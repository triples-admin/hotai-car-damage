import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {StyleSheet, Text, View, StatusBar} from 'react-native';
import { auth } from '../screens/auth';
import { routes } from './routes';
import { colors} from '../theme';
import { main } from '../screens/main';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundStatusBar} />
      <Stack.Navigator
        initialRouteName={routes.LOGINSCREEN}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name={routes.LOGINSCREEN}
          component={auth.LOGINSCREEN}
          options={{gestureEnabled: false}}
        />  
        <Stack.Screen
          name={routes.HOMESCREEN}
          component={main.HOMESCREEN}
          options={{gestureEnabled: false}}
        />  
        <Stack.Screen
          name={routes.LICENSEPLATESCREEN}
          component={main.LICENSEPLATESCREEN}
          options={{gestureEnabled: false, animation: 'fade'}}
        />  
        <Stack.Screen
          name={routes.DAMAGEPARTSCREEN}
          component={main.DAMAGEPARTSCREEN}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={routes.MAINPROCEDURESCREEN}
          component={main.MAINPROCEDURESCREEN}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={routes.COMPONENTSPROCEDURESCREEN}
          component={main.COMPONENTSPROCEDURESCREEN}
          options={{gestureEnabled: false}}
        />
         <Stack.Screen
          name={routes.ASSESSMENTPROCEDURESCREEN}
          component={main.ASSESSMENTPROCEDURESCREEN}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={routes.DRIVING_LICENSE}
          component={main.DRIVING_LICENSE}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={routes.DRIVING_LICENSE_DETAIL}
          component={main.DRIVING_LICENSE_DETAIL}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={routes.CAMERA_SCREEN}
          component={main.CAMERA_SCREEN}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={routes.MEASURE_AREA}
          component={main.MEASURE_AREA}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={routes.MEASURE_AREA_DETAIL}
          component={main.MEASURE_AREA_DETAIL}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={routes.MEASURE_AREA_CAMERA}
          component={main.MEASURE_AREA_CAMERA}
          options={{gestureEnabled: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;

