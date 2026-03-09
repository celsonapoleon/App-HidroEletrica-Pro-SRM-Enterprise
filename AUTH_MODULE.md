# Módulo de Autenticação e Navegação - HidroElétrica Pro

## 📋 Visão Geral

Módulo completo de autenticação corporativa com **Role-Based Access Control (RBAC)** para o HidroElétrica Pro SRM. Implementa login/registro, persistência de sessão e redirecionamento automático baseado em perfil.

---

## 🏗️ Arquitetura

### Fluxo de Autenticação

```
User Input (Email/Senha)
    ↓
LoginScreen / RegisterScreen
    ↓
authService (Firebase Auth + Firestore)
    ↓
AuthContext (Global State)
    ↓
RootNavigator (RBAC)
    ↓
SourcingStack (Buyer) ou VendorStack (Vendor)
```

### Componentes Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/context/AuthContext.tsx` | Gerenciamento de estado global de autenticação |
| `src/hooks/useAuth.ts` | Hook para acessar contexto de autenticação |
| `src/services/authService.ts` | Integração com Firebase Auth e Firestore |
| `src/screens/auth/LoginScreen.tsx` | Tela de login corporativa |
| `src/screens/auth/RegisterScreen.tsx` | Tela de registro com seleção de perfil |
| `src/navigation/RootNavigator.tsx` | Navegação raiz com RBAC |
| `src/navigation/AuthNavigator.tsx` | Stack de autenticação |
| `src/navigation/SourcingNavigator.tsx` | Stack para Strategic Sourcing (Buyers) |
| `src/navigation/VendorNavigator.tsx` | Stack para Key Account Managers (Vendors) |
| `src/components/ui/Button.tsx` | Botão corporativo |
| `src/components/ui/TextInput.tsx` | Input de texto corporativo |

---

## 🔐 Fluxos de Autenticação

### 1. Login

```typescript
// Usuário insere email e senha
const handleLogin = async () => {
  try {
    await authService.login({
      email: 'user@empresa.com',
      password: 'senha123',
    });
    // AuthContext detecta mudança e sincroniza com Firestore
    // RootNavigator redireciona para stack correto
  } catch (error) {
    // Mostrar erro (senha incorreta, usuário não encontrado, etc.)
  }
};
```

### 2. Registro (Solicitar Acesso)

```typescript
// Usuário preenche formulário com perfil obrigatório
const handleRegister = async () => {
  try {
    await authService.register({
      fullName: 'João Silva',
      email: 'joao@empresa.com',
      password: 'senha123',
      role: 'buyer', // ou 'vendor'
      department: 'Strategic Sourcing',
    });
    // Usuário criado no Firebase Auth + Firestore
    // AuthContext sincroniza automaticamente
    // RootNavigator redireciona para dashboard correto
  } catch (error) {
    // Mostrar erro (email já existe, senha fraca, etc.)
  }
};
```

### 3. Logout

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  try {
    await logout();
    // AuthContext limpa estado
    // RootNavigator redireciona para Login
  } catch (error) {
    // Mostrar erro
  }
};
```

---

## 👥 Perfis Corporativos

### Strategic Sourcing (Buyer)

- **ID**: `buyer`
- **Permissões**:
  - Criar RFQs
  - Visualizar propostas
  - Avaliar propostas
  - Gerenciar fornecedores
  - Visualizar KPIs
- **Telas**:
  - Home (Dashboard)
  - Fornecedores
  - RFQs
  - Propostas
  - Configurações

### Key Account Manager (Vendor)

- **ID**: `vendor`
- **Permissões**:
  - Visualizar RFQs convidados
  - Submeter propostas
  - Visualizar próprias propostas
  - Gerenciar compliance
  - Atualizar documentos
- **Telas**:
  - Home (Dashboard)
  - RFQs Disponíveis
  - Minhas Propostas
  - Compliance
  - Configurações

---

## 🔄 Persistência de Sessão

O módulo usa `onAuthStateChanged` do Firebase para persistência automática:

```typescript
// AuthContext.tsx
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Usuário autenticado - sincronizar com Firestore
      setUser(firebaseUser);
      await fetchUserProfile(firebaseUser.uid);
    } else {
      // Usuário desautenticado
      setUser(null);
      setUserProfile(null);
      setRole(null);
    }
    setIsLoading(false);
  });

  return () => unsubscribe();
}, []);
```

**Comportamento**:
- App inicia → `isLoading = true`
- Firebase verifica sessão → `onAuthStateChanged` dispara
- Se autenticado → Sincroniza com Firestore → `isLoading = false`
- Se não autenticado → `isLoading = false`
- RootNavigator renderiza stack correto

---

## 🛡️ Tratamento de Erros

### Erros Firebase Mapeados

| Código | Mensagem |
|--------|----------|
| `auth/user-not-found` | Usuário não encontrado. Verifique o email. |
| `auth/wrong-password` | Senha incorreta. Tente novamente. |
| `auth/invalid-email` | Email inválido. Verifique o formato. |
| `auth/email-already-in-use` | Email já registrado. Use outro email ou faça login. |
| `auth/weak-password` | Senha muito fraca. Use pelo menos 6 caracteres. |
| `auth/too-many-requests` | Muitas tentativas de login. Tente novamente mais tarde. |

### Validação de Formulário

**Login**:
- Email obrigatório e válido
- Senha obrigatória (mín. 6 caracteres)

**Registro**:
- Nome completo obrigatório
- Email obrigatório e válido
- Senha obrigatória (mín. 6 caracteres)
- Confirmação de senha deve conferir
- Perfil obrigatório (Sourcing ou Vendor)

---

## 🎨 UI Corporativa

### Paleta de Cores

- **Primary**: `#0A5BA8` (Azul Corporativo)
- **Background**: `#FFFFFF` (Branco)
- **Surface**: `#F5F7FA` (Cinza Claro)
- **Foreground**: `#1A1D23` (Preto)
- **Muted**: `#6B7280` (Cinza Médio)
- **Error**: `#EF4444` (Vermelho)
- **Border**: `#E5E7EB` (Cinza Muito Claro)

### Componentes

**Button**:
- Variantes: `primary`, `secondary`, `danger`
- Tamanhos: `sm`, `md`, `lg`
- Estados: normal, loading, disabled

**TextInput**:
- Suporte a ícones
- Estados: normal, foco, erro
- Validação em tempo real

---

## 📱 Como Usar

### 1. Envolver App com AuthProvider

```typescript
// app/_layout.tsx
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

### 2. Acessar Autenticação em Componentes

```typescript
import { useAuth } from '@/src/hooks/useAuth';

export function MyComponent() {
  const { user, role, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Text>Não autenticado</Text>;
  }

  return (
    <View>
      <Text>Bem-vindo, {user?.email}</Text>
      <Text>Perfil: {role}</Text>
      <Button label="Logout" onPress={logout} />
    </View>
  );
}
```

### 3. Proteger Rotas

```typescript
// RootNavigator.tsx já implementa RBAC automaticamente
// Se role === 'buyer' → SourcingStack
// Se role === 'vendor' → VendorStack
// Se !isAuthenticated → AuthStack
```

---

## 🧪 Testando

### Teste de Login

1. Abra o app
2. Clique em "Entrar no Sistema"
3. Digite email e senha válidos
4. Clique em "Entrar no Sistema"
5. Deve redirecionar para dashboard correto

### Teste de Registro

1. Abra o app
2. Clique em "Solicitar Acesso"
3. Preencha formulário com:
   - Nome: "João Silva"
   - Email: "joao@test.com"
   - Senha: "senha123"
   - Confirmar: "senha123"
   - Perfil: "Strategic Sourcing"
4. Clique em "Criar Conta"
5. Deve criar usuário e redirecionar para dashboard

### Teste de Persistência

1. Faça login
2. Feche o app
3. Reabra o app
4. Deve permanecer autenticado (sem mostrar tela de login)

### Teste de Logout

1. Faça login
2. Acesse Configurações
3. Clique em "Logout"
4. Deve redirecionar para Login

---

## 🔧 Configuração Firebase

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /internal_users/{userId} {
      allow read: if request.auth.uid == userId || request.auth.token.role == 'admin';
      allow write: if request.auth.token.role == 'admin';
    }
  }
}
```

### Estrutura de Documento (internal_users)

```json
{
  "id": "uid_do_firebase",
  "email": "usuario@empresa.com",
  "fullName": "Nome Completo",
  "role": "buyer",
  "department": "Strategic Sourcing",
  "permissions": ["create_rfq", "view_proposals", ...],
  "status": "active",
  "createdAt": "2026-03-09T13:00:00Z",
  "updatedAt": "2026-03-09T13:00:00Z"
}
```

---

## 📊 Fluxograma de Navegação

```
App Inicia
    ↓
AuthProvider (Verifica onAuthStateChanged)
    ↓
RootNavigator
    ↓
├─ isLoading? → LoadingScreen
├─ !isAuthenticated? → AuthNavigator (Login/Registro)
├─ role === 'buyer'? → SourcingNavigator (Tabs)
├─ role === 'vendor'? → VendorNavigator (Tabs)
└─ Erro → ErrorScreen
```

---

## 🚀 Próximas Etapas

1. **Implementar Telas de Dashboard**:
   - Home Screen para Sourcing
   - Home Screen para Vendor

2. **Adicionar Biometria**:
   - Face ID / Fingerprint
   - Usar `expo-local-authentication`

3. **Implementar Recuperação de Senha**:
   - Email de reset
   - Tela de reset de senha

4. **Adicionar 2FA**:
   - Autenticação de dois fatores
   - Verificação por SMS/Email

5. **Melhorar UX**:
   - Animações de transição
   - Splash screen customizada
   - Onboarding

---

## 📚 Referências

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [React Navigation](https://reactnavigation.org)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [NativeWind Documentation](https://www.nativewind.dev)

---

## 🎯 Checklist de Implementação

- [x] AuthContext com persistência
- [x] authService com Firebase
- [x] useAuth hook
- [x] LoginScreen corporativa
- [x] RegisterScreen com seleção de perfil
- [x] RootNavigator com RBAC
- [x] SourcingNavigator (Buyer)
- [x] VendorNavigator (Vendor)
- [x] Componentes UI (Button, TextInput)
- [x] Tratamento de erros
- [x] Validação de formulários
- [ ] Testes unitários
- [ ] Biometria
- [ ] Recuperação de senha
- [ ] 2FA

---

**Desenvolvido com ❤️ para HidroElétrica Pro SRM**
