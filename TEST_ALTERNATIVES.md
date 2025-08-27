# 🔧 Solutions de Test pour Kookt

## ❌ **Problème "Could not connect to the server"**

### 🚀 **Solutions par Ordre de Priorité**

#### 1. **Test sur Simulateur iOS (Recommandé)**
```bash
npx expo start --ios
```
- ✅ Pas de problème de réseau
- ✅ Compatible SDK 53 
- ✅ Performance optimale

#### 2. **Test sur Émulateur Android**
```bash
npx expo start --android
```
- ✅ Alternative stable
- ✅ Compatible toutes versions

#### 3. **Test sur Navigateur Web**
```bash
npx expo start --web
```
- ✅ Debug facile
- ✅ Accès console développeur
- ⚠️ Certaines fonctionnalités native limitées

#### 4. **Tunnel Expo (Si problème réseau)**
```bash
npx expo start --tunnel
```
- ✅ Bypass problèmes réseau local
- ⚠️ Plus lent

### 🔧 **Résolution des Problèmes de Connexion**

#### Problème de Port
```bash
# Tuer tous les processus
pkill -f expo && pkill -f metro

# Redémarrer sur port différent
npx expo start --port 8082
```

#### Cache Corrompu
```bash
# Nettoyage complet
rm -rf node_modules/.cache
rm -rf .expo
npx expo start --clear --reset-cache
```

#### Problème Réseau Local
```bash
# Utiliser tunnel Expo
npx expo start --tunnel

# Ou forcer localhost
npx expo start --localhost
```

## 🎯 **Test Recommandé Maintenant**

### Option 1: iOS Simulator (MEILLEUR)
```bash
npx expo start --ios
```

### Option 2: Web Browser (RAPIDE) 
```bash
npx expo start --web
```

## 🧪 **Tests de l'IA GPT-4o**

Une fois l'app chargée sur **n'importe quelle plateforme** :

### 1. 🤖 **Test Basique**
- Ouvrir l'app → Onboarding
- Ajouter : "tomate, mozzarella, basilic"
- Générer recette → Vérifier GPT-4o

### 2. 📱 **Test Navigation**
- 4 onglets fonctionnels
- Recherche recettes
- Liste de courses

### 3. 🛒 **Test Partage**
- Génération de liste
- Export (simulé)

## ⚡ **Commandes Rapides**

```bash
# Test immédiat iOS
npx expo start --ios

# Test immédiat Web  
npx expo start --web

# Test avec tunnel si réseau
npx expo start --tunnel
```

---

**🍳 L'important : tester l'IA GPT-4o peu importe la plateforme !**
