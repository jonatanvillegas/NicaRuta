import React, { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../../assets/styles/signup.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function SingupScreen() {

    const [username, setUsername] = useState();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [Loading, setLoading] = useState(false)
    const [showPassword, setshowPassword] = useState(false)

    const {registrar} = useAuthStore();

    // 🔹 Ejecutar registro y redirigir con delay
  const handlerRegister = async () => {
    setLoading(true)

    if (!username || !email || !password) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }

    try {
      await registrar(username, email, password);
      Alert.alert('Registro exitoso', 'Redirigiendo al login...');

      setTimeout(() => {
        router.replace('/(auth)'); // <-- redirige al login
      }, 3000);

    } catch (error: any) {
      Alert.alert('Error en el registro', error.message);
    }
  };
   

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    {/* cabecera */}
                    <View style={styles.header}>
                        <Text style={styles.title}>NicaRut</Text>
                        <Text style={styles.subtitle}>ruta en tiempo real </Text>
                    </View>
                    < View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre de usuario</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name='person-outline'
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder='ej: user78'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={username}
                                    onChangeText={()=>setUsername}
                                    keyboardType='default'
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name='mail-outline'
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder='ej: user78'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name='lock-closed-outline'
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder='passwors'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setshowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handlerRegister}
                        style={styles.button}
                        disabled={Loading}
                    >
                        {Loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Registrar</Text>
                        )}
                    </TouchableOpacity>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Ya tienes cuenta?</Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                        >
                            <Text style={styles.link}>Accede a ella

                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
