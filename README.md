# Kookt - Cuisine IA 🍳

## 📱 MVP d'Application de Cuisine avec Intelligence Artificielle

Kookt est une application mobile innovante qui transforme vos ingrédients en recettes personnalisées grâce à l'intelligence artificielle. Inspirée de MrCook.app, elle offre une expérience culinaire sur mesure.

## 🎯 Fonctionnalités Principales

### ✨ Génération IA de Recettes
- **Recettes personnalisées** à partir de vos ingrédients disponibles
- **Adaptation automatique** aux régimes alimentaires et allergies
- **Prompts IA optimisés** pour des résultats de qualité

### 👤 Onboarding Intelligent
- **Configuration des préférences** alimentaires
- **Sélection du niveau** de cuisine
- **Définition des contraintes** (temps, budget, équipement)

### 🛒 Liste de Courses Automatique
- **Génération automatique** depuis les recettes
- **Groupement par rayons** de magasin
- **Export WhatsApp/Notes** natif
- **Cases à cocher** et suivi des achats

### 🍽️ Gestion des Recettes
- **Affichage détaillé** avec étapes chronométrées
- **Mode cuisine** interactif
- **Système de favoris** et notation
- **Partage social** des recettes

## 🛠️ Stack Technique

### Frontend
- **React Native** avec Expo 50
- **Expo Router** pour la navigation
- **TypeScript** strict
- **Zustand** pour la gestion d'état
- **React Query** pour le cache
- **Zod** pour la validation

### Services
- **OpenAI GPT-4** pour la génération de recettes
- **Stockage local** sécurisé
- **API REST** intégrée

### Design System
- **Couleurs** inspirées de MrCook
- **Composants** UI réutilisables
- **Animations** fluides
- **Design responsive**

## 🚀 Installation et Démarrage

### Prérequis
```bash
node >= 18.0.0
npm >= 9.0.0
expo-cli (global)
```

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd Kookt

# Installer les dépendances
npm install

# Installer Expo CLI (si pas déjà fait)
npm install -g @expo/cli
```

### Configuration
```bash
# Copier le fichier d'environnement
cp env.example .env

# Ajouter votre clé API OpenAI dans .env
OPENAI_API_KEY=your_openai_key_here
```

### Démarrage
```bash
# Démarrer le serveur de développement
npm start

# ou directement
expo start

# Pour iOS
npm run ios

# Pour Android
npm run android

# Pour Web
npm run web
```

## 📁 Architecture du Projet

```
src/
├── app/                      # Écrans Expo Router
│   ├── (tabs)/              # Navigation par onglets
│   ├── onboarding/          # Onboarding 3 étapes
│   ├── ingredients/         # Ajout d'ingrédients
│   ├── recipes/             # Détail des recettes
│   └── shopping/            # Liste de courses
├── components/               # Composants réutilisables
│   ├── ui/                  # Composants UI de base
│   ├── recipe/              # Composants recettes
│   └── forms/               # Formulaires
├── services/                # Services externes
│   ├── ai/                  # Service IA OpenAI
│   └── storage/             # Stockage local
├── stores/                  # Stores Zustand
│   ├── userStore.ts         # État utilisateur
│   ├── recipeStore.ts       # État recettes
│   ├── ingredientStore.ts   # État ingrédients
│   └── shoppingStore.ts     # État courses
├── types/                   # Types TypeScript
├── utils/                   # Utilitaires
└── constants/               # Constantes (colors, typography)
```

## 🎨 Design System

### Couleurs
```typescript
primary: '#22c55e'    // Vert principal MrCook
secondary: '#64748b'  // Gris équilibré
accent: {
  orange: '#f97316',
  blue: '#3b82f6',
  red: '#ef4444'
}
```

### Composants UI
- **Button** : Variants (primary, outline, ghost)
- **Input** : Avec validation et états
- **Badge** : Pour tags et statuts
- **LoadingSpinner** : Avec variante IA
- **RecipeCard** : Affichage recettes
- **IngredientInput** : Saisie intelligente

## 🤖 Intelligence Artificielle

### Prompts Optimisés
```typescript
// Génération de recettes avec contraintes strictes
const RECIPE_GENERATION_PROMPT = `
Tu es un chef cuisinier expert français.
INGRÉDIENTS DISPONIBLES: {ingredients}
CONTRAINTES ALIMENTAIRES: {dietary_restrictions}
ALLERGIES À ÉVITER: {allergens}
TEMPS MAXIMUM: {max_time} minutes
...
`;
```

### Fonctionnalités IA
- **Génération de recettes** personnalisées
- **Suggestions d'ingrédients** intelligentes
- **Adaptations automatiques** aux contraintes
- **Amélioration continue** des recettes

## 📱 Écrans Principaux

### 1. Onboarding (3 étapes)
- Présentation des fonctionnalités
- Configuration des préférences
- Sélection du profil culinaire

### 2. Accueil
- Recettes récentes
- Actions rapides
- Bouton principal de génération

### 3. Ajout d'Ingrédients
- Saisie avec autocomplétion IA
- Suggestions intelligentes
- Gestion des quantités

### 4. Détail Recette
- Affichage complet avec étapes
- Mode cuisine interactif
- Actions (favoris, partage, courses)

### 5. Liste de Courses
- Organisation par catégories
- Export multi-formats
- Suivi des achats

## 🔧 Configuration Avancée

### Variables d'Environnement
```bash
OPENAI_API_KEY=sk-...           # Clé API OpenAI
CLAUDE_API_KEY=claude-...       # Clé API Claude (optionnel)
APP_ENV=development             # Environnement
API_BASE_URL=https://api.kookt.com  # URL API (futur)
```

### Customisation
- **Couleurs** : `src/constants/colors.ts`
- **Typographie** : `src/constants/typography.ts`
- **Configuration** : `src/constants/config.ts`
- **Prompts IA** : `src/utils/ai-prompts.ts`

## 🧪 Tests et Qualité

### Scripts Disponibles
```bash
npm run lint          # Vérification TypeScript
npm run type-check    # Vérification des types
npm run test          # Tests unitaires (à implémenter)
```

### Standards de Code
- **TypeScript strict** activé
- **Validation Zod** pour les données
- **Architecture modulaire** et extensible
- **Patterns React** recommandés

## 📦 Déploiement

### Build de Production
```bash
# Build pour iOS
expo build:ios

# Build pour Android  
expo build:android

# Build Web
expo build:web
```

### Distribution
- **App Store** (iOS)
- **Google Play** (Android)
- **Expo Application Services** (EAS)

## 🛣️ Roadmap

### Phase 2 (prochaine)
- [ ] Reconnaissance photo d'ingrédients
- [ ] Planificateur de repas hebdomadaire
- [ ] Intégration Claude AI
- [ ] Mode hors ligne

### Phase 3 (future)
- [ ] Communauté et partage
- [ ] Intégration courses en ligne
- [ ] Assistant vocal
- [ ] Nutritioniste virtuel

## 🤝 Contribution

### Développement Local
1. Fork le repository
2. Créer une branche feature
3. Implémenter les changements
4. Ajouter les tests
5. Créer une Pull Request

### Guidelines
- Respecter l'architecture existante
- Typer strictement en TypeScript
- Documenter les nouvelles fonctionnalités
- Tester sur iOS et Android

## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **MrCook.app** pour l'inspiration design
- **OpenAI** pour l'API GPT-4
- **Expo Team** pour les outils de développement
- **Communauté React Native** pour les ressources

---

**Kookt** - Transformez vos ingrédients en délices avec l'IA ! 🍳✨
