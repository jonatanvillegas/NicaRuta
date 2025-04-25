import { create } from 'zustand';
import { collection, addDoc, serverTimestamp, GeoPoint, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig'; // Asegúrate de que auth esté correctamente configurado

type DriverStatus = 'activo' | 'inactivo' | 'pausa';

interface Driver {
  id: string;
  name: string;
  email?: string;
  phone: string;
  plate: string;
  role: 'driver';
  status: DriverStatus;
  location?: GeoPoint;
  createdAt: Date;
  updatedAt: Date;
}

interface DriverSinRuta {
  id: string;
  name: string;
  email?: string;
  role: 'driver';
  status: DriverStatus;
}

interface AdminState {
  loading: boolean;
  error: string | null;
  driversSinRuta: DriverSinRuta[];
  crearDriver: (driverData: {
    name: string;
    phone: string;
    plate: string;
    status: DriverStatus;
    location?: GeoPoint;
    correoTrim: string;
    password: string;
  }) => Promise<void>;
  obtenerDrivers: () => Promise<void>;
  guardarRuta: (driverId: string, ruta: GeoPoint[]) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  loading: false,
  error: null,
  driversSinRuta: [],

  crearDriver: async ({ name, phone, plate, status, location, correoTrim, password }) => {
    try {
      set({ loading: true, error: null });

      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, correoTrim, password);
      const user = userCredential.user;

      // Crear el conductor en Firestore
      const docRef = await addDoc(collection(db, 'drivers'), {
        name,
        phone,
        plate,
        role: 'driver',
        status,
        location: location || null,
        email: user.email, // Guarda el correo del usuario de Firebase
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert('Éxito', `Conductor creado con ID: ${docRef.id}`);
    } catch (error: any) {
      set({ error: error.message });
      Alert.alert('Error', error.message);
      console.log('Error', error.message)
    } finally {
      set({ loading: false });
    }
  },

  obtenerDrivers: async () => {
    set({ loading: true, error: null });
    try {
      // Buscar los drivers que no tienen ruta asociada
      const driversQuery = query(collection(db, "drivers"));
      const driversSnapshot = await getDocs(driversQuery);

      const driversSinRuta: DriverSinRuta[] = [];

      // Recorrer los conductores y verificar si tienen ruta
      for (const driverDoc of driversSnapshot.docs) {
        const driverData = driverDoc.data();
        const driverId = driverDoc.id;

        // Buscar en la colección 'routes' si existe una ruta asociada a este conductor
        const routeDoc = await getDoc(doc(db, 'routes', driverId));

        if (!routeDoc.exists()) {
          // Si no existe el documento en la colección 'routes', agregar el driver a la lista de sin ruta
          driversSinRuta.push({
            id: driverId,
            name: driverData.name,
            email: driverData.email,
            role: driverData.role,
            status: driverData.status,
          });
        }
      }

      set({ driversSinRuta });
    } catch (error: any) {
      set({ error: error.message });
      Alert.alert('Error', error.message);
      console.log('Error', error.message);
    } finally {
      set({ loading: false });
    }
  },
  guardarRuta: async (driverId, ruta) => {
    try {
      set({ loading: true, error: null });

      await setDoc(doc(db, 'routes', driverId), {
        driverId,
        ruta,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert('Éxito', 'Ruta guardada correctamente');
    } catch (error: any) {
      set({ error: error.message });
      Alert.alert('Error al guardar la ruta', error.message);
      console.log('Error al guardar la ruta:', error.message);
    } finally {
      set({ loading: false });
    }
  },
}));

