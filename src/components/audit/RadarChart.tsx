/**
 * RadarChart - Gráfico de radar para performance do fornecedor
 * 
 * Características:
 * - 5 dimensões: Qualidade, Preço, Prazo, Suporte, Conformidade
 * - Escala 0-10
 * - Cores customizáveis
 */

import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { RadarData } from '@/src/hooks/useVendorPerformance';

export interface RadarChartProps {
  data: RadarData;
  title?: string;
}

/**
 * Componente de gráfico de radar simplificado
 */
export function RadarChart({ data, title }: RadarChartProps) {
  const dimensions = [
    { label: 'Qualidade', value: data.quality, color: '#3B82F6' },
    { label: 'Preço', value: data.price, color: '#10B981' },
    { label: 'Prazo', value: data.leadTime, color: '#F59E0B' },
    { label: 'Suporte', value: data.support, color: '#8B5CF6' },
    { label: 'Conformidade', value: data.compliance, color: '#06B6D4' },
  ];

  const screenWidth = Dimensions.get('window').width;
  const chartSize = Math.min(screenWidth - 40, 300);
  const center = chartSize / 2;
  const radius = chartSize / 2 - 30;

  // Calcular pontos do polígono
  const angleSlice = (Math.PI * 2) / dimensions.length;
  const points = dimensions.map((dim, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + (radius * dim.value / 10) * Math.cos(angle);
    const y = center + (radius * dim.value / 10) * Math.sin(angle);
    return { x, y, ...dim };
  });

  // Criar SVG-like visualization usando View
  return (
    <View className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      {title && (
        <Text className="text-lg font-bold text-white mb-4">
          {title}
        </Text>
      )}

      {/* Grid de fundo */}
      <View
        className="bg-slate-900 rounded-lg border border-slate-700"
        style={{
          width: chartSize,
          height: chartSize,
          position: 'relative',
          alignSelf: 'center',
          marginBottom: 16,
        }}
      >
        {/* Círculos de referência */}
        {[2, 4, 6, 8, 10].map((level) => (
          <View
            key={level}
            style={{
              position: 'absolute',
              width: (radius * level / 10) * 2,
              height: (radius * level / 10) * 2,
              borderRadius: (radius * level / 10),
              borderWidth: 1,
              borderColor: '#334155',
              top: center - (radius * level / 10),
              left: center - (radius * level / 10),
            }}
          />
        ))}

        {/* Linhas dos eixos */}
        {dimensions.map((dim, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const endX = center + radius * Math.cos(angle);
          const endY = center + radius * Math.sin(angle);
          return (
            <View
              key={`axis-${i}`}
              style={{
                position: 'absolute',
                width: 1,
                height: Math.sqrt(Math.pow(endX - center, 2) + Math.pow(endY - center, 2)),
                backgroundColor: '#334155',
                top: center,
                left: center,
                transform: [{ rotate: `${(angle * 180) / Math.PI}deg` }],
                transformOrigin: '0 0',
              }}
            />
          );
        })}

        {/* Polígono de dados */}
        {points.map((point, i) => {
          const nextPoint = points[(i + 1) % points.length];
          return (
            <View
              key={`line-${i}`}
              style={{
                position: 'absolute',
                width: Math.sqrt(Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)),
                height: 2,
                backgroundColor: point.color,
                opacity: 0.6,
                top: point.y,
                left: point.x,
                transform: [
                  {
                    rotate: `${
                      (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180) / Math.PI
                    }deg`,
                  },
                ],
                transformOrigin: '0 0',
              }}
            />
          );
        })}

        {/* Labels */}
        {points.map((point, i) => (
          <View
            key={`label-${i}`}
            style={{
              position: 'absolute',
              top: point.y - 30,
              left: point.x - 40,
              width: 80,
              alignItems: 'center',
            }}
          >
            <Text className="text-xs font-semibold text-white text-center">
              {point.label}
            </Text>
            <Text className="text-xs font-bold text-white mt-1">
              {point.value}/10
            </Text>
          </View>
        ))}
      </View>

      {/* Legenda */}
      <View className="gap-2 pt-4 border-t border-slate-700">
        {dimensions.map((dim) => (
          <View key={dim.label} className="flex-row items-center gap-2">
            <View
              className="w-3 h-3 rounded"
              style={{ backgroundColor: dim.color }}
            />
            <Text className="text-xs text-slate-300 flex-1">
              {dim.label}
            </Text>
            <Text className="text-xs font-semibold text-white">
              {dim.value}/10
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default RadarChart;
