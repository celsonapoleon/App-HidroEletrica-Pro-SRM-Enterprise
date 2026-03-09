# HidroElétrica Pro - Schema Firestore (NoSQL)

## Visão Geral

O Firestore é um banco de dados NoSQL em tempo real do Firebase, ideal para aplicações móveis. Abaixo está a estrutura completa de coleções e documentos para o SRM corporativo.

---

## 1. Coleção: `vendors` (Master Data de Fornecedores)

**Propósito**: Armazenar dados cadastrais, status de homologação e documentos de compliance de fornecedores.

**Estrutura**:
```
vendors/
├── {vendorId}/
│   ├── legalName: string              # Razão social
│   ├── tradeName: string              # Nome fantasia
│   ├── cnpj: string                   # CNPJ (único)
│   ├── status: string                 # 'active' | 'pending' | 'rejected' | 'suspended'
│   ├── category: string               # Categoria (ex: 'Equipamentos', 'Serviços')
│   ├── contact: {
│   │   ├── email: string
│   │   ├── phone: string
│   │   ├── address: string
│   │   ├── city: string
│   │   ├── state: string
│   │   └── zipCode: string
│   ├── compliance: {
│   │   ├── certifications: string[]   # URLs de certificados (ISO 9001, etc.)
│   │   ├── insurancePolicy: string    # URL da apólice de seguro
│   │   ├── taxCompliance: boolean     # Regularidade fiscal
│   │   ├── laborCompliance: boolean   # Regularidade trabalhista
│   │   └── lastAuditDate: timestamp
│   ├── bankAccount: {
│   │   ├── bank: string
│   │   ├── agency: string
│   │   ├── account: string
│   │   └── accountType: string        # 'checking' | 'savings'
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   ├── createdBy: string              # userId do comprador que criou
│   └── tags: string[]                 # Tags para busca (ex: 'premium', 'local')
```

**Índices Recomendados**:
- `status` (para filtrar por status)
- `category` (para filtrar por categoria)
- `createdAt` (para ordenar por data)

**Exemplo de Documento**:
```json
{
  "legalName": "Turbinas Hidráulicas Ltda.",
  "tradeName": "TurboHidro",
  "cnpj": "12.345.678/0001-99",
  "status": "active",
  "category": "Equipamentos",
  "contact": {
    "email": "contato@turbohidro.com.br",
    "phone": "+55 11 98765-4321",
    "address": "Rua Industrial, 100",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "compliance": {
    "certifications": ["https://s3.../iso-9001.pdf"],
    "insurancePolicy": "https://s3.../apólice.pdf",
    "taxCompliance": true,
    "laborCompliance": true,
    "lastAuditDate": "2026-01-15T10:00:00Z"
  },
  "bankAccount": {
    "bank": "Banco do Brasil",
    "agency": "1234",
    "account": "567890",
    "accountType": "checking"
  },
  "createdAt": "2025-06-01T08:00:00Z",
  "updatedAt": "2026-03-09T13:00:00Z",
  "createdBy": "user_buyer_001",
  "tags": ["premium", "local", "certified"]
}
```

---

## 2. Coleção: `procurement_rfqs` (Requisições de Cotação)

**Propósito**: Armazenar requisições de cotação abertas pela equipe de Sourcing.

**Estrutura**:
```
procurement_rfqs/
├── {rfqId}/
│   ├── title: string                  # Título da RFQ
│   ├── description: string            # Descrição detalhada
│   ├── category: string               # Categoria de produto/serviço
│   ├── quantity: number               # Quantidade solicitada
│   ├── unit: string                   # Unidade (kg, unidade, hora, etc.)
│   ├── status: string                 # 'open' | 'analyzing' | 'closed'
│   ├── createdBy: string              # userId do comprador
│   ├── createdAt: timestamp
│   ├── dueDate: timestamp             # Data limite para submissão
│   ├── closedAt: timestamp            # Data de fechamento (se aplicável)
│   ├── invitedVendors: string[]       # Array de vendorIds convidados
│   ├── evaluationCriteria: {
│   │   ├── price: number              # Peso do preço (0-100)
│   │   ├── deliveryTime: number       # Peso do prazo (0-100)
│   │   ├── quality: number            # Peso da qualidade (0-100)
│   │   └── compliance: number         # Peso da conformidade (0-100)
│   ├── attachments: string[]          # URLs de arquivos anexados
│   ├── notes: string                  # Notas internas
│   └── tags: string[]                 # Tags para busca
```

**Índices Recomendados**:
- `status` (para filtrar por status)
- `createdBy` (para filtrar por comprador)
- `dueDate` (para ordenar por prazo)

**Exemplo de Documento**:
```json
{
  "title": "Cotação de Turbinas Hidráulicas - Projeto Itaipu",
  "description": "Solicitação de cotação para 5 unidades de turbinas Francis 100MW",
  "category": "Equipamentos",
  "quantity": 5,
  "unit": "unidade",
  "status": "open",
  "createdBy": "user_buyer_001",
  "createdAt": "2026-03-01T09:00:00Z",
  "dueDate": "2026-03-15T17:00:00Z",
  "closedAt": null,
  "invitedVendors": ["vendor_001", "vendor_002", "vendor_003"],
  "evaluationCriteria": {
    "price": 40,
    "deliveryTime": 30,
    "quality": 20,
    "compliance": 10
  },
  "attachments": ["https://s3.../especificacoes.pdf"],
  "notes": "Projeto crítico. Prioridade alta.",
  "tags": ["turbinas", "itaipu", "urgente"]
}
```

---

## 3. Coleção: `vendor_proposals` (Propostas Comerciais)

**Propósito**: Armazenar propostas comerciais enviadas pelos fornecedores em resposta a RFQs.

**Estrutura**:
```
vendor_proposals/
├── {proposalId}/
│   ├── rfqId: string                  # Referência à RFQ
│   ├── vendorId: string               # Referência ao fornecedor
│   ├── status: string                 # 'submitted' | 'accepted' | 'rejected' | 'withdrawn'
│   ├── price: number                  # Preço unitário (em reais)
│   ├── totalPrice: number             # Preço total (quantidade × preço)
│   ├── currency: string               # 'BRL' | 'USD' | 'EUR'
│   ├── deliveryDays: number           # Prazo de entrega em dias
│   ├── paymentTerms: string           # Condições de pagamento (ex: '30 dias')
│   ├── warranty: {
│   │   ├── months: number             # Meses de garantia
│   │   └── description: string        # Descrição da garantia
│   ├── confidential: boolean          # Marca como confidencial
│   ├── submittedAt: timestamp
│   ├── acceptedAt: timestamp          # Data de aceitação (se aplicável)
│   ├── rejectedAt: timestamp          # Data de rejeição (se aplicável)
│   ├── rejectionReason: string        # Motivo da rejeição
│   ├── attachments: string[]          # URLs de documentos (catálogos, etc.)
│   ├── notes: string                  # Notas da proposta
│   └── score: {
│   │   ├── price: number              # Score de preço (0-100)
│   │   ├── deliveryTime: number       # Score de prazo (0-100)
│   │   ├── quality: number            # Score de qualidade (0-100)
│   │   ├── compliance: number         # Score de conformidade (0-100)
│   │   └── total: number              # Score total ponderado
```

**Índices Recomendados**:
- `rfqId` (para listar propostas de uma RFQ)
- `vendorId` (para listar propostas de um fornecedor)
- `status` (para filtrar por status)
- `submittedAt` (para ordenar por data)

**Exemplo de Documento**:
```json
{
  "rfqId": "rfq_001",
  "vendorId": "vendor_001",
  "status": "submitted",
  "price": 2500000,
  "totalPrice": 12500000,
  "currency": "BRL",
  "deliveryDays": 180,
  "paymentTerms": "50% à assinatura, 50% na entrega",
  "warranty": {
    "months": 24,
    "description": "Garantia contra defeitos de fabricação"
  },
  "confidential": true,
  "submittedAt": "2026-03-10T14:30:00Z",
  "acceptedAt": null,
  "rejectedAt": null,
  "rejectionReason": null,
  "attachments": ["https://s3.../catalogo.pdf", "https://s3.../certificacoes.pdf"],
  "notes": "Proposta competitiva com tecnologia de ponta",
  "score": {
    "price": 85,
    "deliveryTime": 75,
    "quality": 90,
    "compliance": 95,
    "total": 86.25
  }
}
```

---

## 4. Coleção: `performance_kpis` (Scorecards de Desempenho)

**Propósito**: Armazenar avaliações de qualidade, pontualidade e conformidade técnica dos fornecedores.

**Estrutura**:
```
performance_kpis/
├── {kpiId}/
│   ├── vendorId: string               # Referência ao fornecedor
│   ├── period: string                 # Período (YYYY-MM)
│   ├── quality: {
│   │   ├── score: number              # Score de qualidade (0-100)
│   │   ├── defectRate: number         # Taxa de defeitos (%)
│   │   ├── reworkRate: number         # Taxa de retrabalho (%)
│   │   └── notes: string
│   ├── punctuality: {
│   │   ├── score: number              # Score de pontualidade (0-100)
│   │   ├── onTimeDeliveryRate: number # Taxa de entrega no prazo (%)
│   │   ├── avgDelayDays: number       # Atraso médio em dias
│   │   └── notes: string
│   ├── compliance: {
│   │   ├── score: number              # Score de conformidade (0-100)
│   │   ├── documentationCompliance: boolean
│   │   ├── regulatoryCompliance: boolean
│   │   ├── auditFindings: string[]    # Achados de auditoria
│   │   └── notes: string
│   ├── overallScore: number           # Score geral ponderado (0-100)
│   ├── trend: string                  # 'improving' | 'stable' | 'declining'
│   ├── evaluatedBy: string            # userId do auditor
│   ├── evaluatedAt: timestamp
│   ├── recommendations: string        # Recomendações para melhoria
│   └── attachments: string[]          # URLs de relatórios
```

**Índices Recomendados**:
- `vendorId` (para listar KPIs de um fornecedor)
- `period` (para filtrar por período)
- `overallScore` (para ranking de fornecedores)

**Exemplo de Documento**:
```json
{
  "vendorId": "vendor_001",
  "period": "2026-02",
  "quality": {
    "score": 92,
    "defectRate": 0.5,
    "reworkRate": 0.2,
    "notes": "Desempenho excelente com apenas 1 defeito em 200 unidades"
  },
  "punctuality": {
    "score": 88,
    "onTimeDeliveryRate": 95,
    "avgDelayDays": 1.2,
    "notes": "1 atraso de 3 dias devido a questões logísticas"
  },
  "compliance": {
    "score": 95,
    "documentationCompliance": true,
    "regulatoryCompliance": true,
    "auditFindings": [],
    "notes": "Todas as documentações em dia"
  },
  "overallScore": 91.67,
  "trend": "stable",
  "evaluatedBy": "user_auditor_001",
  "evaluatedAt": "2026-03-05T10:00:00Z",
  "recommendations": "Manter padrão de qualidade. Investigar causa do atraso de 3 dias.",
  "attachments": ["https://s3.../relatorio_fevereiro.pdf"]
}
```

---

## 5. Coleção: `internal_users` (Usuários Internos)

**Propósito**: Armazenar perfis de acesso de usuários internos com controle de permissões.

**Estrutura**:
```
internal_users/
├── {userId}/
│   ├── email: string                  # Email corporativo (único)
│   ├── fullName: string               # Nome completo
│   ├── role: string                   # 'buyer' | 'vendor' | 'auditor' | 'admin'
│   ├── department: string             # Departamento (ex: 'Sourcing', 'Compliance')
│   ├── permissions: string[]          # Array de permissões (ex: 'create_rfq', 'approve_proposal')
│   ├── status: string                 # 'active' | 'inactive' | 'suspended'
│   ├── phone: string
│   ├── avatar: string                 # URL da foto de perfil
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   ├── lastLogin: timestamp
│   ├── biometricEnabled: boolean      # Autenticação biométrica habilitada
│   ├── notificationPreferences: {
│   │   ├── emailNotifications: boolean
│   │   ├── pushNotifications: boolean
│   │   └── smsNotifications: boolean
│   └── metadata: {
│   │   ├── language: string           # 'pt-BR' | 'en-US'
│   │   ├── timezone: string           # 'America/Sao_Paulo'
│   │   └── theme: string              # 'light' | 'dark'
```

**Índices Recomendados**:
- `email` (para buscar por email)
- `role` (para filtrar por perfil)
- `status` (para filtrar por status)

**Exemplo de Documento**:
```json
{
  "email": "joao.silva@hidroeletrica.com.br",
  "fullName": "João Silva",
  "role": "buyer",
  "department": "Sourcing",
  "permissions": ["create_rfq", "view_proposals", "approve_proposal", "manage_vendors"],
  "status": "active",
  "phone": "+55 11 98765-4321",
  "avatar": "https://s3.../avatars/joao.jpg",
  "createdAt": "2025-01-01T08:00:00Z",
  "updatedAt": "2026-03-09T13:00:00Z",
  "lastLogin": "2026-03-09T09:30:00Z",
  "biometricEnabled": true,
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

## 6. Coleção: `notifications` (Notificações)

**Propósito**: Armazenar histórico de notificações do sistema.

**Estrutura**:
```
notifications/
├── {notificationId}/
│   ├── userId: string                 # Destinatário
│   ├── type: string                   # 'rfq_created' | 'proposal_submitted' | 'proposal_accepted' | 'kpi_updated'
│   ├── title: string
│   ├── message: string
│   ├── relatedId: string              # ID da entidade relacionada (rfqId, proposalId, etc.)
│   ├── read: boolean
│   ├── createdAt: timestamp
│   ├── readAt: timestamp
│   └── actionUrl: string              # Deep link para a ação
```

---

## 7. Coleção: `audit_logs` (Logs de Auditoria)

**Propósito**: Rastrear todas as ações críticas no sistema para compliance.

**Estrutura**:
```
audit_logs/
├── {logId}/
│   ├── userId: string                 # Usuário que realizou a ação
│   ├── action: string                 # 'create' | 'update' | 'delete' | 'approve' | 'reject'
│   ├── entity: string                 # 'vendor' | 'rfq' | 'proposal' | 'kpi'
│   ├── entityId: string               # ID da entidade
│   ├── changes: {                     # Mudanças realizadas
│   │   ├── before: object
│   │   └── after: object
│   ├── timestamp: timestamp
│   ├── ipAddress: string
│   └── userAgent: string
```

---

## Relacionamentos Entre Coleções

```
vendors (1) ──→ (N) vendor_proposals
  ↓
  └──→ (N) performance_kpis

procurement_rfqs (1) ──→ (N) vendor_proposals
  ↓
  └──→ (N) notifications

internal_users (1) ──→ (N) procurement_rfqs (criadas por)
  ↓
  └──→ (N) audit_logs (realizadas por)
```

---

## Estratégia de Segurança (Firestore Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Vendors: Compradores e auditores podem ler, apenas admins podem escrever
    match /vendors/{vendorId} {
      allow read: if request.auth.token.role in ['buyer', 'auditor', 'admin'];
      allow write: if request.auth.token.role == 'admin';
    }
    
    // RFQs: Compradores podem criar e editar suas próprias, outros podem ler
    match /procurement_rfqs/{rfqId} {
      allow read: if request.auth.token.role in ['buyer', 'auditor', 'admin'];
      allow create: if request.auth.token.role == 'buyer';
      allow update: if resource.data.createdBy == request.auth.uid && request.auth.token.role == 'buyer';
    }
    
    // Proposals: Fornecedores podem submeter, compradores podem ler e avaliar
    match /vendor_proposals/{proposalId} {
      allow read: if request.auth.token.role in ['buyer', 'auditor', 'admin'] || 
                     request.auth.uid == get(/databases/$(database)/documents/vendors/$(resource.data.vendorId)).data.userId;
      allow create: if request.auth.token.role == 'vendor';
      allow update: if request.auth.token.role in ['buyer', 'admin'];
    }
    
    // KPIs: Auditores podem criar, todos podem ler
    match /performance_kpis/{kpiId} {
      allow read: if request.auth.token.role in ['buyer', 'auditor', 'admin'];
      allow write: if request.auth.token.role in ['auditor', 'admin'];
    }
    
    // Internal Users: Apenas admins podem gerenciar
    match /internal_users/{userId} {
      allow read: if request.auth.uid == userId || request.auth.token.role == 'admin';
      allow write: if request.auth.token.role == 'admin';
    }
  }
}
```

---

## Índices Compostos Recomendados

| Coleção | Campos | Tipo |
|---------|--------|------|
| `vendors` | `status`, `createdAt` | Descending |
| `procurement_rfqs` | `status`, `dueDate` | Ascending |
| `vendor_proposals` | `rfqId`, `status` | Ascending |
| `performance_kpis` | `vendorId`, `period` | Descending |
| `audit_logs` | `userId`, `timestamp` | Descending |

---

## Próximas Etapas

1. Criar coleções no Firebase Console
2. Implementar serviços de acesso em `/src/services`
3. Configurar Firestore Rules para segurança
4. Criar índices compostos conforme necessário
