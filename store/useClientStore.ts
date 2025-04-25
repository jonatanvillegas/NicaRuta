import { create } from 'zustand';
import { collection, getDocs, GeoPoint, query, where } from 'firebase/firestore';
import rutas from '../assets/location/ruta.json';
import { db } from '@/config/firebaseConfig';

export type Driver = {
  id: string;
  name: string;
  plate: string;
  status: string;
  location: GeoPoint;
  ruta: GeoPoint[];
};

interface ClientState {
  drivers: Driver[];
  loading: boolean;
  obtenerDrivers: () => Promise<void>;
}

export const useClientStore = create<ClientState>((set) => ({
  loading: false,
  drivers: [],
  obtenerDrivers: async () => {
    set({ loading: true });

    try {
      const querySnapshot = await getDocs(collection(db, 'drivers'));
      const conductores: Driver[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();

        if (data.status === 'activo') {
          const location = new GeoPoint(data.location.latitude, data.location.longitude);

          // Consultar rutas personalizadas para este conductor
          const rutasQuery = query(collection(db, 'routes'), where('driverId', '==', docSnap.id));
          const rutasSnapshot = await getDocs(rutasQuery);

          let ruta: GeoPoint[];

          if (!rutasSnapshot.empty) {
            // Si hay una ruta personalizada en Firestore
            const rutaData = rutasSnapshot.docs[0].data();
            ruta = rutaData.ruta.map((point: any) => new GeoPoint(point.latitude, point.longitude));
          } else {
            // Si no hay, usa la ruta por defecto del JSON
            ruta = rutas.map((point: any) => new GeoPoint(point.latitude, point.longitude));
            
          }
          const conductor: Driver = {
            id: docSnap.id,
            name: data.name,
            plate: data.plate,
            status: data.status,
            location: location,
            ruta: ruta
          };

          conductores.push(conductor);
        }
      }

      set({ drivers: conductores, loading: false });
    } catch (error) {
      console.error('❌ Error al obtener los conductores:', error);
      set({ loading: false });
    }
  },
}));
