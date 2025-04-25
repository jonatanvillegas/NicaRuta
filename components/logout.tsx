import { Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      console.log('Cerrando sesión...');
      await logout();
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#e11d48',
        borderRadius: 6,
        marginRight: 10,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Salir</Text>
    </TouchableOpacity>
  );
}
