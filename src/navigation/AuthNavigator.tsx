/**
 * AuthNavigator - Stack de Autenticação
 * 
 * Gerencia as telas de Login e Registro
 */

import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@/src/screens/auth/LoginScreen';
import { RegisterScreen } from '@/src/screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator();

/**
 * AuthNavigator com telas de Login e Registro
 */
export function AuthNavigator() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      {!showRegister ? (
        <Stack.Screen
          name="Login"
          options={{
            animationTypeForReplace: 'pop',
          }}
        >
          {() => (
            <LoginScreen
              onSwitchToRegister={() => setShowRegister(true)}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen
          name="Register"
          options={{
            animationTypeForReplace: 'pop',
          }}
        >
          {() => (
            <RegisterScreen
              onSwitchToLogin={() => setShowRegister(false)}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

export default AuthNavigator;
