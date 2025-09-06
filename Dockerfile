# syntax = docker/dockerfile:1

# Argumentos
ARG NODE_VERSION=20.18.0

# Imagem base para build
FROM node:${NODE_VERSION}-alpine as base

# Instalar dependências do sistema
RUN apk update && apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nuxt -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração do npm
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY --chown=nuxt:nodejs . .

# Build da aplicação
RUN npm run build

# Etapa final - runtime
FROM node:${NODE_VERSION}-alpine as runtime

# Instalar dependências do sistema
RUN apk update && apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nuxt -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos built da etapa de build
COPY --from=base --chown=nuxt:nodejs /app/.output /app/.output

# Variáveis de ambiente
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Expor porta
EXPOSE 3000

# Usar usuário não-root
USER nuxt

# Comando de inicialização
CMD ["dumb-init", "node", ".output/server/index.mjs"]
