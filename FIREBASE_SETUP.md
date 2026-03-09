# HidroElétrica Pro - Guia de Configuração Firebase

## Pré-requisitos

- Conta Google
- Acesso ao [Firebase Console](https://console.firebase.google.com/)
- Node.js 18+ instalado
- Firebase CLI instalado: `npm install -g firebase-tools`

---

## Passo 1: Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Criar projeto"**
3. Digite o nome: `hidroeletrica-pro`
4. Aceite os termos e clique em **"Criar projeto"**
5. Aguarde a criação (leva alguns segundos)

---

## Passo 2: Registrar Aplicativo Web

1. No Firebase Console, clique no ícone **"<>"** (Web)
2. Dê um apelido: `HidroElétrica Pro Mobile`
3. Marque **"Também configure o Firebase Hosting"** (opcional)
4. Clique em **"Registrar app"**
5. Copie a configuração exibida (você precisará dela)

---

## Passo 3: Obter Credenciais Firebase

1. No Firebase Console, vá para **"Project Settings"** (ícone de engrenagem)
2. Clique na aba **"General"**
3. Procure por **"Your apps"** → **"Web"**
4. Copie os valores:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",                    // EXPO_PUBLIC_FIREBASE_API_KEY
  authDomain: "hidroeletrica-pro.firebaseapp.com",  // EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "hidroeletrica-pro",         // EXPO_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "hidroeletrica-pro.appspot.com",   // EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",         // EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abcdef123456"   // EXPO_PUBLIC_FIREBASE_APP_ID
};
```

---

## Passo 4: Configurar Variáveis de Ambiente

### Opção A: Usando Secrets do Manus (Recomendado)

O sistema pedirá as variáveis Firebase automaticamente. Forneça os valores obtidos no Passo 3.

### Opção B: Arquivo .env.local

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as variáveis:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=hidroeletrica-pro.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=hidroeletrica-pro
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=hidroeletrica-pro.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

3. **NÃO commite `.env.local`** no Git (adicione ao `.gitignore`)

---

## Passo 5: Ativar Serviços Firebase

### 5.1 Firestore Database

1. No Firebase Console, vá para **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar em modo de teste"** (para desenvolvimento)
4. Escolha a localização: **"nam5 (us-central)"** (ou mais próxima)
5. Clique em **"Criar"**

> ⚠️ **Importante**: Em produção, altere as regras de segurança (veja `FIRESTORE_SCHEMA.md`)

### 5.2 Authentication

1. No Firebase Console, vá para **"Authentication"**
2. Clique na aba **"Sign-in method"**
3. Ative os provedores:
   - **Email/Password**: Clique em "Email/Password" → Ative → Salve
   - **Google** (opcional): Clique em "Google" → Ative → Salve
   - **Apple** (opcional, apenas iOS): Clique em "Apple" → Ative → Salve

### 5.3 Storage

1. No Firebase Console, vá para **"Storage"**
2. Clique em **"Começar"**
3. Aceite as regras padrão (modo de teste)
4. Escolha a localização: **"us-central1"**
5. Clique em **"Concluído"**

---

## Passo 6: Criar Índices Firestore

Para otimizar queries, crie os índices compostos:

1. No Firestore, vá para **"Índices"**
2. Clique em **"Criar índice"**
3. Configure conforme a tabela em `FIRESTORE_SCHEMA.md`

Exemplo:
- **Coleção**: `vendors`
- **Campos**: `status` (Ascending), `createdAt` (Descending)
- Clique em **"Criar índice"**

---

## Passo 7: Configurar Regras de Segurança

### Firestore Rules

1. No Firestore, vá para **"Regras"**
2. Substitua o conteúdo pelas regras em `FIRESTORE_SCHEMA.md`
3. Clique em **"Publicar"**

### Storage Rules

1. No Storage, vá para **"Regras"**
2. Substitua por:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 100 * 1024 * 1024; // 100MB max
    }
  }
}
```

3. Clique em **"Publicar"**

---

## Passo 8: Testar Conexão

### 8.1 Desenvolvimento Local com Emulator

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Fazer login
firebase login

# Inicializar projeto
firebase init emulators

# Iniciar emuladores
firebase emulators:start

# Em outro terminal, defina a variável de ambiente
export EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true

# Inicie o app
pnpm dev
```

### 8.2 Produção (Firebase Hosted)

```bash
# Fazer login
firebase login

# Deploy (se usar Firebase Hosting)
firebase deploy
```

---

## Passo 9: Criar Coleções Iniciais

### Via Firebase Console (Manual)

1. No Firestore, clique em **"Criar coleção"**
2. Digite o nome: `vendors`
3. Clique em **"Próximo"**
4. Clique em **"Salvar"** (deixe em branco por enquanto)
5. Repita para as coleções:
   - `procurement_rfqs`
   - `vendor_proposals`
   - `performance_kpis`
   - `internal_users`
   - `notifications`
   - `audit_logs`

### Via Script (Recomendado)

Crie um arquivo `scripts/initializeFirestore.ts`:

```typescript
import { db } from '../src/services/firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

export async function initializeFirestore() {
  const collections = [
    'vendors',
    'procurement_rfqs',
    'vendor_proposals',
    'performance_kpis',
    'internal_users',
    'notifications',
    'audit_logs'
  ];

  for (const collectionName of collections) {
    try {
      // Criar documento dummy para inicializar a coleção
      await setDoc(doc(collection(db, collectionName), '_init'), {
        createdAt: new Date(),
        _placeholder: true
      });
      console.log(`✅ Coleção '${collectionName}' criada`);
    } catch (error) {
      console.error(`❌ Erro ao criar '${collectionName}':`, error);
    }
  }
}

// Executar
initializeFirestore();
```

---

## Passo 10: Verificar Conectividade

1. Inicie o app: `pnpm dev`
2. Abra o navegador: http://localhost:8081
3. Verifique se não há erros no console
4. Teste a autenticação (Login)

---

## Troubleshooting

### Erro: "Firebase not initialized"

- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Firebase foi criado
- Reinicie o servidor: `pnpm dev`

### Erro: "Permission denied" no Firestore

- Verifique as regras de segurança
- Em desenvolvimento, use "Modo de teste"
- Confirme que o usuário está autenticado

### Erro: "Storage bucket not found"

- Ative o Storage no Firebase Console
- Aguarde alguns minutos para propagação
- Reinicie o app

### Emulator não conecta

- Confirme que `firebase emulators:start` está rodando
- Verifique se `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true`
- Verifique as portas (Firestore: 8080, Auth: 9099, Storage: 9199)

---

## Próximas Etapas

1. ✅ Configurar Firebase
2. ⏳ Implementar serviços em `/src/services`
3. ⏳ Criar hooks em `/src/hooks`
4. ⏳ Desenvolver telas em `/src/screens`
5. ⏳ Testar fluxos corporativos

---

## Referências

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
