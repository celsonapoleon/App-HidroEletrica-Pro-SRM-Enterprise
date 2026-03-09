/**
 * useAuditMetrics - Hook para agregação de dados de auditoria
 * 
 * Características:
 * - Cálculo de IDF Global (Índice de Desempenho do Fornecedor)
 * - Cálculo de Saving Total Acumulado
 * - Identificação de riscos de compliance
 * - Sincronização real-time
 */

import { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/services/firebaseConfig';
import { Vendor } from '@/src/types';

export interface AuditMetrics {
  globalIDF: number; // Índice de Desempenho Global (0-10)
  totalSaving: number; // Economia total em R$
  savingPercentage: number; // Percentual de economia
  complianceRisks: Vendor[]; // Fornecedores com risco
  totalVendors: number;
  totalRFQs: number;
  totalProposals: number;
  averageLeadTime: number; // Dias
}

export interface UseAuditMetricsReturn {
  metrics: AuditMetrics;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook para sincronizar métricas de auditoria
 */
export function useAuditMetrics(): UseAuditMetricsReturn {
  const [metrics, setMetrics] = useState<AuditMetrics>({
    globalIDF: 0,
    totalSaving: 0,
    savingPercentage: 0,
    complianceRisks: [],
    totalVendors: 0,
    totalRFQs: 0,
    totalProposals: 0,
    averageLeadTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Sincronizar vendors
      const vendorsQuery = query(collection(db, 'vendors'));
      const unsubscribeVendors = onSnapshot(
        vendorsQuery,
        (vendorsSnapshot) => {
          const vendors = vendorsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Vendor));

          // Calcular IDF Global (média ponderada)
          const idfScores = vendors
            .filter((v) => v.idf !== undefined && v.idf !== null)
            .map((v) => v.idf as number);

          const globalIDF =
            idfScores.length > 0
              ? idfScores.reduce((a, b) => a + b, 0) / idfScores.length
              : 0;

          // Identificar riscos de compliance
          const complianceRisks = vendors.filter((v) => {
            const hasExpiredDocs = v.complianceDocuments?.some((doc: any) => {
              if (!doc.expiresAt) return false;
              return new Date(doc.expiresAt) < new Date();
            });

            const lowQualityScore = (v.idf || 0) < 6.0;

            return hasExpiredDocs || lowQualityScore;
          });

          // Sincronizar RFQs para calcular savings
          const rfqsQuery = query(collection(db, 'procurement_rfqs'));
          const unsubscribeRFQs = onSnapshot(
            rfqsQuery,
            (rfqsSnapshot) => {
              const rfqs = rfqsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));

              // Calcular total de savings
              let totalSaving = 0;
              let totalBudget = 0;

              rfqs.forEach((rfq: any) => {
                if (rfq.budget) {
                  totalBudget += rfq.budget;
                }
              });

              // Sincronizar proposals para calcular savings realizados
              const proposalsQuery = query(
                collection(db, 'vendor_proposals')
              );
              const unsubscribeProposals = onSnapshot(
                proposalsQuery,
                (proposalsSnapshot) => {
                  const proposals = proposalsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));

                  let totalAdjudicated = 0;
                  let totalLeadTime = 0;
                  let leadTimeCount = 0;

                  proposals.forEach((prop: any) => {
                    if (prop.status === 'approved' && prop.totalValue) {
                      totalAdjudicated += prop.totalValue;
                    }
                    if (prop.leadTime) {
                      totalLeadTime += prop.leadTime;
                      leadTimeCount++;
                    }
                  });

                  const saving = totalBudget - totalAdjudicated;
                  const savingPercentage =
                    totalBudget > 0 ? (saving / totalBudget) * 100 : 0;

                  const averageLeadTime =
                    leadTimeCount > 0 ? totalLeadTime / leadTimeCount : 0;

                  setMetrics({
                    globalIDF: Math.round(globalIDF * 10) / 10,
                    totalSaving: Math.round(saving),
                    savingPercentage: Math.round(savingPercentage * 100) / 100,
                    complianceRisks,
                    totalVendors: vendors.length,
                    totalRFQs: rfqs.length,
                    totalProposals: proposals.length,
                    averageLeadTime: Math.round(averageLeadTime),
                  });

                  setLoading(false);
                  setError(null);
                },
                (err) => {
                  console.error('Erro ao sincronizar proposals:', err);
                  setError(err as Error);
                  setLoading(false);
                }
              );

              return () => unsubscribeProposals();
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
          console.error('Erro ao sincronizar vendors:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribeVendors();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  const refetch = () => {
    setLoading(true);
  };

  return {
    metrics,
    loading,
    error,
    refetch,
  };
}

export default useAuditMetrics;
