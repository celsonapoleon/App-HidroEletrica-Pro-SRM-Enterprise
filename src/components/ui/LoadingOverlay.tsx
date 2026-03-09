/**
 * LoadingOverlay - Componente de overlay com loading
 * 
 * Características:
 * - Overlay semi-transparente
 * - Spinner de loading
 * - Mensagem customizável
 * - Bloqueia interações
 */

import React from 'react';
import { View, Text, ActivityIndicator, Modal } from 'react-native';
import { useColors } from '@/hooks/use-colors';

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

/**
 * Overlay de loading corporativo
 */
export function LoadingOverlay({ visible, message = 'Carregando...' }: LoadingOverlayProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View
          className="rounded-lg p-8 items-center gap-4"
          style={{
            backgroundColor: colors.surface,
            minWidth: 200,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-foreground font-semibold text-center">
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

export default LoadingOverlay;
