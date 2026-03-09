/**
 * VendorOpportunitiesScreen - Dashboard de Oportunidades para KAM
 * 
 * Características:
 * - Lista de RFQs abertas
 * - Filtro por categoria
 * - Sincronização real-time
 * - Indicador de propostas já enviadas
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { OpportunityCard } from '@/src/components/vendor/OpportunityCard';
import { useOpportunities } from '@/src/hooks/useOpportunities';
import { useProposals } from '@/src/hooks/useProposals';
import { RFQ } from '@/src/hooks/useRFQs';

export interface VendorOpportunitiesScreenProps {
  onSelectOpportunity?: (opportunity: RFQ) => void;
}

/**
 * Dashboard de Oportunidades para KAM
 */
export function VendorOpportunitiesScreen({
  onSelectOpportunity,
}: VendorOpportunitiesScreenProps) {
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const { opportunities, loading, categories } = useOpportunities(selectedCategory);

  const categoryLabels = {
    hydraulic: 'Hidráulica',
    electrical: 'Elétrica',
    equipment: 'Equipamentos',
    services: 'Serviços',
  };

  return (
    <ScreenContainer className="bg-slate-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-6 border-b border-slate-700">
          <Text className="text-2xl font-bold text-white mb-2">
            Oportunidades
          </Text>
          <Text className="text-sm text-slate-400">
            Requisições de cotação abertas
          </Text>
        </View>

        {/* Filtro de Categoria */}
        <View className="px-4 py-4 border-b border-slate-700">
          <Text className="text-xs font-semibold text-slate-400 mb-3 uppercase">
            Filtrar por Categoria
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {/* Botão "Todas" */}
            <TouchableOpacity
              onPress={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-full border ${
                !selectedCategory
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  !selectedCategory ? 'text-white' : 'text-slate-300'
                }`}
              >
                Todas
              </Text>
            </TouchableOpacity>

            {/* Categorias */}
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    selectedCategory === cat ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {categoryLabels[cat as keyof typeof categoryLabels]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de Oportunidades */}
        <View className="px-4 py-6">
          {loading ? (
            <View className="items-center justify-center py-12">
              <Text className="text-slate-400">Carregando oportunidades...</Text>
            </View>
          ) : opportunities.length === 0 ? (
            <View className="items-center justify-center py-12 bg-slate-800 rounded-lg">
              <MaterialIcons name="inbox" size={40} color={colors.muted} />
              <Text className="text-slate-400 mt-2">Nenhuma oportunidade encontrada</Text>
              <Text className="text-slate-500 text-xs mt-1">
                Verifique novamente em breve
              </Text>
            </View>
          ) : (
            <FlatList
              data={opportunities}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <OpportunityCard
                  opportunity={item}
                  onPress={onSelectOpportunity || (() => {})}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

export default VendorOpportunitiesScreen;
