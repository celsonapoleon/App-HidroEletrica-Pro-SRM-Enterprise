/**
 * RootNavigator - Navegação Raiz com RBAC
 * 
 * Responsável por:
 * - Renderizar AuthStack (Login/Registro) ou AppStack (Dashboard)
 * - Aplicar RBAC (Role-Based Access Control)
 * - Redirecionar para stack correto baseado no perfil do usuário
 * - Mostrar loading state enquanto verifica autenticação
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '@/src/hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { SourcingNavigator } from './SourcingNavigator';
import { VendorNavigator } from './VendorNavigator';

const Stack = createNativeStackNavigator();

/**
 * RootNavigator com RBAC
 * 
 * Fluxo:
 * 1. Se isLoading: mostrar LoadingScreen
 * 2. Se !isAuthenticated: mostrar AuthStack
 * 3. Se role === 'buyer': mostrar SourcingStack
 * 4. Se role === 'vendor': mostrar VendorStack
 * 5. Caso contrário: mostrar erro
 */
export function RootNavigator() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const colors = useColors();

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack (Login/Registro)
          <Stack.Group>
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </Stack.Group>
        ) : role === 'buyer' ? (
          // Sourcing Stack (Strategic Sourcing)
          <Stack.Group>
            <Stack.Screen name="Sourcing" component={SourcingNavigator} />
          </Stack.Group>
        ) : role === 'vendor' ? (
          // Vendor Stack (Key Account Manager)
          <Stack.Group>
            <Stack.Screen name="Vendor" component={VendorNavigator} />
          </Stack.Group>
        ) : (
          // Erro: perfil não reconhecido
          <Stack.Group>
            <Stack.Screen
              name="Error"
              component={() => (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-lg font-bold text-error">
                    Perfil não reconhecido
                  </Text>
                </View>
              )}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
