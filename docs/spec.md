# KOOKT - Spécification Technique

## 🎯 Vision Produit

**KOOKT** est une application mobile de cuisine intelligente qui révolutionne la façon dont les utilisateurs cuisinent au quotidien. Inspirée par MrCook.app mais avec des innovations uniques, KOOKT combine intelligence artificielle, détection visuelle et anti-gaspillage pour créer une expérience culinaire personnalisée et responsable.

### Mission
Aider les utilisateurs à cuisiner intelligemment ce qu'ils possèdent, réduire le gaspillage alimentaire, et simplifier la planification des repas grâce à l'IA.

### Valeurs
- **Simplicité** : Interface intuitive et workflow naturel
- **Intelligence** : IA avancée pour des suggestions pertinentes  
- **Responsabilité** : Réduction active du gaspillage alimentaire
- **Personnalisation** : Adaptation aux goûts, régimes et contraintes

---

## 🏗️ Architecture Technique

### Stack Technologique

#### Frontend Mobile
```typescript
- Expo SDK 50+ (React Native)
- TypeScript (strict mode)
- expo-router (navigation file-based)
- Zustand (state management)
- @tanstack/react-query (async state)
- zod (validation schemas)
- react-hook-form (forms)
- expo-image-picker (photos)
- expo-camera (scanner)
```

#### Services & APIs
```typescript
- OpenAI GPT-4 / Anthropic Claude (génération recettes)
- Google Vision API / AWS Rekognition (computer vision)
- Supabase / Firebase (Backend-as-a-Service)
- Stripe (paiements premium)
- Sentry (monitoring)
```

#### Architecture des Dossiers
```
src/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Bottom tabs navigation
│   ├── onboarding/        # Onboarding flow
│   ├── recipe/            # Recipe details
│   └── _layout.tsx        # Root layout
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── forms/            # Composants de formulaires
│   └── recipe/           # Composants spécifiques aux recettes
├── services/             # Services externes
│   ├── ai/              # Services IA
│   ├── vision/          # Computer vision
│   └── storage/         # Persistance des données
├── stores/              # Zustand stores
├── types/               # Types TypeScript
├── utils/               # Utilitaires
├── constants/           # Constantes et configuration
└── hooks/              # Custom hooks
```

---

## 📱 User Experience & Wireframes

### Parcours Utilisateur Principal

#### 1. Onboarding (3 écrans)
```
Écran 1: Bienvenue 🎯
- Animation d'introduction
- Présentation de la valeur ajoutée
- CTA "Commencer"

Écran 2: Fonctionnalités 🤖  
- IA pour génération de recettes
- Détection visuelle du frigo
- Anti-gaspillage intelligent
- CTA "Découvrir"

Écran 3: Personnalisation 👤
- Sélection régimes alimentaires
- Allergies et exclusions
- Objectifs (budget, temps, nutrition)
- CTA "Cuisiner maintenant"
```

#### 2. Navigation Principale (Bottom Tabs)
```typescript
interface MainNavigation {
  home: "🏠 Accueil"           // Dashboard + actions rapides
  ingredients: "🥕 Ingrédients"  // Gestion du stock
  recipes: "📖 Recettes"      // Collection de recettes
  planner: "📅 Planning"      // Planificateur hebdomadaire  
  profile: "👤 Profil"       // Paramètres et premium
}
```

#### 3. Workflow de Génération de Recette
```
1. Accueil → "Créer une recette"
2. Choix de la méthode :
   - 📝 Saisie manuelle d'ingrédients
   - 📷 Photo du frigo/placard
   - 🎯 Objectif spécifique (reste, budget...)
3. Configuration (portions, temps, difficulté)
4. Génération IA → Recette personnalisée
5. Actions : Sauvegarder / Cuisiner / Modifier / Partager
```

---

## 🤖 Intégration Intelligence Artificielle

### Service de Génération de Recettes

#### Schéma de Requête IA
```typescript
interface RecipeGenerationRequest {
  ingredients: Ingredient[]           // Liste des ingrédients disponibles
  constraints: {
    dietary: DietaryType[]           // végé, végan, sans gluten, etc.
    allergies: string[]              // Allergies alimentaires
    exclusions: string[]             // Ingrédients à éviter
    maxTime: number                  // Temps max de préparation
    difficulty: 'facile' | 'moyen' | 'difficile'
    budget: 'économique' | 'moyen' | 'premium'
    portions: number                 // Nombre de portions
  }
  preferences: {
    cuisineTypes: string[]           // française, italienne, asiatique...
    objectives: ObjectiveType[]      // anti-gaspillage, protéines, etc.
    equipment: string[]              // Équipements disponibles
  }
}

interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  expiryDate?: string              // Pour prioriser anti-gaspillage
  category: IngredientCategory
}
```

#### Schéma de Réponse IA
```typescript
interface GeneratedRecipe {
  id: string
  title: string
  description: string
  prepTime: number                 // minutes
  cookTime: number                // minutes
  difficulty: 'facile' | 'moyen' | 'difficile'
  portions: number
  
  ingredients: RecipeIngredient[]
  instructions: RecipeStep[]
  
  nutrition: {
    calories: number
    proteins: number
    carbs: number
    fats: number
    fiber: number
  }
  
  metadata: {
    wasteReduction: number         // Score anti-gaspillage (0-100)
    estimatedCost: number          // Coût estimé
    matchScore: number             // Correspondance avec les ingrédients (0-100)
    tags: string[]                 // rapide, économique, healthy, etc.
  }
}
```

### Service de Computer Vision

#### Détection d'Ingrédients par Photo
```typescript
interface VisionDetectionRequest {
  imageBase64: string
  language: 'fr' | 'en'
  confidenceThreshold: number      // Seuil de confiance (0-1)
}

interface VisionDetectionResponse {
  detectedIngredients: DetectedIngredient[]
  processingTime: number
  confidence: number
}

interface DetectedIngredient {
  name: string
  confidence: number               // Niveau de confiance (0-1)
  category: IngredientCategory
  boundingBox?: {                  // Position dans l'image
    x: number
    y: number  
    width: number
    height: number
  }
  suggestedQuantity?: {
    amount: number
    unit: string
  }
}
```

---

## 💾 Modèles de Données

### Schéma Utilisateur
```typescript
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  
  preferences: UserPreferences
  subscription: SubscriptionTier
  
  createdAt: Date
  lastActiveAt: Date
}

interface UserPreferences {
  dietary: DietaryType[]           // régimes alimentaires
  allergies: string[]              // allergies
  exclusions: string[]             // ingrédients à éviter
  cuisineTypes: string[]           // types de cuisine préférés
  
  budget: {
    monthly: number                // Budget mensuel
    currency: string
  }
  
  household: {
    members: number                // Nombre de personnes
    cookingFrequency: 'daily' | 'weekly' | 'occasional'
  }
  
  objectives: ObjectiveType[]      // objectifs culinaires
  notifications: NotificationSettings
}
```

### Schéma Recette
```typescript
interface Recipe {
  id: string
  title: string
  description: string
  imageUrl?: string
  
  author: 'ai' | 'user' | 'community'
  authorId?: string
  
  timing: {
    prepTime: number               // minutes
    cookTime: number              // minutes
    totalTime: number
  }
  
  difficulty: 'facile' | 'moyen' | 'difficile'
  portions: number
  
  ingredients: RecipeIngredient[]
  instructions: RecipeStep[]
  
  nutrition?: NutritionInfo
  tags: string[]
  
  metadata: {
    wasteReduction: number         // Score anti-gaspillage
    estimatedCost: number
    popularity: number             // Nombre de likes/cuisinés
  }
  
  userInteractions: {
    isBookmarked: boolean
    rating?: number                // 1-5 étoiles
    cooked: boolean
    notes?: string
  }
  
  createdAt: Date
  updatedAt: Date
}

interface RecipeIngredient {
  ingredient: Ingredient
  quantity: number
  unit: string
  isOptional: boolean
  substitutes?: string[]           // Ingrédients de substitution
}

interface RecipeStep {
  stepNumber: number
  instruction: string
  duration?: number                // minutes pour cette étape
  temperature?: number             // température si nécessaire
  imageUrl?: string               // Photo de l'étape
}
```

### Schéma Planificateur
```typescript
interface WeeklyPlan {
  id: string
  userId: string
  weekStartDate: Date
  
  meals: PlannedMeal[]
  shoppingList: ShoppingList
  
  budget: {
    estimated: number
    actual?: number
  }
  
  preferences: {
    batchCooking: boolean          // Optimiser pour batch cooking
    maxCookingDays: number         // Max jours de cuisine/semaine
    preferredShoppingDay: number   // Jour préféré pour les courses (0-6)
  }
  
  createdAt: Date
}

interface PlannedMeal {
  id: string
  date: Date
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipe: Recipe
  portions: number
  
  status: 'planned' | 'cooked' | 'skipped'
  notes?: string
}

interface ShoppingList {
  id: string
  items: ShoppingItem[]
  generatedAt: Date
  
  organization: {
    byAisle: Record
    totalEstimatedCost: number
    totalItems: number
  }
  
  status: 'generated' | 'shopping' | 'completed'
  completedAt?: Date
}

interface ShoppingItem {
  ingredient: Ingredient
  quantity: number
  unit: string
  
  category: AisleCategory          // Rayon du magasin
  estimatedPrice: number
  
  isPurchased: boolean
  actualPrice?: number
  
  usedInRecipes: string[]          // IDs des recettes utilisant cet ingrédient
}
```

---

## 🔄 Fonctionnalités Détaillées

### 1. Gestion des Ingrédients

#### Ajout d'Ingrédients
- **Saisie manuelle** : Recherche + sélection dans base de données
- **Photo frigo** : Computer vision + confirmation utilisateur  
- **Scan code-barres** : Reconnaissance produits emballés
- **Import liste** : Copier-coller depuis autre app

#### Garde-manger Numérique (Pantry)
```typescript
interface PantryItem {
  ingredient: Ingredient
  quantity: number
  unit: string
  
  location: 'frigo' | 'congélateur' | 'placard' | 'autre'
  expiryDate?: Date
  purchaseDate?: Date
  
  status: 'fresh' | 'expires_soon' | 'expired'
  
  autoUpdate: boolean              // MAJ auto après utilisation en recette
}
```

### 2. Génération IA de Recettes

#### Modes de Génération
- **À partir du stock** : Utilise les ingrédients disponibles
- **Anti-gaspillage** : Priorise les ingrédients qui périment
- **Objectif spécifique** : Protéines, économique, rapide, etc.
- **Restes** : Transforme les restes en nouveau plat
- **Inspiration** : Génération libre selon préférences

#### Personnalisation Avancée
```typescript
interface RecipeCustomization {
  portions: number                 // Ajustement automatique des quantités
  difficulty: 'facile' | 'moyen' | 'difficile'
  maxTime: number                 // Temps maximum
  
  nutritionalGoals: {
    calories?: { min: number, max: number }
    proteins?: { min: number }     // grammes
    lowCarb?: boolean
    highFiber?: boolean
  }
  
  budgetConstraint: {
    maxCost: number
    currency: string
  }
  
  equipmentAvailable: string[]     // four, micro-ondes, robot, etc.
  cookingStyle: 'traditional' | 'modern' | 'fusion'
}
```

### 3. Smart Weekly Planner (Premium)

#### Algorithme de Planification
- **Analyse des préférences** utilisateur
- **Optimisation budget** hebdomadaire
- **Batch cooking** : regroupement des préparations
- **Équilibrage nutritionnel** automatique
- **Gestion des restes** et réutilisation

#### Interface de Planification
```typescript
interface WeeklyPlannerUI {
  calendar: {
    days: PlannerDay[]
    dragAndDrop: boolean           // Réorganiser les repas
    suggestions: RecipeSuggestion[] // Suggestions IA
  }
  
  budgetTracker: {
    weekly: number
    spent: number
    projected: number
    savings: number                // Économies anti-gaspillage
  }
  
  nutritionOverview: {
    calories: DailyNutritionGoal[]
    macros: MacroDistribution
    balance: 'good' | 'needs_adjustment'
  }
}
```

### 4. Liste de Courses Intelligente

#### Génération Automatique
- **Consolidation** : Évite les doublons entre recettes
- **Optimisation quantités** : Calcule les quantités exactes  
- **Groupement par rayons** : Organisation par sections magasin
- **Estimation prix** : Calcul du coût approximatif

#### Format d'Export
```typescript
interface ShoppingListExport {
  format: 'whatsapp' | 'notes' | 'email' | 'pdf'
  
  content: {
    header: string                 // "Liste de courses KOOKT - Semaine du..."
    sections: ShoppingSection[]
    footer: string                 // Coût total estimé
  }
  
  customization: {
    includeQuantities: boolean
    includePrices: boolean
    includeCheckboxes: boolean
    groupByAisle: boolean
  }
}
```

---

## 🚀 Roadmap de Développement

### Phase 1: MVP Core (Semaines 1-2)
**Objectif** : Application fonctionnelle avec génération IA basique

#### Fonctionnalités à Implémenter
- ✅ **Onboarding** (3 écrans + préférences)
- ✅ **Navigation principale** (bottom tabs)
- ✅ **Saisie manuelle d'ingrédients**
- ✅ **Génération IA de recettes** (service mock puis réel)
- ✅ **Détail de recette** (ingrédients + étapes)
- ✅ **Sauvegarde de recettes**
- ✅ **Export liste de courses** (WhatsApp/Notes)

#### Services à Développer
```typescript
// Service IA Mock pour développement
class MockAIService {
  async generateRecipe(request: RecipeGenerationRequest): Promise
  async detectIngredients(imageBase64: string): Promise
}

// Service IA Production
class ProductionAIService {
  private openAI: OpenAI
  private visionAPI: VisionAPI
  
  async generateRecipe(request: RecipeGenerationRequest): Promise
  async detectIngredients(imageBase64: string): Promise
}
```

### Phase 2: Computer Vision & IA Avancée (Semaines 3-4)  
**Objectif** : Détection visuelle et personnalisation avancée

#### Nouvelles Fonctionnalités
- 📷 **Photo du frigo** avec détection automatique
- 🔍 **Confirmation des ingrédients** détectés
- 🎯 **Objectifs culinaires** (santé, budget, temps)
- 🔄 **Système de substitutions** intelligentes
- 💡 **Suggestions proactives** basées sur le stock

### Phase 3: Planificateur Intelligent (Semaines 5-6)
**Objectif** : Planning hebdomadaire et optimisation

#### Fonctionnalités Premium
- 📅 **Smart Weekly Planner**
- 🛒 **Génération automatique listes de courses**
- 🍱 **Mode Batch Cooking** (optimisation préparations)
- 💰 **Gestion budget alimentaire** intégrée
- 📊 **Analytics nutrition** et coûts

### Phase 4: Écosystème Complet (Semaines 7-8)
**Objectif** : Monétisation et fonctionnalités sociales

#### Finalisation
- 🔒 **Système freemium/premium**
- 🏆 **Gamification anti-gaspillage**
- 📈 **Analytics et métriques** utilisateur
- 🔄 **Partage et découverte** de recettes
- 🌍 **Communauté** et évaluations

---

## 💰 Stratégie de Monétisation

### Modèle Freemium

#### Version Gratuite 🆓
- ✅ 3 générations IA par semaine
- ✅ Saisie manuelle d'ingrédients illimitée
- ✅ Collection de recettes (max 50)
- ✅ Export basique liste de courses
- ✅ Recettes de base sans personnalisation avancée

#### Version Premium 💎 (9,99€/mois ou 79,99€/an)
- ✅ **Générations IA illimitées**
- ✅ **Computer vision** (photo frigo/placard)
- ✅ **Smart Weekly Planner**
- ✅ **Batch cooking optimisé**
- ✅ **Analyses nutritionnelles** détaillées
- ✅ **Gestion budget** alimentaire
- ✅ **Substitutions automatiques**
- ✅ **Export avancé** (PDF, partage)
- ✅ **Support prioritaire**

### Pricing tiers Additionnels

#### Version Famille 👨‍👩‍👧‍👦 (14,99€/mois)
- ✅ Toutes les fonctionnalités Premium
- ✅ **Multi-profils** (jusqu'à 6 membres)
- ✅ **Préférences individuelles** par membre
- ✅ **Planification collaborative**
- ✅ **Notifications intelligentes** family-friendly

---

## 🔧 Configuration Technique

### Variables d'Environnement
```bash
# IA Services
OPENAI_API_KEY=your_openai_key
GOOGLE_VISION_API_KEY=your_vision_key

# Backend
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Paiements
STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Analytics
SENTRY_DSN=your_sentry_dsn

# Features Flags
ENABLE_COMPUTER_VISION=true
ENABLE_PREMIUM_FEATURES=true
```

### Configuration Expo
```json
{
  "expo": {
    "name": "KOOKT",
    "slug": "kookt-app",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1D4ED8"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "bundleIdentifier": "com.kookt.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.kookt.app",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "plugins": [
      "expo-router",
      "expo-camera",
      "expo-image-picker"
    ]
  }
}
```

### Dépendances Principales
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "~3.4.0",
    "react-native": "0.73.0",
    
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    
    "expo-image-picker": "~14.7.0",
    "expo-camera": "~14.1.0",
    "expo-linear-gradient": "~12.7.0",
    
    "@expo/vector-icons": "^13.0.0",
    "react-native-reanimated": "~3.6.0",
    "react-native-gesture-handler": "~2.14.0"
  }
}
```

---

## 🚦 Critères de Succès

### Métriques MVP (Phase 1)
- ✅ **Temps de génération** < 10 secondes
- ✅ **Taux de satisfaction** > 80% sur recettes générées
- ✅ **Rétention J7** > 40%
- ✅ **Crash rate** < 2%

### Métriques de Croissance (Phase 2-3)
- 📈 **MAU** (Monthly Active Users) > 1,000
- 📈 **Conversion freemium → premium** > 5%
- 📈 **Recettes générées/utilisateur/mois** > 15
- 📈 **Réduction gaspillage déclarée** > 25%

### Métriques Business (Phase 4)
- 💰 **ARPU** (Average Revenue Per User) > 3€/mois
- 💰 **LTV/CAC** ratio > 3:1
- 💰 **Churn rate mensuel** < 10%
- 💰 **NPS Score** > 50

---

## 🔒 Sécurité & Conformité

### Gestion des Données Personnelles (RGPD)
- ✅ **Consentement explicite** pour traitement des données
- ✅ **Droit à l'oubli** (suppression compte + données)
- ✅ **Portabilité des données** (export JSON)
- ✅ **Minimisation des données** collectées
- ✅ **Chiffrement** des données sensibles

### Sécurité API
```typescript
interface APISecurityConfig {
  authentication: 'JWT' | 'OAuth2'
  rateLimiting: {
    requests: number              // Requêtes par minute
    window: number               // Fenêtre temporelle
  }
  
  imageUpload: {
    maxSize: number              // Taille max en MB
    allowedFormats: string[]     // jpg, png, webp
    virusScanning: boolean
  }
  
  dataEncryption: {
    atRest: boolean             // Chiffrement base de données
    inTransit: boolean          // HTTPS/TLS
    personalData: boolean       // Chiffrement données perso
  }
}
```

---

## 📚 Documentation Développeur

### Standards de Code
- ✅ **TypeScript strict mode** obligatoire
- ✅ **ESLint + Prettier** configuration
- ✅ **Tests unitaires** (Jest) > 80% couverture
- ✅ **Tests E2E** (Detox) pour parcours critiques
- ✅ **Documentation JSDoc** pour fonctions publiques

### Git Workflow
```bash
main                    # Production release
├── develop            # Integration branch
├── feature/xxx        # Feature branches
├── bugfix/xxx         # Bug fix branches  
└── release/x.x.x      # Release branches
```

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    - Lint & Type check
    - Unit tests
    - E2E tests (staging)
  
  build:
    - Build iOS & Android
    - Upload to TestFlight/Play Console (internal)
  
  deploy:
    - Production deploy (on main merge)
    - Sentry release tracking
```

---

Cette spécification constitue la base technique complète pour développer KOOKT. Elle doit être mise à jour régulièrement selon l'évolution du projet et les retours utilisateurs.