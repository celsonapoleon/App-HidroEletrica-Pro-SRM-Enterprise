/**
 * NewRFQModal - Modal para criação de nova RFQ
 * 
 * Características:
 * - Formulário com validação
 * - Seleção de categoria
 * - Date picker para deadline
 * - Salvamento no Firestore
 */

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { TextInput } from '@/src/components/ui/TextInput';
import { Button } from '@/src/components/ui/Button';
import { ErrorBanner } from '@/src/components/ui/ErrorBanner';

export interface NewRFQModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: 'hydraulic' | 'electrical' | 'equipment' | 'services';
    deadline: string;
    specifications: string;
    budget?: number;
  }) => Promise<void>;
}

/**
 * Modal para criar nova RFQ
 */
export function NewRFQModal({ visible, onClose, onSubmit }: NewRFQModalProps) {
  const colors = useColors();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'hydraulic' | 'electrical' | 'equipment' | 'services'>('hydraulic');
  const [deadline, setDeadline] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = [
    { value: 'hydraulic', label: 'Hidráulica' },
    { value: 'electrical', label: 'Elétrica' },
    { value: 'equipment', label: 'Equipamentos' },
    { value: 'services', label: 'Serviços' },
  ];

  const handleSubmit = async () => {
    setError(null);

    // Validação
    if (!title.trim()) {
      setError('Título da demanda é obrigatório');
      return;
    }

    if (!deadline.trim()) {
      setError('Data limite é obrigatória');
      return;
    }

    if (!specifications.trim()) {
      setError('Especificações técnicas são obrigatórias');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        category,
        deadline,
        specifications: specifications.trim(),
        budget: budget ? parseFloat(budget) : undefined,
      });
      
      // Limpar formulário
      setTitle('');
      setCategory('hydraulic');
      setDeadline('');
      setSpecifications('');
      setBudget('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar RFQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View
        className="flex-1"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <View
          className="flex-1 mt-12 rounded-t-2xl"
          style={{ backgroundColor: colors.background }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
            <Text className="text-lg font-bold text-foreground">
              Abrir Nova Requisição
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Conteúdo */}
          <ScrollView
            className="flex-1 px-6 py-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Erro */}
            {error && (
              <ErrorBanner
                message={error}
                onDismiss={() => setError(null)}
                containerClassName="mb-4"
              />
            )}

            {/* Título */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Título da Demanda *
              </Text>
              <TextInput
                placeholder="Ex: Tubulações de Cobre de Alta Pressão"
                value={title}
                onChangeText={setTitle}
                editable={!loading}
              />
            </View>

            {/* Categoria */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Categoria *
              </Text>
              <View className="flex-row gap-2">
                {categoryOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setCategory(opt.value as any)}
                    className={`flex-1 py-2 px-3 rounded-lg border ${
                      category === opt.value
                        ? 'bg-primary border-primary'
                        : 'bg-surface border-border'
                    }`}
                    disabled={loading}
                  >
                    <Text
                      className={`text-xs font-semibold text-center ${
                        category === opt.value
                          ? 'text-white'
                          : 'text-foreground'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Data Limite */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Data Limite para Propostas *
              </Text>
              <TextInput
                placeholder="DD/MM/YYYY"
                value={deadline}
                onChangeText={setDeadline}
                editable={!loading}
              />
              <Text className="text-xs text-muted mt-1">
                Formato: DD/MM/YYYY
              </Text>
            </View>

            {/* Orçamento (opcional) */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Orçamento Estimado (opcional)
              </Text>
              <TextInput
                placeholder="0.00"
                value={budget}
                onChangeText={setBudget}
                editable={!loading}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Especificações */}
            <View className="mb-8">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Especificações Técnicas *
              </Text>
              <TextInput
                placeholder="Descreva os requisitos técnicos, normas, padrões, etc."
                value={specifications}
                onChangeText={setSpecifications}
                editable={!loading}
                multiline
                numberOfLines={6}
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="flex-row gap-3 px-6 py-4 border-t border-border">
            <Button
              label="Cancelar"
              variant="secondary"
              onPress={onClose}
              disabled={loading}
              className="flex-1"
            />
            <Button
              label={loading ? 'Salvando...' : 'Criar RFQ'}
              onPress={handleSubmit}
              disabled={loading}
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default NewRFQModal;
