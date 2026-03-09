/**
 * TextInput - Componente de entrada de texto corporativo
 * 
 * Características:
 * - Suporte a ícones
 * - Estados (normal, foco, erro)
 * - Validação em tempo real
 * - Acessibilidade
 */

import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TouchableOpacity,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
  containerClassName?: string;
  inputClassName?: string;
}

/**
 * TextInput corporativo com suporte a ícones e validação
 */
export function TextInput({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  containerClassName,
  inputClassName,
  editable = true,
  ...props
}: TextInputProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn('mb-4', containerClassName)}>
      {label && (
        <Text className="text-sm font-semibold text-foreground mb-2">
          {label}
        </Text>
      )}

      <View
        className={cn(
          'flex-row items-center px-4 py-3 rounded-lg border',
          'bg-surface',
          isFocused
            ? 'border-primary border-2'
            : error
              ? 'border-error'
              : 'border-border'
        )}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.muted}
            style={{ marginRight: 12 }}
          />
        )}

        <RNTextInput
          {...props}
          editable={editable}
          className={cn(
            'flex-1 text-base font-medium text-foreground',
            inputClassName
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            color: colors.foreground,
          }}
          placeholderTextColor={colors.muted}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={rightIcon}
              size={20}
              color={colors.muted}
              style={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-xs font-medium text-error mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}

export default TextInput;
