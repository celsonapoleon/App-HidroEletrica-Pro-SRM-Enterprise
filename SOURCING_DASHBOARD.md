# Módulo de Dashboard de Sourcing - HidroElétrica Pro

## 📋 Visão Geral

Módulo completo de gestão de suprimentos para usuários com perfil `role == 'sourcing'`. Implementa dashboard em tempo real, abertura de RFQs e análise comparativa de propostas com sincronização Firestore.

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
Firestore (Real-time)
    ↓
useRFQs / useProposals / useKPIs (Hooks)
    ↓
SourcingHomeScreen (Dashboard)
    ↓
├─ KPICard (Métricas)
├─ RFQListItem (Lista de RFQs)
└─ NewRFQModal (Criar RFQ)
    ↓
ProposalAnalysisScreen (Análise de Propostas)
```

### Componentes Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/hooks/useRFQs.ts` | Sincronização real-time de RFQs |
| `src/hooks/useProposals.ts` | Sincronização real-time de propostas |
| `src/hooks/useKPIs.ts` | Cálculo de KPIs em tempo real |
| `src/screens/sourcing/SourcingHomeScreen.tsx` | Dashboard principal |
| `src/screens/sourcing/ProposalAnalysisScreen.tsx` | Análise de propostas |
| `src/components/sourcing/KPICard.tsx` | Card de métrica |
| `src/components/sourcing/RFQListItem.tsx` | Item de RFQ em lista |
| `src/components/sourcing/ProposalCard.tsx` | Card de proposta |
| `src/components/sourcing/NewRFQModal.tsx` | Modal para criar RFQ |
| `src/services/rfqService.ts` | Operações de RFQ no Firestore |
| `src/navigation/SourcingHomeStackNavigator.tsx` | Navegação de sourcing |

---

## 🎯 Funcionalidades

### 1. Dashboard Principal

**KPIs em Tempo Real**:
- **RFQs Ativas**: Contagem de documentos com `status === 'open'`
- **Saving Médio**: Cálculo de economia em % (baseado em propostas)
- **Compliance Rate**: % de fornecedores homologados

**Lista de RFQs Recentes**:
- Título e categoria
- Status com badge colorido (Em Cotação, Análise Técnica, Finalizada)
- Data limite com contador de dias restantes
- Contador de propostas recebidas

**Botão de Ação**:
- "Abrir Nova Requisição" → Abre modal de criação

### 2. Abertura de RFQ

**Formulário com Validação**:
- Título da Demanda (obrigatório)
- Categoria (Hidráulica, Elétrica, Equipamentos, Serviços)
- Data Limite para Propostas (obrigatório)
- Orçamento Estimado (opcional)
- Especificações Técnicas (obrigatório, texto longo)

**Salvamento**:
- Cria documento em `procurement_rfqs` com:
  - `status: 'open'`
  - `createdBy: user.uid`
  - `createdAt: ISO timestamp`
  - `proposalCount: 0`

### 3. Análise de Propostas

**Seleção de RFQ**:
- Clique em RFQ na lista → Abre tela de análise

**Visualização de Propostas**:
- Lista de propostas ordenadas por valor (menor primeiro)
- Destaque automático da "Melhor Proposta" (menor valor + maior compliance)

**Detalhes de Proposta**:
- Nome do fornecedor
- Valor total (em R$)
- Prazo de entrega (em dias)
- Score de compliance (0-100%)
- Especificações técnicas

**Ação de Adjudicação**:
- Selecionar proposta
- Clique em "Adjudicar Proposta"
- Confirmação com alert
- Atualiza status da proposta e fecha RFQ

---

## 🔄 Sincronização Real-time

### useRFQs Hook

```typescript
const { rfqs, loading, error, activeRFQCount } = useRFQs();

// Sincroniza automaticamente com Firestore
// Atualiza em tempo real quando RFQs mudam
```

**Filtros Disponíveis**:
```typescript
useRFQs({ status: 'open' }) // Apenas RFQs abertas
useRFQs({ status: 'analysis' }) // Apenas em análise
useRFQs({ status: 'closed' }) // Apenas fechadas
```

### useProposals Hook

```typescript
const { proposals, loading, bestProposal } = useProposals(rfqId);

// Sincroniza propostas de uma RFQ específica
// Ordena automaticamente por valor
// Calcula melhor proposta
```

### useKPIs Hook

```typescript
const { kpis } = useKPIs();

// Retorna:
// - kpis.activeRFQs: Número de RFQs abertas
// - kpis.averageSaving: % de economia média
// - kpis.complianceRate: % de compliance
// - kpis.totalVendors: Total de fornecedores
// - kpis.totalProposals: Total de propostas
```

---

## 🎨 Design & Cores

### Paleta

| Elemento | Cor | Uso |
|----------|-----|-----|
| Fundo Principal | `#0F172A` (Slate-900) | Background geral |
| Cards/Surface | `#1E293B` (Slate-800) | Superfícies |
| Texto Principal | `#FFFFFF` | Títulos e textos principais |
| Texto Secundário | `#94A3B8` (Slate-400) | Subtítulos e labels |
| Primário | `#3B82F6` (Blue-500) | Botões, RFQs ativas |
| Sucesso | `#10B981` (Emerald-500) | Saving, compliance |
| Aviso | `#F59E0B` (Amber-500) | Análise técnica |
| Erro | `#EF4444` (Red-500) | Finalizada, erros |

### Status Badges

| Status | Cor | Ícone |
|--------|-----|-------|
| Em Cotação | Azul (#DBEAFE) | `schedule` |
| Análise Técnica | Laranja (#FED7AA) | `assessment` |
| Finalizada | Verde (#DCFCE7) | `check-circle` |

---

## 📱 Como Usar

### 1. Acessar Dashboard

```typescript
// SourcingNavigator renderiza SourcingHomeScreen
// Automaticamente sincroniza com Firestore
```

### 2. Criar Nova RFQ

```typescript
// Clique em "Abrir Nova Requisição"
// Preencha formulário
// Clique em "Criar RFQ"
// Modal fecha e lista atualiza automaticamente
```

### 3. Analisar Propostas

```typescript
// Clique em uma RFQ na lista
// Abre ProposalAnalysisScreen
// Selecione uma proposta
// Clique em "Adjudicar Proposta"
// Confirme na dialog
```

---

## 🧪 Testando

### Teste 1: Dashboard Carrega

1. Abra app como usuário com `role === 'sourcing'`
2. Deve mostrar dashboard com KPIs
3. KPIs devem estar sincronizados em tempo real

### Teste 2: Criar RFQ

1. Clique em "Abrir Nova Requisição"
2. Preencha formulário
3. Clique em "Criar RFQ"
4. Modal fecha
5. RFQ aparece na lista em tempo real

### Teste 3: Analisar Propostas

1. Clique em uma RFQ
2. Deve mostrar lista de propostas
3. Melhor proposta deve estar destacada
4. Selecione uma proposta
5. Detalhes devem aparecer

### Teste 4: Adjudicar Proposta

1. Selecione uma proposta
2. Clique em "Adjudicar Proposta"
3. Confirme na dialog
4. Deve retornar ao dashboard
5. RFQ deve estar fechada

---

## 🔧 Estrutura Firestore

### Coleção: `procurement_rfqs`

```json
{
  "id": "rfq_001",
  "title": "Tubulações de Cobre de Alta Pressão",
  "category": "hydraulic",
  "status": "open",
  "budget": 50000,
  "deadline": "2026-04-09",
  "specifications": "Especificações técnicas...",
  "createdBy": "uid_usuario",
  "createdAt": "2026-03-09T10:00:00Z",
  "updatedAt": "2026-03-09T10:00:00Z",
  "proposalCount": 3
}
```

### Coleção: `vendor_proposals`

```json
{
  "id": "proposal_001",
  "rfqId": "rfq_001",
  "vendorId": "vendor_001",
  "vendorName": "Fornecedor A",
  "totalValue": 45000,
  "leadTime": 15,
  "complianceScore": 95,
  "specifications": "Especificações da proposta...",
  "status": "submitted",
  "createdAt": "2026-03-09T11:00:00Z",
  "updatedAt": "2026-03-09T11:00:00Z"
}
```

---

## 🚀 Próximas Etapas

1. **Implementar Adjudicação**:
   - Atualizar status de proposta para `approved`
   - Fechar RFQ (status = `closed`)
   - Notificar fornecedor vencedor

2. **Adicionar Filtros**:
   - Filtrar RFQs por status
   - Filtrar RFQs por categoria
   - Busca por título

3. **Implementar Relatórios**:
   - Exportar RFQs para PDF
   - Comparativo de propostas em PDF
   - Histórico de adjudicações

4. **Melhorar UX**:
   - Animações de transição
   - Swipe para ações rápidas
   - Notificações push quando propostas chegam

---

## 📚 Referências

- [Firestore Real-time Updates](https://firebase.google.com/docs/firestore/query-data/listen)
- [React Navigation](https://reactnavigation.org)
- [NativeWind Documentation](https://www.nativewind.dev)

---

## ✅ Checklist de Implementação

- [x] Hooks para sincronização real-time (useRFQs, useProposals, useKPIs)
- [x] Dashboard com KPIs
- [x] Lista de RFQs com badges de status
- [x] Modal para criar RFQ
- [x] Validação de formulário
- [x] Tela de análise de propostas
- [x] Destaque de melhor proposta
- [x] Componentes de UI (KPICard, RFQListItem, ProposalCard)
- [x] Serviço de RFQ (rfqService)
- [x] Navegação integrada
- [ ] Implementar adjudicação
- [ ] Adicionar filtros
- [ ] Implementar relatórios
- [ ] Testes unitários

---

**Desenvolvido com ❤️ para HidroElétrica Pro SRM**
