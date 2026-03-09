/**
 * rfqService - Serviço para operações de RFQ no Firestore
 * 
 * Funções:
 * - Criar nova RFQ
 * - Atualizar RFQ
 * - Deletar RFQ
 * - Buscar RFQs
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { RFQ } from '@/src/hooks/useRFQs';

export interface CreateRFQInput {
  title: string;
  category: 'hydraulic' | 'electrical' | 'equipment' | 'services';
  deadline: string;
  specifications: string;
  budget?: number;
  createdBy: string;
}

export interface UpdateRFQInput {
  title?: string;
  status?: 'open' | 'analysis' | 'closed';
  specifications?: string;
  budget?: number;
}

/**
 * Criar nova RFQ
 */
export async function createRFQ(input: CreateRFQInput): Promise<string> {
  try {
    const now = new Date().toISOString();

    const docRef = await addDoc(collection(db, 'procurement_rfqs'), {
      title: input.title,
      category: input.category,
      status: 'open',
      deadline: input.deadline,
      specifications: input.specifications,
      budget: input.budget || 0,
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
      proposalCount: 0,
    });

    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar RFQ:', error);
    throw new Error('Falha ao criar requisição de cotação');
  }
}

/**
 * Atualizar RFQ existente
 */
export async function updateRFQ(
  rfqId: string,
  input: UpdateRFQInput
): Promise<void> {
  try {
    const rfqRef = doc(db, 'procurement_rfqs', rfqId);

    await updateDoc(rfqRef, {
      ...input,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao atualizar RFQ:', error);
    throw new Error('Falha ao atualizar requisição de cotação');
  }
}

/**
 * Deletar RFQ
 */
export async function deleteRFQ(rfqId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'procurement_rfqs', rfqId));
  } catch (error) {
    console.error('Erro ao deletar RFQ:', error);
    throw new Error('Falha ao deletar requisição de cotação');
  }
}

/**
 * Fechar RFQ (mudar status para closed)
 */
export async function closeRFQ(rfqId: string): Promise<void> {
  try {
    await updateRFQ(rfqId, { status: 'closed' });
  } catch (error) {
    console.error('Erro ao fechar RFQ:', error);
    throw new Error('Falha ao fechar requisição de cotação');
  }
}

/**
 * Iniciar análise técnica (mudar status para analysis)
 */
export async function startAnalysis(rfqId: string): Promise<void> {
  try {
    await updateRFQ(rfqId, { status: 'analysis' });
  } catch (error) {
    console.error('Erro ao iniciar análise:', error);
    throw new Error('Falha ao iniciar análise técnica');
  }
}

export default {
  createRFQ,
  updateRFQ,
  deleteRFQ,
  closeRFQ,
  startAnalysis,
};
