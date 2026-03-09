/**
 * Button - Componente de botão corporativo
 * 
 * Variantes:
 * - primary: Ação principal (azul)
 * - secondary: Ação secundária (outline)
 * - danger: Ação destrutiva (vermelho)
 * 
 * Estados:
 * - normal
 * - loading
 * - disabled
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
}

/**
 * Botão corporativo com suporte a variantes e estados
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled = false,
  containerClassName,
  onPress,
  ...props
}: ButtonProps) {
  const colors = useColors();

  // Configurar cores por variante
  const variantStyles = {
    primary: {
      bg: 'bg-primary',
      text: 'text-white',
      pressedOpacity: 0.8,
    },
    secondary: {
      bg: 'bg-transparent border border-primary',
      text: 'text-primary',
      pressedOpacity: 0.7,
    },
    danger: {
      bg: 'bg-error',
      text: 'text-white',
      pressedOpacity: 0.8,
    },
  };

  // Configurar tamanho
  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const style = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      onPress={onPress}
      activeOpacity={style.pressedOpacity}
      className={cn(
        'rounded-lg flex-row items-center justify-center',
        sizeStyles[size],
        style.bg,
        isDisabled && 'opacity-50',
        fullWidth && 'w-full',
        containerClassName
      )}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? colors.primary : 'white'}
          size={size === 'sm' ? 'small' : 'small'}
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon && iconPosition === 'left' && (
            <MaterialIcons
              name={icon}
              size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
              color={
                variant === 'secondary'
                  ? colors.primary
                  : variant === 'danger'
                    ? 'white'
                    : 'white'
              }
            />
          )}

          <Text
            className={cn(
              'font-semibold',
              textSizeStyles[size],
              style.text
            )}
          >
            {label}
          </Text>

          {icon && iconPosition === 'right' && (
            <MaterialIcons
              name={icon}
              size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
              color={
                variant === 'secondary'
                  ? colors.primary
                  : variant === 'danger'
                    ? 'white'
                    : 'white'
              }
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default Button;
