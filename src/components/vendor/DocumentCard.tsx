/**
 * DocumentCard - Componente para exibição de documento de compliance
 * 
 * Características:
 * - Tipo de documento
 * - Data de upload
 * - Status (Pendente, Aprovado, Rejeitado)
 * - Botão de deletar
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ComplianceDocument } from '@/src/hooks/useComplianceDocuments';

export interface DocumentCardProps {
  document: ComplianceDocument;
  onDelete?: (document: ComplianceDocument) => void;
  onDownload?: (document: ComplianceDocument) => void;
}

/**
 * Card de documento
 */
export function DocumentCard({
  document,
  onDelete,
  onDownload,
}: DocumentCardProps) {
  const colors = useColors();

  const typeLabels = {
    cnpj: 'CNPJ',
    certidao: 'Certidão Negativa',
    certification: 'Certificação Técnica',
  };

  const statusColors = {
    pending: { bg: '#FEF3C7', text: '#92400E', icon: '#F59E0B' },
    approved: { bg: '#DCFCE7', text: '#166534', icon: '#10B981' },
    rejected: { bg: '#FEE2E2', text: '#991B1B', icon: '#EF4444' },
  };

  const statusLabels = {
    pending: 'Em Análise',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
  };

  const status = statusColors[document.status];
  const uploadDate = new Date(document.uploadedAt).toLocaleDateString('pt-BR');

  const handleDelete = () => {
    Alert.alert(
      'Deletar Documento',
      `Deseja deletar o documento "${document.name}"?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Deletar',
          onPress: () => onDelete?.(document),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View className="bg-slate-800 rounded-lg p-4 mb-3 border border-slate-700">
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-white mb-1">
            {typeLabels[document.type]}
          </Text>
          <Text className="text-xs text-slate-400">
            {document.name}
          </Text>
        </View>
        <View
          className="px-2 py-1 rounded"
          style={{ backgroundColor: status.bg }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: status.text }}
          >
            {statusLabels[document.status]}
          </Text>
        </View>
      </View>

      {/* Data de Upload */}
      <View className="flex-row items-center gap-2 mb-3 pb-3 border-b border-slate-700">
        <MaterialIcons name="calendar-today" size={14} color={colors.muted} />
        <Text className="text-xs text-slate-400">
          Enviado em {uploadDate}
        </Text>
      </View>

      {/* Ações */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onDownload?.(document)}
          className="flex-1 flex-row items-center justify-center gap-2 bg-blue-600 rounded px-3 py-2"
        >
          <MaterialIcons name="download" size={14} color="white" />
          <Text className="text-xs font-semibold text-white">Baixar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="flex-1 flex-row items-center justify-center gap-2 bg-red-600 rounded px-3 py-2"
        >
          <MaterialIcons name="delete" size={14} color="white" />
          <Text className="text-xs font-semibold text-white">Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default DocumentCard;
