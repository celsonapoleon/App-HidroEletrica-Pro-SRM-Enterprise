/**
 * useProposals - Hook para sincronização real-time de propostas do Firestore
 * 
 * Características:
 * - Sincronização automática com onSnapshot
 * - Filtro por RFQ ID
 * - Cálculo de scores
 * - Tratamento de erros
 */

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/services/firebaseConfig';

export interface Proposal {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  totalValue: number;
  leadTime: number; // em dias
  complianceScore: number; // 0-100
  specifications: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

export interface UseProposalsReturn {
  proposals: Proposal[];
  loading: boolean;
  error: Error | null;
  bestProposal?: Proposal;
  refetch: () => void;
}

/**
 * Hook para sincronizar propostas em tempo real
 */
export function useProposals(rfqId?: string): UseProposalsReturn {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!rfqId) {
      setProposals([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'vendor_proposals'),
        where('rfqId', '==', rfqId)
      );

      // Sincronização real-time com onSnapshot
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Proposal));

          // Ordenar por valor (menor primeiro)
          data.sort((a, b) => a.totalValue - b.totalValue);

          setProposals(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Erro ao sincronizar propostas:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [rfqId]);

  // Melhor proposta: menor valor + maior compliance score
  const bestProposal = proposals.length > 0
    ? proposals.reduce((best, current) => {
        const bestScore = (best.totalValue * 0.6) - (best.complianceScore * 0.4);
        const currentScore = (current.totalValue * 0.6) - (current.complianceScore * 0.4);
        return currentScore < bestScore ? current : best;
      })
    : undefined;

  const refetch = () => {
    setLoading(true);
  };

  return {
    proposals,
    loading,
    error,
    bestProposal,
    refetch,
  };
}

export default useProposals;
