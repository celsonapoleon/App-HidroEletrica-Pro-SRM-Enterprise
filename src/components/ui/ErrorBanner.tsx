/**
 * ErrorBanner - Componente de exibição de erros
 * 
 * Características:
 * - Ícone de erro
 * - Mensagem customizável
 * - Botão de fechar
 * - Animação de entrada
 */

import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
  containerClassName?: string;
}

/**
 * Banner de erro corporativo
 */
export function ErrorBanner({
  message,
  onDismiss,
  variant = 'error',
  containerClassName,
}: ErrorBannerProps) {
  const colors = useColors();

  const variantConfig = {
    error: {
      bg: 'bg-error/10',
      border: 'border-error',
      icon: 'error-outline' as const,
      text: 'text-error',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning',
      icon: 'warning' as const,
      text: 'text-warning',
    },
    info: {
      bg: 'bg-primary/10',
      border: 'border-primary',
      icon: 'info' as const,
      text: 'text-primary',
    },
  };

  const config = variantConfig[variant];

  return (
    <View
      className={cn(
        'flex-row items-start gap-3 p-4 rounded-lg border',
        config.bg,
        config.border,
        containerClassName
      )}
    >
      <MaterialIcons
        name={config.icon}
        size={20}
        color={colors[variant === 'error' ? 'error' : variant === 'warning' ? 'warning' : 'primary']}
        style={{ marginTop: 2 }}
      />

      <Text className={cn('flex-1 text-sm font-medium', config.text)}>
        {message}
      </Text>

      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons
            name="close"
            size={18}
            color={colors[variant === 'error' ? 'error' : variant === 'warning' ? 'warning' : 'primary']}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ErrorBanner;
