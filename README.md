# Sistema CRUD com Nuxt.js

Um sistema completo de CRUD (Create, Read, Update, Delete) para gerenciamento de customers, desenvolvido com Nuxt.js 4, Pinia, Zod, TailwindCSS e TypeScript.

## 🚀 Características

- **Framework**: Nuxt.js 4 (Vue 3) com TypeScript
- **Estado**: Pinia para gerenciamento de estado
- **Validação**: Zod para validação de schemas
- **Estilos**: TailwindCSS para UI moderna e responsiva
- **Testes**: Vitest para testes unitários
- **Containerização**: Docker e Docker Compose

## 📋 Funcionalidades

### Customer Management
- ✅ Listagem paginada de customers
- ✅ Criação de novos customers
- ✅ Edição de customers existentes
- ✅ Exclusão de customers
- ✅ Busca e filtros avançados
- ✅ Visualização detalhada de customers

### Campos do Customer
- **Nome**: String com validação de caracteres e tamanho
- **CPF**: String formatada com validação de dígitos verificadores
- **Email**: String com validação de formato
- **Telefone**: String formatada (11) 99999-9999
- **Idade**: Número inteiro entre 1 e 120
- **Data de Nascimento**: Data no formato ISO
- **Salário**: Número decimal formatado como moeda brasileira
- **Status Ativo**: Boolean
- **Observações**: String opcional até 500 caracteres

### Componentes Reutilizáveis
- **BaseInput**: Campo de entrada genérico
- **CPFInput**: Campo específico para CPF com formatação automática
- **PhoneInput**: Campo para telefone com máscara
- **CurrencyInput**: Campo para valores monetários
- **CheckboxInput**: Campo para valores booleanos
- **TextareaInput**: Campo para texto longo
- **BaseButton**: Botão reutilizável com variantes
- **BaseModal**: Modal base para diálogos

## 🛠️ Tecnologias

- **Frontend**: Nuxt.js 4, Vue 3, TypeScript
- **Estado**: Pinia
- **Validação**: Zod
- **Estilos**: TailwindCSS
- **Testes**: Vitest, @vue/test-utils
- **Build**: Vite
- **Container**: Docker, Docker Compose

## 📁 Estrutura do Projeto

```
nuxt-js/
├── assets/css/              # Estilos CSS e TailwindCSS
├── components/
│   ├── forms/              # Componentes de formulário
│   └── ui/                 # Componentes de interface
├── layouts/                # Layouts da aplicação
├── pages/                  # Páginas da aplicação
│   └── customers/          # Páginas relacionadas a customers
├── plugins/                # Plugins do Nuxt
├── services/               # Camada de serviços
├── stores/                 # Stores do Pinia
├── types/                  # Tipos TypeScript
├── utils/                  # Utilitários e formatadores
├── __tests__/              # Testes unitários
├── Dockerfile              # Container da aplicação
├── docker-compose.yml      # Orquestração de containers
└── nginx.conf             # Configuração do Nginx
```

## 🚀 Como Executar

### Desenvolvimento Local

1. **Clone o repositório**
```bash
git clone <repo-url>
cd nuxt-js
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:3000
```

### Usando Docker

1. **Build e execute com Docker Compose**
```bash
docker-compose up --build
```

2. **Acesse a aplicação**
```
http://localhost:3000
```

### Usando Docker (apenas aplicação)

1. **Build da imagem**
```bash
docker build -t nuxt-crud .
```

2. **Execute o container**
```bash
docker run -p 3000:3000 nuxt-crud
```

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com coverage
```bash
npm run test:coverage
```

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm test` - Executa testes unitários
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Executa testes com relatório de cobertura

## 🏗️ Arquitetura

### Camadas da Aplicação

1. **Apresentação (Components/Pages)**
   - Componentes Vue reutilizáveis
   - Páginas da aplicação
   - Layouts responsivos

2. **Estado (Stores)**
   - Stores Pinia para gerenciamento de estado
   - Actions para operações assíncronas
   - Getters para dados computados

3. **Serviços (Services)**
   - Camada de abstração para APIs
   - Dados mockados para desenvolvimento
   - Validações com Zod

4. **Utilitários (Utils)**
   - Formatadores de dados
   - Funções auxiliares
   - Validações customizadas

### Padrões Utilizados

- **Composition API**: Padrão moderno do Vue 3
- **TypeScript**: Tipagem estática para maior segurança
- **Schema Validation**: Validação robusta com Zod
- **Component-First**: Arquitetura baseada em componentes
- **Reactive State**: Estado reativo com Pinia

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Ambiente
NODE_ENV=development

# API
API_BASE_URL=http://localhost:3000/api

# Aplicação
APP_NAME="Sistema CRUD"
APP_DESCRIPTION="Sistema de gerenciamento de customers"
```

### TailwindCSS

O projeto usa TailwindCSS com configuração personalizada. As classes principais estão definidas em `assets/css/main.css`.

### Zod Schemas

Os schemas de validação estão definidos em `types/customer.ts` e incluem:
- Validação de CPF com dígitos verificadores
- Formatação automática de campos
- Mensagens de erro personalizadas

## 🐳 Docker

### Multi-stage Build

O Dockerfile usa multi-stage build para otimizar o tamanho da imagem:
1. **Base**: Instalação de dependências e build
2. **Runtime**: Apenas arquivos necessários para execução

### Segurança

- Usuário não-root para execução
- Dependências mínimas na imagem final
- Health checks configurados

## 📊 Monitoramento

### Health Checks

- Container health check via HTTP
- Nginx health endpoint
- Monitoring de performance

### Logs

- Logs estruturados da aplicação
- Logs do Nginx para acesso e erros
- Logs do Docker para debugging

## 🔄 CI/CD

O projeto está preparado para integração contínua com:
- Testes automatizados
- Build e deploy via Docker
- Verificação de qualidade de código

## 📈 Performance

### Otimizações Implementadas

- Server-side rendering (SSR)
- Code splitting automático
- Lazy loading de componentes
- Compressão gzip
- Cache de assets estáticos

### Métricas

- Lighthouse score otimizado
- Core Web Vitals compliance
- Bundle size minimizado

## 🛡️ Segurança

### Implementações

- Validação de entrada rigorosa
- Headers de segurança no Nginx
- Rate limiting configurado
- Sanitização de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autor

Desenvolvido como exemplo de sistema CRUD moderno com Nuxt.js.

---

**Nota**: Este é um projeto de demonstração com dados mockados. Para uso em produção, implemente uma API real e configure adequadamente as variáveis de ambiente.