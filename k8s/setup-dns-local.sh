#!/bin/bash

echo "🌐 Configurando DNS local para nuxt-app.com e nuxt-app.local..."

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Este script precisa ser executado como root (sudo)"
    exit 1
fi

# Backup do arquivo hosts
echo "📋 Fazendo backup do /etc/hosts..."
cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d_%H%M%S)

# Adicionar entradas DNS
echo "➕ Adicionando entradas DNS..."
echo "" >> /etc/hosts
echo "# Kubernetes Ingress - Nuxt App" >> /etc/hosts
echo "192.168.3.4    nuxt-app.local" >> /etc/hosts
echo "192.168.3.4    nuxt-app.com" >> /etc/hosts

echo "✅ DNS local configurado com sucesso!"
echo ""
echo "📋 Entradas adicionadas:"
echo "   192.168.3.4    nuxt-app.local"
echo "   192.168.3.4    nuxt-app.com"
echo ""
echo "🔍 Para testar:"
echo "   curl http://nuxt-app.local"
echo "   curl http://nuxt-app.com"
echo ""
echo "🗑️  Para remover as entradas:"
echo "   sudo sed -i '/# Kubernetes Ingress - Nuxt App/,+2d' /etc/hosts"
