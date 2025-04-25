import styles from "@/assets/styles/login.styles";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useEffect } from "react";
import { Image } from "expo-image";

export default function Index() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(auth)");
    }, 4000);

    return () => clearTimeout(timeout); // limpiar en caso de desmontar antes
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Text>Página de Splash</Text>
        {/* Podés agregar tu logo o animación */}
      </View>
    </View>
  );
}
