/**
 * proposalService - Serviço para operações de proposta no Firestore
 * 
 * Funções:
 * - Criar nova proposta
 * - Atualizar proposta
 * - Deletar proposta
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface CreateProposalInput {
  rfqId: string;
  vendorId: string;
  vendorName: string;
  totalValue: number;
  unitPrice?: number;
  leadTime: number; // em dias
  validityDate: string;
  observations?: string;
  complianceScore?: number;
}

export interface UpdateProposalInput {
  totalValue?: number;
  unitPrice?: number;
  leadTime?: number;
  validityDate?: string;
  observations?: string;
  status?: 'submitted' | 'under_review' | 'approved' | 'rejected';
}

/**
 * Criar nova proposta
 */
export async function createProposal(input: CreateProposalInput): Promise<string> {
  try {
    const now = new Date().toISOString();

    const docRef = await addDoc(collection(db, 'vendor_proposals'), {
      rfqId: input.rfqId,
      vendorId: input.vendorId,
      vendorName: input.vendorName,
      totalValue: input.totalValue,
      unitPrice: input.unitPrice || 0,
      leadTime: input.leadTime,
      validityDate: input.validityDate,
      observations: input.observations || '',
      complianceScore: input.complianceScore || 0,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar proposta:', error);
    throw new Error('Falha ao enviar proposta');
  }
}

/**
 * Atualizar proposta existente
 */
export async function updateProposal(
  proposalId: string,
  input: UpdateProposalInput
): Promise<void> {
  try {
    const proposalRef = doc(db, 'vendor_proposals', proposalId);

    await updateDoc(proposalRef, {
      ...input,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao atualizar proposta:', error);
    throw new Error('Falha ao atualizar proposta');
  }
}

/**
 * Deletar proposta
 */
export async function deleteProposal(proposalId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'vendor_proposals', proposalId));
  } catch (error) {
    console.error('Erro ao deletar proposta:', error);
    throw new Error('Falha ao deletar proposta');
  }
}

export default {
  createProposal,
  updateProposal,
  deleteProposal,
};
