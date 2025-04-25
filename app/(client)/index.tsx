import React, { useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Touchable, TouchableOpacity } from 'react-native';
import RutasCard from '@/components/RutasCard';
import { useClientStore } from '@/store/useClientStore';
import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';
import COLORS from '@/constants/colors';
import LogoutButton from '@/components/logout';
const HomeScreen: React.FC = () => {
  const { drivers, obtenerDrivers, loading } = useClientStore();
  const {logout} = useAuthStore();

  useEffect(() => {
    obtenerDrivers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Cargando conductores...</Text>
      </View>
    );
  }

  const handlerLogout = async () => { 
    await logout()
    router.replace('/(auth)')
   }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, Cliente</Text>
      <LogoutButton/>
      <FlatList
        data={drivers}
        renderItem={({ item }) => <RutasCard driver={item} />}
        keyExtractor={(item) => item.plate}
       showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
