/**
 * AuthContext - Gerenciamento de Estado Global de Autenticação
 * 
 * Responsável por:
 * - Gerenciar estado de autenticação (user, role, isAuthenticated)
 * - Persistência de sessão com Firebase onAuthStateChanged
 * - Sincronização com Firestore (internal_users)
 * - Fornecimento de contexto para toda a aplicação
 */

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { auth, db } from '@/src/services/firebaseConfig';
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { InternalUser, UserRole } from '@/src/types';

// ============================================================================
// TIPOS
// ============================================================================

export interface AuthContextType {
  // Estado de Autenticação
  user: FirebaseUser | null;
  userProfile: InternalUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Métodos
  logout: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// CONTEXTO
// ============================================================================

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Estado
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<InternalUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Buscar perfil do usuário no Firestore
   * Sincroniza dados de autenticação com dados corporativos
   */
  const fetchUserProfile = useCallback(async (uid: string) => {
    try {
      const userDocRef = doc(db, 'internal_users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const profile = userDocSnap.data() as InternalUser;
        setUserProfile(profile);
        setRole(profile.role);
        setError(null);
        return profile;
      } else {
        // Usuário não tem perfil no Firestore (erro de sincronização)
        console.warn(`Usuário ${uid} não tem perfil no Firestore`);
        setError('Perfil de usuário não encontrado. Contate o administrador.');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar perfil';
      console.error('Erro ao buscar perfil do usuário:', err);
      setError(errorMessage);
      return null;
    }
  }, []);

  /**
   * Monitorar mudanças no estado de autenticação do Firebase
   * Sincroniza automaticamente quando usuário faz login/logout
   */
  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Usuário autenticado
          setUser(firebaseUser);
          await fetchUserProfile(firebaseUser.uid);
        } else {
          // Usuário desautenticado
          setUser(null);
          setUserProfile(null);
          setRole(null);
          setError(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro de autenticação';
        console.error('Erro ao processar mudança de autenticação:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  /**
   * Fazer logout do usuário
   * Remove sessão do Firebase Auth
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setRole(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout';
      console.error('Erro ao fazer logout:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpar mensagem de erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Valor do contexto
  const value: AuthContextType = {
    user,
    userProfile,
    role,
    isAuthenticated: !!user,
    isLoading,
    error,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// EXPORT
// ============================================================================

export default AuthContext;
