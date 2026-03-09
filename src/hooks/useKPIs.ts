/**
 * useKPIs - Hook para cálculo de KPIs de Sourcing
 * 
 * Características:
 * - RFQs Ativas (contagem)
 * - Saving Médio (% de economia)
 * - Compliance Rate (% de fornecedores homologados)
 */

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/services/firebaseConfig';

export interface KPIs {
  activeRFQs: number;
  averageSaving: number; // em %
  complianceRate: number; // em %
  totalVendors: number;
  totalProposals: number;
}

export interface UseKPIsReturn {
  kpis: KPIs;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para calcular KPIs em tempo real
 */
export function useKPIs(): UseKPIsReturn {
  const [kpis, setKPIs] = useState<KPIs>({
    activeRFQs: 0,
    averageSaving: 0,
    complianceRate: 0,
    totalVendors: 0,
    totalProposals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Sincronizar RFQs abertas
      const rfqQuery = query(
        collection(db, 'procurement_rfqs'),
        where('status', '==', 'open')
      );

      const unsubscribeRFQ = onSnapshot(
        rfqQuery,
        (snapshot) => {
          setKPIs((prev) => ({
            ...prev,
            activeRFQs: snapshot.size,
          }));
        },
        (err) => {
          console.error('Erro ao sincronizar RFQs:', err);
          setError(err as Error);
        }
      );

      // Sincronizar propostas
      const proposalQuery = query(
        collection(db, 'vendor_proposals')
      );

      const unsubscribeProposal = onSnapshot(
        proposalQuery,
        (snapshot) => {
          const proposals = snapshot.docs.map((doc) => doc.data());

          // Calcular saving médio
          const savingValues = proposals
            .filter((p: any) => p.savingPercentage)
            .map((p: any) => p.savingPercentage);

          const averageSaving = savingValues.length > 0
            ? savingValues.reduce((a: number, b: number) => a + b, 0) / savingValues.length
            : 0;

          setKPIs((prev) => ({
            ...prev,
            averageSaving: Math.round(averageSaving),
            totalProposals: snapshot.size,
          }));
        },
        (err) => {
          console.error('Erro ao sincronizar propostas:', err);
          setError(err as Error);
        }
      );

      // Sincronizar fornecedores
      const vendorQuery = query(
        collection(db, 'vendors')
      );

      const unsubscribeVendor = onSnapshot(
        vendorQuery,
        (snapshot) => {
          const vendors = snapshot.docs.map((doc) => doc.data());

          // Calcular compliance rate
          const compliantVendors = vendors.filter(
            (v: any) => v.status === 'homologated'
          ).length;

          const complianceRate = snapshot.size > 0
            ? Math.round((compliantVendors / snapshot.size) * 100)
            : 0;

          setKPIs((prev) => ({
            ...prev,
            complianceRate,
            totalVendors: snapshot.size,
          }));
        },
        (err) => {
          console.error('Erro ao sincronizar fornecedores:', err);
          setError(err as Error);
        }
      );

      setLoading(false);

      return () => {
        unsubscribeRFQ();
        unsubscribeProposal();
        unsubscribeVendor();
      };
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  return {
    kpis,
    loading,
    error,
  };
}

export default useKPIs;
