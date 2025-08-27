#!/bin/bash

echo "🍳 Démarrage de Kookt - Cuisine IA"
echo "=================================="

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier si Expo CLI est installé
if ! command -v expo &> /dev/null; then
    echo "📱 Installation d'Expo CLI..."
    npm install -g @expo/cli
fi

echo "🚀 Démarrage du serveur de développement..."
echo ""
echo "Options disponibles :"
echo "- Appuyez sur 'i' pour iOS Simulator"
echo "- Appuyez sur 'a' pour Android Emulator"  
echo "- Appuyez sur 'w' pour Web Browser"
echo "- Scannez le QR code avec Expo Go sur votre téléphone"
echo ""

# Démarrer Expo
npx expo start
