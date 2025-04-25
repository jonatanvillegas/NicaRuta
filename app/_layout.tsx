import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const { usuario, inicializarSesion, loading } = useAuthStore();

  useEffect(() => {
    inicializarSesion();
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeScreen>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        </SafeScreen>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  // Si no hay sesión iniciada
  if (!usuario) {
    return (
      <SafeAreaProvider>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </SafeScreen>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  // Definir las pantallas según rol
  const roleScreens: Record<string, string> = {
    client: "(client)",
    driver: "(driver)",
    admin: "(admin)"
  };

  const stackName = roleScreens[usuario.rol];

  // Si el rol no está mapeado, redirige al auth
  if (!stackName) {
    return (
      <SafeAreaProvider>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </SafeScreen>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  // Si todo está bien, renderizar el stack correspondiente
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name={stackName} />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
