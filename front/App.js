import React from 'react';
// import {Provider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {
//   main,
//   login,
//   RegisterScreen,
//   ResetPasswordScreen,
//   Dashboard,
// } from './src/pages';

import Main from './src/pages/main';
import Login from './src/pages/login';
import Search from './src/pages/search';
import Register from './src/pages/register';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="main"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'gray',
          },
        }}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Register" component={Register} />
        {/* <Stack.Screen name="RegisterScreen" component={RegisterScreen} /> */}
        {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
        {/* <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
