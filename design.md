# HidroElétrica Pro - Design de Interface Móvel

## Orientação e Contexto

- **Orientação**: Portrait (9:16)
- **Uso**: Uma mão (thumb-friendly)
- **Padrão**: Apple Human Interface Guidelines (HIG)
- **Objetivo**: Parecer um app de primeira parte iOS

---

## Paleta de Cores

| Elemento | Cor | Hex | Uso |
|----------|-----|-----|-----|
| Primary | Azul Corporativo | `#0A5BA8` | Botões, destaques, ações |
| Background | Branco | `#FFFFFF` | Fundo principal (light) |
| Background Dark | Cinza Escuro | `#0F1419` | Fundo (dark mode) |
| Surface | Cinza Claro | `#F5F7FA` | Cards, superfícies elevadas |
| Surface Dark | Cinza Médio | `#1E2329` | Cards (dark mode) |
| Foreground | Preto | `#1A1D23` | Texto principal |
| Foreground Dark | Branco | `#ECEDEE` | Texto (dark mode) |
| Muted | Cinza Médio | `#6B7280` | Texto secundário |
| Muted Dark | Cinza Claro | `#9BA1A6` | Texto secundário (dark mode) |
| Success | Verde | `#10B981` | Status aprovado, sucesso |
| Warning | Laranja | `#F59E0B` | Alertas, atenção |
| Error | Vermelho | `#EF4444` | Erros, rejeições |
| Border | Cinza Muito Claro | `#E5E7EB` | Divisores, bordas |
| Border Dark | Cinza Escuro | `#334155` | Divisores (dark mode) |

---

## Lista de Telas

### 1. **Splash Screen**
- Logo HidroElétrica Pro centralizado
- Animação de carregamento
- Transição automática para Login/Home

### 2. **Login / Autenticação**
- Email/Senha ou OAuth (Firebase)
- Seleção de Perfil (Comprador vs. Fornecedor vs. Auditor)
- Recuperação de senha
- Biometria (Face ID / Fingerprint)

### 3. **Home - Dashboard Principal**
- Resumo de KPIs (Fornecedores Ativos, RFQs Abertas, Propostas Pendentes)
- Cards de ações rápidas (Nova RFQ, Ver Propostas, Scorecards)
- Lista de notificações/alertas recentes
- Filtro por status (Ativo, Pendente, Rejeitado)

### 4. **Vendor Management (Gerenciamento de Fornecedores)**
- Lista de fornecedores com status de homologação
- Busca e filtro por categoria
- Card com dados cadastrais (CNPJ, Razão Social, Status Compliance)
- Detalhes do fornecedor (documentos, histórico, KPIs)
- Ação: Adicionar novo fornecedor

### 5. **Procurement RFQs (Requisições de Cotação)**
- Lista de RFQs abertas/fechadas
- Status visual (Aberta, Em Análise, Fechada)
- Filtro por data, categoria, fornecedor
- Detalhes da RFQ (descrição, prazos, critérios)
- Ação: Criar nova RFQ

### 6. **Vendor Proposals (Propostas Comerciais)**
- Lista de propostas por RFQ
- Comparativo de preços (tabela)
- Status de confidencialidade
- Detalhes: Preço, Prazo, Condições de Pagamento
- Ação: Aceitar/Rejeitar proposta

### 7. **Performance KPIs (Scorecards)**
- Gráficos de desempenho por fornecedor
- Métricas: Qualidade, Pontualidade, Conformidade
- Histórico de avaliações
- Benchmarking vs. média do mercado

### 8. **Internal Users (Gerenciamento de Usuários)**
- Lista de usuários internos
- Perfis: Comprador, Fornecedor, Auditor
- Permissões por perfil
- Ação: Adicionar/Editar usuário

### 9. **Settings / Configurações**
- Perfil do usuário
- Preferências de notificação
- Tema (Light/Dark)
- Logout

---

## Fluxos de Usuário Principais

### Fluxo 1: Comprador cria RFQ
1. Home → Botão "Nova RFQ"
2. Preenche: Título, Descrição, Categoria, Prazos
3. Seleciona fornecedores convidados
4. Define critérios de avaliação
5. Publica RFQ
6. Notificação enviada aos fornecedores

### Fluxo 2: Fornecedor submete Proposta
1. Home → "Propostas Pendentes"
2. Seleciona RFQ disponível
3. Preenche: Preço, Prazo, Condições de Pagamento
4. Marca como Confidencial (se aplicável)
5. Submete proposta
6. Notificação ao Comprador

### Fluxo 3: Comprador avalia Propostas
1. Home → "Propostas em Análise"
2. Visualiza comparativo de preços
3. Filtra por critério (Preço, Prazo, Conformidade)
4. Aceita/Rejeita proposta
5. Notificação enviada ao fornecedor

### Fluxo 4: Auditor monitora Compliance
1. Home → "Scorecards"
2. Visualiza KPIs de todos os fornecedores
3. Identifica desvios de conformidade
4. Gera relatório de auditoria
5. Exporta dados (PDF/CSV)

---

## Componentes Core

| Componente | Descrição | Uso |
|-----------|-----------|-----|
| **TopBar** | Header com título, ícone de menu, notificações | Todas as telas |
| **BottomTab** | Navegação: Home, Vendors, RFQs, Proposals, Settings | Navegação principal |
| **Card** | Container com sombra, borda, padding | Listas, dados |
| **Button** | Primário (azul), Secundário (outline), Perigo (vermelho) | Ações |
| **Badge** | Status visual (Ativo, Pendente, Rejeitado) | Indicadores |
| **Modal** | Diálogo para confirmações, formulários | Ações críticas |
| **SearchBar** | Busca com filtros | Listas |
| **Chart** | Gráficos de desempenho (linha, barra) | KPIs |

---

## Padrões de Interação

- **Swipe**: Deslizar para esquerda = Ações (Editar, Deletar)
- **Tap**: Toque simples = Navegar para detalhes
- **Long Press**: Pressão longa = Menu de contexto
- **Pull-to-Refresh**: Puxar para baixo = Atualizar lista
- **Haptic Feedback**: Vibração ao confirmar ação crítica

---

## Acessibilidade

- Tamanho mínimo de fonte: 14pt
- Contraste de cor: WCAG AA (4.5:1 para texto)
- Botões mínimos: 44×44pt (Apple HIG)
- VoiceOver support: Labels descritivos em todos os elementos
- Dark mode: Suporte automático via tema

---

## Prototipagem

Telas iniciais para MVP (Mínimo Viável):
1. ✅ Splash Screen
2. ✅ Login
3. ✅ Home Dashboard
4. ✅ Vendor List
5. ✅ RFQ List
6. ✅ Proposals Comparison
7. ✅ Settings

Telas secundárias (Phase 2):
- Detalhes de Fornecedor
- Criação de RFQ (formulário completo)
- Submissão de Proposta
- Scorecards com gráficos
- Gerenciamento de Usuários
