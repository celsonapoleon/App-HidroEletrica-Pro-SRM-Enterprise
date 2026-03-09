/**
 * useComplianceDocuments - Hook para sincronização de documentos de compliance
 * 
 * Características:
 * - Sincroniza documentos do fornecedor logado
 * - Tipos: CNPJ, Certidões, Certificações
 * - Sincronização real-time
 * - Tratamento de erros
 */

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/services/firebaseConfig';

export interface ComplianceDocument {
  id: string;
  vendorId: string;
  type: 'cnpj' | 'certidao' | 'certification';
  name: string;
  url: string;
  uploadedAt: string;
  expiresAt?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UseComplianceDocumentsReturn {
  documents: ComplianceDocument[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook para sincronizar documentos de compliance
 */
export function useComplianceDocuments(vendorId: string): UseComplianceDocumentsReturn {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!vendorId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'compliance_documents'),
        where('vendorId', '==', vendorId)
      );

      // Sincronização real-time
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as ComplianceDocument));

          // Ordenar por data de upload (mais recentes primeiro)
          data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

          setDocuments(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Erro ao sincronizar documentos:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [vendorId]);

  const refetch = () => {
    setLoading(true);
  };

  return {
    documents,
    loading,
    error,
    refetch,
  };
}

export default useComplianceDocuments;
