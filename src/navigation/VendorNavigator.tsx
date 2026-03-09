/**
 * VendorNavigator - Stack para Key Account Manager (Vendors)
 * 
 * Gerencia as telas de:
 * - Dashboard/Home
 * - RFQs Disponíveis
 * - Minhas Propostas
 * - Compliance/Documentos
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
 * Tab Navigator para Vendor
 */
function VendorTabNavigator() {
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
        name="VendorHome"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen name="Home - Vendor" />}
      </Tab.Screen>

      <Tab.Screen
        name="AvailableRFQs"
        options={{
          title: 'RFQs',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="description" size={24} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen name="RFQs Disponíveis" />}
      </Tab.Screen>

      <Tab.Screen
        name="MyProposals"
        options={{
          title: 'Propostas',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="send" size={24} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen name="Minhas Propostas" />}
      </Tab.Screen>

      <Tab.Screen
        name="Compliance"
        options={{
          title: 'Compliance',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="verified" size={24} color={color} />
          ),
        }}
      >
        {() => <PlaceholderScreen name="Documentos de Compliance" />}
      </Tab.Screen>

      <Tab.Screen
        name="VendorSettings"
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
 * VendorNavigator com Stack + Tabs
 */
export function VendorNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="VendorTabs"
        component={VendorTabNavigator}
      />
    </Stack.Navigator>
  );
}

export default VendorNavigator;
