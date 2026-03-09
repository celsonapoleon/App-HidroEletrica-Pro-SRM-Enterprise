# Torre de Controle de Auditoria - HidroElétrica Pro

## 📋 Visão Geral

Torre de Controle de Auditoria é um módulo executivo para análise de performance pós-venda, avaliação de fornecedores e governance da cadeia de suprimentos. Acessível apenas para perfis de nível gerencial ou auditoria.

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
Firestore (Real-time)
    ↓
useAuditMetrics / useCategoryPerformance / useVendorPerformance
    ↓
├─ AuditDashboardScreen (Dashboard Global)
├─ ScorecardFormScreen (Avaliação)
└─ VendorPerformanceScreen (Detalhe Individual)
```

### Componentes Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/hooks/useAuditMetrics.ts` | Agregação de KPIs globais |
| `src/hooks/useCategoryPerformance.ts` | Performance por categoria |
| `src/hooks/useVendorPerformance.ts` | Dados individuais do fornecedor |
| `src/screens/audit/AuditDashboardScreen.tsx` | Dashboard global com KPIs |
| `src/screens/audit/ScorecardFormScreen.tsx` | Formulário de avaliação |
| `src/screens/audit/VendorPerformanceScreen.tsx` | Detalhe de performance |
| `src/components/audit/MetricCard.tsx` | Card de KPI |
| `src/components/audit/BarChartComponent.tsx` | Gráfico de barras |
| `src/components/audit/RadarChart.tsx` | Gráfico de radar |
| `src/services/scorecardService.ts` | Operações de scorecard |

---

## 🎯 Funcionalidades

### 1. Dashboard de Auditoria Global

**KPIs Consolidados**:
- **IDF Global**: Índice de Desempenho do Fornecedor (média ponderada de todas as avaliações)
- **Saving Total Acumulado**: Diferença financeira entre orçamentos iniciais e valores adjudicados
- **Saving Percentage**: Percentual de economia realizado
- **Compliance Risks**: Lista de fornecedores com documentos vencidos ou IDF < 6.0
- **Estatísticas**: Total de fornecedores, RFQs ativas, propostas processadas

**Gráfico de Lead Time**:
- Comparação "Lead Time Prometido" vs "Lead Time Realizado" por categoria
- Dados por: Hidráulica, Elétrica, Equipamentos, Serviços
- Exibição de percentual de entregas no prazo

**Alertas de Compliance**:
- Destaque visual para fornecedores com risco
- Motivos: documentos vencidos ou baixa qualidade (IDF < 6.0)

### 2. Formulário de Scorecard de Performance

**Critérios de Avaliação (1-10)**:
- **Qualidade Técnica**: O material condiz com a especificação?
- **Pontualidade**: A entrega foi feita no prazo acordado?
- **Conformidade Documental**: Notas fiscais e certificados estavam corretos?

**Cálculo Automático de IDF**:
- Fórmula: (Qualidade × 0.4) + (Pontualidade × 0.35) + (Conformidade × 0.25)
- Resultado exibido em tempo real (preview)
- Atualização automática do documento do vendor no Firestore

**Observações Opcionais**:
- Campo para notas adicionais sobre o desempenho
- Armazenado no documento de scorecard

### 3. Tela de Performance Individual (Radar Chart)

**Gráfico de Radar (5 Dimensões)**:
- **Qualidade**: Baseada no IDF do fornecedor
- **Preço**: Score de competitividade (simulado)
- **Prazo**: Inverso do lead time (quanto menor, melhor)
- **Suporte**: Derivado do IDF
- **Conformidade**: Derivado do IDF

**Histórico de Propostas**:
- Últimas 5 propostas adjudicadas
- Exibição de: valor, prazo, data
- Ordenação por data (mais recentes primeiro)

**Resumo Executivo**:
- IDF individual
- Número de propostas adjudicadas
- Valor total adjudicado

---

## 🔄 Sincronização Real-time

### useAuditMetrics Hook

```typescript
const { metrics, loading, error, refetch } = useAuditMetrics();

// Retorna:
// - globalIDF: Média ponderada de IDFs
// - totalSaving: Economia total em R$
// - savingPercentage: Percentual de economia
// - complianceRisks: Array de fornecedores com risco
// - totalVendors, totalRFQs, totalProposals: Contadores
// - averageLeadTime: Prazo médio em dias
```

### useCategoryPerformance Hook

```typescript
const { data, loading, error } = useCategoryPerformance();

// Retorna array de:
// - category: Nome da categoria
// - promisedLeadTime: Prazo prometido (dias)
// - realizedLeadTime: Prazo realizado (dias)
// - variance: Diferença (positiva = atrasado)
// - proposalCount: Número de propostas
// - onTimePercentage: % de entregas no prazo
```

### useVendorPerformance Hook

```typescript
const { vendor, radarData, proposals, loading } = useVendorPerformance(vendorId);

// Retorna:
// - vendor: Dados completos do fornecedor
// - radarData: Scores para radar chart
// - proposals: Últimas 5 propostas adjudicadas
```

---

## 🎨 Design & Cores

### Paleta

| Elemento | Cor | Uso |
|----------|-----|-----|
| Fundo Principal | `#0F172A` (Slate-950) | Background geral |
| Cards/Surface | `#1E293B` (Slate-800) | Superfícies |
| Texto Principal | `#FFFFFF` | Títulos e textos |
| Texto Secundário | `#94A3B8` (Slate-400) | Subtítulos |
| Primário | `#3B82F6` (Blue-500) | IDF, qualidade |
| Sucesso | `#10B981` (Emerald-500) | Saving, compliance |
| Aviso | `#F59E0B` (Amber-500) | Prazo urgente |
| Erro | `#EF4444` (Red-500) | Riscos |

### Gráficos

| Dimensão | Cor |
|----------|-----|
| Qualidade | `#3B82F6` (Azul) |
| Preço | `#10B981` (Verde) |
| Prazo | `#F59E0B` (Âmbar) |
| Suporte | `#8B5CF6` (Roxo) |
| Conformidade | `#06B6D4` (Ciano) |

---

## 📱 Como Usar

### 1. Acessar Dashboard de Auditoria

```typescript
// Renderizado em AuditNavigator
// Automaticamente sincroniza com Firestore
// Exibe KPIs consolidados em tempo real
```

### 2. Emitir Scorecard

```typescript
// Clique em um fornecedor
// Preencha os 3 critérios (1-10)
// IDF é calculado automaticamente
// Clique em "Salvar Avaliação"
// Vendor é atualizado no Firestore
```

### 3. Visualizar Performance Individual

```typescript
// Clique em um fornecedor no dashboard
// Exibe radar chart com 5 dimensões
// Mostra histórico das últimas 5 propostas
// Resumo executivo com métricas
```

---

## 🧪 Testando

### Teste 1: Dashboard Global

1. Abra app como usuário com role `audit`
2. Deve exibir KPIs consolidados
3. Gráfico de Lead Time deve mostrar categorias
4. Alertas de compliance devem aparecer se houver riscos

### Teste 2: Emitir Scorecard

1. Clique em "Emitir Scorecard"
2. Selecione um fornecedor e RFQ
3. Preencha os 3 critérios (1-10)
4. IDF preview deve atualizar em tempo real
5. Clique em "Salvar Avaliação"
6. Sucesso e IDF atualizado

### Teste 3: Performance Individual

1. Clique em um fornecedor no dashboard
2. Radar chart deve exibir 5 dimensões
3. Histórico deve mostrar últimas 5 propostas
4. Resumo executivo deve estar correto

---

## 🔧 Estrutura Firestore

### Coleção: `performance_kpis` (Scorecards)

```json
{
  "id": "scorecard_001",
  "rfqId": "rfq_001",
  "vendorId": "uid_fornecedor",
  "qualityScore": 8,
  "punctualityScore": 9,
  "complianceScore": 7,
  "notes": "Observações...",
  "createdAt": "2026-03-09T11:00:00Z",
  "updatedAt": "2026-03-09T11:00:00Z"
}
```

### Coleção: `vendors` (Atualizado com IDF)

```json
{
  "id": "vendor_001",
  "legalName": "Fornecedor A",
  "idf": 8.1,
  "complianceDocuments": [
    {
      "id": "doc_001",
      "type": "cnpj",
      "url": "...",
      "uploadedAt": "2026-03-09T10:00:00Z",
      "expiresAt": "2027-03-09",
      "status": "approved"
    }
  ],
  "updatedAt": "2026-03-09T11:00:00Z"
}
```

---

## 🚀 Próximas Etapas

1. **Implementar Notificações**: Alertar quando fornecedor tem IDF baixo ou documentos vencidos
2. **Relatórios em PDF**: Exportar dashboard e performance individual como PDF
3. **Filtros Avançados**: Filtrar fornecedores por categoria, status, IDF range
4. **Histórico Completo**: Mostrar todas as avaliações (não apenas últimas 5 propostas)
5. **Benchmarking**: Comparar performance de fornecedores na mesma categoria

---

## 📚 Referências

- [Firestore Real-time Updates](https://firebase.google.com/docs/firestore/query-data/listen)
- [React Native Gifted Charts](https://www.npmjs.com/package/react-native-gifted-charts)
- [React Navigation](https://reactnavigation.org)

---

## ✅ Checklist de Implementação

- [x] Hooks para agregação de dados (useAuditMetrics, useCategoryPerformance, useVendorPerformance)
- [x] Dashboard global com KPIs consolidados
- [x] Gráfico de barras (Lead Time)
- [x] Alertas de compliance
- [x] Formulário de scorecard com cálculo automático de IDF
- [x] Atualização de vendor com novo IDF
- [x] Tela de performance individual
- [x] Radar chart com 5 dimensões
- [x] Histórico de propostas
- [x] Componentes de UI (MetricCard, BarChartComponent, RadarChart)
- [x] Serviço de scorecard
- [x] Sincronização real-time
- [ ] Notificações de risco
- [ ] Exportação em PDF
- [ ] Filtros avançados
- [ ] Benchmarking entre fornecedores

---

**Desenvolvido com ❤️ para HidroElétrica Pro SRM**
