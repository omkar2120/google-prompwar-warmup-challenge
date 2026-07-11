import { z } from 'zod';

export const mealSchema = z.object({
  mealName: z.string(),
  calories: z.number().int().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  cookingTime: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      unit: z.string(),
    })
  ),
  recipe: z.array(z.string()),
  nutrition: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

export const groceryItemSchema = z.object({
  name: z.string(),
  quantity: z.string(),
});

export const groceryListSchema = z.object({
  vegetables: z.array(groceryItemSchema),
  fruits: z.array(groceryItemSchema),
  dairy: z.array(groceryItemSchema),
  protein: z.array(groceryItemSchema),
  grains: z.array(groceryItemSchema),
  spices: z.array(groceryItemSchema),
  others: z.array(groceryItemSchema),
});

export const budgetAnalysisSchema = z.object({
  estimatedCost: z.number(),
  currency: z.string().default('USD'),
  isOverBudget: z.boolean(),
  wasOptimized: z.boolean(),
  explanation: z.string(),
});

export const substitutionSchema = z.object({
  ingredient: z.string(),
  alternatives: z.array(z.string()).length(3),
});

export const pantryOptimizationSchema = z.object({
  savingsAmount: z.number(),
  matchedIngredients: z.array(z.string()),
  pantryUsedPercentage: z.number(),
});

export const leftoverRecipeSchema = z.object({
  recipeName: z.string(),
  leftoverIngredientsUsed: z.array(z.string()),
  additionalIngredientsNeeded: z.array(z.string()),
  steps: z.array(z.string()),
});

export const wasteReductionTipSchema = z.object({
  ingredient: z.string(),
  urgency: z.enum(['High', 'Medium', 'Low']),
  reason: z.string(),
  suggestion: z.string(),
});

export const storageTipSchema = z.object({
  ingredient: z.string(),
  refrigeratorLife: z.string(),
  freezerLife: z.string(),
  containerType: z.string(),
});

export const timelineStepSchema = z.object({
  time: z.string(),
  task: z.string(),
  duration: z.string(),
});

export const healthScoreSchema = z.object({
  score: z.number().min(0).max(100),
  breakdown: z.object({
    nutrition: z.string(),
    protein: z.string(),
    fiber: z.string(),
    calories: z.string(),
    sodium: z.string(),
  }),
});

export const sustainabilityScoreSchema = z.object({
  score: z.number().min(1).max(5),
  explanation: z.string(),
});

export const generatePlanResponseSchema = z.object({
  meals: z.object({
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
  }),
  groceryList: groceryListSchema,
  budgetAnalysis: budgetAnalysisSchema,
  substitutions: z.array(substitutionSchema),
  pantryOptimization: pantryOptimizationSchema,
  leftoverPlanner: z.array(leftoverRecipeSchema),
  wasteReductionTips: z.array(wasteReductionTipSchema),
  storageTips: z.array(storageTipSchema),
  cookingTimeline: z.array(timelineStepSchema),
  healthScore: healthScoreSchema,
  cookingTips: z.array(z.string()),
  sustainabilityScore: sustainabilityScoreSchema,
});
