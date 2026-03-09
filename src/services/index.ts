/**
 * Services Index
 * 
 * Exports centralizados de todos os serviços
 */

export { authService } from './authService';
export { auth, db } from './firebaseConfig';

export type { LoginCredentials, RegisterCredentials, AuthError } from './authService';
