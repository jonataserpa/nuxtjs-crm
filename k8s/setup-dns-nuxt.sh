#!/bin/bash

# Script para configurar DNS local para nuxt-app.com
# Execute como root: sudo ./setup-dns-nuxt.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌐 Configurando DNS local para nuxt-app.com${NC}"

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Execute como root: sudo $0${NC}"
    exit 1
fi

# Obter IP do Traefik LoadBalancer
TRAEFIK_IP=$(kubectl get svc traefik -n kube-system -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "192.168.3.242")

echo -e "${YELLOW}📍 IP do Traefik LoadBalancer: ${TRAEFIK_IP}${NC}"

# Configurar /etc/hosts
echo -e "${YELLOW}📝 Configurando /etc/hosts...${NC}"

# Remover entradas antigas se existirem
sed -i '/nuxt-app\./d' /etc/hosts

# Adicionar novas entradas
echo "${TRAEFIK_IP} nuxt-app.com" >> /etc/hosts
echo "${TRAEFIK_IP} nuxt-app.local" >> /etc/hosts

echo -e "${GREEN}✅ DNS configurado com sucesso!${NC}"
echo ""
echo -e "${GREEN}🔗 URLs configuradas:${NC}"
echo -e "${YELLOW}  http://nuxt-app.com${NC}"
echo -e "${YELLOW}  http://nuxt-app.local${NC}"
echo ""
echo -e "${GREEN}📡 Traefik Dashboard:${NC}"
echo -e "${YELLOW}  http://${TRAEFIK_IP}:8080${NC}"
echo ""
echo -e "${YELLOW}💡 Para testar:${NC}"
echo "  curl http://nuxt-app.com"
echo "  ou acesse diretamente: http://nuxt-app.com"
