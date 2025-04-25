import React, { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../../assets/styles/login.styles'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { Link, router } from 'expo-router'
import { useAuthStore } from '@/store/useAuthStore'

export default function LoginScreen() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [Loading, setLoading] = useState(false)
    const [showPassword, setshowPassword] = useState(false)

    const {login} = useAuthStore();

    const handlerLogin = async () => {

        setLoading(true)


        if (!email || !password) {
          Alert.alert('Campos requeridos', 'Por favor completa ambos campos');
          return;
        }
    
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            await login(email, password);
            
            Alert.alert('Éxito', 'Inicio de sesión correcto');
          // Aquí podrías navegar o hacer algo más después del login
          router.replace("/");
          setLoading(false)
        } catch (e) {
          Alert.alert('Error','Hubo un problema al iniciar sesión');
        }
      };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <View style={styles.container}>
                {/*Imagen transporte publico   */}
                <View style={styles.topIllustration}>
                    <Image source={require("../../assets/images/bus.png")}
                        style={styles.illustrationImage}
                        resizeMode='contain'
                    />
                </View>
                {/* formulario */}
                <View style={styles.card}>
                    <View style={styles.formContainer}>
                        {/* inpur email grupo */}

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
                                    placeholder='ingresa tu email'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>
                        {/* password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                {/* incono a la izquierda */}
                                <Ionicons
                                    name='lock-closed-outline'
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                {/* input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder='passwors'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
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
                        <TouchableOpacity
                            onPress={handlerLogin}
                            style={styles.button}
                            disabled={Loading}
                        >
                            {Loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Acceder</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>No tienes una cuenta?</Text>
                        <Link href="/singup" asChild>
                            <TouchableOpacity>
                                <Text style={styles.link}>Crear cuenta</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
