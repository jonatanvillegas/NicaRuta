import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Driver } from '@/store/useClientStore';
import COLORS from '@/constants/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export type RootStackParamList = {
  Home: undefined;
  Mapa: { driver: Driver };  // ← ahora pasamos un driver
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  driver: Driver;
}

const RutasCard: React.FC<Props> = ({ driver }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Mapa', { driver })}
    >
      <Text style={styles.nombre}>{driver.name}</Text>
      <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>

        <Text style={styles.descripcion}>Placa: {driver.plate}</Text>
        <Text style={[styles.descripcion,
          {fontSize:14, padding:8,
          borderColor:COLORS.primary,borderWidth:0.5,
          borderRadius:3, color:COLORS.primary,
          backgroundColor:COLORS.background,borderStyle:'solid'}]}>{driver.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  descripcion: {
    fontSize: 14,
    color: '#666',
  },
});

export default RutasCard;
