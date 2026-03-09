# Portal do Key Account Manager (KAM) - HidroElétrica Pro

## 📋 Visão Geral

Portal completo para fornecedores (Key Account Managers) com acesso exclusivo para usuários com `role == 'vendor'`. Permite visualizar oportunidades (RFQs), enviar propostas comerciais e gerenciar documentos de compliance.

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
Firestore (Real-time)
    ↓
useOpportunities / useComplianceDocuments (Hooks)
    ↓
VendorOpportunitiesScreen (Dashboard)
    ↓
├─ OpportunityCard (Oportunidades)
├─ BidSubmissionScreen (Envio de Proposta)
└─ ComplianceRepositoryScreen (Documentos)
```

### Componentes Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/hooks/useOpportunities.ts` | Sincronização real-time de RFQs abertas |
| `src/hooks/useComplianceDocuments.ts` | Sincronização real-time de documentos |
| `src/screens/vendor/VendorOpportunitiesScreen.tsx` | Dashboard de oportunidades |
| `src/screens/vendor/BidSubmissionScreen.tsx` | Formulário de proposta |
| `src/screens/vendor/ComplianceRepositoryScreen.tsx` | Repositório de compliance |
| `src/components/vendor/OpportunityCard.tsx` | Card de oportunidade |
| `src/components/vendor/DocumentCard.tsx` | Card de documento |
| `src/services/proposalService.ts` | Operações de proposta |
| `src/services/storageService.ts` | Upload de documentos |
| `src/services/complianceService.ts` | Gerenciamento de compliance |

---

## 🎯 Funcionalidades

### 1. Dashboard de Oportunidades

**Listagem de RFQs Abertas**:
- Sincronização real-time com Firestore
- Exibição de título, categoria, orçamento, deadline
- Indicador de urgência (prazo menor que 3 dias)
- Badge de "Proposta Enviada" se já existe proposta

**Filtro por Categoria**:
- Botão "Todas" para listar todas as oportunidades
- Filtros por: Hidráulica, Elétrica, Equipamentos, Serviços
- Atualização dinâmica da lista

**Contador de Dias**:
- Cálculo automático de dias até deadline
- Alerta visual para prazos urgentes (vermelho)

### 2. Formulário de Proposta Comercial

**Campos Obrigatórios**:
- Preço Unitário (R$) - com validação numérica
- Quantidade - com validação numérica
- Prazo de Entrega (dias) - com validação numérica
- Validade da Proposta (DD/MM/YYYY) - com validação de formato

**Campos Opcionais**:
- Observações Logísticas/Técnicas (texto longo)

**Cálculo Automático**:
- Valor Total = Preço Unitário × Quantidade
- Exibição em card destacado (Emerald-900)

**Validação**:
- Todos os campos obrigatórios preenchidos
- Valores numéricos válidos e positivos
- Mensagens de erro claras

**Salvamento**:
- Cria documento em `vendor_proposals` com:
  - `rfqId`: ID da RFQ
  - `vendorId`: UID do usuário logado
  - `vendorName`: Nome do fornecedor
  - `totalValue`: Valor calculado
  - `leadTime`: Prazo em dias
  - `validityDate`: Data de validade
  - `status: 'submitted'`
  - `createdAt`: Timestamp ISO

### 3. Repositório de Compliance

**Tipos de Documentos**:
- **CNPJ**: Inscrição estadual/federal
- **Certidão Negativa**: Comprovante de regularidade fiscal
- **Certificação Técnica**: Certificados de qualidade, ISO, etc.

**Upload de Documentos**:
- Suporte a PDF e Imagens
- Seleção via `expo-document-picker`
- Barra de progresso (0-100%)
- Upload para Firebase Storage (`compliance/{vendorId}/{type}/{timestamp}_{filename}`)

**Gerenciamento de Documentos**:
- Lista sincronizada em tempo real
- Status de análise: Pendente, Aprovado, Rejeitado
- Data de upload
- Ações: Baixar, Deletar

**Fluxo de Compliance**:
1. Fornecedor envia documento
2. Status = `pending` (Em Análise)
3. Sourcing revisa e aprova/rejeita
4. Status atualizado em tempo real

---

## 🔄 Sincronização Real-time

### useOpportunities Hook

```typescript
const { opportunities, loading, error, categories } = useOpportunities(categoryFilter);

// Sincroniza RFQs com status 'open'
// Filtro opcional por categoria
// Atualiza em tempo real quando RFQs mudam
```

### useComplianceDocuments Hook

```typescript
const { documents, loading, error } = useComplianceDocuments(vendorId);

// Sincroniza documentos do fornecedor
// Ordena por data de upload (mais recentes primeiro)
// Atualiza em tempo real quando documentos mudam
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
| Primário | `#3B82F6` (Blue-500) | Botões, categorias |
| Sucesso | `#10B981` (Emerald-500) | Valor total, aprovado |
| Aviso | `#F59E0B` (Amber-500) | Prazo urgente |
| Erro | `#EF4444` (Red-500) | Rejeitado, erros |

### Status Badges (Documentos)

| Status | Cor | Significado |
|--------|-----|------------|
| Pendente | Amarelo (#FEF3C7) | Aguardando análise |
| Aprovado | Verde (#DCFCE7) | Documento válido |
| Rejeitado | Vermelho (#FEE2E2) | Reenviar documento |

---

## 📱 Como Usar

### 1. Acessar Dashboard de Oportunidades

```typescript
// VendorNavigator renderiza VendorOpportunitiesScreen
// Automaticamente sincroniza com Firestore
// Exibe todas as RFQs com status 'open'
```

### 2. Filtrar por Categoria

```typescript
// Clique em um dos botões de categoria
// Lista atualiza automaticamente
// Clique em "Todas" para remover filtro
```

### 3. Enviar Proposta

```typescript
// Clique em "Elaborar Proposta" em uma oportunidade
// Preencha o formulário
// Clique em "Enviar Proposta"
// Confirmação de sucesso
```

### 4. Gerenciar Documentos

```typescript
// Acesse aba "Documentação"
// Clique em um tipo de documento para fazer upload
// Selecione arquivo (PDF ou Imagem)
// Aguarde conclusão do upload
// Documento aparece na lista com status "Em Análise"
```

---

## 🧪 Testando

### Teste 1: Listar Oportunidades

1. Abra app como usuário com `role === 'vendor'`
2. Deve mostrar dashboard com RFQs abertas
3. Cada card deve exibir: título, categoria, orçamento, deadline

### Teste 2: Filtrar por Categoria

1. Clique em uma categoria (ex: "Elétrica")
2. Lista deve mostrar apenas RFQs dessa categoria
3. Clique em "Todas" para remover filtro

### Teste 3: Enviar Proposta

1. Clique em "Elaborar Proposta"
2. Preencha: preço unitário, quantidade, prazo, validade
3. Valor total deve calcular automaticamente
4. Clique em "Enviar Proposta"
5. Alert de sucesso deve aparecer
6. Formulário deve fechar

### Teste 4: Upload de Documento

1. Clique em "Documentação"
2. Selecione um tipo (ex: "CNPJ")
3. Escolha um arquivo PDF ou imagem
4. Barra de progresso deve aparecer
5. Documento deve aparecer na lista com status "Em Análise"

### Teste 5: Deletar Documento

1. Na lista de documentos, clique em "Deletar"
2. Confirme na dialog
3. Documento deve desaparecer da lista

---

## 🔧 Estrutura Firestore

### Coleção: `vendor_proposals`

```json
{
  "id": "proposal_001",
  "rfqId": "rfq_001",
  "vendorId": "uid_fornecedor",
  "vendorName": "Fornecedor A",
  "totalValue": 45000,
  "unitPrice": 1500,
  "leadTime": 15,
  "validityDate": "2026-04-09",
  "observations": "Observações técnicas...",
  "status": "submitted",
  "createdAt": "2026-03-09T11:00:00Z",
  "updatedAt": "2026-03-09T11:00:00Z"
}
```

### Coleção: `compliance_documents`

```json
{
  "id": "doc_001",
  "vendorId": "uid_fornecedor",
  "type": "cnpj",
  "name": "CNPJ_Empresa.pdf",
  "url": "https://storage.googleapis.com/...",
  "expiresAt": null,
  "status": "pending",
  "uploadedAt": "2026-03-09T10:00:00Z",
  "updatedAt": "2026-03-09T10:00:00Z"
}
```

### Firebase Storage

```
compliance/
  └── {vendorId}/
      ├── cnpj/
      │   └── 1709960400000_CNPJ.pdf
      ├── certidao/
      │   └── 1709960500000_Certidao.pdf
      └── certification/
          └── 1709960600000_ISO.pdf
```

---

## 🚀 Próximas Etapas

1. **Implementar Notificações**:
   - Notificar fornecedor quando proposta é aprovada/rejeitada
   - Notificar quando documento é aprovado/rejeitado

2. **Adicionar Histórico**:
   - Tela de propostas enviadas com status
   - Histórico de documentos aprovados/rejeitados

3. **Melhorar UX**:
   - Animações de transição
   - Swipe para ações rápidas
   - Busca por título de oportunidade

4. **Integrar Pagamentos**:
   - Permitir fornecedor ver propostas vencidas
   - Histórico de adjudicações

---

## 📚 Referências

- [Firestore Real-time Updates](https://firebase.google.com/docs/firestore/query-data/listen)
- [Firebase Storage Upload](https://firebase.google.com/docs/storage/web/upload-files)
- [Expo Document Picker](https://docs.expo.dev/versions/latest/sdk/document-picker/)
- [React Navigation](https://reactnavigation.org)

---

## ✅ Checklist de Implementação

- [x] Hooks para sincronização real-time (useOpportunities, useComplianceDocuments)
- [x] Dashboard de oportunidades com filtro por categoria
- [x] Cards de oportunidade com indicadores
- [x] Formulário de proposta com validação
- [x] Cálculo automático de valor total
- [x] Tela de repositório de compliance
- [x] Upload de documentos com progresso
- [x] Componentes de UI (OpportunityCard, DocumentCard)
- [x] Serviços (proposalService, storageService, complianceService)
- [x] Sincronização real-time
- [ ] Implementar notificações
- [ ] Adicionar histórico de propostas
- [ ] Implementar busca por título
- [ ] Testes unitários

---

**Desenvolvido com ❤️ para HidroElétrica Pro SRM**
