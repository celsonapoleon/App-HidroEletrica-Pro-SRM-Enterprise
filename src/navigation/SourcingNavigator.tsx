/**
 * SourcingNavigator - Stack para Strategic Sourcing (Buyers)
 * 
 * Gerencia as telas de:
 * - Dashboard/Home
 * - Gerenciamento de Fornecedores
 * - Requisições de Cotação (RFQs)
 * - Análise de Propostas
 * - Configurações
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Placeholder para telas (serão implementadas depois)
 */
function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-bold text-foreground">{name}</Text>
      <Text className="text-sm text-muted mt-2">Em desenvolvimento</Text>
    </View>
  );
}

/**
 * Tab Navigator para Sourcing
 */
function SourcingTabNavigator() {
  const colors = useColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen
        name="SourcingHome"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen name="Home - Sourcing" />}
      </Tab.Screen>

      <Tab.Screen
        name="Vendors"
        options={{
          title: 'Fornecedores',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="business" size={24} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen name="Gerenciamento de Fornecedores" />}
      </Tab.Screen>

      <Tab.Screen
        name="RFQs"
        options={{
          title: 'RFQs',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="description" size={24} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen name="Requisições de Cotação" />}
      </Tab.Screen>

      <Tab.Screen
        name="Proposals"
        options={{
          title: 'Propostas',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="compare" size={24} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen name="Análise de Propostas" />}
      </Tab.Screen>

      <Tab.Screen
        name="SourcingSettings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen name="Configurações" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

/**
 * SourcingNavigator com Stack + Tabs
 */
export function SourcingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SourcingTabs"
        component={SourcingTabNavigator}
      />
    </Stack.Navigator>
  );
}

export default SourcingNavigator;
