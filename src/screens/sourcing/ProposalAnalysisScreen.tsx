/**
 * ProposalAnalysisScreen - Tela de análise comparativa de propostas
 * 
 * Características:
 * - Detalhes da RFQ
 * - Lista de propostas em ordem de valor
 * - Destaque da melhor proposta
 * - Botão de adjudicação
 * - Sincronização real-time
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { ProposalCard } from '@/src/components/sourcing/ProposalCard';
import { Button } from '@/src/components/ui/Button';
import { useProposals } from '@/src/hooks/useProposals';
import { RFQ } from '@/src/hooks/useRFQs';
import { Proposal } from '@/src/hooks/useProposals';

export interface ProposalAnalysisScreenProps {
  rfq: RFQ;
  onBack: () => void;
  onAdjudicate?: (proposal: Proposal) => Promise<void>;
}

/**
 * Tela de análise de propostas
 */
export function ProposalAnalysisScreen({
  rfq,
  onBack,
  onAdjudicate,
}: ProposalAnalysisScreenProps) {
  const colors = useColors();
  const { proposals, loading, bestProposal } = useProposals(rfq.id);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [adjudicating, setAdjudicating] = useState(false);

  const handleAdjudicate = async () => {
    if (!selectedProposal) {
      Alert.alert('Selecione uma proposta', 'Escolha uma proposta para adjudicar');
      return;
    }

    Alert.alert(
      'Confirmar Adjudicação',
      `Deseja adjudicar a proposta de ${selectedProposal.vendorName}?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Adjudicar',
          onPress: async () => {
            try {
              setAdjudicating(true);
              await onAdjudicate?.(selectedProposal);
              Alert.alert('Sucesso', 'Proposta adjudicada com sucesso');
              onBack();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao adjudicar proposta');
            } finally {
              setAdjudicating(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const categoryLabels = {
    hydraulic: 'Hidráulica',
    electrical: 'Elétrica',
    equipment: 'Equipamentos',
    services: 'Serviços',
  };

  return (
    <ScreenContainer className="bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-4 border-b border-slate-700">
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-white" numberOfLines={1}>
            {rfq.title}
          </Text>
          <Text className="text-xs text-slate-400">
            {categoryLabels[rfq.category]}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        {/* Resumo RFQ */}
        <View className="px-4 py-6 border-b border-slate-700">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xs text-slate-400 mb-1">Orçamento</Text>
              <Text className="text-lg font-bold text-white">
                R$ {rfq.budget.toLocaleString('pt-BR')}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-400 mb-1">Deadline</Text>
              <Text className="text-lg font-bold text-white">
                {new Date(rfq.deadline).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-400 mb-1">Propostas</Text>
              <Text className="text-lg font-bold text-white">
                {proposals.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Propostas */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold text-white mb-4">
            Análise de Propostas
          </Text>

          {loading ? (
            <View className="items-center justify-center py-8">
              <Text className="text-slate-400">Carregando propostas...</Text>
            </View>
          ) : proposals.length === 0 ? (
            <View className="items-center justify-center py-8 bg-slate-800 rounded-lg">
              <MaterialIcons name="inbox" size={40} color={colors.muted} />
              <Text className="text-slate-400 mt-2">Nenhuma proposta recebida</Text>
            </View>
          ) : (
            <FlatList
              data={proposals}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedProposal(item)}
                  activeOpacity={0.7}
                >
                  <ProposalCard
                    proposal={item}
                    isBest={bestProposal?.id === item.id}
                    onPress={setSelectedProposal}
                  />
                </TouchableOpacity>
              )}
            />
          )}

          {/* Detalhes da Proposta Selecionada */}
          {selectedProposal && (
            <View className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <Text className="text-sm font-semibold text-white mb-3">
                Detalhes da Proposta
              </Text>

              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">Fornecedor</Text>
                  <Text className="text-sm font-semibold text-white">
                    {selectedProposal.vendorName}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">Valor Total</Text>
                  <Text className="text-sm font-semibold text-emerald-400">
                    R$ {selectedProposal.totalValue.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">Prazo Entrega</Text>
                  <Text className="text-sm font-semibold text-white">
                    {selectedProposal.leadTime} dias
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">Compliance Score</Text>
                  <Text className="text-sm font-semibold text-white">
                    {selectedProposal.complianceScore}%
                  </Text>
                </View>

                {selectedProposal.specifications && (
                  <View className="mt-2 pt-3 border-t border-slate-700">
                    <Text className="text-xs text-slate-400 mb-2">Especificações</Text>
                    <Text className="text-xs text-slate-300 leading-relaxed">
                      {selectedProposal.specifications}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      {selectedProposal && (
        <View className="px-4 py-4 border-t border-slate-700 gap-3">
          <Button
            label={adjudicating ? 'Adjudicando...' : 'Adjudicar Proposta'}
            onPress={handleAdjudicate}
            disabled={adjudicating}
          />
          <Button
            label="Voltar"
            variant="secondary"
            onPress={onBack}
            disabled={adjudicating}
          />
        </View>
      )}
    </ScreenContainer>
  );
}

export default ProposalAnalysisScreen;
