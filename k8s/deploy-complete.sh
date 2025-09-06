#!/bin/bash

echo "🚀 Iniciando deploy completo da aplicação Nuxt.js no Kubernetes..."

# Verificar se kubectl está configurado
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ kubectl não está configurado ou cluster não está acessível"
    echo "Execute primeiro: export KUBECONFIG=\$HOME/.kube/config"
    exit 1
fi

# 1. Build da imagem
echo "🔨 Fazendo build da imagem Docker..."
docker build -t nuxt-app:latest .

if [ $? -ne 0 ]; then
    echo "❌ Erro no build da imagem Docker"
    exit 1
fi

# 2. Importar imagem para containerd
echo "📦 Importando imagem para containerd..."
docker save nuxt-app:latest | sudo ctr -n k8s.io images import -

if [ $? -ne 0 ]; then
    echo "❌ Erro ao importar imagem para containerd"
    exit 1
fi

# 3. Aplicar manifestos
echo "📋 Aplicando manifestos Kubernetes..."

# Namespace
echo "  - Aplicando namespace..."
kubectl apply -f namespace.yaml

# ConfigMap
echo "  - Aplicando configmap..."
kubectl apply -f configmap.yaml

# Deployment
echo "  - Aplicando deployment..."
kubectl apply -f deployment.yaml

# Service
echo "  - Aplicando service..."
kubectl apply -f service.yaml

# Ingress (opcional)
if [ -f "ingress.yaml" ]; then
    echo "  - Aplicando ingress..."
    kubectl apply -f ingress.yaml
fi

# HPA (opcional)
if [ -f "hpa.yaml" ]; then
    echo "  - Aplicando HPA..."
    kubectl apply -f hpa.yaml
fi

# 4. Aguardar pods ficarem prontos
echo "⏳ Aguardando pods ficarem prontos..."
kubectl wait --for=condition=Ready pod -l app=nuxt-app -n nuxt-app --timeout=300s

if [ $? -ne 0 ]; then
    echo "⚠️  Timeout aguardando pods ficarem prontos"
    echo "Verificando status dos pods:"
    kubectl get pods -n nuxt-app
    exit 1
fi

# 5. Verificar status
echo "✅ Deploy concluído! Verificando status..."

echo ""
echo "📊 Status dos pods:"
kubectl get pods -n nuxt-app

echo ""
echo "📊 Status dos services:"
kubectl get svc -n nuxt-app

echo ""
echo "🌐 Aplicação disponível em:"
echo "  - Acesso direto: http://192.168.3.4:3000"
echo "  - Port forward: kubectl port-forward svc/nuxt-app-service 8080:80 -n nuxt-app"

echo ""
echo "🔧 Comandos úteis:"
echo "  - Ver logs: kubectl logs -f deployment/nuxt-app -n nuxt-app"
echo "  - Ver status: kubectl get all -n nuxt-app"
echo "  - Deletar tudo: kubectl delete namespace nuxt-app"
