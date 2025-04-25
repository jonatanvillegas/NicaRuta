import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import MapView, { Marker, LatLng, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import io from 'socket.io-client';

type DriverStatus = 'Activo' | 'Pausa' | 'Inactivo';

const socket = io('https://servernicaruta.onrender.com');

const DriverScreen: React.FC = () => {

  const [driverStatus, setDriverStatus] = useState<DriverStatus>('Inactivo');
  const [scaleAnim] = useState(new Animated.Value(1));
  const [driverLocation, setDriverLocation] = useState<LatLng>({
    latitude: 12.136389,
    longitude: -86.251389,
  });

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (driverStatus === 'Activo') {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se requiere permiso de ubicación');
          return;
        }
  
        // Animación
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          ])
        ).start();
  
        // Suscripción a cambios de ubicación
        locationSubscription.current = await Location.watchPositionAsync(
          //caracteristicas para una persona en vehiculo
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000, //tiempo en obtener la ubicacion 
            distanceInterval: 10, //distancia como parametro 
          },
          (location) => {
            const coords = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
  
            setDriverLocation(coords);
            //recordar crear un store para el conductor y colocar su placa como id para comunicacion entre el servidor
            socket.emit('updateLocation', {
              conductorId: 'ruta6',
              lat: coords.latitude,
              lng: coords.longitude,
            });
  
            console.log('Ubicación enviada:', coords);
          }
        );
      })();
    } else {
      // Limpiar suscripción y animación
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
      scaleAnim.stopAnimation();
      scaleAnim.setValue(1);
    }
  
    // Cleanup cuando se desmonta o cambia el estado
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, [driverStatus]);
  

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={driverLocation} title="Tu ubicación" />
        <Circle
          center={driverLocation}
          radius={250}
          strokeWidth={2}
          strokeColor="rgba(255, 87, 34, 0.8)"
          fillColor="rgba(255, 87, 34, 0.3)"
        />
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.status}>Estado: {driverStatus}</Text>

        {driverStatus === 'Activo' && (
          <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Ubicación Activa</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.stateButtons}>
          <TouchableOpacity
            style={[styles.stateButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => setDriverStatus('Activo')}
          >
            <Text style={styles.stateText}>Activo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stateButton, { backgroundColor: '#FFC107' }]}
            onPress={() => setDriverStatus('Pausa')}
          >
            <Text style={styles.stateText}>Pausa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stateButton, { backgroundColor: '#F44336' }]}
            onPress={() => setDriverStatus('Inactivo')}
          >
            <Text style={styles.stateText}>Inactivo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DriverScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  animatedButton: { marginBottom: 20 },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 5,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  stateButtons: { flexDirection: 'row', gap: 10 },
  stateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  stateText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
