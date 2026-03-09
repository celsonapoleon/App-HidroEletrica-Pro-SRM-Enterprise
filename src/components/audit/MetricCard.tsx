/**
 * MetricCard - Componente para exibição de KPI de auditoria
 * 
 * Características:
 * - Título e valor
 * - Ícone e cor customizáveis
 * - Subtítulo opcional
 * - Indicador de tendência
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any; // MaterialIcons name
  iconColor: string;
  backgroundColor: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

/**
 * Card de métrica
 */
export function MetricCard({
  title,
  value,
  icon,
  iconColor,
  backgroundColor,
  subtitle,
  trend,
  trendValue,
}: MetricCardProps) {
  const trendColors = {
    up: '#10B981',
    down: '#EF4444',
    neutral: '#94A3B8',
  };

  const trendIcons: Record<string, any> = {
    up: 'trending-up',
    down: 'trending-down',
    neutral: 'trending-flat',
  };

  return (
    <View
      className="rounded-lg p-4 border border-slate-700"
      style={{ backgroundColor }}
    >
      {/* Header: Ícone e Título */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs font-semibold text-slate-400 uppercase">
          {title}
        </Text>
        <View className="bg-slate-700 rounded-lg p-2">
          <MaterialIcons name={icon} size={16} color={iconColor} />
        </View>
      </View>

      {/* Valor Principal */}
      <Text className="text-3xl font-bold text-white mb-1">
        {value}
      </Text>

      {/* Subtítulo e Tendência */}
      <View className="flex-row items-center justify-between">
        {subtitle && (
          <Text className="text-xs text-slate-400">
            {subtitle}
          </Text>
        )}

        {trend && trendValue && (
          <View className="flex-row items-center gap-1">
            <MaterialIcons
              name={trendIcons[trend] as any}
              size={12}
              color={trendColors[trend]}
            />
            <Text
              className="text-xs font-semibold"
              style={{ color: trendColors[trend] }}
            >
              {trendValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default MetricCard;
