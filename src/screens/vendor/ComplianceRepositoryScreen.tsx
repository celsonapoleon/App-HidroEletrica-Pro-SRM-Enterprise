/**
 * ComplianceRepositoryScreen - Repositório de documentos de compliance
 * 
 * Características:
 * - Upload de documentos (PDF/Imagens)
 * - Sincronização real-time
 * - Barra de progresso
 * - Gerenciamento de documentos
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDocumentAsync } from 'expo-document-picker';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { DocumentCard } from '@/src/components/vendor/DocumentCard';
import { LoadingOverlay } from '@/src/components/ui/LoadingOverlay';
import { ErrorBanner } from '@/src/components/ui/ErrorBanner';
import { useAuth } from '@/src/hooks/useAuth';
import { useComplianceDocuments } from '@/src/hooks/useComplianceDocuments';
import storageService from '@/src/services/storageService';
import complianceService from '@/src/services/complianceService';
import { ComplianceDocument } from '@/src/hooks/useComplianceDocuments';

export interface ComplianceRepositoryScreenProps {
  onBack?: () => void;
}

/**
 * Tela de repositório de compliance
 */
export function ComplianceRepositoryScreen({
  onBack,
}: ComplianceRepositoryScreenProps) {
  const colors = useColors();
  const { user } = useAuth();
  const { documents, loading } = useComplianceDocuments(user?.uid || '');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<'cnpj' | 'certidao' | 'certification' | null>(null);

  const documentTypes = [
    { value: 'cnpj', label: 'CNPJ', icon: 'business' },
    { value: 'certidao', label: 'Certidão Negativa', icon: 'verified-user' },
    { value: 'certification', label: 'Certificação Técnica', icon: 'engineering' },
  ] as const;

  const handleSelectDocument = async (docType: 'cnpj' | 'certidao' | 'certification') => {
    try {
      const result = await getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        await handleUpload(file, docType);
      }
    } catch (err) {
      setError('Erro ao selecionar documento');
    }
  };

  const handleUpload = async (
    file: any,
    docType: 'cnpj' | 'certidao' | 'certification'
  ) => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      // Upload do arquivo
      const url = await storageService.uploadFile(
        {
          name: file.name,
          size: file.size || 0,
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
        },
        user.uid,
        docType,
        (progress) => {
          setUploadProgress(Math.round(progress.progress));
        }
      );

      // Salvar referência no Firestore
      await complianceService.createComplianceDocument({
        vendorId: user.uid,
        type: docType,
        name: file.name,
        url,
      });

      Alert.alert(
        'Sucesso',
        'Documento enviado com sucesso! Aguarde análise de compliance.'
      );

      setSelectedDocType(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async (document: ComplianceDocument) => {
    if (!user) return;

    try {
      setUploading(true);
      await storageService.deleteFile(document.url);
      await complianceService.deleteComplianceDocument(document.id);
      Alert.alert('Sucesso', 'Documento deletado com sucesso');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar documento');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadDocument = (document: ComplianceDocument) => {
    // Implementar download/abertura do documento
    Alert.alert('Baixar', `Abrindo ${document.name}...`);
  };

  return (
    <ScreenContainer className="bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-4 border-b border-slate-700">
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-white">
            Documentação
          </Text>
          <Text className="text-xs text-slate-400">Minha Empresa</Text>
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

          {/* Seção de Upload */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-white mb-4">
              Enviar Documentos
            </Text>

            <View className="gap-3">
              {documentTypes.map((docType) => (
                <TouchableOpacity
                  key={docType.value}
                  onPress={() => handleSelectDocument(docType.value)}
                  disabled={uploading}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="bg-blue-600 rounded-lg p-3">
                      <MaterialIcons name={docType.icon} size={20} color="white" />
                    </View>
                    <View>
                      <Text className="text-base font-semibold text-white">
                        {docType.label}
                      </Text>
                      <Text className="text-xs text-slate-400 mt-1">
                        PDF ou Imagem
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Documentos Enviados */}
          <View>
            <Text className="text-lg font-bold text-white mb-4">
              Documentos Enviados
            </Text>

            {loading ? (
              <View className="items-center justify-center py-8">
                <Text className="text-slate-400">Carregando documentos...</Text>
              </View>
            ) : documents.length === 0 ? (
              <View className="items-center justify-center py-8 bg-slate-800 rounded-lg">
                <MaterialIcons name="folder-open" size={40} color={colors.muted} />
                <Text className="text-slate-400 mt-2">Nenhum documento enviado</Text>
                <Text className="text-slate-500 text-xs mt-1">
                  Envie documentos para completar seu perfil
                </Text>
              </View>
            ) : (
              documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={handleDeleteDocument}
                  onDownload={handleDownloadDocument}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      <LoadingOverlay
        visible={uploading}
        message={`Enviando... ${uploadProgress}%`}
      />
    </ScreenContainer>
  );
}

export default ComplianceRepositoryScreen;
