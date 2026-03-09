/**
 * VendorPerformanceScreen - Tela de Performance Individual
 * 
 * Características:
 * - Radar Chart com 5 dimensões
 * - Histórico de propostas
 * - Informações do fornecedor
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { RadarChart } from '@/src/components/audit/RadarChart';
import { useVendorPerformance } from '@/src/hooks/useVendorPerformance';

export interface VendorPerformanceScreenProps {
  vendorId: string;
  onBack?: () => void;
}

/**
 * Tela de performance individual
 */
export function VendorPerformanceScreen({
  vendorId,
  onBack,
}: VendorPerformanceScreenProps) {
  const colors = useColors();
  const { vendor, radarData, proposals, loading } = useVendorPerformance(vendorId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <ScreenContainer className="bg-slate-950">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-4 border-b border-slate-700">
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-white">
            {vendor?.tradeName || vendor?.legalName || 'Fornecedor'}
          </Text>
          <Text className="text-xs text-slate-400">
            CNPJ: {vendor?.cnpj}
          </Text>
        </View>
        {vendor?.idf && (
          <View className="bg-blue-600 rounded-lg px-3 py-2">
            <Text className="text-xs font-semibold text-white">
              IDF {vendor.idf}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <View className="px-4 py-6">
          {loading ? (
            <View className="items-center justify-center py-8">
              <Text className="text-slate-400">Carregando dados...</Text>
            </View>
          ) : (
            <>
              {/* Radar Chart */}
              <RadarChart
                data={radarData}
                title="Performance Metrics"
              />

              {/* Resumo de Indicadores */}
              <View className="mt-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
                <Text className="text-lg font-bold text-white mb-4">
                  Resumo Executivo
                </Text>

                <View className="gap-3">
                  <View className="flex-row justify-between items-center pb-3 border-b border-slate-700">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons name="assessment" size={16} color="#3B82F6" />
                      <Text className="text-sm text-slate-300">
                        Índice de Desempenho
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-white">
                      {vendor?.idf || 0}/10
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center pb-3 border-b border-slate-700">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons name="mail" size={16} color="#10B981" />
                      <Text className="text-sm text-slate-300">
                        Propostas Adjudicadas
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-white">
                      {proposals.length}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons name="trending-up" size={16} color="#F59E0B" />
                      <Text className="text-sm text-slate-300">
                        Valor Total Adjudicado
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-white">
                      {formatCurrency(
                        proposals.reduce((sum, p) => sum + p.totalValue, 0)
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Histórico de Propostas */}
              {proposals.length > 0 && (
                <View className="mt-6">
                  <Text className="text-lg font-bold text-white mb-4">
                    Últimas Propostas Adjudicadas
                  </Text>

                  <FlatList
                    data={proposals}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-3">
                        <View className="flex-row justify-between items-start mb-3">
                          <View className="flex-1">
                            <Text className="text-sm font-semibold text-white">
                              RFQ #{item.rfqId.substring(0, 8)}
                            </Text>
                            <Text className="text-xs text-slate-400 mt-1">
                              {formatDate(item.createdAt)}
                            </Text>
                          </View>
                          <View className="bg-emerald-900 rounded px-2 py-1">
                            <Text className="text-xs font-semibold text-emerald-200">
                              Aprovada
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row justify-between items-center pt-3 border-t border-slate-700">
                          <View>
                            <Text className="text-xs text-slate-400 mb-1">
                              Valor
                            </Text>
                            <Text className="text-sm font-bold text-white">
                              {formatCurrency(item.totalValue)}
                            </Text>
                          </View>
                          <View>
                            <Text className="text-xs text-slate-400 mb-1">
                              Prazo
                            </Text>
                            <Text className="text-sm font-bold text-white">
                              {item.leadTime} dias
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                </View>
              )}

              {proposals.length === 0 && (
                <View className="mt-6 items-center justify-center py-8 bg-slate-800 rounded-lg border border-slate-700">
                  <MaterialIcons name="mail-outline" size={40} color={colors.muted} />
                  <Text className="text-slate-400 mt-2">
                    Nenhuma proposta adjudicada
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

export default VendorPerformanceScreen;
