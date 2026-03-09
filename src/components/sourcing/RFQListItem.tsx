/**
 * RFQListItem - Componente para item de RFQ em lista
 * 
 * Características:
 * - Título e categoria
 * - Status com badge colorido
 * - Data limite
 * - Contador de propostas
 * - Pressável
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { RFQ } from '@/src/hooks/useRFQs';

export interface RFQListItemProps {
  rfq: RFQ;
  onPress: (rfq: RFQ) => void;
  proposalCount?: number;
}

/**
 * Item de RFQ em lista
 */
export function RFQListItem({ rfq, onPress, proposalCount = 0 }: RFQListItemProps) {
  const colors = useColors();

  const statusConfig = {
    open: {
      label: 'Em Cotação',
      bgColor: '#DBEAFE',
      textColor: '#1E40AF',
      icon: 'schedule' as const,
    },
    analysis: {
      label: 'Análise Técnica',
      bgColor: '#FED7AA',
      textColor: '#92400E',
      icon: 'assessment' as const,
    },
    closed: {
      label: 'Finalizada',
      bgColor: '#DCFCE7',
      textColor: '#166534',
      icon: 'check-circle' as const,
    },
  };

  const status = statusConfig[rfq.status];

  const categoryLabels = {
    hydraulic: 'Hidráulica',
    electrical: 'Elétrica',
    equipment: 'Equipamentos',
    services: 'Serviços',
  };

  const deadline = new Date(rfq.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <TouchableOpacity
      onPress={() => onPress(rfq)}
      activeOpacity={0.7}
    >
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        {/* Header: Título e Status */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-base font-semibold text-foreground" numberOfLines={2}>
              {rfq.title}
            </Text>
            <Text className="text-xs text-muted mt-1">
              {categoryLabels[rfq.category]}
            </Text>
          </View>

          {/* Badge de Status */}
          <View
            className="flex-row items-center gap-1 px-3 py-1 rounded"
            style={{ backgroundColor: status.bgColor }}
          >
            <MaterialIcons name={status.icon} size={14} color={status.textColor} />
            <Text
              className="text-xs font-semibold"
              style={{ color: status.textColor }}
              numberOfLines={1}
            >
              {status.label}
            </Text>
          </View>
        </View>

        {/* Footer: Data limite e Propostas */}
        <View className="flex-row items-center justify-between pt-3 border-t border-border">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="calendar-today" size={14} color={colors.muted} />
            <Text className="text-xs text-muted">
              {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo expirado'}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <MaterialIcons name="mail" size={14} color={colors.muted} />
            <Text className="text-xs font-semibold text-foreground">
              {proposalCount} {proposalCount === 1 ? 'proposta' : 'propostas'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default RFQListItem;
