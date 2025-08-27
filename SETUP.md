# 🚀 KOOKT - Setup Local

## 📱 Configuration Locale

1. **Cloner le repository**
```bash
git clone https://github.com/picmakpro/Kookt.git
cd Kookt
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp env.example .env
```

Puis éditer `.env` avec vos vraies clés API :
```bash
OPENAI_API_KEY=sk-proj-votre-vraie-cle-openai
CLAUDE_API_KEY=votre_claude_key_here
APP_ENV=development
API_BASE_URL=https://api.kookt.com
```

4. **Lancer l'application**
```bash
npx expo start
```

## 🤖 Test avec votre clé OpenAI

Votre clé actuelle est déjà configurée dans votre `.env` local.

## ✅ Test GPT-4o

1. Complétez l'onboarding (3 étapes)
2. Ajoutez des ingrédients : "tomate, mozzarella, basilic"
3. Générez une recette → GPT-4o va créer une vraie recette !

## 🔒 Sécurité

- Le fichier `.env` est ignoré par Git (sécurisé)
- Les secrets ne sont jamais poussés sur GitHub
- Utilisez `env.example` comme template pour d'autres développeurs
