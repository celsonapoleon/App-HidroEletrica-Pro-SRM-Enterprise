/**
 * useVendorPerformance - Hook para performance individual do fornecedor
 * 
 * Características:
 * - Dados para Radar Chart
 * - Histórico de propostas
 * - Sincronização real-time
 */

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db } from '@/src/services/firebaseConfig';
import { Vendor } from '@/src/types';

export interface RadarData {
  quality: number;
  price: number;
  leadTime: number;
  support: number;
  compliance: number;
}

export interface ProposalHistory {
  id: string;
  rfqId: string;
  totalValue: number;
  leadTime: number;
  status: string;
  createdAt: string;
}

export interface UseVendorPerformanceReturn {
  vendor: Vendor | null;
  radarData: RadarData;
  proposals: ProposalHistory[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para sincronizar performance individual
 */
export function useVendorPerformance(vendorId: string): UseVendorPerformanceReturn {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [radarData, setRadarData] = useState<RadarData>({
    quality: 0,
    price: 0,
    leadTime: 0,
    support: 0,
    compliance: 0,
  });
  const [proposals, setProposals] = useState<ProposalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Sincronizar vendor
      const vendorRef = query(
        collection(db, 'vendors'),
        where('id', '==', vendorId)
      );

      const unsubscribeVendor = onSnapshot(
        vendorRef,
        (vendorSnapshot) => {
          if (vendorSnapshot.docs.length > 0) {
            const vendorData = {
              id: vendorSnapshot.docs[0].id,
              ...vendorSnapshot.docs[0].data(),
            } as Vendor;

            setVendor(vendorData);

            // Calcular dados do radar
            const idf = vendorData.idf || 0;
            const quality = Math.min(idf, 10);
            const compliance = Math.min((idf * 0.9), 10);
            const support = Math.min((idf * 0.85), 10);

            setRadarData({
              quality: Math.round(quality),
              price: 7, // Simulado
              leadTime: Math.round(Math.max(10 - (idf * 0.5), 0)),
              support: Math.round(support),
              compliance: Math.round(compliance),
            });
          }

          // Sincronizar proposals
          const proposalsQuery = query(
            collection(db, 'vendor_proposals'),
            where('vendorId', '==', vendorId),
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc'),
            limit(5)
          );

          const unsubscribeProposals = onSnapshot(
            proposalsQuery,
            (proposalsSnapshot) => {
              const proposalsData = proposalsSnapshot.docs.map((doc) => ({
                id: doc.id,
                rfqId: doc.data().rfqId,
                totalValue: doc.data().totalValue,
                leadTime: doc.data().leadTime,
                status: doc.data().status,
                createdAt: doc.data().createdAt,
              } as ProposalHistory));

              setProposals(proposalsData);
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
          console.error('Erro ao sincronizar vendor:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribeVendor();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [vendorId]);

  return {
    vendor,
    radarData,
    proposals,
    loading,
    error,
  };
}

export default useVendorPerformance;
