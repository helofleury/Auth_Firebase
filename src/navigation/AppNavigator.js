import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import LoginScreen from '../screens/LoginScreen'; 
import RegisterScreen from '../screens/RegisterScreen'; 
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'; 
import HomeScreen from '../screens/HomeScreen'; 
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen'; 

const Stack = createNativeStackNavigator();

export default function AppNavigator() { 

  return (

    <NavigationContainer> 
      <Stack.Navigator initialRouteName="Login"> 

        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Cadastro" component={RegisterScreen} /> 
        <Stack.Screen name="EsqueciSenha" component={ForgotPasswordScreen} /> 
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen 
          name="BarcodeScanner" 
          component={BarcodeScannerScreen} 
          options={{ title: 'Ler código de barras' }} 
        /> 

      </Stack.Navigator> 
    </NavigationContainer> 

  ); 

}