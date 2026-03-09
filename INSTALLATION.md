# HidroElétrica Pro - Guia de Instalação

## Dependências Instaladas

O projeto foi inicializado com as seguintes dependências principais:

### Framework & Runtime
- **React Native 0.81.5** - Framework para desenvolvimento mobile
- **Expo SDK 54** - Plataforma para desenvolvimento React Native
- **React 19.1.0** - Biblioteca UI
- **TypeScript 5.9.3** - Tipagem estática para JavaScript

### Navegação & UI
- **Expo Router 6** - Roteamento baseado em arquivo
- **React Navigation 7** - Navegação entre telas
- **NativeWind 4** - Tailwind CSS para React Native
- **Expo Symbols** - Ícones SF Symbols (iOS) / Material Icons (Android)

### Styling & Temas
- **Tailwind CSS 3.4** - Utilitários CSS
- **Clsx 2.1** - Utilitário para classes condicionais
- **Tailwind Merge 2.6** - Merge de classes Tailwind

### Estado & Dados
- **TanStack React Query 5** - Gerenciamento de estado assíncrono
- **Axios 1.13** - Cliente HTTP
- **AsyncStorage 2.2** - Armazenamento local persistente
- **Drizzle ORM 0.44** - ORM para banco de dados

### Backend & API
- **tRPC 11.7** - RPC type-safe
- **Express 4.22** - Framework web (servidor)
- **MySQL2 3.16** - Driver MySQL
- **Zod 4.2** - Validação de schemas

### Autenticação & Segurança
- **Firebase 12.10** - Backend as a Service (BaaS)
- **Jose 6.1** - JWT (JSON Web Tokens)
- **Expo Secure Store 15** - Armazenamento seguro

### Multimídia & Sensores
- **Expo Audio 1.1** - Reprodução e gravação de áudio
- **Expo Video 3** - Reprodução de vídeo
- **Expo Image 3** - Carregamento e cache de imagens
- **Expo Haptics 15** - Feedback háptico (vibração)
- **Expo Keep Awake 15** - Manter tela ligada

### Notificações
- **Expo Notifications 0.32** - Notificações push locais e remotas

### Animações & Gestos
- **React Native Reanimated 4.1** - Animações de alto desempenho
- **React Native Gesture Handler 2.28** - Gestos customizados
- **React Native Worklets 0.5** - Execução de código em threads separadas

### Desenvolvimento
- **Vitest 2.1** - Framework de testes
- **ESLint 9.39** - Linter
- **Prettier 3.7** - Formatador de código
- **tsx 4.21** - Executor TypeScript
- **Concurrently 9.2** - Executar múltiplos comandos

---

## Instalação Rápida

### 1. Clonar/Abrir o Projeto

```bash
cd /home/ubuntu/hidroeletrica-pro
```

### 2. Instalar Dependências (Já Feito)

```bash
pnpm install
```

> ✅ Todas as dependências já foram instaladas durante a inicialização

### 3. Configurar Firebase

Siga o guia em `FIREBASE_SETUP.md` para:
- Criar projeto Firebase
- Obter credenciais
- Configurar variáveis de ambiente
- Ativar serviços (Firestore, Auth, Storage)

### 4. Iniciar Servidor de Desenvolvimento

```bash
pnpm dev
```

Isso iniciará:
- **Metro Bundler** (http://localhost:8081) - Bundler React Native
- **Express Server** (http://localhost:3000) - API backend

### 5. Acessar o App

- **Web**: http://localhost:8081
- **iOS**: Escanear QR code com câmera (Expo Go)
- **Android**: Escanear QR code com Expo Go

---

## Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia Metro + Server
pnpm dev:metro       # Apenas Metro Bundler
pnpm dev:server      # Apenas Express Server

# Build & Deploy
pnpm build           # Build para produção
pnpm start           # Inicia servidor em produção

# Testes & Qualidade
pnpm test            # Executar testes (Vitest)
pnpm check           # Verificar tipos TypeScript
pnpm lint            # Executar ESLint
pnpm format          # Formatar código com Prettier

# Plataformas Específicas
pnpm android         # Abrir no Android Emulator
pnpm ios             # Abrir no iOS Simulator
pnpm qr              # Gerar QR code

# Banco de Dados
pnpm db:push         # Sincronizar schema com banco de dados
```

---

## Estrutura de Pastas

```
src/
├── services/          # Lógica de negócio (Firebase, APIs)
├── components/        # Componentes reutilizáveis
├── screens/           # Telas principais
├── hooks/             # Custom React hooks
├── context/           # Context API para estado global
├── utils/             # Funções utilitárias
├── types/             # Tipos TypeScript
├── constants/         # Constantes da aplicação
└── navigation/        # Configuração de rotas

app/
├── _layout.tsx        # Layout raiz com providers
├── (tabs)/
│   ├── _layout.tsx    # Configuração de abas
│   └── index.tsx      # Home screen

components/
├── screen-container.tsx  # SafeArea wrapper
├── ui/                   # Componentes base
└── haptic-tab.tsx        # Tab com feedback háptico

lib/
├── utils.ts           # Utilitários (cn, etc.)
├── theme-provider.tsx # Provider de tema
└── trpc.ts            # Cliente tRPC

assets/
├── images/            # Ícones, logos, splash
└── fonts/             # Fontes customizadas

server/
├── _core/             # Lógica do servidor
├── routes/            # Endpoints da API
└── middleware/        # Middlewares Express
```

---

## Configuração Inicial

### 1. Atualizar Nome do App

Edite `app.config.ts`:

```typescript
const env = {
  appName: "HidroElétrica Pro",
  appSlug: "hidroeletrica-pro",
  logoUrl: "",  // Será preenchido após gerar logo
  // ...
};
```

### 2. Customizar Tema

Edite `theme.config.js`:

```javascript
const themeColors = {
  primary: { light: '#0A5BA8', dark: '#0A5BA8' },      // Azul corporativo
  background: { light: '#ffffff', dark: '#0F1419' },
  surface: { light: '#F5F7FA', dark: '#1E2329' },
  foreground: { light: '#1A1D23', dark: '#ECEDEE' },
  // ... mais cores
};
```

### 3. Gerar Logo do App

Use o comando `generate` para criar um ícone corporativo:

```bash
# Será pedido para gerar um logo
# Salve em: assets/images/icon.png
```

### 4. Configurar Firebase

Siga `FIREBASE_SETUP.md` para integrar Firebase.

---

## Verificação de Saúde

### Verificar Tipos TypeScript

```bash
pnpm check
```

Deve retornar: `Found 0 errors`

### Verificar Linting

```bash
pnpm lint
```

Deve retornar: `No errors`

### Verificar Dependências

```bash
pnpm install --dry-run
```

Deve retornar: `up to date`

---

## Próximas Etapas

1. ✅ Instalar dependências
2. ✅ Configurar Firebase
3. ⏳ Criar tipos corporativos (`src/types/`)
4. ⏳ Implementar serviços (`src/services/`)
5. ⏳ Criar componentes base (`src/components/`)
6. ⏳ Desenvolver telas (`src/screens/`)
7. ⏳ Configurar navegação (`src/navigation/`)
8. ⏳ Testar fluxos end-to-end

---

## Troubleshooting

### Erro: "Metro Bundler failed to start"

```bash
# Limpar cache
rm -rf .expo
rm -rf node_modules/.cache

# Reinstalar
pnpm install
pnpm dev
```

### Erro: "Firebase not initialized"

- Verifique `FIREBASE_SETUP.md`
- Confirme variáveis de ambiente
- Reinicie o servidor: `pnpm dev`

### Erro: "Port 8081 already in use"

```bash
# Usar porta diferente
EXPO_PORT=8082 pnpm dev

# Ou matar processo na porta 8081
lsof -ti:8081 | xargs kill -9
```

### Erro: "Too many open files"

```bash
# Aumentar limite de file watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Recursos Adicionais

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev)
- [React Navigation Documentation](https://reactnavigation.org)

---

## Suporte

Para problemas ou dúvidas:

1. Verifique a documentação em `ARCHITECTURE.md`
2. Consulte `FIRESTORE_SCHEMA.md` para estrutura de dados
3. Leia `FIREBASE_SETUP.md` para configuração Firebase
4. Abra uma issue no repositório
