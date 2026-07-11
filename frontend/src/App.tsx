import React, { useState } from 'react';
import axios from 'axios';
import { ChefHat, Sparkles, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { PlanForm } from './components/PlanForm';
import { usePlanMutation } from './hooks/usePlan';
import { GeneratePlanRequest } from './types/api';
import {
  MealCard,
  BudgetMeter,
  HealthScoreWidget,
  GroceryListWidget,
  TimelineWidget,
  SubstitutionsWidget,
  LeftoverWidget,
  StorageTipsWidget,
  SustainabilityScoreWidget,
  CookingTipsWidget,
} from './components/SassComponents';

export const App: React.FC = () => {
  const [activePlan, setActivePlan] = useState<any>(null);
  const [currentRequest, setCurrentRequest] = useState<GeneratePlanRequest | null>(null);

  const { mutate, isPending, error } = usePlanMutation();

  const getErrorMessage = (err: any) => {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.message || err.message;
    }
    return err?.message || 'An unexpected error occurred.';
  };

  const handleFormSubmit = (data: GeneratePlanRequest) => {
    setCurrentRequest(data);
    mutate(data, {
      onSuccess: (plan) => {
        setActivePlan(plan);
        // Scroll to top of the dashboard smooth
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  const handleReset = () => {
    setActivePlan(null);
    setCurrentRequest(null);
  };

  // Custom loading skeletons representing premium SaaS dashboards
  const RenderSkeletons = () => (
    <div className="space-y-6 py-6 animate-pulse">
      <div className="h-12 bg-slate-900/60 border border-white/5 rounded-2xl w-1/3" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col Skeletons */}
        <div className="space-y-6">
          <div className="h-64 bg-slate-900/60 border border-white/5 rounded-2xl" />
          <div className="h-64 bg-slate-900/60 border border-white/5 rounded-2xl" />
          <div className="h-64 bg-slate-900/60 border border-white/5 rounded-2xl" />
        </div>
        {/* Mid Col Skeletons */}
        <div className="space-y-6">
          <div className="h-72 bg-slate-900/60 border border-white/5 rounded-2xl" />
          <div className="h-60 bg-slate-900/60 border border-white/5 rounded-2xl" />
          <div className="h-44 bg-slate-900/60 border border-white/5 rounded-2xl" />
        </div>
        {/* Right Col Skeletons */}
        <div className="space-y-6">
          <div className="h-96 bg-slate-900/60 border border-white/5 rounded-2xl" />
          <div className="h-80 bg-slate-900/60 border border-white/5 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden dotted-bg">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full glow-indigo opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full glow-emerald opacity-20 pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 rounded-full glow-pink opacity-20 pointer-events-none" />

      {/* Main Navigation Header */}
      <header className="border-b border-white/5 bg-[#0b0f19]/45 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-emerald-400">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-black font-display text-white tracking-tight flex items-center">
                SmartChef <span className="text-emerald-400 ml-1">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Your AI-Powered Daily Cooking Planner
              </p>
            </div>
          </div>
          {activePlan && (
            <button
              onClick={handleReset}
              className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs px-3.5 py-1.5 rounded-xl font-medium flex items-center space-x-1.5 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>New Plan</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start space-x-3 text-red-400 animate-fadeIn">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold">API Generation Error</h4>
              <p className="text-xs text-red-300/80 mt-1">
                {getErrorMessage(error)}
              </p>
            </div>
            <button
              onClick={() => currentRequest && handleFormSubmit(currentRequest)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/30 flex items-center space-x-1 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {isPending && <RenderSkeletons />}

        {!isPending && !activePlan && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-6">
            {/* Left Col - Info Intro */}
            <div className="lg:col-span-5 space-y-6 lg:pr-4">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full text-xs text-emerald-400 font-semibold">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>Hackathon Edition MVP</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
                  Reduce Waste. <br />
                  Optimize Budget. <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                    Eat Exquisitely.
                  </span>
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  SmartChef AI generates custom daily meal routines based on your financial budget, available pantry ingredients, diets, and goals. It minimizes grocery waste and structures recipes automatically.
                </p>
              </div>

              {/* Mini Highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0b0f19]/60 border border-white/5 p-4 rounded-xl">
                  <div className="text-emerald-400 font-bold text-lg">Pantry Match</div>
                  <p className="text-xs text-slate-400 mt-1">Detects and excludes in-stock ingredients to save costs.</p>
                </div>
                <div className="bg-[#0b0f19]/60 border border-white/5 p-4 rounded-xl">
                  <div className="text-indigo-400 font-bold text-lg">Budget Guard</div>
                  <p className="text-xs text-slate-400 mt-1">Automatically restructures recipes if budget is exceeded.</p>
                </div>
              </div>
            </div>

            {/* Right Col - The Form */}
            <div className="lg:col-span-7">
              <PlanForm onSubmit={handleFormSubmit} isLoading={isPending} />
            </div>
          </div>
        )}

        {/* Dashboard Grid (When plan is loaded) */}
        {!isPending && activePlan && (
          <div className="space-y-8 py-6 animate-fadeIn">
            {/* Quick summary stats */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
              <span className="text-xs text-slate-400">Diet: <strong className="text-white">{currentRequest?.diet}</strong></span>
              <span className="text-slate-600 text-xs">|</span>
              <span className="text-xs text-slate-400">Cuisine: <strong className="text-white">{currentRequest?.cuisine}</strong></span>
              <span className="text-slate-600 text-xs">|</span>
              <span className="text-xs text-slate-400">Target Budget: <strong className="text-white">${currentRequest?.budget}</strong></span>
              <span className="text-slate-600 text-xs">|</span>
              <span className="text-xs text-slate-400">People: <strong className="text-white">{currentRequest?.people}</strong></span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Column 1: The Meal Routines */}
              <div className="space-y-6 lg:col-span-1">
                <h2 className="text-md font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                  <span>Meal Planner Plan</span>
                </h2>
                <MealCard meal={activePlan.meals.breakfast} type="Breakfast" />
                <MealCard meal={activePlan.meals.lunch} type="Lunch" />
                <MealCard meal={activePlan.meals.dinner} type="Dinner" />
              </div>

              {/* Column 2: Financials & Metrics */}
              <div className="space-y-6 lg:col-span-1">
                <h2 className="text-md font-bold uppercase tracking-widest text-slate-400">
                  Metrics & Optimization
                </h2>
                <BudgetMeter
                  budget={currentRequest?.budget || 0}
                  analysis={activePlan.budgetAnalysis}
                  optimization={activePlan.pantryOptimization}
                />
                <HealthScoreWidget health={activePlan.healthScore} />
                <SustainabilityScoreWidget sustainability={activePlan.sustainabilityScore} />
              </div>

              {/* Column 3: Logistics & Cooking */}
              <div className="space-y-6 lg:col-span-1">
                <h2 className="text-md font-bold uppercase tracking-widest text-slate-400">
                  Shopping & Timeline
                </h2>
                <GroceryListWidget
                  groceryList={activePlan.groceryList}
                  pantryOpt={activePlan.pantryOptimization}
                />
                <TimelineWidget steps={activePlan.cookingTimeline} />
              </div>
            </div>

            {/* Substitutions & Leftovers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SubstitutionsWidget substitutions={activePlan.substitutions} />
              <LeftoverWidget recipes={activePlan.leftoverPlanner} />
            </div>

            {/* Storage & Waste Reduction */}
            <StorageTipsWidget
              storage={activePlan.storageTips}
              waste={activePlan.wasteReductionTips}
            />

            {/* AI Cooking Tips */}
            <CookingTipsWidget tips={activePlan.cookingTips} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16 pt-8 text-center text-xs text-slate-500 relative z-10 max-w-7xl mx-auto px-4">
        <p>© 2026 SmartChef AI. Designed for Google PromptWars Warmup Hackathon. Staff-level architecture.</p>
      </footer>
    </div>
  );
};

export default App;
