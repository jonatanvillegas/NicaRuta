import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminScreen from './index';
import CreateDriverScreen from './createDriver';
import LoadRoute from './loadRoute';
import Route from './driver';

export type RootStackParamList = {
  loadRoute: undefined;
  createDriver: undefined;
  home: undefined;
  driver: { driverId: string };
  };
const Stack = createNativeStackNavigator<RootStackParamList>();

const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="home" component={AdminScreen}  options={{ headerShown: false }}/>
      <Stack.Screen name="createDriver" component={CreateDriverScreen} />
      <Stack.Screen name="loadRoute" component={LoadRoute} />
      <Stack.Screen name="driver" component={Route} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
