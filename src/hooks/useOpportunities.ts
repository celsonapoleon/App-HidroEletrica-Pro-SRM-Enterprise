/**
 * useOpportunities - Hook para sincronização de RFQs abertas (oportunidades)
 * 
 * Características:
 * - Sincroniza apenas RFQs com status 'open'
 * - Filtro por categoria
 * - Sincronização real-time
 * - Tratamento de erros
 */

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '@/src/services/firebaseConfig';
import { RFQ } from './useRFQs';

export interface UseOpportunitiesReturn {
  opportunities: RFQ[];
  loading: boolean;
  error: Error | null;
  categories: string[];
  refetch: () => void;
}

/**
 * Hook para sincronizar oportunidades (RFQs abertas)
 */
export function useOpportunities(categoryFilter?: string): UseOpportunitiesReturn {
  const [opportunities, setOpportunities] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const constraints: QueryConstraint[] = [
        where('status', '==', 'open'),
      ];

      // Adicionar filtro de categoria se fornecido
      if (categoryFilter) {
        constraints.push(where('category', '==', categoryFilter));
      }

      const q = query(
        collection(db, 'procurement_rfqs'),
        ...constraints
      );

      // Sincronização real-time
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as RFQ));

          // Ordenar por data de criação (mais recentes primeiro)
          data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setOpportunities(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Erro ao sincronizar oportunidades:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [categoryFilter]);

  // Extrair categorias únicas
  const categories = Array.from(
    new Set(opportunities.map((opp) => opp.category))
  );

  const refetch = () => {
    setLoading(true);
  };

  return {
    opportunities,
    loading,
    error,
    categories,
    refetch,
  };
}

export default useOpportunities;
