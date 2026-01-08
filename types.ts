
export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  difficulty: '简单' | '中等' | '困难';
  ingredients: Ingredient[];
  steps: Step[];
  imageUrl?: string; // Base64 or URL
  tags: string[];
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string; // Emoji or URL
  image: string;
  caption: string;
  likes: number;
  isLiked: boolean;
  timestamp: number;
  linkedRecipeId?: string; // Optional link to a saved recipe
  linkedRecipeTitle?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  HOME = 'HOME',
  GENERATE = 'GENERATE',
  RECIPE_DETAIL = 'RECIPE_DETAIL',
  CHAT = 'CHAT',
  SAVED = 'SAVED',
  COMMUNITY = 'COMMUNITY',
  CREATE_POST = 'CREATE_POST'
}

export type LoadingState = 'idle' | 'generating_recipe' | 'generating_image' | 'chatting';
