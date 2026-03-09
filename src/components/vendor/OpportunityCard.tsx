/**
 * OpportunityCard - Componente para exibição de oportunidade (RFQ)
 * 
 * Características:
 * - Título e categoria
 * - Data limite com contador de dias
 * - Orçamento
 * - Botão "Elaborar Proposta"
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { RFQ } from '@/src/hooks/useRFQs';

export interface OpportunityCardProps {
  opportunity: RFQ;
  onPress: (opportunity: RFQ) => void;
  hasProposal?: boolean;
}

/**
 * Card de oportunidade
 */
export function OpportunityCard({
  opportunity,
  onPress,
  hasProposal = false,
}: OpportunityCardProps) {
  const colors = useColors();

  const categoryLabels = {
    hydraulic: 'Hidráulica',
    electrical: 'Elétrica',
    equipment: 'Equipamentos',
    services: 'Serviços',
  };

  const deadline = new Date(opportunity.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 3;

  return (
    <View className="bg-slate-800 rounded-lg p-4 mb-3 border border-slate-700">
      {/* Header: Título e Categoria */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-white" numberOfLines={2}>
            {opportunity.title}
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="bg-blue-600 rounded px-2 py-1">
              <Text className="text-xs font-semibold text-white">
                {categoryLabels[opportunity.category]}
              </Text>
            </View>
            {hasProposal && (
              <View className="bg-emerald-600 rounded px-2 py-1">
                <Text className="text-xs font-semibold text-white">
                  Proposta Enviada
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Orçamento */}
      <View className="mb-3 pb-3 border-b border-slate-700">
        <Text className="text-xs text-slate-400 mb-1">Orçamento Estimado</Text>
        <Text className="text-lg font-bold text-emerald-400">
          R$ {opportunity.budget.toLocaleString('pt-BR')}
        </Text>
      </View>

      {/* Footer: Data e Botão */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialIcons
            name="calendar-today"
            size={14}
            color={isUrgent ? '#EF4444' : colors.muted}
          />
          <Text
            className="text-xs font-semibold"
            style={{ color: isUrgent ? '#EF4444' : colors.muted }}
          >
            {daysLeft > 0 ? `${daysLeft} dias` : 'Prazo expirado'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onPress(opportunity)}
          className="bg-blue-600 rounded px-3 py-2"
          disabled={hasProposal}
        >
          <Text className="text-xs font-semibold text-white">
            {hasProposal ? 'Proposta Enviada' : 'Elaborar Proposta'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default OpportunityCard;
