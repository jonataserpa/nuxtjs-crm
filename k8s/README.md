# Kubernetes Manifests para Aplicação Nuxt.js

Este diretório contém todos os manifestos Kubernetes necessários para deployar a aplicação Nuxt.js em um cluster Kubernetes.

## Arquivos Incluídos

- `namespace.yaml` - Namespace para isolar os recursos da aplicação
- `configmap.yaml` - Configurações e variáveis de ambiente
- `deployment.yaml` - Deployment principal da aplicação
- `service.yaml` - Service para expor a aplicação internamente
- `ingress.yaml` - Ingress para expor a aplicação externamente
- `hpa.yaml` - Horizontal Pod Autoscaler para escalonamento automático
- `deploy.sh` - Script automatizado de deploy
- `deploy-complete.sh` - Script completo de build e deploy
- `reset-cluster.sh` - Script para reset completo do cluster
- `kustomization.yaml` - Configuração do Kustomize

## Guia Completo de Execução

### 1. Criação do Cluster Kubernetes (Garuda/Arch Linux)

#### Pré-requisitos do Sistema

```bash
# 1. Instalar dependências
sudo pacman -S kubernetes kubeadm kubectl containerd docker

# 2. Configurar kernel modules
sudo modprobe overlay
sudo modprobe br_netfilter

# 3. Configurar sysctl
echo 'net.bridge.bridge-nf-call-iptables = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.bridge.bridge-nf-call-ip6tables = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl --system

# 4. Desativar swap
sudo swapoff -a
sudo sed -i '/swap/s/^/#/' /etc/fstab
sudo systemctl mask systemd-zram-setup@zram0.service

# 5. Configurar containerd
sudo mkdir -p /etc/containerd
sudo containerd config default | sudo tee /etc/containerd/config.toml
sudo systemctl enable containerd
sudo systemctl start containerd

# 6. Configurar kubelet
sudo systemctl enable kubelet
```

#### Inicialização do Cluster

```bash
# 1. Inicializar o cluster
sudo kubeadm init --apiserver-advertise-address=192.168.3.4 --pod-network-cidr=192.168.0.0/16 --ignore-preflight-errors=Swap

# 2. Configurar kubectl para usuário normal
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/super-admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# 3. Configurar variável de ambiente
export KUBECONFIG=$HOME/.kube/config

# 4. Verificar status do cluster
kubectl get nodes
```

#### Instalação do CNI (Flannel)

```bash
# Instalar Flannel
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# Verificar se os pods do Flannel estão rodando
kubectl get pods -n kube-flannel

# Aguardar nó ficar Ready
kubectl get nodes
```

### 2. Build e Preparação da Imagem

#### Build da Imagem Docker

```bash
# 1. Build da imagem local
docker build -t nuxt-app:latest .

# 2. Verificar se a imagem foi criada
docker images | grep nuxt-app

# 3. Testar a imagem localmente
docker run -d -p 3000:3000 --name nuxt-test nuxt-app:latest
curl http://localhost:3000
docker stop nuxt-test && docker rm nuxt-test
```

#### Importar Imagem para Containerd

```bash
# Importar imagem do Docker para containerd (necessário para Kubernetes local)
docker save nuxt-app:latest | sudo ctr -n k8s.io images import -

# Verificar se a imagem foi importada
sudo ctr -n k8s.io images list | grep nuxt
```

### 3. Deploy no Kubernetes

#### Scripts Automatizados

**Deploy Completo (Recomendado):**
```bash
# Executar script completo de build e deploy
./deploy-complete.sh
```

**Reset do Cluster:**
```bash
# Reset completo do cluster
./reset-cluster.sh
```

#### Aplicar Manifests (Manual)

```bash
# 1. Aplicar namespace
kubectl apply -f namespace.yaml

# 2. Aplicar configmap
kubectl apply -f configmap.yaml

# 3. Aplicar deployment
kubectl apply -f deployment.yaml

# 4. Aplicar service
kubectl apply -f service.yaml

# 5. Aplicar ingress (opcional)
kubectl apply -f ingress.yaml

# 6. Aplicar HPA (opcional)
kubectl apply -f hpa.yaml
```

#### Verificar Deploy

```bash
# 1. Verificar pods
kubectl get pods -n nuxt-app

# 2. Verificar services
kubectl get svc -n nuxt-app

# 3. Verificar status detalhado
kubectl get pods -n nuxt-app -o wide

# 4. Ver logs da aplicação
kubectl logs -n nuxt-app -l app=nuxt-app

# 5. Descrever pod para debug
kubectl describe pod -n nuxt-app <pod-name>
```

### 4. Acesso à Aplicação

#### Opção 1: Acesso Direto (com hostNetwork)

```bash
# A aplicação estará disponível no IP do nó
curl http://192.168.3.4:3000

# Ou acesse no navegador:
# http://192.168.3.4:3000
```

#### Opção 2: Port Forward

```bash
# Port forward do service
kubectl port-forward svc/nuxt-app-service 8080:80 -n nuxt-app

# Acesse no navegador:
# http://localhost:8080
```

### 5. Comandos de Monitoramento e Gerenciamento

#### Status e Logs

```bash
# Ver todos os recursos
kubectl get all -n nuxt-app

# Status dos pods
kubectl get pods -n nuxt-app

# Logs em tempo real
kubectl logs -f deployment/nuxt-app -n nuxt-app

# Descrever recursos
kubectl describe deployment nuxt-app -n nuxt-app
kubectl describe service nuxt-app-service -n nuxt-app

# Eventos do namespace
kubectl get events -n nuxt-app --sort-by='.lastTimestamp'
```

#### Escalamento

```bash
# Escalar manualmente
kubectl scale deployment nuxt-app --replicas=5 -n nuxt-app

# Verificar HPA
kubectl get hpa -n nuxt-app

# Ver métricas de recursos
kubectl top pods -n nuxt-app
```

#### Atualizações

```bash
# Atualizar imagem
kubectl set image deployment/nuxt-app nuxt-app=nuxt-app:v1.0.1 -n nuxt-app

# Verificar rollout
kubectl rollout status deployment/nuxt-app -n nuxt-app

# Rollback se necessário
kubectl rollout undo deployment/nuxt-app -n nuxt-app
```

### 6. Troubleshooting

#### Problemas Comuns

**1. Pods com status "ErrImageNeverPull":**
```bash
# Solução: Importar imagem para containerd
docker save nuxt-app:latest | sudo ctr -n k8s.io images import -
kubectl delete pods -n nuxt-app --all
```

**2. Pods com status "Pending":**
```bash
# Verificar recursos disponíveis
kubectl describe pod <pod-name> -n nuxt-app

# Verificar se há nós disponíveis
kubectl get nodes
```

**3. Problemas de conectividade:**
```bash
# Verificar se o Flannel está funcionando
kubectl get pods -n kube-flannel

# Verificar logs do kubelet
sudo journalctl -u kubelet
```

#### Limpeza

```bash
# Remover aplicação
kubectl delete -f .

# Ou remover namespace completo
kubectl delete namespace nuxt-app

# Resetar cluster (cuidado!)
sudo kubeadm reset -f
```

### 7. Configuração de DNS Local

Para acessar a aplicação via `nuxt-app.com` ou `nuxt-app.local`:

```bash
# Adicionar entradas DNS locais
echo "192.168.3.4    nuxt-app.local" | sudo tee -a /etc/hosts
echo "192.168.3.4    nuxt-app.com" | sudo tee -a /etc/hosts

# Testar acesso
curl http://nuxt-app.local:3000
curl http://nuxt-app.com:3000
```

**Acesso via Navegador:**
- 🌐 **http://nuxt-app.com:3000**
- 🌐 **http://nuxt-app.local:3000**

**Remover entradas DNS:**
```bash
# Remover entradas DNS locais
sudo sed -i '/# Kubernetes Ingress - Nuxt App/,+2d' /etc/hosts
```

### 8. Gerenciamento de Pods e Cluster

#### Matar/Deletar Pods

```bash
# 1. Deletar pods específicos
kubectl delete pod <pod-name> -n nuxt-app

# 2. Deletar todos os pods do deployment
kubectl delete pods -n nuxt-app -l app=nuxt-app

# 3. Deletar todos os pods do namespace
kubectl delete pods --all -n nuxt-app

# 4. Forçar deleção de pods (se estiverem travados)
kubectl delete pod <pod-name> -n nuxt-app --force --grace-period=0
```

#### Deletar Recursos Específicos

```bash
# 1. Deletar deployment
kubectl delete deployment nuxt-app -n nuxt-app

# 2. Deletar service
kubectl delete service nuxt-app-service -n nuxt-app

# 3. Deletar configmap
kubectl delete configmap nuxt-app-config -n nuxt-app

# 4. Deletar ingress
kubectl delete ingress nuxt-app-ingress -n nuxt-app

# 5. Deletar HPA
kubectl delete hpa nuxt-app-hpa -n nuxt-app

# 6. Deletar namespace completo (remove tudo dentro)
kubectl delete namespace nuxt-app
```

#### Resetar e Recriar Cluster

```bash
# 1. PARAR TODOS OS SERVIÇOS
sudo systemctl stop kubelet
sudo systemctl stop containerd
sudo systemctl stop docker

# 2. RESETAR CLUSTER KUBERNETES
sudo kubeadm reset -f

# 3. LIMPAR ARQUIVOS DE CONFIGURAÇÃO
sudo rm -rf /etc/kubernetes/
sudo rm -rf /var/lib/kubelet/
sudo rm -rf /var/lib/etcd/
sudo rm -rf ~/.kube/

# 4. LIMPAR CONTAINERD
sudo ctr -n k8s.io images rm $(sudo ctr -n k8s.io images list -q)
sudo systemctl restart containerd

# 5. LIMPAR DOCKER (opcional)
docker system prune -a -f

# 6. RECRIAR CLUSTER (seguir seção 1 novamente)
sudo kubeadm init --apiserver-advertise-address=192.168.3.4 --pod-network-cidr=192.168.0.0/16 --ignore-preflight-errors=Swap

# 7. RECONFIGURAR KUBECTL
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/super-admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
export KUBECONFIG=$HOME/.kube/config

# 8. REINSTALAR CNI
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# 9. VERIFICAR STATUS
kubectl get nodes
```

#### Script de Reset Completo

Crie um arquivo `reset-cluster.sh`:

```bash
#!/bin/bash

echo "🔄 Iniciando reset completo do cluster Kubernetes..."

# Parar serviços
echo "⏹️  Parando serviços..."
sudo systemctl stop kubelet
sudo systemctl stop containerd

# Reset kubeadm
echo "🗑️  Resetando cluster..."
sudo kubeadm reset -f

# Limpar arquivos
echo "🧹 Limpando arquivos..."
sudo rm -rf /etc/kubernetes/
sudo rm -rf /var/lib/kubelet/
sudo rm -rf /var/lib/etcd/
sudo rm -rf ~/.kube/

# Limpar containerd
echo "🐳 Limpando containerd..."
sudo ctr -n k8s.io images rm $(sudo ctr -n k8s.io images list -q) 2>/dev/null || true

# Reiniciar serviços
echo "🔄 Reiniciando serviços..."
sudo systemctl restart containerd
sudo systemctl start kubelet

echo "✅ Reset completo! Execute os comandos de criação do cluster novamente."
```

#### Recriar Aplicação Após Reset

```bash
# 1. Rebuildar imagem
docker build -t nuxt-app:latest .

# 2. Reimportar para containerd
docker save nuxt-app:latest | sudo ctr -n k8s.io images import -

# 3. Recriar cluster (se necessário)
sudo kubeadm init --apiserver-advertise-address=192.168.3.4 --pod-network-cidr=192.168.0.0/16 --ignore-preflight-errors=Swap

# 4. Reconfigurar kubectl
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/super-admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
export KUBECONFIG=$HOME/.kube/config

# 5. Reinstalar CNI
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# 6. Aguardar nó ficar Ready
kubectl get nodes

# 7. Redeployar aplicação
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# 8. Verificar deploy
kubectl get pods -n nuxt-app
```

#### Comandos de Diagnóstico

```bash
# 1. Verificar status geral
kubectl get all --all-namespaces

# 2. Verificar nós
kubectl get nodes -o wide

# 3. Verificar eventos
kubectl get events --all-namespaces --sort-by='.lastTimestamp'

# 4. Verificar logs do kubelet
sudo journalctl -u kubelet -f

# 5. Verificar logs do containerd
sudo journalctl -u containerd -f

# 6. Verificar recursos do sistema
kubectl top nodes
kubectl top pods --all-namespaces

# 7. Verificar configuração do cluster
kubectl cluster-info
kubectl cluster-info dump

# 8. Verificar versões
kubectl version
kubeadm version
```

#### Troubleshooting Avançado

```bash
# 1. Se pods não sobem após reset
kubectl describe pod <pod-name> -n nuxt-app
kubectl logs <pod-name> -n nuxt-app

# 2. Se cluster não inicializa
sudo journalctl -xeu kubelet
sudo systemctl status kubelet

# 3. Se containerd não funciona
sudo journalctl -xeu containerd
sudo systemctl status containerd

# 4. Se kubectl não conecta
kubectl config view
kubectl config get-contexts
kubectl config use-context kubernetes-admin@kubernetes

# 5. Se CNI não funciona
kubectl get pods -n kube-flannel
kubectl logs -n kube-flannel -l app=flannel

# 6. Verificar se swap está desativado
swapon --show
cat /proc/swaps

# 7. Verificar módulos do kernel
lsmod | grep br_netfilter
lsmod | grep overlay
```

## Status Final Esperado

Após executar todos os comandos, você deve ter:

```bash
# Pods rodando
$ kubectl get pods -n nuxt-app
NAME                       READY   STATUS    RESTARTS   AGE
nuxt-app-df84d6d8f-ddp58   1/1     Running   0          2m

# Services funcionando
$ kubectl get svc -n nuxt-app
NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
nuxt-app-service   ClusterIP   10.104.242.89   <none>        80/TCP    2m

# Aplicação acessível
$ curl http://192.168.3.4:3000
<!DOCTYPE html><html>...
```

## Configurações Importantes

### Deployment com hostNetwork

O deployment está configurado com `hostNetwork: true` para contornar problemas de CNI. Isso significa:
- A aplicação usa a rede do host
- Apenas 1 pod pode rodar por nó
- Acesso direto via IP do nó na porta 3000

### Recursos e Limites

- **CPU**: 250m request, 500m limit
- **Memória**: 256Mi request, 512Mi limit
- **Replicas**: 3 (mas apenas 1 rodará com hostNetwork)

### Segurança

- Container roda como usuário não-root (UID 1001)
- Read-only root filesystem
- Security contexts configurados

## 🚀 Resumo Rápido - Comandos Essenciais

### Setup Inicial (Primeira vez)
```bash
# 1. Configurar sistema e criar cluster
sudo pacman -S kubernetes kubeadm kubectl containerd docker
sudo modprobe overlay br_netfilter
echo 'net.bridge.bridge-nf-call-iptables = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl --system
sudo swapoff -a && sudo systemctl mask systemd-zram-setup@zram0.service

# 2. Inicializar cluster
sudo kubeadm init --apiserver-advertise-address=192.168.3.4 --pod-network-cidr=192.168.0.0/16 --ignore-preflight-errors=Swap

# 3. Configurar kubectl
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/super-admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
export KUBECONFIG=$HOME/.kube/config

# 4. Instalar CNI
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

### Deploy da Aplicação
```bash
# Deploy completo automatizado
./deploy-complete.sh

# OU deploy manual
docker build -t nuxt-app:latest .
docker save nuxt-app:latest | sudo ctr -n k8s.io images import -
kubectl apply -f .
```

### Comandos de Gerenciamento
```bash
# Ver status
kubectl get pods -n nuxt-app
kubectl get svc -n nuxt-app

# Acessar aplicação
curl http://192.168.3.4:3000

# Ver logs
kubectl logs -f deployment/nuxt-app -n nuxt-app

# Deletar tudo
kubectl delete namespace nuxt-app

# Reset completo
./reset-cluster.sh
```

### Troubleshooting
```bash
# Pods não sobem
kubectl describe pod <pod-name> -n nuxt-app

# Cluster não funciona
sudo journalctl -u kubelet
kubectl get nodes

# Aplicação não acessível
kubectl get pods -n nuxt-app -o wide
curl http://192.168.3.4:3000
```

## Comandos para Build e Push da Imagem

### 1. Build da Imagem Docker

```bash
# Build da imagem local
docker build -t nuxt-app:latest .

# Tag para registry (substitua por seu registry)
docker tag nuxt-app:latest your-registry.com/nuxt-app:latest

# Push para registry
docker push your-registry.com/nuxt-app:latest
```

### 2. Para Docker Hub

```bash
# Login no Docker Hub
docker login

# Build e tag
docker build -t your-username/nuxt-app:latest .
docker tag your-username/nuxt-app:latest your-username/nuxt-app:v1.0.0

# Push
docker push your-username/nuxt-app:latest
docker push your-username/nuxt-app:v1.0.0
```

### 3. Para AWS ECR

```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com

# Build e tag
docker build -t nuxt-app .
docker tag nuxt-app:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/nuxt-app:latest

# Push
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/nuxt-app:latest
```

## Deploy no Kubernetes

### 1. Aplicar os Manifests

```bash
# Aplicar todos os manifestos em ordem
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml

# Ou aplicar todos de uma vez
kubectl apply -f .
```

### 2. Verificar o Deploy

```bash
# Verificar pods
kubectl get pods -n nuxt-app

# Verificar services
kubectl get svc -n nuxt-app

# Verificar ingress
kubectl get ingress -n nuxt-app

# Verificar HPA
kubectl get hpa -n nuxt-app

# Logs da aplicação
kubectl logs -f deployment/nuxt-app -n nuxt-app
```

### 3. Testar a Aplicação

```bash
# Port-forward para testar localmente
kubectl port-forward svc/nuxt-app-service 8080:80 -n nuxt-app

# Acesse http://localhost:8080
```

## Configurações Importantes

### Ingress

O arquivo `ingress.yaml` está configurado para:
- Domínio local: `nuxt-app.local`
- Domínio de produção: `your-domain.com` (substitua pelo seu domínio)
- SSL/TLS com Let's Encrypt
- Nginx Ingress Controller

**Para usar em produção:**
1. Substitua `your-domain.com` pelo seu domínio real
2. Configure o DNS para apontar para o IP do Ingress Controller
3. Certifique-se de que o cert-manager está instalado no cluster

### Recursos

O deployment está configurado com:
- **Replicas**: 3 (mínimo 2 com HPA)
- **CPU**: 250m request, 500m limit
- **Memória**: 256Mi request, 512Mi limit
- **HPA**: Escala de 2 a 10 pods baseado em CPU (70%) e memória (80%)

### Segurança

- Container roda como usuário não-root (UID 1001)
- Read-only root filesystem
- Security contexts configurados
- Sem privilégios de escalação

## Comandos Úteis

### Monitoramento

```bash
# Status geral
kubectl get all -n nuxt-app

# Descrever recursos
kubectl describe deployment nuxt-app -n nuxt-app
kubectl describe service nuxt-app-service -n nuxt-app
kubectl describe ingress nuxt-app-ingress -n nuxt-app

# Logs em tempo real
kubectl logs -f deployment/nuxt-app -n nuxt-app

# Top pods (recursos)
kubectl top pods -n nuxt-app
```

### Troubleshooting

```bash
# Verificar eventos
kubectl get events -n nuxt-app --sort-by='.lastTimestamp'

# Executar comando no pod
kubectl exec -it deployment/nuxt-app -n nuxt-app -- /bin/sh

# Verificar configuração do pod
kubectl get pod -n nuxt-app -o yaml
```

### Atualizações

```bash
# Atualizar imagem
kubectl set image deployment/nuxt-app nuxt-app=your-registry.com/nuxt-app:v1.0.1 -n nuxt-app

# Verificar rollout
kubectl rollout status deployment/nuxt-app -n nuxt-app

# Rollback se necessário
kubectl rollout undo deployment/nuxt-app -n nuxt-app
```

## Limpeza

```bash
# Remover todos os recursos
kubectl delete -f .

# Ou remover namespace (remove tudo dentro dele)
kubectl delete namespace nuxt-app
```

## Personalização

### Variáveis de Ambiente

Edite o arquivo `configmap.yaml` para adicionar suas variáveis de ambiente:

```yaml
data:
  NODE_ENV: "production"
  HOST: "0.0.0.0"
  PORT: "3000"
  API_URL: "https://api.example.com"
  DATABASE_URL: "postgresql://user:pass@db:5432/dbname"
```

### Recursos

Ajuste os recursos no `deployment.yaml` conforme necessário:

```yaml
resources:
  requests:
    memory: "512Mi"  # Aumentar se necessário
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Domínios

Atualize o `ingress.yaml` com seus domínios reais:

```yaml
rules:
- host: seu-dominio.com
  http:
    paths:
    - path: /
      pathType: Prefix
      backend:
        service:
          name: nuxt-app-service
          port:
            number: 80
```
