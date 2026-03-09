/**
 * ProposalCard - Componente para exibição de proposta em lista
 * 
 * Características:
 * - Nome do fornecedor
 * - Valor total
 * - Prazo de entrega
 * - Score de compliance
 * - Ícone de melhor proposta
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { Proposal } from '@/src/hooks/useProposals';

export interface ProposalCardProps {
  proposal: Proposal;
  isBest?: boolean;
  onPress: (proposal: Proposal) => void;
}

/**
 * Card de proposta
 */
export function ProposalCard({ proposal, isBest = false, onPress }: ProposalCardProps) {
  const colors = useColors();

  const complianceColor =
    proposal.complianceScore >= 80
      ? colors.success
      : proposal.complianceScore >= 60
      ? '#F59E0B'
      : colors.error;

  return (
    <TouchableOpacity
      onPress={() => onPress(proposal)}
      activeOpacity={0.7}
    >
      <View
        className={`rounded-lg p-4 mb-3 border ${
          isBest ? 'border-emerald-500 bg-emerald-50' : 'border-border bg-surface'
        }`}
      >
        {/* Header: Nome e Badge */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text className={`text-base font-semibold ${isBest ? 'text-emerald-900' : 'text-foreground'}`}>
              {proposal.vendorName}
            </Text>
          </View>

          {isBest && (
            <View className="flex-row items-center gap-1 px-2 py-1 bg-emerald-500 rounded">
              <MaterialIcons name="star" size={12} color="white" />
              <Text className="text-xs font-bold text-white">Melhor</Text>
            </View>
          )}
        </View>

        {/* Valor */}
        <View className="mb-3 pb-3 border-b border-border">
          <Text className="text-xs text-muted mb-1">Valor Total</Text>
          <Text className="text-2xl font-bold text-foreground">
            R$ {proposal.totalValue.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        {/* Grid: Lead Time e Compliance */}
        <View className="flex-row gap-4">
          {/* Lead Time */}
          <View className="flex-1">
            <View className="flex-row items-center gap-1 mb-1">
              <MaterialIcons name="schedule" size={14} color={colors.muted} />
              <Text className="text-xs text-muted">Prazo</Text>
            </View>
            <Text className="text-sm font-semibold text-foreground">
              {proposal.leadTime} dias
            </Text>
          </View>

          {/* Compliance Score */}
          <View className="flex-1">
            <View className="flex-row items-center gap-1 mb-1">
              <MaterialIcons name="verified" size={14} color={complianceColor} />
              <Text className="text-xs text-muted">Compliance</Text>
            </View>
            <Text className="text-sm font-semibold" style={{ color: complianceColor }}>
              {proposal.complianceScore}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ProposalCard;
