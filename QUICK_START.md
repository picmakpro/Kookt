# 🍳 Kookt - Démarrage Rapide avec GPT-4o

## ⚡ Configuration Terminée !

Votre application Kookt est maintenant configurée avec :
- ✅ **GPT-4o** comme modèle IA
- ✅ **Votre clé API OpenAI** intégrée
- ✅ **AsyncStorage** pour la persistance
- ✅ **Expo Sharing** pour le partage

## 🚀 Démarrage en 3 étapes

### 1. Installation des dépendances
```bash
npm install
```

### 2. Démarrage rapide
```bash
./start.sh
# ou
npx expo start
```

### 3. Tester sur votre appareil
- **iOS** : Appuyez sur `i` dans le terminal
- **Android** : Appuyez sur `a` dans le terminal
- **Web** : Appuyez sur `w` dans le terminal
- **Mobile** : Scannez le QR code avec Expo Go

## 🎯 Fonctionnalités à Tester

### 🤖 Test IA (GPT-4o)
1. Ouvrir l'app → Compléter l'onboarding
2. Appuyer sur "Générer une recette"
3. Ajouter des ingrédients (ex: "tomate", "mozzarella", "basilic")
4. Appuyer sur "Générer une recette"
5. **L'IA devrait créer une recette personnalisée !**

### 📱 Test Navigation
- ✅ **Onglet Accueil** : Voir les recettes récentes
- ✅ **Onglet Recettes** : Parcourir et rechercher
- ✅ **Onglet Courses** : Voir la liste générée
- ✅ **Onglet Profil** : Voir vos statistiques

### 🛒 Test Liste de Courses
1. Générer une recette
2. Ouvrir la recette → "Ajouter à la liste de courses"
3. Aller dans l'onglet "Courses"
4. Tester le partage WhatsApp/Notes

## 🔧 Configuration IA

Votre clé API est déjà configurée dans `app.json` :
```json
"extra": {
  "openaiApiKey": "sk-proj-o0xj...",
  "environment": "development"
}
```

## 📝 Modèle IA Utilisé

```typescript
// Service configuré pour GPT-4o
model: 'gpt-4o'           // Le plus récent d'OpenAI
temperature: 0.7          // Créativité équilibrée
max_tokens: 4000         // Réponses détaillées
response_format: 'json'  // Format structuré
```

## 🎨 Interface Utilisateur

L'app utilise le design system Kookt :
- **Couleur principale** : `#22c55e` (vert MrCook)
- **Navigation** : Expo Router avec onglets
- **Composants** : UI moderne et responsive
- **Animations** : Fluides et engageantes

## 🚨 En cas de problème

### Erreur "API Key not found"
```bash
# Vérifier la configuration
cat app.json | grep openaiApiKey
```

### Erreur de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install
```

### Erreur de build
```bash
# Nettoyer le cache Expo
npx expo start --clear
```

## 📊 Prochaines Étapes

Une fois l'app testée :

### Phase 2 - Améliorations
- [ ] Reconnaissance photo d'ingrédients
- [ ] Planificateur de repas hebdomadaire
- [ ] Mode hors ligne
- [ ] Synchronisation cloud

### Phase 3 - Fonctionnalités Avancées
- [ ] Communauté et partage
- [ ] Assistant vocal
- [ ] Intégrations tierces
- [ ] Monétisation

## 💡 Conseils de Test

### Ingrédients à tester
- **Basique** : "tomate, mozzarella, basilic"
- **Français** : "bœuf, carottes, pommes de terre"
- **Asiatique** : "poulet, soja, gingembre, riz"
- **Végétarien** : "quinoa, avocat, épinards"

### Contraintes à tester
- Régimes : Végétarien, Végan, Sans gluten
- Temps : 15min, 30min, 1h
- Budget : Économique, Moyen, Premium
- Équipement : Four, Micro-ondes, Robot

---

**🍳 Kookt est prêt ! Testez votre assistant culinaire IA !** ✨
