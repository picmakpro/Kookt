import { config } from '../../constants/config';
import { Recipe, RecipeGenerationRequest } from '../../types/recipe';
import { RECIPE_GENERATION_PROMPT } from '../../utils/ai-prompts';
import { validateRecipe } from '../../utils/validation';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
    completion_tokens: number;
    prompt_tokens: number;
  };
}

class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = config.ai.openaiApiKey;
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured');
    }
  }

  private async makeRequest(endpoint: string, data: any): Promise<OpenAIResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async generateRecipe(request: RecipeGenerationRequest): Promise<Recipe> {
    const prompt = RECIPE_GENERATION_PROMPT(request);
    
    const data = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un chef cuisinier expert français. Tu réponds UNIQUEMENT en JSON valide, sans texte additionnel.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: config.ai.maxTokens,
      temperature: config.ai.temperature,
      response_format: { type: 'json_object' }
    };

    try {
      const response = await this.makeRequest('/chat/completions', data);
      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Pas de contenu reçu de OpenAI');
      }

      // Parse le JSON
      let recipeData;
      try {
        recipeData = JSON.parse(content);
      } catch (parseError) {
        console.error('Erreur parsing JSON:', content);
        throw new Error('Réponse OpenAI invalide (JSON malformé)');
      }

      // Ajouter les métadonnées requises
      const now = new Date().toISOString();
      const completeRecipe = {
        ...recipeData,
        id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
        aiGenerated: true,
        author: 'Kookt IA',
        source: 'OpenAI GPT-4',
        rating: undefined,
        userNotes: '',
        isFavorite: false,
        cookCount: 0,
        totalTime: (recipeData.prepTime || 0) + (recipeData.cookTime || 0),
        // Générer des IDs pour les étapes
        steps: recipeData.steps?.map((step: any, index: number) => ({
          ...step,
          id: `step_${index + 1}`,
          isCompleted: false,
        })) || [],
      };

      // Valider le schéma
      return validateRecipe(completeRecipe);

    } catch (error) {
      console.error('Erreur génération recette OpenAI:', error);
      
      if (error instanceof Error) {
        throw new Error(`Échec génération recette: ${error.message}`);
      }
      
      throw new Error('Erreur inconnue lors de la génération de recette');
    }
  }

  async generateIngredientSuggestions(partialInput: string): Promise<string[]> {
    const prompt = `L'utilisateur tape "${partialInput}" pour ajouter un ingrédient.
    
Suggère 5 ingrédients français courants qui commencent par cette saisie.
Privilégie les ingrédients de saison et populaires.

Réponds UNIQUEMENT avec un tableau JSON de strings, sans texte additionnel.`;

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Tu réponds UNIQUEMENT en JSON valide.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    };

    try {
      const response = await this.makeRequest('/chat/completions', data);
      const content = response.choices[0]?.message?.content;

      if (!content) {
        return [];
      }

      const parsed = JSON.parse(content);
      return Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
      
    } catch (error) {
      console.error('Erreur suggestions ingrédients:', error);
      return [];
    }
  }

  async improveRecipe(recipe: Recipe, feedback: string): Promise<Recipe> {
    const prompt = `Améliore cette recette basée sur le retour utilisateur :

RECETTE ACTUELLE:
${JSON.stringify(recipe, null, 2)}

RETOUR UTILISATEUR:
${feedback}

Apporte des améliorations pertinentes en gardant l'essence de la recette.
Réponds avec la recette complète améliorée au format JSON.`;

    const data = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un chef expert. Tu réponds UNIQUEMENT en JSON valide.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: config.ai.maxTokens,
      temperature: 0.5,
      response_format: { type: 'json_object' }
    };

    try {
      const response = await this.makeRequest('/chat/completions', data);
      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Pas de contenu reçu');
      }

      const improvedRecipe = JSON.parse(content);
      
      // Conserver l'ID et mettre à jour la date
      const updatedRecipe = {
        ...improvedRecipe,
        id: recipe.id,
        createdAt: recipe.createdAt,
        updatedAt: new Date().toISOString(),
        aiGenerated: true,
      };

      return validateRecipe(updatedRecipe);

    } catch (error) {
      console.error('Erreur amélioration recette:', error);
      throw new Error('Échec de l\'amélioration de recette');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const openAIService = new OpenAIService();
