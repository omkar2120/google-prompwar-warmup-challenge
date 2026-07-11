import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChefHat,
  Users,
  DollarSign,
  Clock,
  Award,
  Leaf,
  Dumbbell,
  Smile,
  AlertTriangle,
  FileText,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { GeneratePlanRequest } from '../types/api';

const formSchema = z.object({
  budget: z.coerce.number().positive('Budget must be a positive number'),
  people: z.coerce.number().int().min(1, 'At least 1 person is required'),
  cuisine: z.string().min(1, 'Cuisine is required'),
  diet: z.string().min(1, 'Diet is required'),
  cookingTime: z.string().min(1, 'Cooking time is required'),
  fitnessGoal: z.string().min(1, 'Fitness goal is required'),
  mood: z.string().min(1, 'Mood is required'),
  notes: z.string().optional(),
});

interface PlanFormProps {
  onSubmit: (data: GeneratePlanRequest) => void;
  isLoading: boolean;
}

export const PlanForm: React.FC<PlanFormProps> = ({ onSubmit, isLoading }) => {
  const [pantryTags, setPantryTags] = useState<string[]>([]);
  const [pantryInput, setPantryInput] = useState('');
  const [allergyTags, setAllergyTags] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 30,
      people: 2,
      cuisine: 'Mediterranean',
      diet: 'None',
      cookingTime: '30 mins',
      fitnessGoal: 'Healthy Balance',
      mood: 'Cozy',
      notes: '',
    },
  });

  const handleAddPantryTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
    e.preventDefault();
    const tag = pantryInput.trim();
    if (tag && !pantryTags.includes(tag)) {
      setPantryTags([...pantryTags, tag]);
      setPantryInput('');
    }
  };

  const handleRemovePantryTag = (tag: string) => {
    setPantryTags(pantryTags.filter((t) => t !== tag));
  };

  const handleAddAllergyTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
    e.preventDefault();
    const tag = allergyInput.trim();
    if (tag && !allergyTags.includes(tag)) {
      setAllergyTags([...allergyTags, tag]);
      setAllergyInput('');
    }
  };

  const handleRemoveAllergyTag = (tag: string) => {
    setAllergyTags(allergyTags.filter((t) => t !== tag));
  };

  const onFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      ...data,
      pantry: pantryTags,
      allergies: allergyTags,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="glass-card rounded-2xl p-6 lg:p-8 space-y-6 relative overflow-hidden"
    >
      {/* Subtle background blur highlights */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full glow-indigo opacity-30 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full glow-emerald opacity-20 pointer-events-none" />

      <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
          <ChefHat className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-white">Create Meal Plan</h2>
          <p className="text-xs text-slate-400">Tell SmartChef AI about your preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span>Daily Budget ($)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              {...register('budget')}
              className="glass-input w-full rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none"
              placeholder="e.g. 30.00"
            />
          </div>
          {errors.budget && <p className="text-xs text-red-400 mt-1">{errors.budget.message}</p>}
        </div>

        {/* Number of People */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <span>Number of People</span>
          </label>
          <input
            type="number"
            {...register('people')}
            className="glass-input w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none"
            placeholder="e.g. 2"
          />
          {errors.people && <p className="text-xs text-red-400 mt-1">{errors.people.message}</p>}
        </div>

        {/* Cuisine Preference */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <ChefHat className="h-4 w-4 text-emerald-400" />
            <span>Cuisine Preference</span>
          </label>
          <select
            {...register('cuisine')}
            className="glass-input w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none appearance-none"
          >
            <option value="Mediterranean">Mediterranean</option>
            <option value="Italian">Italian</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="Japanese">Japanese</option>
            <option value="Chinese">Chinese</option>
            <option value="Thai">Thai</option>
            <option value="American">American</option>
            <option value="Fusion">Fusion / Creative</option>
          </select>
        </div>

        {/* Diet */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-emerald-400" />
            <span>Diet Preference</span>
          </label>
          <select
            {...register('diet')}
            className="glass-input w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none"
          >
            <option value="None">No Specific Diet (Everything)</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Keto">Keto (Low Carb)</option>
            <option value="Paleo">Paleo</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Dairy-Free">Dairy-Free</option>
            <option value="Pescatarian">Pescatarian</option>
          </select>
        </div>

        {/* Cooking Time Limit */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span>Cooking Time Limit</span>
          </label>
          <select
            {...register('cookingTime')}
            className="glass-input w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none"
          >
            <option value="15 mins">Super Fast (under 15 mins)</option>
            <option value="30 mins">Quick (under 30 mins)</option>
            <option value="45 mins">Medium (under 45 mins)</option>
            <option value="60+ mins">Chef Special (60+ mins)</option>
          </select>
        </div>

        {/* Fitness Goal */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <Dumbbell className="h-4 w-4 text-indigo-400" />
            <span>Fitness Goal</span>
          </label>
          <select
            {...register('fitnessGoal')}
            className="glass-input w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none"
          >
            <option value="Healthy Balance">Healthy Balance</option>
            <option value="Weight Loss">Weight Loss (Caloric Deficit)</option>
            <option value="Muscle Gain">Muscle Gain (High Protein)</option>
            <option value="Low Sodium">Heart Healthy (Low Sodium)</option>
            <option value="High Fiber">Digestive Wellness (High Fiber)</option>
          </select>
        </div>

        {/* Mood */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <Smile className="h-4 w-4 text-emerald-400" />
            <span>Current Mood</span>
          </label>
          <select
            {...register('mood')}
            className="glass-input w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none"
          >
            <option value="Cozy">Comfort Food / Cozy 🛋️</option>
            <option value="Energetic">Energetic / Superfood ⚡</option>
            <option value="Busy">Busy / Low effort ⏱️</option>
            <option value="Adventurous">Adventurous / Unique ✈️</option>
            <option value="Light">Fresh & Light 🥗</option>
          </select>
        </div>

        {/* Notes (Moved to take full width or partial) */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>Optional Notes / Special Requests</span>
          </label>
          <textarea
            {...register('notes')}
            className="glass-input w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none h-20 resize-none"
            placeholder="e.g. 'I want to use my lemon harvest' or 'No spicy food for dinner'."
          />
        </div>

        {/* Pantry Ingredients Tag Input */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <Smile className="h-4 w-4 text-indigo-400" />
            <span>Available Pantry Ingredients (Removes from shopping list)</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={pantryInput}
              onChange={(e) => setPantryInput(e.target.value)}
              onKeyDown={handleAddPantryTag}
              className="glass-input flex-1 rounded-xl py-2 px-4 text-sm focus:outline-none"
              placeholder="e.g. Garlic, Rice, Olive oil (Press Enter to add)"
            />
            <button
              type="button"
              onClick={handleAddPantryTag}
              className="bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl px-4 flex items-center justify-center transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {pantryTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 p-3 bg-slate-950/40 rounded-xl border border-white/5">
              {pantryTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1.5"
                >
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemovePantryTag(tag)}>
                    <X className="h-3 w-3 hover:text-white transition-colors" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Allergies Tag Input */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span>Allergies / Exclusions</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyDown={handleAddAllergyTag}
              className="glass-input flex-1 rounded-xl py-2 px-4 text-sm focus:outline-none"
              placeholder="e.g. Peanuts, Shellfish, Cilantro (Press Enter to add)"
            />
            <button
              type="button"
              onClick={handleAddAllergyTag}
              className="bg-red-600/60 hover:bg-red-600/80 text-white rounded-xl px-4 flex items-center justify-center transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {allergyTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 p-3 bg-slate-950/40 rounded-xl border border-white/5">
              {allergyTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-red-500/10 text-red-300 border border-red-500/20 text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1.5"
                >
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveAllergyTag(tag)}>
                    <X className="h-3 w-3 hover:text-white transition-colors" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl py-3 px-4 font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Cooking up your plan...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Generate Smart Plan</span>
          </>
        )}
      </button>
    </form>
  );
};
