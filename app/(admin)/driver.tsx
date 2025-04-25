import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { GeoPoint } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAdminStore } from '@/store/useAdminStore';


type RootStackParamList = {
  driver: { driverId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'driver'>;

const Route: React.FC<Props> = ({ route }) => {
  const { driverId } = route.params;

  const [grabandoRuta, setGrabandoRuta] = useState(false);
  const [rutaTemporal, setRutaTemporal] = useState<Location.LocationObject[]>([]);
  const [contadorPuntos, setContadorPuntos] = useState(0);

    const {guardarRuta} = useAdminStore();

  // Solicitar permisos de ubicación al iniciar
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para grabar la ruta.');
      }
    })();
  }, []);

  const toggleGrabacionRuta = () => {
    if (!grabandoRuta) {
      setGrabandoRuta(true);
      setRutaTemporal([]);
      setContadorPuntos(0);
    } else {
      Alert.alert(
        'Detener carga',
        '¿Estás seguro de finalizar la carga de ruta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Finalizar',
            onPress: async () => {
              setGrabandoRuta(false);

              const geoPoints: GeoPoint[] = rutaTemporal.map((pos) =>
                new GeoPoint(pos.coords.latitude, pos.coords.longitude)
              );

              await guardarRuta(driverId, geoPoints);

              Alert.alert('Ruta guardada', `Se guardaron ${contadorPuntos} puntos correctamente.`);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  // Agregar punto de ubicación cada 20 segundos si está grabando
  useEffect(() => {
    let intervalo: NodeJS.Timeout | null = null;

    if (grabandoRuta) {
      intervalo = setInterval(async () => {
        const location = await Location.getCurrentPositionAsync({});
        setRutaTemporal((prev) => [...prev, location]);
        setContadorPuntos((prev) => prev + 1);
      }, 20000); // 60,000 ms = 1 minuto
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [grabandoRuta]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={toggleGrabacionRuta}
      >
        <Text style={styles.textoBoton}>
          {grabandoRuta ? 'Cargando' : 'Cargar Ruta'}
        </Text>
      </TouchableOpacity>

      {grabandoRuta && (
        <View style={styles.cardRuta}>
          <Text style={styles.textoCard}>Puntos guardados: {contadorPuntos}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonFlotante: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#ff5722',
    padding: 16,
    borderRadius: 50,
    elevation: 5,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardRuta: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  textoCard: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Route;
