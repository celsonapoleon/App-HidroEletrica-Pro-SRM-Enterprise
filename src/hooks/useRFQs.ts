/**
 * useRFQs - Hook para sincronização real-time de RFQs do Firestore
 * 
 * Características:
 * - Sincronização automática com onSnapshot
 * - Filtro por status (open, analysis, closed)
 * - Cálculo de KPIs
 * - Tratamento de erros
 */

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '@/src/services/firebaseConfig';

export interface RFQ {
  id: string;
  title: string;
  category: 'hydraulic' | 'electrical' | 'equipment' | 'services';
  status: 'open' | 'analysis' | 'closed';
  budget: number;
  deadline: string;
  specifications: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  proposalCount?: number;
}

export interface UseRFQsReturn {
  rfqs: RFQ[];
  loading: boolean;
  error: Error | null;
  activeRFQCount: number;
  refetch: () => void;
}

/**
 * Hook para sincronizar RFQs em tempo real
 */
export function useRFQs(filters?: { status?: RFQ['status'] }): UseRFQsReturn {
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const constraints: QueryConstraint[] = [];

      // Filtro por status se fornecido
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      const q = query(
        collection(db, 'procurement_rfqs'),
        ...constraints
      );

      // Sincronização real-time com onSnapshot
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as RFQ));

          // Ordenar por data de criação (mais recentes primeiro)
          data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setRFQs(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Erro ao sincronizar RFQs:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [filters?.status]);

  const activeRFQCount = rfqs.filter((rfq) => rfq.status === 'open').length;

  const refetch = () => {
    setLoading(true);
  };

  return {
    rfqs,
    loading,
    error,
    activeRFQCount,
    refetch,
  };
}

export default useRFQs;
