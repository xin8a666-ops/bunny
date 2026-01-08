import React from 'react';
import { Recipe } from '../types';
import { IconClock } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  // Use recipe image OR a nice default fallback (Unsplash)
  const displayImage = recipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80';

  return (
    <div 
      onClick={() => onClick(recipe)}
      className="bg-white rounded-3xl overflow-hidden cursor-pointer shadow-cute hover:shadow-cute-hover hover:-translate-y-1 active:translate-y-0 active:shadow-cute-active transition-all duration-200 border-2 border-cute-border group"
    >
      <div className="h-40 w-full bg-cute-bg relative overflow-hidden">
        <img 
          src={displayImage} 
          alt={recipe.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 left-3">
             <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-white shadow-sm ${
                recipe.difficulty === '简单' ? 'bg-cute-green text-cute-text' :
                recipe.difficulty === '中等' ? 'bg-cute-yellow text-cute-text' :
                'bg-cute-pink text-white'
            }`}>
              {recipe.difficulty}
            </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-cute-text mb-1 truncate">{recipe.title}</h3>
        <p className="text-cute-subtext text-sm line-clamp-2 mb-3 h-10">{recipe.description}</p>
        <div className="flex items-center text-cute-pinkDark text-sm space-x-4 font-bold">
          <div className="flex items-center space-x-1 bg-cute-bg px-2 py-1 rounded-lg">
            <IconClock className="w-4 h-4" />
            <span>{recipe.prepTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};