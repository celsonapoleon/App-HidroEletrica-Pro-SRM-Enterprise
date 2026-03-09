/**
 * useCategoryPerformance - Hook para análise de performance por categoria
 * 
 * Características:
 * - Comparação Lead Time Prometido vs Realizado
 * - Agregação por categoria
 * - Sincronização real-time
 */

import { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/services/firebaseConfig';

export interface CategoryPerformance {
  category: string;
  promisedLeadTime: number; // Média de prazo prometido
  realizedLeadTime: number; // Média de prazo realizado
  variance: number; // Diferença (positiva = atrasado)
  proposalCount: number; // Número de propostas
  onTimePercentage: number; // % de entregas no prazo
}

export interface UseCategoryPerformanceReturn {
  data: CategoryPerformance[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook para sincronizar performance por categoria
 */
export function useCategoryPerformance(): UseCategoryPerformanceReturn {
  const [data, setData] = useState<CategoryPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Sincronizar proposals
      const proposalsQuery = query(collection(db, 'vendor_proposals'));
      const unsubscribeProposals = onSnapshot(
        proposalsQuery,
        (proposalsSnapshot) => {
          const proposals = proposalsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Sincronizar RFQs para obter categorias
          const rfqsQuery = query(collection(db, 'procurement_rfqs'));
          const unsubscribeRFQs = onSnapshot(
            rfqsQuery,
            (rfqsSnapshot) => {
              const rfqs = rfqsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));

              // Agrupar por categoria
              const categoryMap = new Map<string, CategoryPerformance>();

              rfqs.forEach((rfq: any) => {
                const category = rfq.category || 'Sem Categoria';

                // Encontrar propostas aprovadas para esta RFQ
                const approvedProposals = proposals.filter(
                  (p: any) => p.rfqId === rfq.id && p.status === 'approved'
                );

                if (approvedProposals.length > 0) {
                  const existingData = categoryMap.get(category) || {
                    category,
                    promisedLeadTime: 0,
                    realizedLeadTime: 0,
                    variance: 0,
                    proposalCount: 0,
                    onTimePercentage: 0,
                  };

                  approvedProposals.forEach((prop: any) => {
                    existingData.promisedLeadTime += prop.leadTime || 0;
                    existingData.proposalCount += 1;

                    // Simular lead time realizado (em produção, virá de dados de entrega)
                    const realizedLeadTime = (prop.leadTime || 0) * (0.8 + Math.random() * 0.4);
                    existingData.realizedLeadTime += realizedLeadTime;

                    if (realizedLeadTime <= (prop.leadTime || 0)) {
                      existingData.onTimePercentage += 1;
                    }
                  });

                  if (existingData.proposalCount > 0) {
                    existingData.promisedLeadTime = Math.round(
                      existingData.promisedLeadTime / existingData.proposalCount
                    );
                    existingData.realizedLeadTime = Math.round(
                      existingData.realizedLeadTime / existingData.proposalCount
                    );
                    existingData.variance =
                      existingData.realizedLeadTime - existingData.promisedLeadTime;
                    existingData.onTimePercentage = Math.round(
                      (existingData.onTimePercentage / existingData.proposalCount) * 100
                    );
                  }

                  categoryMap.set(category, existingData);
                }
              });

              const categoryData = Array.from(categoryMap.values());
              setData(categoryData);
              setLoading(false);
              setError(null);
            },
            (err) => {
              console.error('Erro ao sincronizar RFQs:', err);
              setError(err as Error);
              setLoading(false);
            }
          );

          return () => unsubscribeRFQs();
        },
        (err) => {
          console.error('Erro ao sincronizar proposals:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribeProposals();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  const refetch = () => {
    setLoading(true);
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}

export default useCategoryPerformance;
