import React, { useState } from 'react';
import {
  Clock,
  Flame,
  Scale,
  ChefHat,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Database,
  Globe,
  Award,
} from 'lucide-react';
import { Meal, GroceryList, BudgetAnalysis, IngredientSubstitution, PantryOptimization, LeftoverRecipe, WasteReductionTip, StorageTip, TimelineStep, HealthScore, SustainabilityScore } from '../types/api';

// Custom Wrapper
export const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass-card rounded-2xl p-6 ${className}`}>{children}</div>
);

// 1. MEAL CARD COMPONENT
interface MealCardProps {
  meal: Meal;
  type: 'Breakfast' | 'Lunch' | 'Dinner';
}

export const MealCard: React.FC<MealCardProps> = ({ meal, type }) => {
  const [showRecipe, setShowRecipe] = useState(false);
  const colorMap = {
    Breakfast: 'from-amber-500/20 to-orange-500/10 border-orange-500/30 text-orange-400',
    Lunch: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    Dinner: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
  };

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="glass-card-interactive rounded-2xl p-5 flex flex-col justify-between h-full border border-white/5 relative overflow-hidden">
      {/* Glow Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-10 bg-gradient-to-br ${type === 'Breakfast' ? 'from-orange-500' : type === 'Lunch' ? 'from-emerald-500' : 'from-indigo-500'}`} />

      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${colorMap[type]}`}>
            {type}
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-lg border font-medium ${difficultyColors[meal.difficulty]}`}>
            {meal.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{meal.mealName}</h3>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{meal.nutrition}</p>

        {/* Nutritional Highlights */}
        <div className="grid grid-cols-4 gap-2 mb-4 bg-slate-950/30 p-2.5 rounded-xl border border-white/5 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Calories</div>
            <div className="text-sm font-bold text-white mt-0.5">{meal.calories}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Protein</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{meal.protein}g</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Carbs</div>
            <div className="text-sm font-bold text-indigo-400 mt-0.5">{meal.carbs}g</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Fat</div>
            <div className="text-sm font-bold text-pink-400 mt-0.5">{meal.fat}g</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-400 mb-4">
          <span className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{meal.cookingTime}</span>
          </span>
          <span className="flex items-center space-x-1">
            <ChefHat className="h-3.5 w-3.5 text-slate-400" />
            <span>{meal.ingredients.length} ingredients</span>
          </span>
        </div>
      </div>

      <div>
        <button
          onClick={() => setShowRecipe(!showRecipe)}
          className={`w-full text-xs font-semibold py-2 px-4 rounded-xl border transition-all flex items-center justify-center space-x-1 ${showRecipe ? 'bg-white/10 text-white border-white/10' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25'}`}
        >
          <span>{showRecipe ? 'Hide Recipe Steps' : 'View Recipe & Ingredients'}</span>
          <ChevronRight className={`h-3 w-3 transform transition-transform ${showRecipe ? 'rotate-90' : ''}`} />
        </button>

        {showRecipe && (
          <div className="mt-4 space-y-4 pt-4 border-t border-white/5 animate-fadeIn">
            {/* Ingredients checklist */}
            <div>
              <h4 className="text-xs font-semibold text-white mb-2">Ingredients needed:</h4>
              <ul className="grid grid-cols-2 gap-1.5">
                {meal.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                    <span>{ing.amount} {ing.unit} {ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-xs font-semibold text-white mb-2">Steps to cook:</h4>
              <ol className="space-y-2">
                {meal.recipe.map((step, idx) => (
                  <li key={idx} className="flex space-x-2.5 text-xs text-slate-300">
                    <span className="flex-shrink-0 bg-slate-800 text-slate-400 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] border border-white/5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. BUDGET ANALYSIS METER
interface BudgetMeterProps {
  budget: number;
  analysis: BudgetAnalysis;
  optimization: PantryOptimization;
}

export const BudgetMeter: React.FC<BudgetMeterProps> = ({ budget, analysis, optimization }) => {
  const percentage = Math.min(100, Math.round((analysis.estimatedCost / budget) * 100));
  const isOver = analysis.isOverBudget;
  const isOptimized = analysis.wasOptimized;

  return (
    <GlassCard className="flex flex-col justify-between h-full relative overflow-hidden border border-white/5">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full glow-indigo opacity-10 pointer-events-none" />

      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">Budget Analysis</h3>
              <p className="text-xs text-slate-400">Comparison of estimated cost vs. limit</p>
            </div>
          </div>
          {isOptimized && (
            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
              <Award className="h-3 w-3" />
              <span>AI Optimized</span>
            </span>
          )}
        </div>

        {/* Cost stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Your Budget Limit</span>
            <div className="text-xl font-extrabold text-white mt-1">${budget.toFixed(2)}</div>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Estimated Cost</span>
            <div className={`text-xl font-extrabold mt-1 ${isOver && !isOptimized ? 'text-red-400' : 'text-emerald-400'}`}>
              ${analysis.estimatedCost.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Custom Progress Gauge */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Usage Meter</span>
            <span className={percentage > 100 ? 'text-red-400' : percentage > 85 ? 'text-amber-400' : 'text-emerald-400'}>
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-slate-950/50 rounded-full h-3.5 p-0.5 border border-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${percentage > 100 ? 'from-red-500 to-rose-600' : percentage > 85 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Savings highlights from pantry */}
        {optimization.savingsAmount > 0 && (
          <div className="flex items-center space-x-2 text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/15 p-3 rounded-xl mb-4">
            <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Pantry Savings:</strong> Saved <strong>${optimization.savingsAmount.toFixed(2)}</strong> by using items already in your kitchen!
            </span>
          </div>
        )}
      </div>

      {/* Explanation text */}
      <div className="bg-slate-950/20 p-3 rounded-xl border border-white/5 flex items-start space-x-2.5 text-xs text-slate-300">
        <Info className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">{analysis.explanation}</p>
      </div>
    </GlassCard>
  );
};

// 3. HEALTH SCORE WIDGET
interface HealthScoreWidgetProps {
  health: HealthScore;
}

export const HealthScoreWidget: React.FC<HealthScoreWidgetProps> = ({ health }) => {
  const [activeTab, setActiveTab] = useState<keyof HealthScore['breakdown']>('nutrition');

  // Radial progress calculations
  const radius = 36;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (health.score / 100) * circumference;

  const scoreColor = health.score >= 85 ? 'text-emerald-400 stroke-emerald-500' : health.score >= 70 ? 'text-amber-400 stroke-amber-500' : 'text-red-400 stroke-red-500';

  return (
    <GlassCard className="flex flex-col justify-between h-full border border-white/5 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full glow-emerald opacity-10 pointer-events-none" />

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white">Health Score</h3>
            <p className="text-xs text-slate-400">Daily recipe nutrition valuation</p>
          </div>
        </div>

        {/* Circular Progress + Simple Summary */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative flex items-center justify-center w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                className="text-slate-800"
                strokeWidth={stroke}
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                style={{ transform: `translate(${stroke}px, ${stroke}px)` }}
              />
              {/* Foreground circle */}
              <circle
                className={`${scoreColor} transition-all duration-1000 ease-out`}
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{
                  strokeDashoffset,
                  transform: `translate(${stroke}px, ${stroke}px)`,
                }}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white">{health.score}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="flex-1 bg-slate-950/30 p-3 rounded-xl border border-white/5">
            <h4 className="text-xs font-bold text-white mb-1 flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Personal Nutrition Guide</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              Based on your goals, this plan maintains highly balanced nutritional density.
            </p>
          </div>
        </div>

        {/* Breakdown Tabs */}
        <div className="border-b border-white/5 flex mb-3 overflow-x-auto">
          {Object.keys(health.breakdown).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown detail */}
      <div className="bg-slate-950/30 p-3 rounded-xl border border-white/5 min-h-[50px] flex items-center">
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "{health.breakdown[activeTab]}"
        </p>
      </div>
    </GlassCard>
  );
};

// 4. GROCERY LIST WIDGET
interface GroceryListWidgetProps {
  groceryList: GroceryList;
  pantryOpt: PantryOptimization;
}

export const GroceryListWidget: React.FC<GroceryListWidgetProps> = ({ groceryList, pantryOpt }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const categories = Object.keys(groceryList) as Array<keyof GroceryList>;

  const toggleCheck = (name: string) => {
    if (checkedItems.includes(name)) {
      setCheckedItems(checkedItems.filter((i) => i !== name));
    } else {
      setCheckedItems([...checkedItems, name]);
    }
  };

  return (
    <GlassCard className="h-full border border-white/5 relative overflow-hidden flex flex-col justify-between">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full glow-indigo opacity-5 pointer-events-none" />

      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">Grocery Shopping List</h3>
              <p className="text-xs text-slate-400">Categorized list for direct cooking preparation</p>
            </div>
          </div>
        </div>

        {/* Pantry matched details */}
        {pantryOpt.matchedIngredients.length > 0 && (
          <div className="bg-indigo-950/30 border border-indigo-500/20 p-3 rounded-xl mb-4 text-xs text-indigo-300">
            <span className="font-bold flex items-center space-x-1.5 mb-1 text-indigo-400">
              <Database className="h-3.5 w-3.5" />
              <span>Pantry Optimizer Active</span>
            </span>
            <p className="mb-2">We detected following ingredients in your pantry and skipped them to save money:</p>
            <div className="flex flex-wrap gap-1.5">
              {pantryOpt.matchedIngredients.map((item, idx) => (
                <span key={idx} className="bg-indigo-500/10 text-indigo-300 text-[10px] px-2 py-0.5 rounded-lg border border-indigo-500/15 line-through">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* List of categories */}
        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
          {categories.map((cat) => {
            const items = groceryList[cat];
            if (!items || items.length === 0) return null;

            return (
              <div key={cat} className="space-y-1.5">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-1">
                  {cat}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  {items.map((item, idx) => {
                    const isChecked = checkedItems.includes(item.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleCheck(item.name)}
                        className={`text-left flex items-center space-x-2.5 p-2 rounded-xl border text-xs transition-colors ${isChecked ? 'bg-slate-900/40 text-slate-500 border-white/5 line-through' : 'bg-slate-950/20 hover:bg-slate-950/40 text-slate-200 border-white/5'}`}
                      >
                        <span className={`w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-600/20 border-indigo-600/30 text-indigo-400' : 'border-white/20 text-transparent'}`}>
                          ✓
                        </span>
                        <span className="flex-1 font-medium">{item.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">
                          {item.quantity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-[10px] text-slate-400 border-t border-white/5 mt-4 pt-3 flex justify-between items-center">
        <span>Click items to cross them off while shopping.</span>
        <span>Items checked: {checkedItems.length}</span>
      </div>
    </GlassCard>
  );
};

// 5. COOKING TIMELINE
interface TimelineProps {
  steps: TimelineStep[];
}

export const TimelineWidget: React.FC<TimelineProps> = ({ steps }) => {
  return (
    <GlassCard className="h-full border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full glow-emerald opacity-5 pointer-events-none" />

      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Cooking Timeline</h3>
          <p className="text-xs text-slate-400">Time-optimized chronological cooking roadmap</p>
        </div>
      </div>

      <div className="relative border-l border-white/10 pl-6 ml-3 space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            {/* Timeline node icon */}
            <span className="absolute -left-9 top-0.5 bg-slate-900 border border-emerald-500/40 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm">
              {idx + 1}
            </span>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/25">
                  {step.time}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-slate-400" />
                  {step.duration}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">{step.task}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// 6. SUBSTITUTIONS
interface SubstitutionsProps {
  substitutions: IngredientSubstitution[];
}

export const SubstitutionsWidget: React.FC<SubstitutionsProps> = ({ substitutions }) => {
  return (
    <GlassCard className="h-full border border-white/5">
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Ingredient Substitutions</h3>
          <p className="text-xs text-slate-400">Smart alternatives for hard-to-find ingredients</p>
        </div>
      </div>

      <div className="space-y-3">
        {substitutions.map((sub, idx) => (
          <div key={idx} className="bg-slate-950/30 p-3 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/5 w-fit">
              {sub.ingredient}
            </span>
            <div className="flex items-center space-x-2">
              {sub.alternatives.map((alt, i) => (
                <React.Fragment key={i}>
                  <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    {alt}
                  </span>
                  {i < sub.alternatives.length - 1 && <span className="text-slate-600 text-xs">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// 7. LEFTOVER PLANNER
interface LeftoverProps {
  recipes: LeftoverRecipe[];
}

export const LeftoverWidget: React.FC<LeftoverProps> = ({ recipes }) => {
  return (
    <GlassCard className="h-full border border-white/5">
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
          <RotateCcw className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Leftover Recipe Planner</h3>
          <p className="text-xs text-slate-400">Upcycle ingredients to minimize food waste</p>
        </div>
      </div>

      <div className="space-y-4">
        {recipes.map((rec, idx) => (
          <div key={idx} className="bg-slate-950/30 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>{rec.recipeName}</span>
            </h4>

            <div className="text-[11px] space-y-2">
              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Leftovers Utilized</span>
                <div className="flex flex-wrap gap-1">
                  {rec.leftoverIngredientsUsed.map((ing, i) => (
                    <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/15 px-2 py-0.5 rounded">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
              {rec.additionalIngredientsNeeded.length > 0 && (
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Extra Items Needed</span>
                  <div className="flex flex-wrap gap-1">
                    {rec.additionalIngredientsNeeded.map((ing, i) => (
                      <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Preparation Steps</span>
              <ol className="space-y-1 text-xs text-slate-300">
                {rec.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex space-x-2">
                    <span className="text-indigo-400 font-bold">{sIdx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// 8. STORAGE & WASTE WIDGETS
interface StorageWasteProps {
  storage: StorageTip[];
  waste: WasteReductionTip[];
}

export const StorageTipsWidget: React.FC<StorageWasteProps> = ({ storage, waste }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Storage Tips */}
      <GlassCard className="border border-white/5">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white">Ingredient Storage Tips</h3>
            <p className="text-xs text-slate-400">Best practices to optimize produce freshness</p>
          </div>
        </div>

        <div className="space-y-3">
          {storage.map((tip, idx) => (
            <div key={idx} className="bg-slate-950/30 p-3 rounded-xl border border-white/5 space-y-2">
              <span className="text-xs font-bold text-white">{tip.ingredient}</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-slate-900/60 p-1.5 rounded">
                  <span className="text-slate-400 block font-semibold">Refrigerator</span>
                  <span className="text-emerald-400 font-medium mt-0.5 block">{tip.refrigeratorLife}</span>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded">
                  <span className="text-slate-400 block font-semibold">Freezer</span>
                  <span className="text-indigo-400 font-medium mt-0.5 block">{tip.freezerLife}</span>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded">
                  <span className="text-slate-400 block font-semibold">Container</span>
                  <span className="text-slate-300 font-medium mt-0.5 block truncate" title={tip.containerType}>{tip.containerType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Waste Reduction */}
      <GlassCard className="border border-white/5">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-red-500/10 p-2 rounded-lg text-red-400">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white">Waste Reduction Tips</h3>
            <p className="text-xs text-slate-400">Ingredients to consume quickly and ideas</p>
          </div>
        </div>

        <div className="space-y-3">
          {waste.map((tip, idx) => {
            const urgencyColors = {
              High: 'bg-red-500/10 text-red-400 border-red-500/20',
              Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
              Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            };
            return (
              <div key={idx} className="bg-slate-950/30 p-3 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{tip.ingredient}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-lg border font-semibold ${urgencyColors[tip.urgency]}`}>
                    {tip.urgency} Urgency
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 italic">"{tip.reason}"</p>
                <p className="text-xs text-slate-400 font-medium bg-slate-900/50 p-1.5 rounded border border-white/5">
                  💡 {tip.suggestion}
                </p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};

// 9. SUSTAINABILITY SCORE WIDGET
interface SustainabilityProps {
  sustainability: SustainabilityScore;
}

export const SustainabilityScoreWidget: React.FC<SustainabilityProps> = ({ sustainability }) => {
  return (
    <GlassCard className="border border-white/5 relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full glow-emerald opacity-10 pointer-events-none" />

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white">Sustainability Index</h3>
            <p className="text-xs text-slate-400">Environmental footprint estimate of meals</p>
          </div>
        </div>

        {/* Stars generator */}
        <div className="flex items-center space-x-3 mb-4 bg-slate-950/30 p-3.5 rounded-xl border border-white/5 w-fit">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${star <= sustainability.score ? 'text-emerald-400' : 'text-slate-700'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-300">({sustainability.score} / 5 Score)</span>
        </div>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex items-start space-x-2.5">
        <Info className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-200/90 leading-relaxed">{sustainability.explanation}</p>
      </div>
    </GlassCard>
  );
};

// 10. AI COOKING TIPS WIDGET
interface CookingTipsProps {
  tips: string[];
}

export const CookingTipsWidget: React.FC<CookingTipsProps> = ({ tips }) => {
  return (
    <GlassCard className="border border-white/5 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Personalized Chef Recommendations</h3>
          <p className="text-xs text-slate-400">Tips tailored to fitness goals & culinary skill</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-slate-950/20 p-3 rounded-xl border border-white/5 flex items-start space-x-2.5">
            <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 w-5.5 h-5.5 rounded-full flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
