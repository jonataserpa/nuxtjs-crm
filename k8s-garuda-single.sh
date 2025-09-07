#!/usr/bin/env bash
set -euo pipefail

# ===========================
# Configuráveis (edite se quiser)
# ===========================
POD_CIDR="${POD_CIDR:-192.168.0.0/16}"
USE_METALLB="${USE_METALLB:-1}"        # 1 = instala MetalLB para suportar Service: LoadBalancer
METALLB_IP_RANGE="${METALLB_IP_RANGE:-}" # Ex.: "10.0.0.240-10.0.0.250" (se vazio, detecta /24 e usa .240-.250)

# ===========================
# Funções utilitárias
# ===========================
have() { command -v "$1" >/dev/null 2>&1; }
log()  { echo -e "\033[1;32m[INFO]\033[0m $*"; }
warn() { echo -e "\033[1;33m[WARN]\033[0m $*"; }
die()  { echo -e "\033[1;31m[ERRO]\033[0m $*"; exit 1; }

detect_if_ip() {
  # Descobre a interface e IP principal de saída
  local ip
  ip=$(ip -4 route get 1.1.1.1 2>/dev/null | awk '/src/ {print $7; exit}')
  echo "${ip}"
}

calc_default_pool() {
  # Constrói um range .240-.250 no /24 do IP local
  local ip="$1"
  local base
  base="$(echo "$ip" | awk -F. '{print $1"."$2"."$3}')"
  echo "${base}.240-${base}.250"
}

open_firewall_ports() {
  # Tenta configurar firewalld/nftables/ufw se presentes
  if have firewall-cmd; then
    log "Configurando firewalld (se ativo) para portas do control-plane e worker…"
    sudo firewall-cmd --permanent --add-port=6443/tcp || true
    sudo firewall-cmd --permanent --add-port=2379-2380/tcp || true
    sudo firewall-cmd --permanent --add-port=10250/tcp || true
    sudo firewall-cmd --permanent --add-port=10259/tcp || true
    sudo firewall-cmd --permanent --add-port=10257/tcp || true
    sudo firewall-cmd --permanent --add-port=10256/tcp || true
    sudo firewall-cmd --permanent --add-port=30000-32767/tcp || true
    sudo firewall-cmd --reload || true
  elif have ufw; then
    log "Configurando ufw para portas do Kubernetes…"
    sudo ufw allow 6443/tcp || true
    sudo ufw allow 2379:2380/tcp || true
    sudo ufw allow 10250/tcp || true
    sudo ufw allow 10259/tcp || true
    sudo ufw allow 10257/tcp || true
    sudo ufw allow 10256/tcp || true
    sudo ufw allow 30000:32767/tcp || true
  else
    warn "Nenhum firewall gerenciado detectado (firewalld/ufw). Se você usa nftables/iptables custom, libere as portas manualmente."
  fi
}

# ===========================
# Pré-checagens
# ===========================
[ "$(id -u)" -eq 0 ] || die "Execute como root ou com sudo: sudo $0"
have pacman || die "Este script é para Garuda/Arch (pacman)."

log "Atualizando sistema e instalando dependências…"
# Pacotes úteis ao Kubernetes conforme docs: conntrack, socat, ethtool etc.
pacman -Sy --noconfirm
pacman -S --noconfirm --needed \
  containerd iproute2 conntrack-tools ethtool socat ebtables iptables-nft \
  kubectl kubeadm kubelet cni-plugins curl

# ===========================
# Kernel modules e sysctl
# ===========================
log "Habilitando módulos de kernel overlay e br_netfilter…"
cat >/etc/modules-load.d/containerd.conf <<'EOF'
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

log "Aplicando parâmetros sysctl para Kubernetes…"
cat >/etc/sysctl.d/99-kubernetes-cri.conf <<'EOF'
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
sysctl --system

# ===========================
# Desativar SWAP (requisito kubelet)
# ===========================
if swapon --show | grep -q .; then
  warn "Desativando SWAP (requisito do kubelet)…"
  swapoff -a
  # comenta entradas de swap no fstab
  sed -ri 's/^\s*([^#].*\s+swap\s+)/# \1/' /etc/fstab || true
fi

# ===========================
# Configurar containerd
# ===========================
log "Configurando containerd (SystemdCgroup=true e pause:3.10)…"
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# SystemdCgroup = true
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
# pause image atual
sed -i 's|sandbox_image = ".*"|sandbox_image = "registry.k8s.io/pause:3.10"|' /etc/containerd/config.toml

systemctl enable --now containerd

# ===========================
# Habilitar kubelet (inicia depois do kubeadm init)
# ===========================
systemctl enable kubelet

# ===========================
# Firewall
# ===========================
open_firewall_ports

# ===========================
# kubeadm init
# ===========================
log "Detectando IP principal…"
API_IP="$(detect_if_ip)"
[ -n "${API_IP}" ] || die "Não foi possível detectar o IP principal. Defina API_IP no ambiente e reexecute."

log "Inicializando cluster com kubeadm (API: ${API_IP}, POD_CIDR: ${POD_CIDR})…"
# Se já inicializado, pula
if [ ! -f /etc/kubernetes/admin.conf ]; then
  kubeadm init \
    --apiserver-advertise-address="${API_IP}" \
    --apiserver-cert-extra-sans="${API_IP}" \
    --pod-network-cidr="${POD_CIDR}"
else
  warn "Cluster já parece inicializado (/etc/kubernetes/admin.conf existe). Pulando kubeadm init."
fi

# ===========================
# kubectl para o usuário atual (root aqui)
# ===========================
export KUBECONFIG=/etc/kubernetes/admin.conf
mkdir -p "$HOME/.kube"
cp -i /etc/kubernetes/admin.conf "$HOME/.kube/config"
chown "$(id -u)":"$(id -g)" "$HOME/.kube/config"

# Configurar kubeconfig para root também (evita problemas de certificado)
log "Configurando kubeconfig para root…"
mkdir -p /root/.kube
cp /etc/kubernetes/admin.conf /root/.kube/config

# Permitir agendar pods no control-plane (nó único)
kubectl taint nodes --all node-role.kubernetes.io/control-plane- || true
kubectl taint nodes --all node-role.kubernetes.io/master- || true

# ===========================
# CNI Flannel
# ===========================
log "Limpando CNIs anteriores (se existirem)…"
# Remove Calico se existir
kubectl delete -f https://raw.githubusercontent.com/projectcalico/calico/v3.29.0/manifests/calico.yaml 2>/dev/null || true
kubectl delete -f https://raw.githubusercontent.com/projectcalico/calico/v3.29.0/manifests/tigera-operator.yaml 2>/dev/null || true
# Remove Flannel antigo se existir
kubectl delete -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml 2>/dev/null || true

# Limpa arquivos CNI no host
rm -rf /etc/cni/net.d/* /var/lib/cni/networks/* /run/flannel /var/run/calico /var/lib/calico 2>/dev/null || true

# Reinicia kubelet para limpar estado anterior
log "Reiniciando kubelet para limpar estado anterior…"
systemctl restart kubelet
sleep 5

log "Instalando CNI Flannel…"
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml

# Configurar Flannel para usar a rede correta
log "Configurando Flannel para rede ${POD_CIDR}…"
kubectl patch configmap kube-flannel-cfg -n kube-flannel --patch "{\"data\":{\"net-conf.json\":\"{\\n  \\\"Network\\\": \\\"${POD_CIDR}\\\",\\n  \\\"EnableNFTables\\\": false,\\n  \\\"Backend\\\": {\\n    \\\"Type\\\": \\\"vxlan\\\"\\n  }\\n}\\n\"}}"

# Reiniciar Flannel para aplicar nova configuração
kubectl rollout restart daemonset kube-flannel-ds -n kube-flannel

log "Aguardando Flannel ficar Ready (isso pode levar alguns minutos)…"
# espera até 10 min (120 x 5s)
for i in $(seq 1 120); do
  READY=$(kubectl get nodes -o jsonpath='{range .items[*]}{.status.conditions[?(@.type=="Ready")].status}{"\n"}{end}' | grep True || true)
  if [ -n "$READY" ]; then break; fi
  sleep 5
done
kubectl get nodes -o wide

# ===========================
# (Opcional) MetalLB para Service: LoadBalancer
# ===========================
if [ "${USE_METALLB}" = "1" ]; then
  log "Instalando MetalLB para suportar Service: LoadBalancer em bare-metal…"
  kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.8/config/manifests/metallb-native.yaml

  # Espera controlador subir rapidamente
  sleep 10

  if [ -z "${METALLB_IP_RANGE}" ]; then
    METALLB_IP_RANGE="$(calc_default_pool "${API_IP}")"
    warn "METALLB_IP_RANGE não definido; usando intervalo detectado: ${METALLB_IP_RANGE}"
  fi

  cat <<EOF | kubectl apply -f -
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default-pool
  namespace: metallb-system
spec:
  addresses:
  - ${METALLB_IP_RANGE}
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default-l2
  namespace: metallb-system
spec: {}
EOF
fi

# ===========================
# App de teste: Nginx + Service
# ===========================
log "Aplicando deployment e service do Nginx…"
cat <<'EOF' | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
EOF

log "Resumo:"
kubectl get nodes -o wide
kubectl get pods -A -o wide
kubectl get svc nginx

log "Se o tipo LoadBalancer não receber EXTERNAL-IP e você não instalou MetalLB, defina USE_METALLB=1 e reexecute o script."
log "Pronto! kubeconfig: $HOME/.kube/config"
