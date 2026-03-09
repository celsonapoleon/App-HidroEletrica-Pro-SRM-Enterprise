/**
 * scorecardService - Serviço para gerenciar scorecards de performance
 * 
 * Funções:
 * - Criar scorecard
 * - Calcular IDF individual
 * - Atualizar vendor com novo IDF
 */

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface ScorecardInput {
  rfqId: string;
  vendorId: string;
  qualityScore: number; // 1-10
  punctualityScore: number; // 1-10
  complianceScore: number; // 1-10
  notes?: string;
}

export interface Scorecard extends ScorecardInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Criar scorecard e atualizar IDF do fornecedor
 */
export async function createScorecard(input: ScorecardInput): Promise<string> {
  try {
    const now = new Date().toISOString();

    // Criar scorecard
    const docRef = await addDoc(collection(db, 'performance_kpis'), {
      rfqId: input.rfqId,
      vendorId: input.vendorId,
      qualityScore: input.qualityScore,
      punctualityScore: input.punctualityScore,
      complianceScore: input.complianceScore,
      notes: input.notes || '',
      createdAt: now,
      updatedAt: now,
    });

    // Calcular novo IDF do fornecedor
    await updateVendorIDF(input.vendorId);

    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar scorecard:', error);
    throw new Error('Falha ao salvar avaliação');
  }
}

/**
 * Calcular e atualizar IDF do fornecedor
 */
export async function updateVendorIDF(vendorId: string): Promise<void> {
  try {
    // Buscar todos os scorecards do fornecedor
    const scorecardQuery = query(
      collection(db, 'performance_kpis'),
      where('vendorId', '==', vendorId)
    );

    const scorecardSnapshot = await getDocs(scorecardQuery);
    const scorecards = scorecardSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (scorecards.length === 0) {
      return;
    }

    // Calcular IDF (média ponderada)
    let totalScore = 0;
    scorecards.forEach((scorecard: any) => {
      const qualityWeight = 0.4;
      const punctualityWeight = 0.35;
      const complianceWeight = 0.25;

      const weightedScore =
        (scorecard.qualityScore || 0) * qualityWeight +
        (scorecard.punctualityScore || 0) * punctualityWeight +
        (scorecard.complianceScore || 0) * complianceWeight;

      totalScore += weightedScore;
    });

    const idf = Math.round((totalScore / scorecards.length) * 10) / 10;

    // Atualizar vendor com novo IDF
    const vendorRef = doc(db, 'vendors', vendorId);
    await updateDoc(vendorRef, {
      idf,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao atualizar IDF:', error);
    throw new Error('Falha ao atualizar IDF do fornecedor');
  }
}

/**
 * Buscar scorecards de um fornecedor
 */
export async function getVendorScorecards(vendorId: string): Promise<Scorecard[]> {
  try {
    const scorecardQuery = query(
      collection(db, 'performance_kpis'),
      where('vendorId', '==', vendorId)
    );

    const snapshot = await getDocs(scorecardQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Scorecard));
  } catch (error) {
    console.error('Erro ao buscar scorecards:', error);
    throw new Error('Falha ao buscar avaliações');
  }
}

export default {
  createScorecard,
  updateVendorIDF,
  getVendorScorecards,
};
