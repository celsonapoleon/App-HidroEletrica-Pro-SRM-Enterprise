# HidroElétrica Pro - Sistema de Gerenciamento de Relacionamento com Fornecedores (SRM)

## 📋 Visão Geral

**HidroElétrica Pro** é um aplicativo mobile corporativo desenvolvido em **React Native (Expo)** para gerenciamento de relacionamento com fornecedores (Supplier Relationship Management - SRM). O sistema foi arquitetado para empresas de grande porte que precisam de controle rigoroso sobre procurement, compliance e desempenho de fornecedores.

### Características Principais

- **Gerenciamento de Fornecedores**: Master data com status de homologação e compliance
- **Requisições de Cotação (RFQs)**: Abertura e gerenciamento de RFQs com critérios de avaliação
- **Propostas Comerciais**: Submissão e análise de propostas com controle de confidencialidade
- **Scorecards de Desempenho**: Avaliação de KPIs (Qualidade, Pontualidade, Conformidade)
- **Controle de Acesso**: Perfis diferenciados (Comprador, Fornecedor, Auditor)
- **Auditoria Completa**: Logs de todas as ações críticas para compliance

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React Native 0.81 + Expo 54 |
| **Linguagem** | TypeScript 5.9 |
| **Styling** | NativeWind (Tailwind CSS) |
| **Navegação** | Expo Router 6 |
| **Estado** | Context API + React Query |
| **Backend** | Firebase (Firestore + Auth) |
| **Banco de Dados** | Firestore NoSQL |
| **Armazenamento** | Firebase Storage |
| **API** | tRPC + Express (opcional) |

### Padrão de Arquitetura

```
UI (Screens) → Hooks (useVendors, useRFQs) → Context (Global State) → Services (Firebase) → Firestore
```

---

## 📁 Estrutura de Pastas

### `/src` - Código-fonte principal

```
src/
├── services/          # Integração com Firebase e APIs
│   ├── firebaseConfig.ts
│   ├── vendorService.ts
│   ├── rfqService.ts
│   ├── proposalService.ts
│   ├── kpiService.ts
│   └── authService.ts
│
├── components/        # Componentes reutilizáveis
│   ├── ui/            # Componentes base (Button, Card, Badge)
│   ├── layouts/       # Layouts corporativos
│   └── forms/         # Formulários
│
├── screens/           # Telas principais
│   ├── auth/          # Autenticação
│   ├── home/          # Dashboard
│   ├── vendors/       # Gerenciamento de fornecedores
│   ├── rfqs/          # Requisições de cotação
│   ├── proposals/     # Propostas comerciais
│   ├── kpis/          # Scorecards
│   ├── users/         # Usuários internos
│   └── settings/      # Configurações
│
├── hooks/             # Custom React hooks
│   ├── useAuth.ts
│   ├── useVendors.ts
│   ├── useRFQs.ts
│   └── useProposals.ts
│
├── context/           # Context API
│   ├── AuthContext.tsx
│   ├── VendorsContext.tsx
│   └── NotificationsContext.tsx
│
├── types/             # Tipos TypeScript
│   └── index.ts       # Todas as interfaces corporativas
│
├── constants/         # Constantes
│   ├── endpoints.ts
│   ├── roles.ts
│   └── permissions.ts
│
├── utils/             # Funções utilitárias
│   ├── formatters.ts
│   ├── validators.ts
│   └── calculations.ts
│
└── navigation/        # Configuração de rotas
    ├── RootNavigator.tsx
    ├── AuthNavigator.tsx
    └── AppNavigator.tsx
```

### `/app` - Expo Router (File-based routing)

```
app/
├── _layout.tsx        # Layout raiz com providers
├── (tabs)/
│   ├── _layout.tsx    # Configuração de abas
│   └── index.tsx      # Home screen
└── oauth/             # OAuth callbacks
```

---

## 🗄️ Schema Firestore

### Coleções Principais

| Coleção | Propósito | Documentos |
|---------|-----------|-----------|
| `vendors` | Master data de fornecedores | Dados cadastrais, compliance, status |
| `procurement_rfqs` | Requisições de cotação | RFQs abertas, prazos, critérios |
| `vendor_proposals` | Propostas comerciais | Preços, prazos, confidencialidade |
| `performance_kpis` | Scorecards de desempenho | Qualidade, pontualidade, conformidade |
| `internal_users` | Usuários internos | Perfis, permissões, departamentos |
| `notifications` | Histórico de notificações | Alertas do sistema |
| `audit_logs` | Logs de auditoria | Rastreamento de ações críticas |

Veja `FIRESTORE_SCHEMA.md` para detalhes completos.

---

## 🔐 Segurança & Permissões

### Perfis de Usuário

| Perfil | Permissões | Acesso |
|--------|-----------|--------|
| **Comprador** | Criar RFQs, avaliar propostas, gerenciar fornecedores | Todas as RFQs, propostas, KPIs |
| **Fornecedor** | Submeter propostas, visualizar RFQs | Apenas RFQs convidados, suas propostas |
| **Auditor** | Criar KPIs, gerar relatórios, auditar compliance | Todos os dados, relatórios |
| **Admin** | Gerenciar usuários, configurações, backups | Acesso total |

### Firestore Security Rules

Todas as regras estão configuradas em `FIRESTORE_SCHEMA.md` para garantir:
- Isolamento de dados por perfil
- Proteção de propostas confidenciais
- Auditoria de todas as ações

---

## 🚀 Quick Start

### 1. Instalação

```bash
cd /home/ubuntu/hidroeletrica-pro
pnpm install
```

### 2. Configurar Firebase

Siga o guia em `FIREBASE_SETUP.md`:
- Criar projeto Firebase
- Obter credenciais
- Ativar Firestore, Auth, Storage

### 3. Iniciar Desenvolvimento

```bash
pnpm dev
```

Acesse:
- **Web**: http://localhost:8081
- **iOS/Android**: Escanear QR code

### 4. Explorar Estrutura

- `ARCHITECTURE.md` - Detalhes de arquitetura
- `FIRESTORE_SCHEMA.md` - Schema do banco de dados
- `FIREBASE_SETUP.md` - Configuração Firebase
- `INSTALLATION.md` - Guia de instalação

---

## 📱 Fluxos Corporativos Principais

### Fluxo 1: Comprador cria RFQ

1. Home → "Nova RFQ"
2. Preenche: Título, Descrição, Quantidade, Prazos
3. Seleciona fornecedores convidados
4. Define critérios de avaliação
5. Publica RFQ
6. Fornecedores recebem notificação

### Fluxo 2: Fornecedor submete Proposta

1. Home → "Propostas Pendentes"
2. Seleciona RFQ
3. Preenche: Preço, Prazo, Condições
4. Marca como Confidencial (se necessário)
5. Submete proposta
6. Comprador recebe notificação

### Fluxo 3: Comprador avalia Propostas

1. Home → "Propostas em Análise"
2. Visualiza comparativo de preços
3. Filtra por critério (Preço, Prazo, Conformidade)
4. Aceita/Rejeita proposta
5. Fornecedor recebe notificação

### Fluxo 4: Auditor monitora Compliance

1. Home → "Scorecards"
2. Visualiza KPIs de fornecedores
3. Identifica desvios
4. Gera relatório de auditoria
5. Exporta dados (PDF/CSV)

---

## 🎨 Design & UX

### Princípios de Design

- **Apple HIG Compliance**: Parecer um app de primeira parte iOS
- **Thumb-Friendly**: Otimizado para uso com uma mão
- **Dark Mode**: Suporte automático a tema escuro
- **Acessibilidade**: WCAG AA (4.5:1 contraste)

### Paleta de Cores

| Elemento | Cor | Uso |
|----------|-----|-----|
| Primary | `#0A5BA8` (Azul) | Botões, destaques |
| Success | `#10B981` (Verde) | Status aprovado |
| Warning | `#F59E0B` (Laranja) | Alertas |
| Error | `#EF4444` (Vermelho) | Erros |

Veja `design.md` para detalhes completos.

---

## 🧪 Testes & Qualidade

### Executar Testes

```bash
pnpm test
```

### Verificar Tipos

```bash
pnpm check
```

### Lint & Formato

```bash
pnpm lint
pnpm format
```

---

## 📚 Documentação Completa

| Arquivo | Conteúdo |
|---------|----------|
| `ARCHITECTURE.md` | Arquitetura de pastas e padrões |
| `FIRESTORE_SCHEMA.md` | Schema Firestore com exemplos |
| `FIREBASE_SETUP.md` | Guia passo-a-passo Firebase |
| `INSTALLATION.md` | Instalação e dependências |
| `design.md` | Design de interface e UX |
| `todo.md` | Rastreamento de features |

---

## 🔄 Fluxo de Desenvolvimento

### Fase 1: Boilerplate ✅
- ✅ Estrutura de pastas
- ✅ Tipos TypeScript
- ✅ Configuração Firebase
- ✅ Documentação

### Fase 2: Autenticação (Próxima)
- [ ] Tela de Login
- [ ] Autenticação Firebase
- [ ] Seleção de Perfil
- [ ] Biometria

### Fase 3: Dashboard
- [ ] Home com KPIs
- [ ] Notificações
- [ ] Filtros

### Fase 4: Vendor Management
- [ ] Lista de fornecedores
- [ ] Detalhes do fornecedor
- [ ] Adicionar/Editar fornecedor

### Fase 5: RFQs & Proposals
- [ ] Criar RFQ
- [ ] Listar RFQs
- [ ] Submeter proposta
- [ ] Comparativo de preços

### Fase 6: KPIs & Auditoria
- [ ] Gráficos de desempenho
- [ ] Scorecards
- [ ] Relatórios

---

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Faça commits: `git commit -am 'Adiciona feature'`
3. Push: `git push origin feature/sua-feature`
4. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a documentação em `ARCHITECTURE.md`
2. Verifique `FIREBASE_SETUP.md` para configuração
3. Leia `INSTALLATION.md` para troubleshooting
4. Abra uma issue no repositório

---

## 📄 Licença

© 2026 HidroElétrica Pro. Todos os direitos reservados.

---

## 🎯 Próximas Etapas

1. ✅ Revisar arquitetura em `ARCHITECTURE.md`
2. ✅ Configurar Firebase em `FIREBASE_SETUP.md`
3. ⏳ Implementar autenticação
4. ⏳ Criar componentes base
5. ⏳ Desenvolver telas principais
6. ⏳ Testar fluxos corporativos
7. ⏳ Deploy em produção

---

**Desenvolvido com ❤️ usando React Native, Expo e Firebase**
