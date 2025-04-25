import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import COLORS from '@/constants/colors';

const AdminScreen = () => {
  const router = useRouter();

  const{logout,usuario}= useAuthStore();

  const handlerLogout = async () => { 
    await logout()
    router.replace('/(auth)')
   }

   console.log("esta entrando aca ",usuario)
return (
  <View style={styles.container}>
    <Text style={styles.title} >Modulos Administrativos</Text>
      {/* Fila de tarjetas */}
      <View style={styles.cardRow}>
        {/* Card de Crear Conductor */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(admin)/createDriver')}
          >
          <FontAwesome5 name="user-plus" size={50} color={COLORS.white} />
          <Text style={styles.cardText}>Crear Conductor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={handlerLogout}
          >
          <FontAwesome5 name="user-plus" size={50} color={COLORS.white} />
          <Text style={styles.cardText}>cerrar secion</Text>
        </TouchableOpacity>

        {/* Card de otros módulos (Ejemplo: Ver Conductores) */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => alert('Ver Conductores')}
        >
          <FontAwesome5 name="users" size={50} color={COLORS.white} />
          <Text style={styles.cardText}>Ver Conductores</Text>
        </TouchableOpacity>
        {/* Card de Cargar Ruta */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(admin)/loadRoute')}
        >
          <FontAwesome5 name="map-marked-alt" size={50} color={COLORS.white} />
          <Text style={styles.cardText}>Cargar Ruta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title:{
    color: COLORS.textSecondary
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    
  },
  card: {
    backgroundColor: COLORS.primary,
    width: Dimensions.get('window').width / 2 - 40, // Dos columnas
    margin: 10,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    marginTop: 10,
  },
});



export default AdminScreen