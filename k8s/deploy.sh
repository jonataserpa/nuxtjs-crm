#!/bin/bash

# Script de Deploy para Kubernetes
# Uso: ./deploy.sh [registry-url] [image-tag]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parâmetros - usando imagem local
IMAGE_NAME="nuxt-app"
IMAGE_TAG="latest"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

echo -e "${GREEN}🚀 Iniciando deploy da aplicação Nuxt.js no Kubernetes${NC}"
echo -e "${YELLOW}Imagem local: ${FULL_IMAGE_NAME}${NC}"
echo ""

# Função para verificar se kubectl está configurado
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}❌ kubectl não encontrado. Instale o kubectl primeiro.${NC}"
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        echo -e "${RED}❌ kubectl não consegue conectar ao cluster. Verifique sua configuração.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ kubectl configurado e conectado ao cluster${NC}"
}

# Função para verificar se a imagem local existe
check_local_image() {
    echo -e "${YELLOW}🔍 Verificando se a imagem local existe...${NC}"
    
    if ! docker image inspect ${FULL_IMAGE_NAME} &> /dev/null; then
        echo -e "${RED}❌ Imagem local ${FULL_IMAGE_NAME} não encontrada${NC}"
        echo -e "${YELLOW}💡 Execute primeiro: docker build -t ${FULL_IMAGE_NAME} .${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Imagem local encontrada${NC}"
}

# Função para carregar imagem local no cluster
load_image_to_cluster() {
    echo -e "${YELLOW}📦 Carregando imagem local para o cluster...${NC}"
    
    # Verificar se estamos usando kind ou minikube
    if command -v kind &> /dev/null && kind get clusters &> /dev/null; then
        echo -e "${YELLOW}🔄 Carregando imagem no Kind...${NC}"
        kind load docker-image ${FULL_IMAGE_NAME}
    elif command -v minikube &> /dev/null && minikube status &> /dev/null; then
        echo -e "${YELLOW}🔄 Carregando imagem no Minikube...${NC}"
        minikube image load ${FULL_IMAGE_NAME}
    else
        echo -e "${YELLOW}⚠️  Cluster local detectado. Certifique-se de que a imagem está disponível no cluster.${NC}"
        echo -e "${YELLOW}💡 Se necessário, execute: docker save ${FULL_IMAGE_NAME} | docker load${NC}"
    fi
    
    echo -e "${GREEN}✅ Imagem carregada no cluster${NC}"
}

# Função para preparar deployment com imagem local
prepare_deployment() {
    echo -e "${YELLOW}📝 Preparando deployment com imagem local...${NC}"
    
    # Verificar se deployment.yaml existe
    if [ ! -f "deployment.yaml" ]; then
        echo -e "${RED}❌ deployment.yaml não encontrado${NC}"
        exit 1
    fi
    
    # Atualizar a imagem no deployment se necessário
    if grep -q "image: nuxt-app:latest" deployment.yaml; then
        sed -i "s|image: nuxt-app:latest|image: ${FULL_IMAGE_NAME}|g" deployment.yaml
        echo -e "${GREEN}✅ Deployment atualizado com imagem local${NC}"
    else
        echo -e "${GREEN}✅ Deployment já configurado corretamente${NC}"
    fi
}

# Função para aplicar os manifestos
apply_manifests() {
    echo -e "${YELLOW}📋 Aplicando manifestos Kubernetes...${NC}"
    
    # Aplicar ingress controller primeiro (Traefik)
    echo -e "${YELLOW}🔧 Instalando Traefik Ingress Controller...${NC}"
    kubectl apply -f traefik-deployment.yaml
    
    # Aguardar Traefik ficar pronto
    echo -e "${YELLOW}⏳ Aguardando Traefik ficar pronto...${NC}"
    kubectl wait --for=condition=available --timeout=300s deployment/traefik -n kube-system
    
    # Aplicar manifestos da aplicação em ordem
    kubectl apply -f namespace.yaml
    kubectl apply -f configmap.yaml
    kubectl apply -f deployment.yaml
    kubectl apply -f service.yaml
    kubectl apply -f ingress.yaml
    kubectl apply -f hpa.yaml
    
    echo -e "${GREEN}✅ Manifests aplicados com sucesso${NC}"
}

# Função para configurar DNS local
setup_dns() {
    echo -e "${YELLOW}🌐 Configurando DNS local...${NC}"
    
    # Verificar se o script de DNS existe
    if [ -f "setup-dns-nuxt.sh" ]; then
        echo -e "${YELLOW}📝 Executando configuração de DNS...${NC}"
        sudo ./setup-dns-nuxt.sh
        echo -e "${GREEN}✅ DNS configurado${NC}"
    else
        echo -e "${YELLOW}⚠️  Script de DNS não encontrado. Configure manualmente:${NC}"
        echo -e "${YELLOW}   echo '192.168.3.4 nuxt-app.com' | sudo tee -a /etc/hosts${NC}"
        echo -e "${YELLOW}   echo '192.168.3.4 nuxt-app.local' | sudo tee -a /etc/hosts${NC}"
    fi
}

# Função para verificar o status do deploy
check_deployment() {
    echo -e "${YELLOW}🔍 Verificando status do deployment...${NC}"
    
    # Aguardar rollout
    kubectl rollout status deployment/nuxt-app -n nuxt-app --timeout=300s
    
    # Mostrar status
    echo ""
    echo -e "${GREEN}📊 Status dos recursos:${NC}"
    kubectl get all -n nuxt-app
    
    echo ""
    echo -e "${GREEN}🌐 Informações de acesso:${NC}"
    kubectl get ingress -n nuxt-app
    echo ""
    echo -e "${GREEN}🔗 URLs de acesso:${NC}"
    echo -e "${YELLOW}  http://nuxt-app.local${NC}"
    echo -e "${YELLOW}  http://nuxt-app.com${NC}"
    echo ""
    echo -e "${GREEN}📡 Traefik Dashboard:${NC}"
    TRAEFIK_IP=$(kubectl get svc traefik -n kube-system -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "192.168.3.242")
    echo -e "${YELLOW}  http://${TRAEFIK_IP}:8080${NC}"
}

# Função para mostrar comandos úteis
show_commands() {
    echo ""
    echo -e "${GREEN}🛠️  Comandos úteis:${NC}"
    echo ""
    echo "Ver logs da aplicação:"
    echo "  kubectl logs -f deployment/nuxt-app -n nuxt-app"
    echo ""
    echo "Ver logs do Traefik:"
    echo "  kubectl logs -f deployment/traefik -n kube-system"
    echo ""
    echo "Verificar ingress:"
    echo "  kubectl get ingress -n nuxt-app"
    echo "  kubectl describe ingress nuxt-app-ingress -n nuxt-app"
    echo ""
    echo "Port-forward para teste local:"
    echo "  kubectl port-forward svc/nuxt-app-service 8080:80 -n nuxt-app"
    echo ""
    echo "Verificar pods:"
    echo "  kubectl get pods -n nuxt-app"
    echo "  kubectl get pods -n kube-system | grep traefik"
    echo ""
    echo "Descrever deployment:"
    echo "  kubectl describe deployment nuxt-app -n nuxt-app"
    echo ""
    echo "Remover tudo:"
    echo "  kubectl delete -f ."
    echo "  kubectl delete -f traefik-deployment.yaml"
}

# Função principal
main() {
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}  Deploy Nuxt.js no Kubernetes  ${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    
    check_kubectl
    check_local_image
    load_image_to_cluster
    prepare_deployment
    apply_manifests
    setup_dns
    check_deployment
    show_commands
    
    echo ""
    echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
}

# Executar função principal
main "$@"
