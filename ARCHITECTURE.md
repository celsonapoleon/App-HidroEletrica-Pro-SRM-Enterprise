# HidroElétrica Pro - Arquitetura de Pastas

## Estrutura Corporativa Escalável

```
src/
├── services/          # Lógica de negócio e integração com APIs/Firebase
├── components/        # Componentes reutilizáveis (Button, Card, Modal, etc.)
├── screens/           # Telas principais do aplicativo
├── hooks/             # Custom React hooks (useAuth, useVendors, etc.)
├── context/           # Context API para estado global (Auth, Vendors, RFQs)
├── utils/             # Funções utilitárias (formatação, validação, etc.)
├── types/             # Tipos TypeScript (Vendor, RFQ, Proposal, etc.)
├── constants/         # Constantes da aplicação (URLs, chaves, etc.)
└── navigation/        # Configuração de navegação (rotas, stacks)
```

---

## Propósito de Cada Pasta

### `/src/services`

**Responsabilidade**: Lógica de negócio, integração com Firebase e APIs externas.

**Padrão**: Cada serviço é uma classe ou arquivo com funções puras.

**Exemplo**:
- `vendorService.ts` - CRUD de fornecedores (Firestore)
- `rfqService.ts` - Gerenciamento de RFQs
- `proposalService.ts` - Gerenciamento de propostas
- `authService.ts` - Autenticação Firebase
- `kpiService.ts` - Cálculo de KPIs e scorecards

**Contexto SRM**: Separa a lógica corporativa da UI, permitindo testes unitários e reutilização em múltiplas plataformas.

---

### `/src/components`

**Responsabilidade**: Componentes reutilizáveis e agnósticos de negócio.

**Padrão**: Componentes funcionais com props bem definidas.

**Estrutura**:
```
components/
├── ui/                # Componentes base (Button, Card, Badge, etc.)
├── layouts/           # Layouts reutilizáveis (TopBar, BottomTab, etc.)
└── forms/             # Componentes de formulário (Input, Select, etc.)
```

**Exemplo**:
- `ui/Button.tsx` - Botão primário/secundário/perigo
- `ui/Card.tsx` - Container com sombra e borda
- `ui/Badge.tsx` - Indicador de status (Ativo, Pendente, Rejeitado)
- `layouts/ScreenContainer.tsx` - SafeArea wrapper
- `forms/VendorForm.tsx` - Formulário de cadastro de fornecedor

**Contexto SRM**: Garante consistência visual corporativa em todo o aplicativo.

---

### `/src/screens`

**Responsabilidade**: Telas principais do aplicativo (páginas completas).

**Padrão**: Cada tela é um arquivo ou pasta com componentes específicos.

**Estrutura**:
```
screens/
├── auth/              # Telas de autenticação (Login, Register, etc.)
├── home/              # Dashboard e home
├── vendors/           # Gerenciamento de fornecedores
├── rfqs/              # Requisições de cotação
├── proposals/         # Propostas comerciais
├── kpis/              # Scorecards e desempenho
├── users/             # Gerenciamento de usuários internos
└── settings/          # Configurações
```

**Exemplo**:
- `auth/LoginScreen.tsx` - Tela de login
- `home/DashboardScreen.tsx` - Home com KPIs
- `vendors/VendorListScreen.tsx` - Lista de fornecedores
- `vendors/VendorDetailScreen.tsx` - Detalhes do fornecedor
- `rfqs/RFQListScreen.tsx` - Lista de RFQs
- `proposals/ProposalComparisonScreen.tsx` - Comparativo de propostas

**Contexto SRM**: Organização clara de cada fluxo corporativo (Sourcing, Procurement, Compliance).

---

### `/src/hooks`

**Responsabilidade**: Custom React hooks para lógica reutilizável.

**Padrão**: Hooks que encapsulam estado e efeitos colaterais.

**Exemplo**:
- `useAuth()` - Estado de autenticação e perfil do usuário
- `useVendors()` - Fetch e cache de fornecedores
- `useRFQs()` - Gerenciamento de RFQs
- `useProposals()` - Gerenciamento de propostas
- `useKPIs()` - Cálculo e cache de KPIs
- `useNotifications()` - Gerenciamento de notificações
- `usePagination()` - Paginação de listas

**Contexto SRM**: Reutilização de lógica entre múltiplas telas (ex: `useVendors` em VendorList e VendorDetail).

---

### `/src/context`

**Responsabilidade**: Estado global com Context API.

**Padrão**: Providers e consumers para estado compartilhado.

**Exemplo**:
- `AuthContext.tsx` - Autenticação e perfil global
- `VendorsContext.tsx` - Cache de fornecedores
- `RFQsContext.tsx` - Cache de RFQs
- `NotificationsContext.tsx` - Notificações globais
- `ThemeContext.tsx` - Tema (light/dark)

**Contexto SRM**: Evita prop drilling em árvores profundas (ex: passar `currentUser` por 5 níveis de componentes).

---

### `/src/utils`

**Responsabilidade**: Funções utilitárias e helpers.

**Padrão**: Funções puras e sem efeitos colaterais.

**Exemplo**:
- `formatters.ts` - Formatação de data, moeda, CNPJ
- `validators.ts` - Validação de email, CNPJ, etc.
- `calculations.ts` - Cálculos de KPI, média, percentual
- `storage.ts` - AsyncStorage helpers
- `logger.ts` - Logging estruturado

**Contexto SRM**: Centraliza regras corporativas (ex: validação de CNPJ, cálculo de score de fornecedor).

---

### `/src/types`

**Responsabilidade**: Definições de tipos TypeScript.

**Padrão**: Interfaces e tipos para todas as entidades.

**Exemplo**:
```typescript
// types/vendor.ts
export interface Vendor {
  id: string;
  legalName: string;
  cnpj: string;
  status: 'active' | 'pending' | 'rejected';
  complianceDocuments: string[];
  createdAt: Date;
}

// types/rfq.ts
export interface RFQ {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'analyzing' | 'closed';
  dueDate: Date;
  createdBy: string;
}

// types/proposal.ts
export interface Proposal {
  id: string;
  rfqId: string;
  vendorId: string;
  price: number;
  deliveryDays: number;
  confidential: boolean;
  status: 'submitted' | 'accepted' | 'rejected';
}

// types/user.ts
export interface InternalUser {
  id: string;
  email: string;
  role: 'buyer' | 'vendor' | 'auditor';
  permissions: string[];
}

// types/kpi.ts
export interface KPI {
  vendorId: string;
  quality: number;      // 0-100
  punctuality: number;  // 0-100
  compliance: number;   // 0-100
  period: string;       // YYYY-MM
}
```

**Contexto SRM**: Garante tipagem forte e documentação automática de entidades corporativas.

---

### `/src/constants`

**Responsabilidade**: Constantes da aplicação.

**Padrão**: Valores imutáveis e configurações.

**Exemplo**:
- `endpoints.ts` - URLs de API e Firebase
- `roles.ts` - Definição de perfis (Comprador, Fornecedor, Auditor)
- `status.ts` - Status válidos (Ativo, Pendente, Rejeitado)
- `permissions.ts` - Matriz de permissões por perfil
- `theme.ts` - Paleta de cores corporativa

**Contexto SRM**: Centraliza configurações corporativas (ex: URLs de compliance, regras de aprovação).

---

### `/src/navigation`

**Responsabilidade**: Configuração de navegação e rotas.

**Padrão**: React Navigation com stacks e tabs.

**Exemplo**:
- `RootNavigator.tsx` - Navigator raiz (Auth vs. App)
- `AuthNavigator.tsx` - Stack de autenticação
- `AppNavigator.tsx` - Tab navigator com stacks internos
- `LinkingConfiguration.ts` - Deep linking

**Contexto SRM**: Organiza fluxos corporativos (ex: Sourcing, Procurement, Compliance como tabs separadas).

---

## Padrões de Desenvolvimento

### 1. Fluxo de Dados

```
UI (Screen) → Hook (useVendors) → Context (VendorsContext) → Service (vendorService) → Firebase
```

### 2. Separação de Responsabilidades

| Camada | Responsabilidade | Exemplo |
|--------|------------------|---------|
| **Screen** | Renderização e interação do usuário | `VendorListScreen.tsx` |
| **Hook** | Lógica de estado e efeitos | `useVendors()` |
| **Context** | Estado global compartilhado | `VendorsContext.tsx` |
| **Service** | Lógica de negócio e integração | `vendorService.ts` |
| **Type** | Tipagem TypeScript | `vendor.ts` |

### 3. Exemplo Completo: Listar Fornecedores

**1. Type** (`src/types/vendor.ts`):
```typescript
export interface Vendor {
  id: string;
  legalName: string;
  cnpj: string;
  status: 'active' | 'pending' | 'rejected';
}
```

**2. Service** (`src/services/vendorService.ts`):
```typescript
export const vendorService = {
  async listVendors(): Promise<Vendor[]> {
    const snapshot = await db.collection('vendors').get();
    return snapshot.docs.map(doc => doc.data() as Vendor);
  }
};
```

**3. Hook** (`src/hooks/useVendors.ts`):
```typescript
export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorService.listVendors().then(setVendors).finally(() => setLoading(false));
  }, []);

  return { vendors, loading };
}
```

**4. Screen** (`src/screens/vendors/VendorListScreen.tsx`):
```typescript
export function VendorListScreen() {
  const { vendors, loading } = useVendors();

  return (
    <ScreenContainer>
      {loading ? <LoadingSpinner /> : (
        <FlatList
          data={vendors}
          renderItem={({ item }) => <VendorCard vendor={item} />}
        />
      )}
    </ScreenContainer>
  );
}
```

---

## Escalabilidade Corporativa

Esta arquitetura suporta:

- **Multi-tenant**: Adicionar `organizationId` em tipos e queries
- **Auditoria**: Adicionar `createdBy`, `updatedAt`, `auditLog` em entidades
- **Permissões**: Usar `useAuth()` para verificar `role` e `permissions`
- **Notificações**: Usar `NotificationsContext` para alertas globais
- **Offline-first**: Adicionar sincronização com `AsyncStorage` + Firestore
- **Internacionalização**: Adicionar `i18n` em `constants` e `utils`

---

## Próximos Passos

1. Implementar tipos corporativos em `/src/types`
2. Criar serviços Firebase em `/src/services`
3. Implementar hooks em `/src/hooks`
4. Criar componentes base em `/src/components`
5. Desenvolver telas em `/src/screens`
