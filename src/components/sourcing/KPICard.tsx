/**
 * KPICard - Componente para exibição de KPIs
 * 
 * Características:
 * - Ícone customizável
 * - Valor principal
 * - Subtítulo
 * - Indicador de tendência (opcional)
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';

export interface KPICardProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  backgroundColor?: string;
  iconColor?: string;
}

/**
 * Card de KPI corporativo
 */
export function KPICard({
  icon,
  label,
  value,
  unit,
  trend,
  trendValue,
  backgroundColor,
  iconColor,
}: KPICardProps) {
  const colors = useColors();

  const bgColor = backgroundColor || colors.surface;
  const iColor = iconColor || colors.primary;

  const trendConfig = {
    up: { icon: 'trending-up', color: colors.success },
    down: { icon: 'trending-down', color: colors.error },
    neutral: { icon: 'remove', color: colors.muted },
  };

  return (
    <View
      className="rounded-lg p-6 flex-1 min-h-[140px] justify-between"
      style={{ backgroundColor: bgColor }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-sm font-medium text-muted flex-1">
          {label}
        </Text>
        <View
          className="w-10 h-10 rounded-lg items-center justify-center"
          style={{ backgroundColor: `${iColor}15` }}
        >
          <MaterialIcons name={icon as any} size={20} color={iColor} />
        </View>
      </View>

      <View className="gap-1">
        <View className="flex-row items-baseline gap-2">
          <Text className="text-3xl font-bold text-foreground">
            {value}
          </Text>
          {unit && (
            <Text className="text-sm font-medium text-muted">
              {unit}
            </Text>
          )}
        </View>

        {trend && trendValue && (
          <View className="flex-row items-center gap-1 mt-2">
            <MaterialIcons
              name={trendConfig[trend].icon as any}
              size={14}
              color={trendConfig[trend].color}
            />
            <Text
              className="text-xs font-medium"
              style={{ color: trendConfig[trend].color }}
            >
              {trendValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default KPICard;
