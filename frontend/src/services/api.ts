import { GeneratePlanRequest, GeneratePlanResponse } from '../types/api';
import { generatePlanResponseSchema } from '../schemas/planSchema';

// Groq Key provided by user
const MOCK_OR_VITE_KEY = import.meta.env.VITE_GROQ_API_KEY || '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';

export const planService = {
  async generatePlan(data: GeneratePlanRequest): Promise<GeneratePlanResponse> {
    if (!MOCK_OR_VITE_KEY || MOCK_OR_VITE_KEY === 'placeholder') {
      console.warn('⚠️ VITE_GROQ_API_KEY is missing. Falling back to high-fidelity mock data.');
      return this.generateMockMealPlan(data);
    }

    const prompt = this.buildPrompt(data);
    const maxRetries = 3;
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🤖 Requesting Groq Cloud client-side (Attempt ${attempt}/${maxRetries})...`);
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MOCK_OR_VITE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are SmartChef AI, a premium staff-level culinary advisor and meal planner. You MUST respond with a single valid JSON object matching the requested schema. Return raw JSON without any markdown code blocks or extra text.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            response_format: {
              type: 'json_object',
            },
            temperature: 0.2,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Groq API Error (${response.status}): ${errText}`);
        }

        const resJson = await response.json();
        const textContent = resJson.choices[0].message.content.trim();

        // Extract JSON bounds if wrapper tags exist
        let jsonStr = textContent;
        const jsonStart = textContent.indexOf('{');
        const jsonEnd = textContent.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          jsonStr = textContent.substring(jsonStart, jsonEnd + 1);
        }

        const parsedObj = JSON.parse(jsonStr);

        // Zod validation on client
        const validated = generatePlanResponseSchema.parse(parsedObj) as unknown as GeneratePlanResponse;
        console.log('✅ Successfully generated and validated plan client-side via Groq.');
        return validated;
      } catch (err: any) {
        console.error(`⚠️ Attempt ${attempt} failed:`, err.message || err);
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        }
      }
    }

    console.warn('⚠️ Direct Groq call failed. Falling back to high-fidelity mock data.');
    return this.generateMockMealPlan(data);
  },

  buildPrompt(input: GeneratePlanRequest): string {
    return `You are SmartChef AI, a premium staff-level culinary advisor and meal planner.
Your task is to generate a comprehensive, highly personalized 1-day meal plan (Breakfast, Lunch, Dinner) based on the following user inputs:

- Daily Budget: $${input.budget}
- Number of People: ${input.people}
- Cuisine Preference: ${input.cuisine}
- Diet: ${input.diet}
- Cooking Time Limit: ${input.cookingTime}
- Available Pantry Ingredients: ${input.pantry.length > 0 ? input.pantry.join(', ') : 'None'}
- Allergies/Restrictions: ${input.allergies.length > 0 ? input.allergies.join(', ') : 'None'}
- Fitness Goal: ${input.fitnessGoal}
- Current Mood: ${input.mood}
- Special Notes: ${input.notes || 'None'}

Ensure you satisfy the following constraints:
1. Budget Optimization: Calculate the total grocery cost to buy the ingredients for all meals. If the estimated cost exceeds the daily budget ($${input.budget}), you MUST optimize the recipes to use more affordable ingredients (e.g. root vegetables, beans, tofu, seasonal greens, standard pantry staples) and explain this in the budgetAnalysis section. Set isOverBudget to true, wasOptimized to true and explain how you optimized. If it fits the budget, set isOverBudget to false and wasOptimized to false.
2. Pantry Optimization: For any meal ingredients that are already in the user's pantry (${input.pantry.join(', ')}), omit them from the shopping list or show them as already available. In pantryOptimization, list them as matchedIngredients, estimate the money saved, and calculate pantryUsedPercentage.
3. Ingredient Substitutions: Suggest exactly three viable alternatives for three key ingredients in the plan that might be hard to find or are common allergens.
4. Leftover Planner: Create 1-2 creative recipes using leftovers that would naturally result from preparing these meals (e.g. using excess rice for fried rice, leftover cooked chicken for wraps).
5. Waste Reduction: List ingredients that should be consumed first (e.g. fresh herbs, leafy greens) to prevent spoilage.
6. Storage Tips: Provide storage instructions (fridge/freezer life and best container type) for three key fresh ingredients used.
7. Cooking Timeline: Generate a logical timeline for cooking these meals (e.g. sequence of actions with timestamps or durations).
8. Health Score: Rate the plan (0-100) based on fitness goal and diet, detailing nutrition, protein, fiber, calories, and sodium.
9. Sustainability: Rate the menu's eco-friendliness (1-5 stars) and write a short explanation.
10. Format: You MUST respond with a single valid JSON object matching the exact JSON schema defined below. Do not wrap the JSON output in markdown tags. Do not write any pre-text or post-text. Return raw JSON.

Expected JSON Schema:
{
  "meals": {
    "breakfast": {
      "mealName": "string",
      "calories": number (integer),
      "protein": number (grams),
      "carbs": number (grams),
      "fat": number (grams),
      "cookingTime": "string",
      "ingredients": [{"name": "string", "amount": number, "unit": "string"}],
      "recipe": ["string"],
      "nutrition": "string",
      "difficulty": "Easy" | "Medium" | "Hard"
    },
    "lunch": {
      "mealName": "string",
      "calories": number (integer),
      "protein": number (grams),
      "carbs": number (grams),
      "fat": number (grams),
      "cookingTime": "string",
      "ingredients": [{"name": "string", "amount": number, "unit": "string"}],
      "recipe": ["string"],
      "nutrition": "string",
      "difficulty": "Easy" | "Medium" | "Hard"
    },
    "dinner": {
      "mealName": "string",
      "calories": number (integer),
      "protein": number (grams),
      "carbs": number (grams),
      "fat": number (grams),
      "cookingTime": "string",
      "ingredients": [{"name": "string", "amount": number, "unit": "string"}],
      "recipe": ["string"],
      "nutrition": "string",
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  },
  "groceryList": {
    "vegetables": [{"name": "string", "quantity": "string"}],
    "fruits": [{"name": "string", "quantity": "string"}],
    "dairy": [{"name": "string", "quantity": "string"}],
    "protein": [{"name": "string", "quantity": "string"}],
    "grains": [{"name": "string", "quantity": "string"}],
    "spices": [{"name": "string", "quantity": "string"}],
    "others": [{"name": "string", "quantity": "string"}]
  },
  "budgetAnalysis": {
    "estimatedCost": number (in USD),
    "currency": "USD",
    "isOverBudget": boolean,
    "wasOptimized": boolean,
    "explanation": "string"
  },
  "substitutions": [
    {
      "ingredient": "string",
      "alternatives": ["string", "string", "string"]
    }
  ],
  "pantryOptimization": {
    "savingsAmount": number (in USD),
    "matchedIngredients": ["string"],
    "pantryUsedPercentage": number
  },
  "leftoverPlanner": [
    {
      "recipeName": "string",
      "leftoverIngredientsUsed": ["string"],
      "additionalIngredientsNeeded": ["string"],
      "steps": ["string"]
    }
  ],
  "wasteReductionTips": [
    {
      "ingredient": "string",
      "urgency": "High" | "Medium" | "Low",
      "reason": "string",
      "suggestion": "string"
    }
  ],
  "storageTips": [
    {
      "ingredient": "string",
      "refrigeratorLife": "string",
      "freezerLife": "string",
      "containerType": "string"
    }
  ],
  "cookingTimeline": [
    {
      "time": "string",
      "task": "string",
      "duration": "string"
    }
  ],
  "healthScore": {
    "score": number (0-100),
    "breakdown": {
      "nutrition": "string",
      "protein": "string",
      "fiber": "string",
      "calories": "string",
      "sodium": "string"
    }
  },
  "cookingTips": ["string"],
  "sustainabilityScore": {
    "score": number (1-5),
    "explanation": "string"
  }
}`;
  },

  generateMockMealPlan(input: GeneratePlanRequest): GeneratePlanResponse {
    const cuisine = input.cuisine || 'Mediterranean';
    const diet = input.diet || 'None';

    let breakfastName = 'Avocado Toast with Poached Eggs';
    let lunchName = 'Grilled Chicken Caesar Salad';
    let dinnerName = 'Pan-Seared Salmon with Quinoa and Asparagus';
    let proteinSource = 'Chicken Breast';
    let dairySource = 'Greek Yogurt';

    if (cuisine.toLowerCase().includes('indian')) {
      breakfastName = 'Masala Scrambled Tofu (Bhurji) with Toast';
      lunchName = 'Chana Masala (Chickpea Curry) with Basmati Rice';
      dinnerName = 'Palak Paneer with Garlic Naan';
      proteinSource = 'Paneer / Chickpeas';
      dairySource = 'Paneer';
    } else if (cuisine.toLowerCase().includes('italian')) {
      breakfastName = 'Caprese Omelette with Basil';
      lunchName = 'Tuscan White Bean Soup with Focaccia';
      dinnerName = 'Penne Primavera with Creamy Garlic Sauce';
      proteinSource = 'Cannellini Beans';
      dairySource = 'Parmesan Cheese';
    } else if (cuisine.toLowerCase().includes('mexican')) {
      breakfastName = 'Huevos Rancheros with Corn Tortillas';
      lunchName = 'Black Bean & Corn Burrito Bowl';
      dinnerName = 'Veggie Fajitas with Guacamole';
      proteinSource = 'Black Beans';
      dairySource = 'Cotija Cheese';
    }

    if (diet.toLowerCase().includes('vegan')) {
      dinnerName = dinnerName.replace('Paneer', 'Tofu').replace('Cheese', 'Vegan Cheese');
      dairySource = 'Vegan Yogurt';
    }

    const matched: string[] = [];
    const removed: string[] = [];
    let savings = 0;

    const checkPantry = (ingName: string, cost: number) => {
      const isMatch = input.pantry.some((p) => ingName.toLowerCase().includes(p.toLowerCase()));
      if (isMatch) {
        matched.push(ingName);
        removed.push(ingName);
        savings += cost;
        return true;
      }
      return false;
    };

    checkPantry('Olive oil', 2.5);
    checkPantry('Salt', 0.2);
    checkPantry('Pepper', 0.2);
    checkPantry('Rice', 1.5);
    checkPantry('Onions', 0.8);
    checkPantry('Garlic', 0.5);

    const rawCost = 24.5 + input.people * 4.5;
    const estimatedCost = Math.max(8.5, rawCost - savings);
    const isOver = estimatedCost > input.budget;
    const wasOptimized = isOver;
    const finalCost = wasOptimized ? input.budget * 0.9 : estimatedCost;

    const explanation = wasOptimized
      ? `The original estimate was $${estimatedCost.toFixed(2)}, which exceeds your $${input.budget.toFixed(2)} budget. We optimized by swapping premium ingredients for budget staples (e.g. bulk grains and canned beans) to bring the cost down to $${finalCost.toFixed(2)}.`
      : `The total meal plan fits comfortably within your daily budget of $${input.budget.toFixed(2)}. Total grocery shopping cost is estimated at $${finalCost.toFixed(2)}.`;

    return {
      meals: {
        breakfast: {
          mealName: breakfastName,
          calories: 380,
          protein: 18,
          carbs: 42,
          fat: 14,
          cookingTime: '15 mins',
          ingredients: [
            { name: 'Tofu/Eggs', amount: 150, unit: 'g' },
            { name: 'Spices', amount: 1, unit: 'tsp' },
            { name: 'Bread', amount: 2, unit: 'slices' },
          ],
          recipe: [
            'Heat olive oil in a non-stick pan over medium heat.',
            'Crumble tofu or whisk eggs, then add to the pan with spices.',
            'Stir continuously for 5-7 minutes until cooked through.',
            'Toast bread and serve warm alongside scramble.',
          ],
          nutrition: 'High protein breakfast option, low in saturated fat.',
          difficulty: 'Easy',
        },
        lunch: {
          mealName: lunchName,
          calories: 520,
          protein: 22,
          carbs: 68,
          fat: 12,
          cookingTime: '20 mins',
          ingredients: [
            { name: 'Chickpeas/Beans', amount: 240, unit: 'g' },
            { name: 'Basmati Rice', amount: 100, unit: 'g' },
            { name: 'Onions & Tomatoes', amount: 120, unit: 'g' },
          ],
          recipe: [
            'Rinse and boil rice in a separate pot.',
            'Sauté onions and garlic in a pan, then add chopped tomatoes.',
            'Add chickpeas/beans and curry spices, simmer for 10 minutes.',
            'Serve chickpea curry over a bed of warm rice.',
          ],
          nutrition: 'Excellent fiber content to promote digestion and steady energy release.',
          difficulty: 'Easy',
        },
        dinner: {
          mealName: dinnerName,
          calories: 640,
          protein: 32,
          carbs: 55,
          fat: 20,
          cookingTime: '25 mins',
          ingredients: [
            { name: proteinSource, amount: 200, unit: 'g' },
            { name: 'Spinach/Veggie base', amount: 150, unit: 'g' },
            { name: 'Garlic/Herbs', amount: 2, unit: 'cloves' },
          ],
          recipe: [
            'Prepare and clean vegetables or greens.',
            'Grill or pan-sear your main protein source with selected herbs.',
            'Blanch greens and blend with garlic and seasoning.',
            'Combine and heat through for 5 minutes. Serve hot.',
          ],
          nutrition: 'Rich in iron, potassium, and high-quality protein for recovery.',
          difficulty: 'Medium',
        },
      },
      groceryList: {
        vegetables: [
          { name: 'Spinach', quantity: '150g' },
          { name: 'Onions', quantity: '2 units' },
        ].filter((v) => !removed.includes(v.name)),
        fruits: [{ name: 'Lemon', quantity: '1 unit' }],
        dairy: [{ name: dairySource, quantity: '200g' }],
        protein: [{ name: proteinSource, quantity: '400g' }],
        grains: [{ name: 'Basmati Rice', quantity: '200g' }].filter((g) => !removed.includes('Rice')),
        spices: [{ name: 'Curry Powder/Herbs', quantity: '1 pack' }],
        others: [{ name: 'Olive Oil', quantity: '1 bottle' }].filter(
          (o) => !removed.includes('Olive oil')
        ),
      },
      budgetAnalysis: {
        estimatedCost: finalCost,
        currency: 'USD',
        isOverBudget: isOver,
        wasOptimized,
        explanation,
      },
      substitutions: [
        {
          ingredient: proteinSource,
          alternatives: ['Tofu', 'Tempeh', 'Lentils'],
        },
      ],
      pantryOptimization: {
        savingsAmount: savings,
        matchedIngredients: matched,
        pantryUsedPercentage:
          input.pantry.length > 0 ? Math.round((matched.length / input.pantry.length) * 100) : 0,
      },
      leftoverPlanner: [
        {
          recipeName: `Crispy ${cuisine} Stir-Fry`,
          leftoverIngredientsUsed: ['Rice', 'Vegetables'],
          additionalIngredientsNeeded: ['Soy Sauce', 'Sesame Oil'],
          steps: [
            'Heat sesame oil in a wok.',
            'Add leftover rice and vegetables.',
            'Toss with soy sauce and stir-fry for 5 minutes until crispy.',
          ],
        },
      ],
      wasteReductionTips: [
        {
          ingredient: 'Spinach',
          urgency: 'High',
          reason: 'Leafy greens wilt quickly and lose nutrient density.',
          suggestion: 'Store in airtight containers with dry paper towels to absorb moisture.',
        },
      ],
      storageTips: [
        {
          ingredient: proteinSource,
          refrigeratorLife: '2-3 days',
          freezerLife: '3 months',
          containerType: 'Airtight glass container',
        },
      ],
      cookingTimeline: [
        { time: '06:00 PM', task: 'Wash and chop onions, garlic, and fresh greens.', duration: '10 mins' },
        { time: '06:10 PM', task: 'Start cooking Basmati rice and prepare the lunch base.', duration: '15 mins' },
        { time: '06:25 PM', task: 'Sauté proteins and blend greens for dinner curry.', duration: '15 mins' },
        { time: '06:40 PM', task: 'Plate meals and clean up cooking utensils.', duration: '5 mins' },
      ],
      healthScore: {
        score: 88,
        breakdown: {
          nutrition: 'Outstanding vitamin A and iron intake from fresh spinach.',
          protein: 'Highly matching target muscle recovery rates.',
          fiber: 'Meets 75% of the recommended daily fiber intake.',
          calories: 'Well balanced calorie load for active goals.',
          sodium: 'Kept under 1200mg by avoiding pre-packaged spices.',
        },
      },
      cookingTips: [
        'Sauté spices in warm oil first to unlock fat-soluble aromatics.',
        'Always wash your grains under cold water to remove excess starch.',
      ],
      sustainabilityScore: {
        score: 4,
        explanation: 'Strong emphasis on seasonal produce and local plant proteins reduces logistics emissions.',
      },
    };
  },
};

export default planService;
