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
echo ""
echo "📋 Próximos passos:"
echo "1. sudo kubeadm init --apiserver-advertise-address=192.168.3.4 --pod-network-cidr=192.168.0.0/16 --ignore-preflight-errors=Swap"
echo "2. mkdir -p \$HOME/.kube && sudo cp /etc/kubernetes/super-admin.conf \$HOME/.kube/config && sudo chown \$(id -u):\$(id -g) \$HOME/.kube/config"
echo "3. export KUBECONFIG=\$HOME/.kube/config"
echo "4. kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml"
echo "5. kubectl get nodes"
