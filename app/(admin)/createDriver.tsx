import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAdminStore } from '@/store/useAdminStore';
import * as Location from 'expo-location';
import { GeoPoint } from 'firebase/firestore';

const CreateDriverScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPastword] = useState('');
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [status, setStatus] = useState<'activo' | 'inactivo' | 'pausa'>('inactivo');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const { crearDriver } = useAdminStore();

  
  const handleSubmit = async () => {
    if (!name || !phone || !plate || !correo || !password) {
      Alert.alert('Error', 'Por favor ingresa todos los campos');
      return;
    }

    var correoTrim = correo.replace(/\s+/g, '').toLowerCase();

    if (correoTrim.includes(' ')) {
      console.log('El correo tiene espacios');
    }else{
      console.log('El no tiene espacios');
    }


    let location: GeoPoint | undefined = undefined;

    if (useCurrentLocation) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permiso de ubicación denegado');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      location = new GeoPoint(currentLocation.coords.latitude, currentLocation.coords.longitude);
    }
    if (!location) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
      return;
    }
    await crearDriver({
      name,
      phone,
      plate,
      status,
      location,
      correoTrim,
      password
    });
  };

  return (
    <ScrollView>

      <View style={styles.container}>
        <Text style={styles.title}>Crear Conductor</Text>

        <TextInput
          style={styles.input}
          placeholder="N° de ruta"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo del conductor"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPastword}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Placa"
          value={plate}
          onChangeText={setPlate}
        />

        <Text style={styles.label}>Estado:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Activo" value="activo" />
            <Picker.Item label="Inactivo" value="inactivo" />
            <Picker.Item label="Pausa" value="pausa" />
          </Picker>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Usar ubicación actual:</Text>
          <Switch
            value={useCurrentLocation}
            onValueChange={setUseCurrentLocation}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Crear Conductor</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CreateDriverScreen;
