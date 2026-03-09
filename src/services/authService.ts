/**
 * Auth Service - Integração com Firebase Authentication
 * 
 * Responsável por:
 * - Login/Logout de usuários
 * - Criação de contas (Registro)
 * - Sincronização com Firestore (internal_users)
 * - Tratamento de erros de autenticação
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { InternalUser, UserRole } from '@/src/types';

// ============================================================================
// TIPOS
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string;
  role: UserRole;
  department?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// ============================================================================
// MAPEAMENTO DE ERROS FIREBASE
// ============================================================================

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': 'Usuário não encontrado. Verifique o email.',
  'auth/wrong-password': 'Senha incorreta. Tente novamente.',
  'auth/invalid-email': 'Email inválido. Verifique o formato.',
  'auth/user-disabled': 'Usuário desativado. Contate o administrador.',
  'auth/email-already-in-use': 'Email já registrado. Use outro email ou faça login.',
  'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
  'auth/operation-not-allowed': 'Operação não permitida. Contate o administrador.',
  'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente mais tarde.',
  'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
};

/**
 * Traduzir código de erro do Firebase para mensagem legível
 */
function getErrorMessage(errorCode: string): string {
  return FIREBASE_ERROR_MESSAGES[errorCode] || 'Erro de autenticação. Tente novamente.';
}

// ============================================================================
// SERVIÇO DE AUTENTICAÇÃO
// ============================================================================

export const authService = {
  /**
   * Login de usuário existente
   * 
   * @param credentials - Email e senha
   * @returns Usuário autenticado
   * @throws AuthError com mensagem legível
   */
  async login(credentials: LoginCredentials): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      return userCredential.user;
    } catch (error: any) {
      const errorCode = error.code || 'unknown-error';
      throw {
        code: errorCode,
        message: getErrorMessage(errorCode),
      } as AuthError;
    }
  },

  /**
   * Registrar novo usuário (Solicitar Acesso)
   * 
   * Fluxo:
   * 1. Criar usuário no Firebase Auth
   * 2. Criar documento em internal_users no Firestore
   * 3. Retornar usuário autenticado
   * 
   * @param credentials - Email, senha, nome completo e perfil
   * @returns Usuário autenticado
   * @throws AuthError com mensagem legível
   */
  async register(credentials: RegisterCredentials): Promise<FirebaseUser> {
    try {
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;

      // 2. Criar perfil no Firestore
      const userProfile: InternalUser = {
        id: firebaseUser.uid,
        email: credentials.email,
        fullName: credentials.fullName,
        role: credentials.role,
        department: credentials.department || 'Não especificado',
        permissions: this.getDefaultPermissions(credentials.role),
        status: 'active',
        phone: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        biometricEnabled: false,
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
        },
        metadata: {
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          theme: 'light',
        },
      };

      // Salvar perfil no Firestore
      await setDoc(doc(db, 'internal_users', firebaseUser.uid), userProfile);

      return firebaseUser;
    } catch (error: any) {
      const errorCode = error.code || 'unknown-error';
      throw {
        code: errorCode,
        message: getErrorMessage(errorCode),
      } as AuthError;
    }
  },

  /**
   * Fazer logout do usuário
   * 
   * @throws AuthError se falhar
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      const errorCode = error.code || 'unknown-error';
      throw {
        code: errorCode,
        message: getErrorMessage(errorCode),
      } as AuthError;
    }
  },

  /**
   * Obter permissões padrão por perfil
   * 
   * Define quais ações cada perfil pode realizar
   */
  getDefaultPermissions(role: UserRole): string[] {
    const permissions: Record<UserRole, string[]> = {
      buyer: [
        'create_rfq',
        'view_rfqs',
        'view_proposals',
        'evaluate_proposals',
        'approve_proposal',
        'reject_proposal',
        'manage_vendors',
        'view_kpis',
      ],
      vendor: [
        'view_rfqs',
        'submit_proposal',
        'view_own_proposals',
        'view_own_profile',
        'update_compliance_docs',
      ],
      auditor: [
        'view_all_vendors',
        'view_all_rfqs',
        'view_all_proposals',
        'create_kpi',
        'view_kpis',
        'generate_reports',
        'view_audit_logs',
      ],
      admin: [
        'manage_users',
        'manage_vendors',
        'manage_rfqs',
        'manage_proposals',
        'manage_kpis',
        'view_audit_logs',
        'system_settings',
      ],
    };

    return permissions[role] || [];
  },

  /**
   * Verificar se usuário existe no Firestore
   * 
   * @param uid - ID do usuário Firebase
   * @returns true se existe, false caso contrário
   */
  async userExists(uid: string): Promise<boolean> {
    try {
      const userDocRef = doc(db, 'internal_users', uid);
      const userDocSnap = await getDoc(userDocRef);
      return userDocSnap.exists();
    } catch (error) {
      console.error('Erro ao verificar existência do usuário:', error);
      return false;
    }
  },

  /**
   * Obter perfil do usuário do Firestore
   * 
   * @param uid - ID do usuário Firebase
   * @returns Perfil do usuário ou null
   */
  async getUserProfile(uid: string): Promise<InternalUser | null> {
    try {
      const userDocRef = doc(db, 'internal_users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return userDocSnap.data() as InternalUser;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      return null;
    }
  },
};

export default authService;
