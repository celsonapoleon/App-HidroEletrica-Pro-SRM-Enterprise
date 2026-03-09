/**
 * AuditDashboardScreen - Dashboard de Auditoria Global
 * 
 * Características:
 * - KPIs consolidados
 * - Gráfico de Lead Time por categoria
 * - Alertas de compliance
 * - Sincronização real-time
 */

import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { MetricCard } from '@/src/components/audit/MetricCard';
import { BarChartComponent } from '@/src/components/audit/BarChartComponent';
import { useAuditMetrics } from '@/src/hooks/useAuditMetrics';
import { useCategoryPerformance } from '@/src/hooks/useCategoryPerformance';

export interface AuditDashboardScreenProps {
  onSelectVendor?: (vendorId: string) => void;
}

/**
 * Dashboard de Auditoria Global
 */
export function AuditDashboardScreen({
  onSelectVendor,
}: AuditDashboardScreenProps) {
  const colors = useColors();
  const { metrics, loading: metricsLoading } = useAuditMetrics();
  const { data: categoryData, loading: categoryLoading } = useCategoryPerformance();

  return (
    <ScreenContainer className="bg-slate-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-6 border-b border-slate-800">
          <Text className="text-2xl font-bold text-white mb-2">
            Auditoria de Processo
          </Text>
          <Text className="text-sm text-slate-400">
            Performance Metrics e Governance Check
          </Text>
        </View>

        {/* KPIs Principais */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold text-white mb-4">
            KPIs Consolidados
          </Text>

          {metricsLoading ? (
            <View className="items-center justify-center py-8">
              <Text className="text-slate-400">Carregando métricas...</Text>
            </View>
          ) : (
            <View className="gap-3">
              {/* IDF Global */}
              <MetricCard
                title="IDF Global"
                value={metrics.globalIDF.toFixed(1)}
                icon="assessment"
                iconColor="#3B82F6"
                backgroundColor="#1E293B"
                subtitle="Índice de Desempenho"
                trend={metrics.globalIDF >= 7 ? 'up' : 'down'}
                trendValue={metrics.globalIDF >= 7 ? '+0.5' : '-0.3'}
              />

              {/* Saving Total */}
              <MetricCard
                title="Saving Acumulado"
                value={`R$ ${(metrics.totalSaving / 1000).toFixed(1)}k`}
                icon="trending-up"
                iconColor="#10B981"
                backgroundColor="#1E293B"
                subtitle={`${metrics.savingPercentage.toFixed(1)}% de economia`}
                trend="up"
                trendValue="+12.5%"
              />

              {/* Estatísticas */}
              <View className="grid grid-cols-3 gap-3">
                <MetricCard
                  title="Fornecedores"
                  value={metrics.totalVendors}
                  icon="business"
                  iconColor="#8B5CF6"
                  backgroundColor="#1E293B"
                />
                <MetricCard
                  title="RFQs Ativas"
                  value={metrics.totalRFQs}
                  icon="description"
                  iconColor="#F59E0B"
                  backgroundColor="#1E293B"
                />
                <MetricCard
                  title="Propostas"
                  value={metrics.totalProposals}
                  icon="mail"
                  iconColor="#06B6D4"
                  backgroundColor="#1E293B"
                />
              </View>
            </View>
          )}
        </View>

        {/* Gráfico de Lead Time */}
        {!categoryLoading && categoryData.length > 0 && (
          <View className="px-4 py-6">
            <BarChartComponent
              data={categoryData}
              title="Lead Time: Prometido vs Realizado"
            />
          </View>
        )}

        {/* Alertas de Compliance */}
        {metrics.complianceRisks.length > 0 && (
          <View className="px-4 py-6">
            <Text className="text-lg font-bold text-white mb-4">
              ⚠️ Alertas de Compliance
            </Text>

            <View className="bg-red-900 border border-red-700 rounded-lg p-4">
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="error" size={20} color="#FEE2E2" />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-red-100 mb-2">
                    {metrics.complianceRisks.length} fornecedor(es) com risco
                  </Text>
                  {metrics.complianceRisks.slice(0, 3).map((vendor) => (
                    <Text
                      key={vendor.id}
                      className="text-xs text-red-200 mb-1"
                    >
                      • {vendor.tradeName || vendor.legalName}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Resumo de Performance */}
        <View className="px-4 py-6 bg-slate-900 rounded-lg border border-slate-800 mx-4">
          <Text className="text-lg font-bold text-white mb-3">
            Resumo Executivo
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-slate-300">Prazo Médio Realizado</Text>
              <Text className="text-sm font-semibold text-white">
                {metrics.averageLeadTime} dias
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-slate-300">Taxa de Conformidade</Text>
              <Text className="text-sm font-semibold text-emerald-400">
                {Math.round((metrics.globalIDF / 10) * 100)}%
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-slate-300">Propostas Processadas</Text>
              <Text className="text-sm font-semibold text-white">
                {metrics.totalProposals}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

export default AuditDashboardScreen;
