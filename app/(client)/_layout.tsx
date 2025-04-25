import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './index';
import MapaScreen from './MapaScreen';
import { Driver } from '@/store/useClientStore';

export type RootStackParamList = {
    Home: undefined;
    Mapa: { driver: Driver };
  };
    
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function ClientLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Mapa" component={MapaScreen} />
    </Stack.Navigator>
  );
}
