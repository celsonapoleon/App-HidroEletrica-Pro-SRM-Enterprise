/**
 * useAuth - Hook para acessar contexto de autenticação
 * 
 * Fornece acesso seguro ao contexto de autenticação com validação.
 * Deve ser usado dentro de um componente envolvido por AuthProvider.
 */

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/src/context/AuthContext';

/**
 * Hook para acessar o contexto de autenticação
 * 
 * @returns {AuthContextType} Contexto de autenticação
 * @throws {Error} Se usado fora de AuthProvider
 * 
 * @example
 * const { user, role, isAuthenticated, logout } = useAuth();
 * 
 * if (!isAuthenticated) {
 *   return <LoginScreen />;
 * }
 * 
 * return <DashboardScreen />;
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de um AuthProvider. ' +
      'Certifique-se de que AuthProvider envolve seu componente.'
    );
  }

  return context;
}

export default useAuth;
