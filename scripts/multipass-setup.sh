#!/bin/bash
#
# Vesta Multipass Development Setup
# Creates an Ubuntu 24.04 VM and installs Vesta for testing
#

set -e

VM_NAME="vesta-dev"
MEMORY="2G"
DISK="20G"
UBUNTU_VERSION="24.04"

echo "🚀 Vesta Development VM Setup"
echo "=============================="

# Check if multipass is installed
if ! command -v multipass &> /dev/null; then
    echo "❌ Multipass not installed. Install with:"
    echo "   brew install --cask multipass"
    exit 1
fi

# Check if VM already exists
if multipass list | grep -q "$VM_NAME"; then
    echo "⚠️  VM '$VM_NAME' already exists."
    read -p "Delete and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        multipass delete "$VM_NAME" --purge
    else
        echo "Connecting to existing VM..."
        multipass shell "$VM_NAME"
        exit 0
    fi
fi

echo "📦 Creating Ubuntu $UBUNTU_VERSION VM..."
multipass launch "$UBUNTU_VERSION" \
    --name "$VM_NAME" \
    --memory "$MEMORY" \
    --disk "$DISK" \
    --cpus 2

echo "📂 Mounting Vesta source..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VESTA_DIR="$(dirname "$SCRIPT_DIR")"
multipass mount "$VESTA_DIR" "$VM_NAME":/opt/vesta-src

echo "🔧 Installing dependencies..."
multipass exec "$VM_NAME" -- bash -c '
    sudo apt-get update
    sudo apt-get install -y curl wget git
'

echo ""
echo "✅ VM Ready!"
echo ""
echo "Commands:"
echo "  multipass shell $VM_NAME     # Enter the VM"
echo "  multipass stop $VM_NAME      # Stop the VM"
echo "  multipass start $VM_NAME     # Start the VM"
echo "  multipass delete $VM_NAME    # Delete the VM"
echo ""
echo "Inside the VM, Vesta source is at: /opt/vesta-src"
echo ""
echo "To install Vesta (inside the VM):"
echo "  cd /opt/vesta-src/install"
echo "  sudo bash vst-install-ubuntu.sh --interactive no --email admin@test.local --password admin123"
echo ""

# Connect to VM
read -p "Connect to VM now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    multipass shell "$VM_NAME"
fi
