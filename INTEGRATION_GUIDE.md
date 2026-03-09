# Guia de Integração - Módulo de Autenticação

## 📋 Resumo

Este guia descreve como integrar o módulo de autenticação e navegação com RBAC ao aplicativo HidroElétrica Pro.

---

## 🔧 Passo 1: Configurar Firebase

### 1.1 Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Nome: `hidroeletrica-pro`
4. Desabilite Google Analytics
5. Clique em "Criar projeto"

### 1.2 Ativar Firestore

1. No Firebase Console, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Modo: **Modo de teste** (para desenvolvimento)
4. Localização: **Selecione a mais próxima**
5. Clique em "Criar"

### 1.3 Ativar Firebase Auth

1. No Firebase Console, clique em "Authentication"
2. Clique em "Começar"
3. Clique em "Email/Senha"
4. Ative "Email/Senha"
5. Clique em "Salvar"

### 1.4 Obter Credenciais

1. No Firebase Console, clique em "Configurações do projeto"
2. Clique em "Sua aplicação"
3. Clique em "Web"
4. Copie a configuração JSON
5. Cole em `src/services/firebaseConfig.ts`

---

## 🔐 Passo 2: Configurar Firestore Security Rules

1. No Firebase Console, clique em "Firestore Database"
2. Clique em "Regras"
3. Substitua o conteúdo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita de internal_users apenas para o próprio usuário
    match /internal_users/{userId} {
      allow read: if request.auth.uid == userId;
      allow create: if request.auth.uid == resource.id;
      allow update, delete: if false; // Apenas admin pode atualizar
    }

    // Permitir leitura de vendors para todos autenticados
    match /vendors/{vendorId} {
      allow read: if request.auth != null;
      allow write: if false; // Apenas admin pode escrever
    }

    // Permitir leitura de rfqs para todos autenticados
    match /procurement_rfqs/{rfqId} {
      allow read: if request.auth != null;
      allow write: if false; // Apenas admin pode escrever
    }

    // Permitir leitura/escrita de proposals para o próprio usuário
    match /vendor_proposals/{proposalId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == request.resource.data.vendorId;
      allow update: if request.auth.uid == resource.data.vendorId;
      allow delete: if false;
    }

    // Permitir leitura de kpis para todos autenticados
    match /performance_kpis/{kpiId} {
      allow read: if request.auth != null;
      allow write: if false; // Apenas admin pode escrever
    }
  }
}
```

4. Clique em "Publicar"

---

## 📱 Passo 3: Integrar ao App

### 3.1 Atualizar `app/_layout.tsx`

```typescript
import { AuthProvider } from '@/src/context/AuthContext';
import { RootNavigator } from '@/src/navigation/RootNavigator';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
```

### 3.2 Remover Tabs Padrão

Delete ou renomeie `app/(tabs)/` para `app/(tabs)_old/` para evitar conflitos.

### 3.3 Testar

```bash
# Terminal 1: Iniciar Metro
pnpm dev:metro

# Terminal 2: Testar no browser
# Abra http://localhost:8081
```

---

## 🧪 Passo 4: Testar Fluxos

### Teste 1: Registro

1. Abra o app
2. Clique em "Solicitar Acesso"
3. Preencha:
   - Nome: "João Silva"
   - Email: "joao@test.com"
   - Senha: "senha123"
   - Confirmar: "senha123"
   - Perfil: "Strategic Sourcing"
4. Clique em "Criar Conta"
5. **Esperado**: Redireciona para dashboard Sourcing

### Teste 2: Login

1. Abra o app
2. Clique em "Entrar no Sistema"
3. Email: "joao@test.com"
4. Senha: "senha123"
5. Clique em "Entrar no Sistema"
6. **Esperado**: Redireciona para dashboard Sourcing

### Teste 3: Persistência

1. Faça login (Teste 2)
2. Feche o app (ou recarregue a página)
3. Reabra o app
4. **Esperado**: Permanece autenticado, sem mostrar tela de login

### Teste 4: Perfil Vendor

1. Clique em "Solicitar Acesso"
2. Preencha com Perfil: "Key Account Manager"
3. Clique em "Criar Conta"
4. **Esperado**: Redireciona para dashboard Vendor

### Teste 5: Logout

1. Faça login
2. Acesse "Configurações"
3. Clique em "Logout"
4. **Esperado**: Redireciona para tela de login

---

## 📊 Estrutura de Dados Firestore

### Coleção: `internal_users`

```json
{
  "id": "uid_firebase",
  "email": "usuario@empresa.com",
  "fullName": "João Silva",
  "role": "buyer",
  "department": "Strategic Sourcing",
  "permissions": ["create_rfq", "view_proposals", ...],
  "status": "active",
  "phone": "",
  "createdAt": "2026-03-09T13:00:00Z",
  "updatedAt": "2026-03-09T13:00:00Z",
  "biometricEnabled": false,
  "notificationPreferences": {
    "emailNotifications": true,
    "pushNotifications": true,
    "smsNotifications": false
  },
  "metadata": {
    "language": "pt-BR",
    "timezone": "America/Sao_Paulo",
    "theme": "light"
  }
}
```

---

## 🎯 Próximas Etapas

### Fase 1: Validação
- [ ] Testar todos os 5 testes acima
- [ ] Verificar erros no console
- [ ] Validar dados no Firestore

### Fase 2: Melhorias
- [ ] Implementar telas de dashboard
- [ ] Adicionar biometria (Face ID/Fingerprint)
- [ ] Implementar recuperação de senha
- [ ] Adicionar 2FA

### Fase 3: Produção
- [ ] Configurar Firebase para produção
- [ ] Ativar Google Analytics
- [ ] Configurar domínios autorizados
- [ ] Implementar rate limiting
- [ ] Adicionar logging e monitoring

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/src/context/AuthContext'"

**Solução**: Certifique-se de que o arquivo existe em `src/context/AuthContext.tsx`

### Erro: "Firebase is not initialized"

**Solução**: Verifique se `firebaseConfig.ts` tem as credenciais corretas

### Erro: "Permission denied" no Firestore

**Solução**: Verifique as Firestore Security Rules (Passo 2)

### Usuário não aparece no Firestore após registro

**Solução**: Verifique se `authService.register()` está criando documento em `internal_users`

### Tela de login não desaparece após login

**Solução**: Verifique se `AuthContext` está sincronizando com `onAuthStateChanged`

---

## 📚 Referências

- [AUTH_MODULE.md](./AUTH_MODULE.md) - Documentação técnica completa
- [Firebase Console](https://console.firebase.google.com)
- [React Navigation](https://reactnavigation.org)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

---

## ✅ Checklist de Integração

- [ ] Firebase projeto criado
- [ ] Firestore ativado
- [ ] Firebase Auth ativado
- [ ] Credenciais obtidas
- [ ] `firebaseConfig.ts` atualizado
- [ ] Firestore Rules configuradas
- [ ] `app/_layout.tsx` atualizado
- [ ] Teste 1: Registro ✓
- [ ] Teste 2: Login ✓
- [ ] Teste 3: Persistência ✓
- [ ] Teste 4: Perfil Vendor ✓
- [ ] Teste 5: Logout ✓

---

**Desenvolvido com ❤️ para HidroElétrica Pro SRM**
