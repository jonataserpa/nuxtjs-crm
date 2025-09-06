#!/bin/bash

# Script de Deploy para Kubernetes
# Uso: ./deploy.sh [registry-url] [image-tag]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parâmetros
REGISTRY=${1:-"your-registry.com"}
IMAGE_TAG=${2:-"latest"}
IMAGE_NAME="nuxt-app"
FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

echo -e "${GREEN}🚀 Iniciando deploy da aplicação Nuxt.js no Kubernetes${NC}"
echo -e "${YELLOW}Registry: ${REGISTRY}${NC}"
echo -e "${YELLOW}Imagem: ${FULL_IMAGE_NAME}${NC}"
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

# Função para build da imagem Docker
build_image() {
    echo -e "${YELLOW}🔨 Fazendo build da imagem Docker...${NC}"
    
    if [ ! -f "../Dockerfile" ]; then
        echo -e "${RED}❌ Dockerfile não encontrado no diretório pai${NC}"
        exit 1
    fi
    
    cd ..
    docker build -t ${FULL_IMAGE_NAME} .
    cd k8s
    
    echo -e "${GREEN}✅ Imagem buildada com sucesso${NC}"
}

# Função para push da imagem
push_image() {
    echo -e "${YELLOW}📤 Fazendo push da imagem para o registry...${NC}"
    
    docker push ${FULL_IMAGE_NAME}
    
    echo -e "${GREEN}✅ Imagem enviada com sucesso${NC}"
}

# Função para atualizar a imagem no deployment
update_deployment() {
    echo -e "${YELLOW}📝 Atualizando deployment com nova imagem...${NC}"
    
    # Atualizar a imagem no deployment
    sed -i "s|image: nuxt-app:latest|image: ${FULL_IMAGE_NAME}|g" deployment.yaml
    
    echo -e "${GREEN}✅ Deployment atualizado${NC}"
}

# Função para aplicar os manifestos
apply_manifests() {
    echo -e "${YELLOW}📋 Aplicando manifestos Kubernetes...${NC}"
    
    # Aplicar em ordem
    kubectl apply -f namespace.yaml
    kubectl apply -f configmap.yaml
    kubectl apply -f deployment.yaml
    kubectl apply -f service.yaml
    kubectl apply -f ingress.yaml
    kubectl apply -f hpa.yaml
    
    echo -e "${GREEN}✅ Manifests aplicados com sucesso${NC}"
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
}

# Função para mostrar comandos úteis
show_commands() {
    echo ""
    echo -e "${GREEN}🛠️  Comandos úteis:${NC}"
    echo ""
    echo "Ver logs:"
    echo "  kubectl logs -f deployment/nuxt-app -n nuxt-app"
    echo ""
    echo "Port-forward para teste local:"
    echo "  kubectl port-forward svc/nuxt-app-service 8080:80 -n nuxt-app"
    echo ""
    echo "Verificar pods:"
    echo "  kubectl get pods -n nuxt-app"
    echo ""
    echo "Descrever deployment:"
    echo "  kubectl describe deployment nuxt-app -n nuxt-app"
    echo ""
    echo "Remover tudo:"
    echo "  kubectl delete -f ."
}

# Função principal
main() {
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}  Deploy Nuxt.js no Kubernetes  ${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    
    check_kubectl
    build_image
    push_image
    update_deployment
    apply_manifests
    check_deployment
    show_commands
    
    echo ""
    echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
}

# Executar função principal
main "$@"
