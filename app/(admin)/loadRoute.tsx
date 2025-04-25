import React, { useEffect, useState,useCallback  } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { useAdminStore } from '@/store/useAdminStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  loadRoute: undefined;
  driver: { driverId:string };  // ← ahora pasamos un driver
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'loadRoute'>;

const LoadRoute= () => {
  const navigation = useNavigation<NavigationProp>();
  const { driversSinRuta, obtenerDrivers } = useAdminStore();
  const [loading, setLoading] = useState(true); // Inicia con loading en true

  // Solo ejecutar la carga de datos una vez al montar el componente
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true); // Empieza con el estado de carga
        await obtenerDrivers(); // Obtener los datos (drivers)
        setLoading(false); // Cambiar el estado cuando los datos están listos
      };

      fetchData();
    }, [obtenerDrivers]) // Dependencia para que se recargue cuando cambie la función de obtenerDrivers
  );

  // Si se está cargando, mostramos un texto de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Cargando...</Text>
      </View>
    );
  }

  // Función al presionar un conductor
  const handleDriverPress = (driverId: string) => {
    // Aquí es donde irías a la pantalla para cargar la ruta
    navigation.navigate('driver',{driverId})
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={driversSinRuta}
        keyExtractor={(item) => item.id.toString()} // Asegúrate de que item.id sea un valor único y string
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleDriverPress(item.id)}
          >
            <Text style={styles.nombre}>{item.name}</Text>
            <Text >{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
    card: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
      elevation: 2,
    },
    nombre: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
});

export default LoadRoute;
