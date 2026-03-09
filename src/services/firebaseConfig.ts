/**
 * Firebase Configuration
 * 
 * Este arquivo configura o Firebase SDK para o projeto HidroElétrica Pro.
 * Inclui inicialização do Firestore, Authentication, e outras funcionalidades.
 * 
 * IMPORTANTE: Substitua os valores de {PROJECT_ID}, {API_KEY}, etc. pelos valores
 * reais do seu projeto Firebase. Você pode encontrá-los em:
 * Firebase Console → Project Settings → General → Your apps → Web
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { initializeAnalytics } from 'firebase/analytics';
import { Platform } from 'react-native';

/**
 * Configuração do Firebase
 * 
 * Valores necessários (obtenha do Firebase Console):
 * - apiKey: Chave de API do projeto
 * - authDomain: Domínio de autenticação
 * - projectId: ID do projeto Firebase
 * - storageBucket: Bucket de armazenamento
 * - messagingSenderId: ID do remetente de mensagens
 * - appId: ID do aplicativo
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '{FIREBASE_API_KEY}',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '{FIREBASE_AUTH_DOMAIN}',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '{FIREBASE_PROJECT_ID}',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '{FIREBASE_STORAGE_BUCKET}',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '{FIREBASE_MESSAGING_SENDER_ID}',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '{FIREBASE_APP_ID}',
};

/**
 * Inicializar Firebase App
 */
const app = initializeApp(firebaseConfig);

/**
 * Inicializar Firestore
 * 
 * Firestore é um banco de dados NoSQL em tempo real, ideal para aplicações móveis.
 * Suporta sincronização offline automática com AsyncStorage.
 */
export const db = getFirestore(app);

/**
 * Inicializar Firebase Authentication
 * 
 * Suporta:
 * - Email/Senha
 * - OAuth (Google, Apple, Facebook)
 * - Biometria (Face ID, Fingerprint)
 */
export const auth = getAuth(app);

/**
 * Inicializar Firebase Storage
 * 
 * Para armazenar documentos de compliance, certificados, propostas, etc.
 */
export const storage = getStorage(app);

/**
 * Inicializar Firebase Analytics (apenas em produção)
 * 
 * Rastreia eventos de uso do aplicativo para análise de comportamento.
 */
if (Platform.OS !== 'web' || process.env.NODE_ENV === 'production') {
  try {
    initializeAnalytics(app);
  } catch (error) {
    console.warn('Firebase Analytics não disponível:', error);
  }
}

/**
 * Conectar ao Emulador (desenvolvimento local)
 * 
 * Para usar o emulador local:
 * 1. Instale Firebase CLI: npm install -g firebase-tools
 * 2. Inicie o emulador: firebase emulators:start
 * 3. Descomente as linhas abaixo
 */
const USE_EMULATOR = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (USE_EMULATOR && Platform.OS !== 'web') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('✅ Conectado aos emuladores do Firebase');
  } catch (error) {
    console.warn('⚠️ Erro ao conectar aos emuladores:', error);
  }
}

export default app;
