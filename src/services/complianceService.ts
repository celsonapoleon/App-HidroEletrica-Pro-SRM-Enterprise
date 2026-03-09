/**
 * complianceService - Serviço para gerenciar documentos de compliance
 * 
 * Funções:
 * - Criar documento de compliance
 * - Atualizar documento
 * - Deletar documento
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface CreateComplianceDocumentInput {
  vendorId: string;
  type: 'cnpj' | 'certidao' | 'certification';
  name: string;
  url: string;
  expiresAt?: string;
}

/**
 * Criar documento de compliance
 */
export async function createComplianceDocument(
  input: CreateComplianceDocumentInput
): Promise<string> {
  try {
    const now = new Date().toISOString();

    const docRef = await addDoc(collection(db, 'compliance_documents'), {
      vendorId: input.vendorId,
      type: input.type,
      name: input.name,
      url: input.url,
      expiresAt: input.expiresAt || null,
      status: 'pending',
      uploadedAt: now,
      updatedAt: now,
    });

    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    throw new Error('Falha ao salvar documento');
  }
}

/**
 * Atualizar documento de compliance
 */
export async function updateComplianceDocument(
  documentId: string,
  input: Partial<CreateComplianceDocumentInput>
): Promise<void> {
  try {
    const docRef = doc(db, 'compliance_documents', documentId);

    await updateDoc(docRef, {
      ...input,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    throw new Error('Falha ao atualizar documento');
  }
}

/**
 * Deletar documento de compliance
 */
export async function deleteComplianceDocument(documentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'compliance_documents', documentId));
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    throw new Error('Falha ao deletar documento');
  }
}

export default {
  createComplianceDocument,
  updateComplianceDocument,
  deleteComplianceDocument,
};
