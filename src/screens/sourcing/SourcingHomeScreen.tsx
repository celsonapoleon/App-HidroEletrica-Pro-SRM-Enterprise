/**
 * SourcingHomeScreen - Dashboard Principal de Sourcing
 * 
 * Características:
 * - KPIs em tempo real
 * - Lista de RFQs recentes
 * - Botão para abrir nova RFQ
 * - Sincronização com Firestore
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { KPICard } from '@/src/components/sourcing/KPICard';
import { RFQListItem } from '@/src/components/sourcing/RFQListItem';
import { useKPIs } from '@/src/hooks/useKPIs';
import { useRFQs } from '@/src/hooks/useRFQs';
import { RFQ } from '@/src/hooks/useRFQs';

export interface SourcingHomeScreenProps {
  onOpenRFQ?: () => void;
  onSelectRFQ?: (rfq: RFQ) => void;
}

/**
 * Dashboard de Sourcing
 */
export function SourcingHomeScreen({
  onOpenRFQ,
  onSelectRFQ,
}: SourcingHomeScreenProps) {
  const colors = useColors();
  const { kpis, loading: kpisLoading } = useKPIs();
  const { rfqs, loading: rfqsLoading } = useRFQs();
  const [selectedRFQId, setSelectedRFQId] = useState<string | null>(null);

  const handleSelectRFQ = (rfq: RFQ) => {
    setSelectedRFQId(rfq.id);
    onSelectRFQ?.(rfq);
  };

  return (
    <ScreenContainer className="bg-slate-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-8 border-b border-slate-700">
          <Text className="text-2xl font-bold text-white mb-2">
            Painel de Controle de Suprimentos
          </Text>
          <Text className="text-sm text-slate-400">
            Gerencie RFQs e propostas de fornecedores
          </Text>
        </View>

        {/* KPIs */}
        <View className="px-4 py-6 gap-4">
          <View className="flex-row gap-3">
            <KPICard
              icon="description"
              label="RFQs Ativas"
              value={kpis.activeRFQs}
              backgroundColor="#1E293B"
              iconColor="#3B82F6"
            />
            <KPICard
              icon="trending-up"
              label="Saving Médio"
              value={kpis.averageSaving}
              unit="%"
              backgroundColor="#1E293B"
              iconColor="#10B981"
            />
          </View>

          <KPICard
            icon="verified-user"
            label="Compliance Rate"
            value={kpis.complianceRate}
            unit="%"
            backgroundColor="#1E293B"
            iconColor="#8B5CF6"
          />
        </View>

        {/* Botão Abrir RFQ */}
        <View className="px-4 pb-6">
          <TouchableOpacity
            onPress={onOpenRFQ}
            className="bg-blue-600 rounded-lg p-4 flex-row items-center justify-center gap-2"
            activeOpacity={0.8}
          >
            <MaterialIcons name="add-circle" size={20} color="white" />
            <Text className="text-white font-semibold">Abrir Nova Requisição</Text>
          </TouchableOpacity>
        </View>

        {/* Requisições Recentes */}
        <View className="px-4">
          <Text className="text-lg font-bold text-white mb-4">
            Requisições Recentes
          </Text>

          {rfqsLoading ? (
            <View className="items-center justify-center py-8">
              <Text className="text-slate-400">Carregando RFQs...</Text>
            </View>
          ) : rfqs.length === 0 ? (
            <View className="items-center justify-center py-8 bg-slate-800 rounded-lg">
              <MaterialIcons name="inbox" size={40} color={colors.muted} />
              <Text className="text-slate-400 mt-2">Nenhuma RFQ encontrada</Text>
              <Text className="text-slate-500 text-xs mt-1">
                Clique em "Abrir Nova Requisição" para começar
              </Text>
            </View>
          ) : (
            <FlatList
              data={rfqs}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <RFQListItem
                  rfq={item}
                  onPress={handleSelectRFQ}
                  proposalCount={item.proposalCount || 0}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

export default SourcingHomeScreen;
