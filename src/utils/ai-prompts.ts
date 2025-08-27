import { RecipeGenerationRequest } from '../types/recipe';

export const RECIPE_GENERATION_PROMPT = (request: RecipeGenerationRequest): string => `
Tu es un chef cuisinier expert français spécialisé dans la cuisine créative et équilibrée. Tu vas générer une recette délicieuse et réalisable avec ces contraintes strictes :

## CONTRAINTES OBLIGATOIRES :
- INGRÉDIENTS DISPONIBLES: ${request.ingredients.join(', ')}
- CONTRAINTES ALIMENTAIRES: ${request.dietaryRestrictions.join(', ') || 'Aucune'}
- ALLERGIES À ÉVITER: ${request.allergens.join(', ') || 'Aucune'}
- TEMPS MAXIMUM: ${request.maxTime || 60} minutes
- NOMBRE DE PERSONNES: ${request.servings || 2}
- NIVEAU BUDGET: ${request.budgetLevel || 'moyen'}
- OBJECTIFS: ${request.goals?.join(', ') || 'savoureux et équilibré'}
- CUISINE PRÉFÉRÉE: ${request.cuisine || 'française ou internationale'}
- DIFFICULTÉ SOUHAITÉE: ${request.difficulty || 'moyen'}

## RÈGLES STRICTES :
1. Utilise PRIORITAIREMENT les ingrédients disponibles (au moins 70% de la recette)
2. Si un ingrédient manque, propose une SUBSTITUTION CLAIRE
3. Respecte ABSOLUMENT les contraintes alimentaires et allergies
4. Les étapes doivent être PRÉCISES et CHRONOMÉTRÉES
5. Fournis des ASTUCES DE CHEF pour réussir le plat
6. Calcule la NUTRITION approximative
7. Suggère des ACCOMPAGNEMENTS si pertinent

## FORMAT DE RÉPONSE REQUIS :
Retourne UNIQUEMENT un JSON valide suivant exactement ce schéma :

{
  "title": "Nom appétissant de la recette",
  "description": "Description courte et engageante (2-3 phrases)",
  "prepTime": nombre_minutes_preparation,
  "cookTime": nombre_minutes_cuisson,
  "totalTime": prep_time + cook_time,
  "servings": ${request.servings || 2},
  "difficulty": "facile|moyen|difficile",
  "cuisine": "type_de_cuisine",
  "ingredients": [
    {
      "name": "nom_ingredient",
      "quantity": nombre,
      "unit": "unité",
      "available": true_si_dans_ingredients_disponibles,
      "alternatives": ["substitution1", "substitution2"] // si available = false
    }
  ],
  "steps": [
    {
      "order": 1,
      "instruction": "Instruction détaillée et précise",
      "duration": minutes_optionnel,
      "temperature": temperature_optionnelle,
      "tips": "Astuce de chef optionnelle"
    }
  ],
  "nutrition": {
    "calories": calories_par_portion,
    "proteins": grammes_proteines,
    "carbs": grammes_glucides,
    "fats": grammes_lipides,
    "fiber": grammes_fibres
  },
  "tags": ["tag1", "tag2", "tag3"],
  "dietary": ["végétarien", "sans-gluten", etc.],
  "allergens": ["allergène1", "allergène2"],
  "estimatedCost": {
    "total": coût_total_euros,
    "perServing": coût_par_portion_euros
  },
  "substitutions": [
    {
      "originalIngredient": "ingrédient_manquant",
      "alternatives": ["alternative1", "alternative2"],
      "reason": "explication_substitution"
    }
  ]
}

## EXEMPLES DE QUALITÉ ATTENDUE :
- "Préchauffez le four à 180°C" plutôt que "chauffez le four"
- "Faites revenir 3 minutes jusqu'à transparence" plutôt que "faites cuire"
- "Assaisonnez avec une pincée de fleur de sel" plutôt que "salez"

GÉNÈRE UNE SEULE RECETTE EXCEPTIONNELLE qui respecte toutes ces contraintes.
`;

export const RECIPE_IMPROVEMENT_PROMPT = (originalRecipe: string, feedback: string): string => `
Tu es un chef expert. Améliore cette recette basée sur les retours utilisateur :

RECETTE ORIGINALE :
${originalRecipe}

RETOURS UTILISATEUR :
${feedback}

Apporte des améliorations pertinentes tout en gardant l'essence de la recette.
Retourne la recette améliorée au même format JSON.
`;

export const INGREDIENT_SUGGESTION_PROMPT = (partialInput: string): string => `
L'utilisateur tape "${partialInput}" pour ajouter un ingrédient.

Suggère 5 ingrédients pertinents qui commencent par cette saisie, en français.
Privilégie les ingrédients courants et de saison.

Format : ["ingrédient1", "ingrédient2", "ingrédient3", "ingrédient4", "ingrédient5"]
`;

export const SUBSTITUTION_PROMPT = (missingIngredient: string, recipe: string): string => `
Dans cette recette, l'ingrédient "${missingIngredient}" n'est pas disponible.

RECETTE : ${recipe}

Propose 3 substitutions viables avec :
1. Le nom de l'alternative
2. La quantité équivalente
3. L'impact sur le goût/texture

Format JSON :
{
  "substitutions": [
    {
      "alternative": "nom",
      "quantity": "quantité",
      "impact": "description impact",
      "confidence": 0.8
    }
  ]
}
`;

export const NUTRITION_CALCULATION_PROMPT = (ingredients: string[]): string => `
Calcule les valeurs nutritionnelles approximatives pour ces ingrédients :
${ingredients.join('\n')}

Retourne un JSON avec les totaux :
{
  "calories": nombre,
  "proteins": grammes,
  "carbs": grammes,
  "fats": grammes,
  "fiber": grammes,
  "sodium": milligrammes
}
`;

export const COOKING_TIPS_PROMPT = (recipe: string, difficulty: string): string => `
Pour cette recette de niveau "${difficulty}" :
${recipe}

Génère 3 conseils de chef expert pour garantir la réussite.

Format :
{
  "tips": [
    "Conseil 1 précis et actionnable",
    "Conseil 2 avec technique spécifique", 
    "Conseil 3 pour éviter un échec courant"
  ]
}
`;
