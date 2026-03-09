/**
 * ScorecardFormScreen - Formulário de Avaliação de Performance
 * 
 * Características:
 * - Avaliação em escala 1-10
 * - Cálculo automático de IDF
 * - Validação de formulário
 * - Feedback visual
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/src/components/ui/Button';
import { ErrorBanner } from '@/src/components/ui/ErrorBanner';
import { LoadingOverlay } from '@/src/components/ui/LoadingOverlay';
import scorecardService from '@/src/services/scorecardService';

export interface ScorecardFormScreenProps {
  rfqId: string;
  vendorId: string;
  vendorName: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

/**
 * Tela de formulário de scorecard
 */
export function ScorecardFormScreen({
  rfqId,
  vendorId,
  vendorName,
  onSuccess,
  onBack,
}: ScorecardFormScreenProps) {
  const colors = useColors();

  const [qualityScore, setQualityScore] = useState(5);
  const [punctualityScore, setPunctualityScore] = useState(5);
  const [complianceScore, setComplianceScore] = useState(5);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular IDF preview
  const idfPreview = Math.round(
    (qualityScore * 0.4 + punctualityScore * 0.35 + complianceScore * 0.25) * 10
  ) / 10;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      await scorecardService.createScorecard({
        rfqId,
        vendorId,
        qualityScore,
        punctualityScore,
        complianceScore,
        notes,
      });

      Alert.alert(
        'Sucesso',
        `Scorecard salvo! IDF do fornecedor atualizado para ${idfPreview}`
      );

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar scorecard');
    } finally {
      setLoading(false);
    }
  };

  const renderScoreSlider = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    description: string
  ) => (
    <View className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-base font-semibold text-white">
            {label}
          </Text>
          <Text className="text-xs text-slate-400 mt-1">
            {description}
          </Text>
        </View>
        <View className="bg-blue-600 rounded-lg px-3 py-1">
          <Text className="text-lg font-bold text-white">
            {value}
          </Text>
        </View>
      </View>

      {/* Slider visual com botões */}
      <View className="flex-row gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
          <TouchableOpacity
            key={score}
            onPress={() => onChange(score)}
            className={`flex-1 py-2 rounded ${
              value === score
                ? 'bg-blue-600'
                : 'bg-slate-700'
            }`}
          >
            <Text
              className={`text-xs font-semibold text-center ${
                value === score ? 'text-white' : 'text-slate-400'
              }`}
            >
              {score}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-slate-950">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-4 border-b border-slate-700">
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-white">
            Scorecard Mensal
          </Text>
          <Text className="text-xs text-slate-400">
            {vendorName}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <View className="px-4 py-6">
          {/* Erro */}
          {error && (
            <ErrorBanner
              message={error}
              onDismiss={() => setError(null)}
              containerClassName="mb-4"
            />
          )}

          {/* Instruções */}
          <View className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
            <Text className="text-sm text-slate-300 leading-relaxed">
              Avalie o desempenho do fornecedor em uma escala de 1 a 10. A nota final (IDF) será calculada automaticamente com pesos: Qualidade 40%, Pontualidade 35%, Conformidade 25%.
            </Text>
          </View>

          {/* Critérios de Avaliação */}
          {renderScoreSlider(
            'Qualidade Técnica',
            qualityScore,
            setQualityScore,
            'O material condiz com a especificação?'
          )}

          {renderScoreSlider(
            'Pontualidade',
            punctualityScore,
            setPunctualityScore,
            'A entrega foi feita no prazo acordado?'
          )}

          {renderScoreSlider(
            'Conformidade Documental',
            complianceScore,
            setComplianceScore,
            'Notas fiscais e certificados estavam corretos?'
          )}

          {/* IDF Preview */}
          <View className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700 mb-6">
            <Text className="text-xs font-semibold text-blue-200 uppercase mb-2">
              Índice de Desempenho (IDF) - Preview
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-4xl font-bold text-white">
                {idfPreview}
              </Text>
              <View className="items-end">
                <Text className="text-xs text-blue-200 mb-1">
                  Escala: 0-10
                </Text>
                <View className="w-24 h-2 bg-blue-700 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-emerald-500"
                    style={{ width: `${(idfPreview / 10) * 100}%` }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Observações */}
          <View className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
            <Text className="text-sm font-semibold text-white mb-2">
              Observações (Opcional)
            </Text>
            <View className="bg-slate-900 rounded-lg p-3 border border-slate-600 min-h-24">
              <Text className="text-sm text-slate-300">
                {notes || 'Adicione observações sobre o desempenho...'}
              </Text>
            </View>
          </View>

          {/* Botões */}
          <View className="gap-3">
            <Button
              label="Salvar Avaliação"
              onPress={handleSubmit}
              disabled={loading}
              variant="primary"
            />
            <Button
              label="Cancelar"
              onPress={onBack}
              disabled={loading}
              variant="secondary"
            />
          </View>
        </View>
      </ScrollView>

      {/* Loading */}
      <LoadingOverlay
        visible={loading}
        message="Salvando avaliação..."
      />
    </ScreenContainer>
  );
}

export default ScorecardFormScreen;
