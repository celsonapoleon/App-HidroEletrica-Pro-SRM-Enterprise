/**
 * BidSubmissionScreen - Tela de envio de proposta comercial
 * 
 * Características:
 * - Formulário com validação
 * - Máscara de moeda
 * - Date picker para validade
 * - Sincronização com Firestore
 * - Feedback de sucesso/erro
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { TextInput } from '@/src/components/ui/TextInput';
import { Button } from '@/src/components/ui/Button';
import { ErrorBanner } from '@/src/components/ui/ErrorBanner';
import { LoadingOverlay } from '@/src/components/ui/LoadingOverlay';
import { useAuth } from '@/src/hooks/useAuth';
import proposalService from '@/src/services/proposalService';
import { RFQ } from '@/src/hooks/useRFQs';

export interface BidSubmissionScreenProps {
  rfq: RFQ;
  onSuccess?: () => void;
  onBack?: () => void;
}

/**
 * Tela de envio de proposta
 */
export function BidSubmissionScreen({
  rfq,
  onSuccess,
  onBack,
}: BidSubmissionScreenProps) {
  const colors = useColors();
  const { user } = useAuth();

  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [validityDate, setValidityDate] = useState('');
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular valor total
  const totalValue = unitPrice && quantity
    ? (parseFloat(unitPrice) * parseFloat(quantity))
    : 0;

  const handleSubmit = async () => {
    setError(null);

    // Validação
    if (!unitPrice.trim()) {
      setError('Preço unitário é obrigatório');
      return;
    }

    if (!quantity.trim()) {
      setError('Quantidade é obrigatória');
      return;
    }

    if (!leadTime.trim()) {
      setError('Prazo de entrega é obrigatório');
      return;
    }

    if (!validityDate.trim()) {
      setError('Validade da proposta é obrigatória');
      return;
    }

    if (isNaN(parseFloat(unitPrice)) || parseFloat(unitPrice) <= 0) {
      setError('Preço unitário deve ser um valor válido');
      return;
    }

    if (isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
      setError('Quantidade deve ser um valor válido');
      return;
    }

    if (isNaN(parseInt(leadTime)) || parseInt(leadTime) <= 0) {
      setError('Prazo deve ser um número positivo');
      return;
    }

    try {
      setLoading(true);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      await proposalService.createProposal({
        rfqId: rfq.id,
        vendorId: user.uid,
        vendorName: user.email || 'Fornecedor',
        totalValue,
        unitPrice: parseFloat(unitPrice),
        leadTime: parseInt(leadTime),
        validityDate,
        observations,
      });

      Alert.alert(
        'Sucesso',
        'Proposta enviada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess?.();
              onBack?.();
            },
          },
        ]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar proposta');
    } finally {
      setLoading(false);
    }
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
          <Text className="text-xs text-slate-400">Elaborar Proposta</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        {/* Conteúdo */}
        <View className="px-4 py-6">
          {/* Erro */}
          {error && (
            <ErrorBanner
              message={error}
              onDismiss={() => setError(null)}
              containerClassName="mb-4"
            />
          )}

          {/* Resumo RFQ */}
          <View className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
            <Text className="text-xs text-slate-400 mb-2">Orçamento Estimado</Text>
            <Text className="text-2xl font-bold text-emerald-400">
              R$ {rfq.budget.toLocaleString('pt-BR')}
            </Text>
            <Text className="text-xs text-slate-400 mt-3">
              Deadline: {new Date(rfq.deadline).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          {/* Preço Unitário */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-white mb-2">
              Preço Unitário (R$) *
            </Text>
            <TextInput
              placeholder="0.00"
              value={unitPrice}
              onChangeText={setUnitPrice}
              editable={!loading}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Quantidade */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-white mb-2">
              Quantidade *
            </Text>
            <TextInput
              placeholder="0"
              value={quantity}
              onChangeText={setQuantity}
              editable={!loading}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Valor Total (Calculado) */}
          {totalValue > 0 && (
            <View className="mb-6 bg-emerald-900 rounded-lg p-4 border border-emerald-700">
              <Text className="text-xs text-emerald-300 mb-1">Valor Total da Proposta</Text>
              <Text className="text-2xl font-bold text-emerald-400">
                R$ {totalValue.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          )}

          {/* Prazo de Entrega */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-white mb-2">
              Prazo de Entrega (dias) *
            </Text>
            <TextInput
              placeholder="30"
              value={leadTime}
              onChangeText={setLeadTime}
              editable={!loading}
              keyboardType="number-pad"
            />
          </View>

          {/* Validade da Proposta */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-white mb-2">
              Validade da Proposta (DD/MM/YYYY) *
            </Text>
            <TextInput
              placeholder="DD/MM/YYYY"
              value={validityDate}
              onChangeText={setValidityDate}
              editable={!loading}
            />
          </View>

          {/* Observações */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-white mb-2">
              Observações Logísticas/Técnicas
            </Text>
            <TextInput
              placeholder="Descreva detalhes técnicos, logística, garantia, etc."
              value={observations}
              onChangeText={setObservations}
              editable={!loading}
              multiline
              numberOfLines={6}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="flex-row gap-3 px-4 py-4 border-t border-slate-700">
        <Button
          label="Cancelar"
          variant="secondary"
          onPress={onBack}
          disabled={loading}
          className="flex-1"
        />
        <Button
          label={loading ? 'Enviando...' : 'Enviar Proposta'}
          onPress={handleSubmit}
          disabled={loading}
          className="flex-1"
        />
      </View>

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} message="Enviando proposta..." />
    </ScreenContainer>
  );
}

export default BidSubmissionScreen;
