/**
 * BarChartComponent - Gráfico de barras para comparação de Lead Time
 * 
 * Características:
 * - Comparação lado a lado
 * - Valores interativos
 * - Cores customizáveis
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

export interface BarChartData {
  category: string;
  promisedLeadTime: number;
  realizedLeadTime: number;
}

export interface BarChartComponentProps {
  data: BarChartData[];
  title: string;
}

/**
 * Componente de gráfico de barras
 */
export function BarChartComponent({ data, title }: BarChartComponentProps) {
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  // Transformar dados para o formato do react-native-gifted-charts
  const chartData = data.map((item) => ({
    label: item.category.substring(0, 3).toUpperCase(), // Abreviar categoria
    value: item.promisedLeadTime,
    value2: item.realizedLeadTime,
    labelWidth: 40,
    labelTextStyle: { color: '#94A3B8', fontSize: 10 },
  }));

  const screenWidth = Dimensions.get('window').width;

  return (
    <View className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4">
      <Text className="text-lg font-bold text-white mb-4">
        {title}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <BarChart
          data={chartData as any}
          barWidth={30}
          height={250}
          spacing={20}
          color="#3B82F6"
          xAxisThickness={0}
          yAxisThickness={1}
          yAxisColor="#334155"
        />
      </ScrollView>

      {/* Legenda */}
      <View className="mt-4 pt-4 border-t border-slate-700">
        <View className="flex-row justify-center gap-4 mb-4">
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 bg-blue-500 rounded" />
            <Text className="text-xs text-slate-300">Prometido</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 bg-emerald-500 rounded" />
            <Text className="text-xs text-slate-300">Realizado</Text>
          </View>
        </View>
        <Text className="text-xs text-slate-400 mb-2">
          Valores em dias
        </Text>
        <View className="flex-row justify-between">
          <Text className="text-xs text-slate-300">
            Média Prometida: {Math.round(data.reduce((a, b) => a + b.promisedLeadTime, 0) / data.length)} dias
          </Text>
          <Text className="text-xs text-slate-300">
            Média Realizada: {Math.round(data.reduce((a, b) => a + b.realizedLeadTime, 0) / data.length)} dias
          </Text>
        </View>
      </View>
    </View>
  );
}

export default BarChartComponent;
