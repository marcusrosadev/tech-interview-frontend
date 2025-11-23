# 🚀 Recomendador de Produtos RD Station

Sistema de recomendação de produtos baseado em preferências e funcionalidades do usuário.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Casos de Uso](#-casos-de-uso)
- [Arquitetura](#-arquitetura)
- [Decisões Técnicas](#-decisões-técnicas)
- [Performance e Complexidade](#-performance-e-complexidade)
- [Como Executar](#-como-executar)
- [Testes](#-testes)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Próximos Passos](#-próximos-passos-para-escalabilidade)
- [Tecnologias](#-tecnologias-utilizadas)

---

## 🎯 Visão Geral

Sistema que permite aos usuários selecionar preferências e funcionalidades desejadas, recebendo recomendações personalizadas de produtos RD Station.

### Funcionalidades

- **Layout Stepper Horizontal**: Navegação fluida entre etapas (Preferências → Funcionalidades → Tipo de Recomendação) com transições suaves
- Seleção de preferências e funcionalidades via formulário
- Recomendação de produto único (SingleProduct) ou múltiplos produtos (MultipleProducts)
- Algoritmo de pontuação baseado em matches de preferências e features
- Tratamento de empates retornando o último produto da lista original
- Validação de formulário com feedback visual e toast notifications
- **Botão "Limpar Seleções"**: Permite resetar todas as seleções do formulário rapidamente
- **Footer fixo**: Botões de ação sempre visíveis na parte inferior da tela
- Interface responsiva com Tailwind CSS
- Visualizações interativas com barras de progresso para matches de preferências e funcionalidades
- Cards de recomendações com animações de entrada e estados expandíveis

---

## 📖 Casos de Uso

### 1. Recomendação de Produto Único (SingleProduct)

**Cenário:** Usuário seleciona preferências e features, escolhe tipo "Produto Único"

**Fluxo:**
1. Usuário seleciona uma ou mais preferências
2. Usuário seleciona uma ou mais funcionalidades
3. Usuário seleciona tipo de recomendação "Produto Único"
4. Sistema calcula pontuação para cada produto (matches de preferences + features)
5. Sistema ordena produtos por pontuação (maior primeiro)
6. Sistema retorna apenas o produto com maior pontuação
7. Em caso de empate, retorna o último produto da lista original que tem pontuação máxima

**Resultado Esperado:**
- Array com um único produto
- Produto que melhor corresponde às seleções do usuário

**Exemplo:**
```javascript
// Input
{
  selectedPreferences: ['Integração com chatbots'],
  selectedFeatures: ['Chat ao vivo e mensagens automatizadas'],
  selectedRecommendationType: 'SingleProduct'
}

// Output
[{ id: 3, name: 'RD Conversas', category: 'Omnichannel', ... }]
```

### 2. Recomendação de Múltiplos Produtos (MultipleProducts)

**Cenário:** Usuário seleciona preferências e features, escolhe tipo "Múltiplos Produtos"

**Fluxo:**
1. Usuário seleciona uma ou mais preferências
2. Usuário seleciona uma ou mais funcionalidades
3. Usuário seleciona tipo de recomendação "Múltiplos Produtos"
4. Sistema calcula pontuação para cada produto
5. Sistema ordena produtos por pontuação (maior primeiro)
6. Sistema retorna todos os produtos que têm pelo menos um match, ordenados

**Resultado Esperado:**
- Array com múltiplos produtos
- Produtos ordenados por relevância (maior pontuação primeiro)

**Exemplo:**
```javascript
// Input
{
  selectedPreferences: ['Integração fácil com ferramentas de e-mail', 'Automação de marketing'],
  selectedFeatures: ['Rastreamento de interações com clientes'],
  selectedRecommendationType: 'MultipleProducts'
}

// Output
[
  { id: 1, name: 'RD Station CRM', ... },
  { id: 2, name: 'RD Station Marketing', ... }
]
```

### 3. Tratamento de Empates

**Cenário:** Múltiplos produtos têm a mesma pontuação máxima

**Fluxo:**
1. Sistema identifica produtos com pontuação máxima
2. Se há empate e tipo é SingleProduct, busca o último produto na lista original
3. Retorna o último produto da lista original que tem pontuação máxima

**Resultado Esperado:**
- Para SingleProduct: um único produto (último da lista original em caso de empate)
- Para MultipleProducts: todos os produtos ordenados (empates mantêm ordem original)

**Exemplo:**
```javascript
// Input - dois produtos com mesma pontuação
{
  selectedPreferences: ['Automação de marketing', 'Integração com chatbots'],
  selectedRecommendationType: 'SingleProduct'
}

// Output - retorna o último da lista original (RD Conversas)
[{ id: 3, name: 'RD Conversas', ... }]
```

### 4. Validação de Formulário

**Cenário:** Usuário tenta submeter formulário sem dados obrigatórios

**Fluxo:**
1. Usuário tenta submeter sem selecionar tipo de recomendação
2. Sistema exibe mensagem: "Por favor, selecione um tipo de recomendação."
3. Usuário tenta submeter sem selecionar preferências ou features
4. Sistema exibe mensagem: "Por favor, selecione pelo menos uma preferência ou funcionalidade."

**Resultado Esperado:**
- Formulário não é processado
- Mensagem de erro clara é exibida
- Usuário pode corrigir e tentar novamente

### 5. Sem Matches

**Cenário:** Nenhum produto corresponde às seleções do usuário

**Fluxo:**
1. Usuário seleciona preferências/features que não existem em nenhum produto
2. Sistema filtra produtos e não encontra matches
3. Sistema retorna array vazio

**Resultado Esperado:**
- Array vazio `[]`
- Lista de recomendações exibe mensagem: "Nenhuma recomendação encontrada"

### 6. Produtos sem Preferências ou Features Selecionadas

**Cenário:** Usuário não seleciona preferências nem features

**Fluxo:**
1. Usuário tenta submeter sem selecionar nada
2. Sistema valida e impede submissão
3. Exibe mensagem de validação

**Resultado Esperado:**
- Formulário não é processado
- Validação impede processamento com dados vazios

---

## 🏗️ Arquitetura

### Estrutura de Camadas

```
┌─────────────────────────────────────┐
│      PRESENTATION LAYER              │
│  Components (UI, Form, List)         │
└──────────────┬──────────────────────┘
               │ Props & Callbacks
┌──────────────▼──────────────────────┐
│      APPLICATION LAYER              │
│  Hooks (useForm, useProducts, etc)   │
└──────────────┬──────────────────────┘
               │ Function Calls
┌──────────────▼──────────────────────┐
│      DOMAIN LAYER                   │
│  Services (Business Logic)           │
└──────────────────────────────────────┘
```

### Princípios Aplicados

- **SOLID**: Single Responsibility, Dependency Inversion
- **Clean Code**: Funções pequenas, nomes descritivos, DRY, KISS
- **Clean Architecture**: Separação de camadas, dependências unidirecionais

---

## 🔧 Decisões Técnicas

### 1. Separação Services → Hooks → Components

Lógica de negócio isolada em services, hooks como camada de aplicação, components apenas para UI. Facilita testabilidade, reutilização e manutenibilidade.

### 2. Constantes Centralizadas

Arquivo `constants/recommendationTypes.js` para tipos de recomendação. Evita magic strings e centraliza valores.

### 3. Funções Pequenas e Focadas

Algoritmo de recomendação dividido em funções específicas:
- `calculateProductScore`: Calcula pontuação
- `filterMatchingProducts`: Filtra produtos com matches
- `sortProductsByScore`: Ordena por pontuação
- `selectBestProduct`: Seleciona melhor produto
- `selectMultipleProducts`: Seleciona múltiplos produtos

### 4. Keys Únicas em Listas

Uso de `key={uniqueKey}` ao invés de `key={index}` para melhor performance e evitar bugs de renderização.

### 5. Componente Radio Separado

Componente `Radio` dedicado para semântica HTML correta e melhor acessibilidade.

### 6. Validação em Múltiplas Camadas

Validação no Form (UX) e no Service (robustez) para defesa em profundidade.

### 7. Path Aliases com CRACO

Configuração de aliases de caminho (`@components`, `@hooks`, etc.) via CRACO para imports mais limpos e manutenibilidade.

### 8. Estilos Centralizados

Pasta `styles/` dedicada para organizar estilos globais (global.css, tailwind.css) com barrel export para facilitar imports.

### 9. Toast Notifications Customizado

Sistema de toast próprio usando React Context e Tailwind CSS, sem dependências externas, otimizado para performance.

### 10. Stepper Horizontal

Navegação por etapas com transições suaves usando Framer Motion, melhorando a experiência do usuário e reduzindo scroll vertical.

### 11. Footer Fixo

Botões de ação sempre visíveis na parte inferior da tela, garantindo acesso fácil sem necessidade de scroll.

---

## ⚡ Performance e Complexidade

### Análise de Complexidade do Algoritmo

O algoritmo de recomendação foi implementado com foco em performance:

**Complexidade Temporal:**
- `filterMatchingProducts`: O(n × m) onde n = produtos, m = preferências/features
- `calculateProductScore`: O(p + f) onde p = preferências do produto, f = features do produto
- `sortProductsByScore`: O(n log n) - ordenação padrão do JavaScript
- `selectBestProduct`: O(n) no pior caso (empate)
- **Complexidade Total: O(n log n)** - dominada pela ordenação

**Complexidade Espacial:**
- O(n) - cópia dos produtos para ordenação
- O(n) - produtos filtrados armazenados

**Otimizações Implementadas:**
- Filtragem antes da ordenação reduz quantidade de elementos ordenados
- Cálculo de pontuação feito uma vez por produto
- Uso de métodos nativos do JavaScript (filter, sort) otimizados

**Considerações:**
- Para listas pequenas/médias (< 1000 produtos): Performance excelente
- Para listas grandes: Considerar cache de resultados ou otimizações adicionais
- Algoritmo é determinístico e previsível

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18.3 ou superior
- Yarn 1.22.22 ou superior

### Instalação

1. **Instalar dependências:**
```bash
yarn install
```

2. **Executar script de instalação:**
```bash
./install.sh
```

3. **Iniciar aplicação:**
```bash
yarn start
```

> **Nota:** O comando `yarn start` inicia automaticamente o backend e o frontend simultaneamente.

### Acessando a Aplicação

Após executar `yarn start`, os serviços estarão disponíveis em:

- **Frontend (React):** http://localhost:3000
- **Backend API (json-server):** http://localhost:3001

> **Importante:** O terminal mostrará logs do backend (porta 3001), mas o frontend também estará rodando na porta 3000. Acesse http://localhost:3000 no navegador para ver a aplicação.

### Scripts Disponíveis

- `start:` Inicia backend e frontend automaticamente
- `start:frontend:` Inicia apenas o frontend (porta 3000)
- `start:backend:` Inicia apenas o backend (porta 3001)
- `dev:` Inicia frontend e backend simultaneamente (mesmo que `start`)

---

## 🧪 Testes

### Cobertura de Testes

O projeto inclui testes unitários que cobrem todos os casos de uso obrigatórios:

#### Casos Obrigatórios ✅

1. **Retorno de Produto Único (SingleProduct)**
   - Teste verifica que apenas um produto é retornado
   - Produto correto baseado nas preferências e funcionalidades selecionadas

2. **Retorno de Múltiplos Produtos Ordenados (MultipleProducts)**
   - Teste verifica que múltiplos produtos são retornados
   - Produtos ordenados por pontuação (maior primeiro)
   - Ordem correta dos produtos validada

3. **Cenário de Empate na Pontuação Máxima**
   - Teste garante que em caso de empate, o último produto da lista original é retornado
   - Validação da lógica de tratamento de empates
   - Último produto com pontuação máxima é selecionado

4. **Cenário de Zero Matches**
   - Teste verifica que array vazio é retornado quando não há matches
   - Validação de cenário sem correspondências
   - Retorno consistente de `[]`

#### Casos Adicionais ✅

- Validação de dados inválidos (formData null, produtos vazios)
- Tipo de recomendação não especificado
- SingleProduct com múltiplos produtos de match (seleciona um)

### Executando Testes

Para executar todos os testes:

```bash
cd frontend
yarn test
```

Para executar apenas os testes do serviço de recomendação:

```bash
cd frontend
yarn test recommendation.service.test.ts
```

### Confirmação de Cobertura

Todos os casos de uso obrigatórios estão implementados e testados:

- ✅ **Retorno de Produto Único**: Teste valida que apenas um produto é retornado
- ✅ **Retorno de Múltiplos Produtos Ordenados**: Teste verifica ordenação por pontuação (maior primeiro)
- ✅ **Cenário de Empate**: Teste garante que o último produto da lista original é retornado em caso de empate na pontuação máxima
- ✅ **Cenário de Zero Matches**: Teste verifica que array vazio `[]` é retornado quando não há matches

### Arquivos de Teste

- `services/recommendation.service.test.ts` - Testes unitários do serviço de recomendação cobrindo todos os casos de uso obrigatórios com JSDoc explicativo

---

## 📡 Documentação da API

### GET /products

Retorna a lista completa de produtos disponíveis.

**Request:**
```http
GET http://localhost:3001/products
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "RD Station CRM",
    "category": "Vendas",
    "preferences": [
      "Integração fácil com ferramentas de e-mail",
      "Personalização de funis de vendas",
      "Relatórios avançados de desempenho de vendas"
    ],
    "features": [
      "Gestão de leads e oportunidades",
      "Automação de fluxos de trabalho de vendas",
      "Rastreamento de interações com clientes"
    ]
  }
]
```

**Status Codes:**
- `200 OK`: Sucesso
- `500 Internal Server Error`: Erro no servidor

### Estrutura de Dados

```typescript
interface Product {
  id: number;
  name: string;
  category: string;
  preferences: string[];
  features: string[];
}

interface FormData {
  selectedPreferences: string[];
  selectedFeatures: string[];
  selectedRecommendationType: 'SingleProduct' | 'MultipleProducts';
}
```

---

## 📁 Estrutura do Projeto

```
tech-interview-frontend-entry-level/
├── backend/                    # API Mock (json-server)
│   ├── db.json                # Banco de dados mock
│   └── package.json
│
├── frontend/                   # Aplicação React
│   ├── public/                # Arquivos estáticos
│   └── src/
│       ├── components/        # Componentes React
│       │   ├── Form/         # Formulário de seleção
│       │   │   ├── Fields/   # Campos do formulário (Preferências, Funcionalidades, Tipo)
│       │   │   ├── FormStepper/  # Stepper horizontal com navegação entre etapas
│       │   │   ├── ResetButton/  # Botão de reset de seleções
│       │   │   └── SubmitButton/ # Botão de submissão
│       │   ├── RecommendationList/  # Lista de resultados
│       │   ├── shared/       # Componentes reutilizáveis (Checkbox, Radio, MatchProgressBar)
│       │   └── icons/        # Ícones customizados
│       │
│       ├── styles/           # Estilos globais centralizados
│       │   ├── global.css    # Estilos globais da aplicação
│       │   ├── tailwind.css  # Configuração do Tailwind CSS
│       │   └── index.ts      # Barrel export para imports
│       │
│       ├── constants/        # Constantes da aplicação
│       ├── hooks/            # Hooks customizados (useForm, useProducts, useRecommendations, useToast)
│       ├── services/         # Lógica de negócio (product.service, recommendation.service)
│       ├── types/            # Tipos TypeScript (interfaces e tipos)
│       ├── utils/            # Utilitários (iconMapper)
│       ├── mocks/            # Dados mock para testes
│       ├── App.tsx           # Componente principal
│       └── index.tsx         # Entry point
│
├── install.sh                # Script de instalação
└── package.json              # Configuração do monorepo
```

---

## 🚀 Próximos Passos para Escalabilidade

### 📅 Curto Prazo

#### Tratamento de Erros
- [ ] Implementar ErrorBoundary para capturar erros de renderização
- [ ] Adicionar tratamento de erros de API na UI
- [ ] Exibir mensagens de erro amigáveis ao usuário
- [ ] Implementar logging de erros para debugging
- [ ] Criar componente de erro genérico reutilizável

#### Estados de Loading
- [ ] Adicionar spinner durante carregamento de produtos
- [ ] Implementar skeleton screens
- [ ] Feedback visual durante processamento de recomendações
- [ ] Loading states em botões durante submit

#### Validação e Type Safety
- [ ] Adicionar PropTypes em todos os componentes
- [ ] Validação de tipos em runtime
- [ ] Documentação inline de props
- [ ] Criar utilitário de validação de formulário

#### Acessibilidade
- [ ] Adicionar ARIA labels onde necessário
- [ ] Melhorar navegação por teclado
- [ ] Testes com leitores de tela
- [ ] Verificar contraste de cores (WCAG AA)
- [ ] Adicionar skip links para navegação

### 📅 Médio Prazo

#### Testes
- [ ] Testes E2E com Cypress ou Playwright
- [ ] Testes de fluxo completo do usuário
- [ ] Testes de acessibilidade automatizados
- [ ] Aumentar cobertura de testes unitários (>80%)
- [ ] Testes de performance

#### Performance
- [ ] Implementar `useMemo` para cálculos pesados
- [ ] Lazy loading de componentes
- [ ] Code splitting por rotas
- [ ] Memoização de componentes com `React.memo`
- [ ] Otimizar re-renders desnecessários
- [ ] Virtualização de listas (se necessário)

#### TypeScript (✅ Concluído)
- [x] Migração completa para TypeScript
- [x] Tipos para services e hooks
- [x] Interfaces para componentes
- [x] Type safety em tempo de compilação
- [x] Configurado strict mode

#### Documentação
- [ ] Storybook para documentação visual
- [ ] Exemplos de uso de cada componente
- [ ] Documentação de props e estados
- [ ] Guia de contribuição
- [ ] Documentação de arquitetura detalhada

#### UX/UI
- [ ] Animações suaves de transição
- [ ] Feedback visual ao selecionar opções
- [ ] Histórico de recomendações
- [ ] Comparação de produtos lado a lado
- [ ] Filtros avançados
- [ ] Busca de produtos
- [ ] Paginação de resultados

### 📅 Longo Prazo

#### Backend
- [ ] Substituir json-server por API real
- [ ] Implementar com Node.js/Express ou Python/FastAPI
- [ ] Banco de dados (PostgreSQL ou MongoDB)
- [ ] Autenticação e autorização (JWT, OAuth)
- [ ] Rate limiting e segurança
- [ ] Validação de dados no backend
- [ ] API versioning

#### Algoritmo Avançado
- [ ] Machine Learning para recomendações personalizadas
- [ ] Análise de histórico do usuário
- [ ] Sistema de pesos configurável
- [ ] A/B testing de algoritmos
- [ ] Métricas de qualidade de recomendações
- [ ] Feedback loop (usuário avalia recomendações)

#### Infraestrutura
- [ ] Redis para cache de recomendações
- [ ] CDN para assets estáticos
- [ ] Otimização de queries
- [ ] Paginação de resultados
- [ ] Load balancing
- [ ] Auto-scaling

#### Monitoramento
- [ ] Logging estruturado (Winston, Pino)
- [ ] Error tracking (Sentry)
- [ ] Analytics de uso
- [ ] Performance monitoring
- [ ] Dashboards de métricas
- [ ] Alertas automatizados

#### CI/CD
- [ ] GitHub Actions ou GitLab CI
- [ ] Testes automatizados no pipeline
- [ ] Deploy automático
- [ ] Ambientes de staging e produção
- [ ] Rollback automático
- [ ] Health checks

#### Internacionalização
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Formatação de datas e números
- [ ] Tradução de interface
- [ ] RTL support (se necessário)
- [ ] Localização de conteúdo

#### Testes de Carga
- [ ] Load testing com k6 ou Artillery
- [ ] Otimização baseada em resultados
- [ ] Planejamento de capacidade
- [ ] Stress testing
- [ ] Performance benchmarks

#### Features Adicionais
- [ ] Favoritar produtos
- [ ] Compartilhar recomendações
- [ ] Exportar recomendações (PDF, CSV)
- [ ] Notificações de novos produtos
- [ ] Integração com outros sistemas
- [ ] API pública para integrações

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18.2.0
- TypeScript 5.9.3
- Tailwind CSS 3.4.1
- Axios 1.13.2
- React Testing Library
- Framer Motion 12.23.24 (animações)
- Heroicons 2.2.0 (ícones)

### Backend
- json-server 1.0.0
- Node.js 18.3+

### Ferramentas
- CRACO 7.1.0 (customização do Create React App)
- Lerna 8.0.2
- ESLint 8.56.0
- Yarn 1.22.22
- Create React App 5.0.1
- Concurrently 8.2.2 (execução simultânea de scripts)

---

## 📝 Notas Técnicas

- **Backend:** json-server como mock da API (porta 3001)
- **Algoritmo:** Implementado em `recommendation.service.ts` com complexidade O(n log n)
- **Testes:** Testes unitários em `recommendation.service.test.ts` cobrindo todos os casos de uso obrigatórios (Produto Único, Múltiplos Produtos, Empates, Zero Matches)
- **Linguagem:** TypeScript 5.9.3 (com strict mode habilitado)
- **Framework:** React 18.2.0
- **Estilização:** Tailwind CSS 3.4.1 com estilos globais centralizados em `styles/`
- **Type Safety:** Interfaces e tipos definidos em `types/index.ts` para garantir type safety em tempo de compilação
- **Path Aliases:** Configurados via CRACO e tsconfig.json (`@components`, `@hooks`, `@services`, `@appTypes`, `@constants`, `@utils`, `@mocks`)
- **UI/UX:** Stepper horizontal com navegação por etapas, footer fixo, animações com Framer Motion, toast notifications customizadas
- **Arquitetura:** Separação clara de responsabilidades (Services → Hooks → Components) seguindo princípios de Clean Architecture

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
