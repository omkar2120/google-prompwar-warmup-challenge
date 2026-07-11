export interface MealIngredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Meal {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cookingTime: string;
  ingredients: MealIngredient[];
  recipe: string[];
  nutrition: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface GroceryItem {
  name: string;
  quantity: string;
}

export interface GroceryList {
  vegetables: GroceryItem[];
  fruits: GroceryItem[];
  dairy: GroceryItem[];
  protein: GroceryItem[];
  grains: GroceryItem[];
  spices: GroceryItem[];
  others: GroceryItem[];
}

export interface BudgetAnalysis {
  estimatedCost: number;
  currency: string;
  isOverBudget: boolean;
  wasOptimized: boolean;
  explanation: string;
}

export interface IngredientSubstitution {
  ingredient: string;
  alternatives: string[];
}

export interface PantryOptimization {
  savingsAmount: number;
  matchedIngredients: string[];
  pantryUsedPercentage: number;
}

export interface LeftoverRecipe {
  recipeName: string;
  leftoverIngredientsUsed: string[];
  additionalIngredientsNeeded: string[];
  steps: string[];
}

export interface WasteReductionTip {
  ingredient: string;
  urgency: 'High' | 'Medium' | 'Low';
  reason: string;
  suggestion: string;
}

export interface StorageTip {
  ingredient: string;
  refrigeratorLife: string;
  freezerLife: string;
  containerType: string;
}

export interface TimelineStep {
  time: string;
  task: string;
  duration: string;
}

export interface HealthScore {
  score: number;
  breakdown: {
    nutrition: string;
    protein: string;
    fiber: string;
    calories: string;
    sodium: string;
  };
}

export interface SustainabilityScore {
  score: number;
  explanation: string;
}

export interface GeneratePlanResponse {
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  groceryList: GroceryList;
  budgetAnalysis: BudgetAnalysis;
  substitutions: IngredientSubstitution[];
  pantryOptimization: PantryOptimization;
  leftoverPlanner: LeftoverRecipe[];
  wasteReductionTips: WasteReductionTip[];
  storageTips: StorageTip[];
  cookingTimeline: TimelineStep[];
  healthScore: HealthScore;
  cookingTips: string[];
  sustainabilityScore: SustainabilityScore;
}

export interface GeneratePlanRequest {
  budget: number;
  people: number;
  cuisine: string;
  diet: string;
  cookingTime: string;
  pantry: string[];
  allergies: string[];
  fitnessGoal: string;
  mood: string;
  notes?: string;
}
