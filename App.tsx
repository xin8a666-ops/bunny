import React, { useState, useEffect, useRef } from 'react';
import { 
  AppView, 
  Recipe, 
  ChatMessage, 
  LoadingState,
  CommunityPost
} from './types';
import { generateRecipe, generateRecipeFromImage, generateRecipeImage } from './services/geminiService';
import { RecipeCard } from './components/RecipeCard';
import { ChatInterface } from './components/ChatInterface';
import { 
  IconWand, 
  IconHome, 
  IconMessage, 
  IconArrowLeft,
  IconPlus,
  IconCamera,
  IconBook,
  IconBunnyLogo,
  IconCommunity,
  IconHeart,
  IconHeartFilled,
  IconSend
} from './components/Icons';

function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  // Generator State
  const [generationMode, setGenerationMode] = useState<'text' | 'image'>('text');
  const [promptInput, setPromptInput] = useState('');
  const [dietaryInput, setDietaryInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Base64
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Community State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostRecipeId, setNewPostRecipeId] = useState<string>('');
  const postFileInputRef = useRef<HTMLInputElement>(null);

  // Initial Load (Mock Data)
  useEffect(() => {
    // Mock Recipes
    const defaultRecipes: Recipe[] = [
      {
        id: '1',
        title: '草莓奶油独角兽杯子蛋糕',
        description: '超级梦幻的粉色杯子蛋糕，顶着彩虹般的奶油霜，每一口都是幸福的味道！(≧◡≦)',
        prepTime: '25分钟',
        cookTime: '20分钟',
        difficulty: '简单',
        tags: ['甜点', '可爱', '派对'],
        ingredients: [
          { name: '低筋面粉', amount: '120g' },
          { name: '细砂糖', amount: '80g' },
          { name: '无盐黄油', amount: '100g' },
          { name: '鸡蛋', amount: '2个' },
          { name: '草莓果酱', amount: '2勺' },
          { name: '淡奶油', amount: '200ml' }
        ],
        steps: [
            { stepNumber: 1, instruction: '黄油软化，加糖打发至发白蓬松。' },
            { stepNumber: 2, instruction: '分次加入蛋液，搅拌均匀后加入果酱。' },
            { stepNumber: 3, instruction: '筛入面粉，翻拌均匀，烤箱170度烤20分钟。' }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1599785209707-3a111453e9cb?q=80&w=600&auto=format&fit=crop'
      }
    ];
    setSavedRecipes(defaultRecipes);

    // Mock Community Posts
    const defaultPosts: CommunityPost[] = [
      {
        id: '101',
        userId: 'u1',
        userName: '小熊面包师',
        userAvatar: '🐻',
        image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80',
        caption: '今天试做了全麦面包，超级香！大家记得多发酵一会儿哦~ 🍞',
        likes: 42,
        isLiked: false,
        timestamp: Date.now() - 3600000
      },
      {
        id: '102',
        userId: 'u2',
        userName: '甜点爱丽丝',
        userAvatar: '🎀',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
        caption: '按照 Bunny 的食谱做的杯子蛋糕，太可爱了！孩子们超喜欢！',
        likes: 128,
        isLiked: true,
        timestamp: Date.now() - 86400000,
        linkedRecipeId: '1',
        linkedRecipeTitle: '草莓奶油独角兽杯子蛋糕'
      }
    ];
    setCommunityPosts(defaultPosts);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateRecipe = async () => {
    setLoadingState('generating_recipe');
    try {
      let recipe: Recipe;

      if (generationMode === 'text') {
        if (!promptInput.trim()) return;
        recipe = await generateRecipe(promptInput, dietaryInput);
      } else {
        if (!selectedImage) return;
        const matches = selectedImage.match(/^data:(.+);base64,(.+)$/);
        const mimeType = matches ? matches[1] : 'image/jpeg';
        
        recipe = await generateRecipeFromImage(selectedImage, mimeType);
      }
      
      setActiveRecipe(recipe);
      setView(AppView.RECIPE_DETAIL);
      
      if (generationMode === 'text') {
          setLoadingState('generating_image');
          const imageUrl = await generateRecipeImage(recipe.title);
          if (imageUrl) {
            setActiveRecipe(prev => prev ? { ...prev, imageUrl } : null);
          }
      }
    } catch (error) {
      console.error("Generation failed", error);
      alert("哎呀，魔法失效了！请重试一下。");
    } finally {
      setLoadingState('idle');
    }
  };

  const saveCurrentRecipe = () => {
    if (activeRecipe && !savedRecipes.find(r => r.id === activeRecipe.id)) {
      setSavedRecipes(prev => [activeRecipe, ...prev]);
    }
    setView(AppView.HOME);
  };

  // Community Functions
  const handleLikePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handlePublishPost = () => {
    if (!newPostImage) {
        alert("请上传一张照片哦！");
        return;
    }
    
    let linkedRecipeTitle = undefined;
    if (newPostRecipeId) {
        const r = savedRecipes.find(rec => rec.id === newPostRecipeId);
        if (r) linkedRecipeTitle = r.title;
    }

    const newPost: CommunityPost = {
        id: Date.now().toString(),
        userId: 'currentUser',
        userName: '我',
        userAvatar: '👩‍🍳',
        image: newPostImage,
        caption: newPostCaption,
        likes: 0,
        isLiked: false,
        timestamp: Date.now(),
        linkedRecipeId: newPostRecipeId || undefined,
        linkedRecipeTitle
    };

    setCommunityPosts([newPost, ...communityPosts]);
    
    // Reset
    setNewPostImage(null);
    setNewPostCaption('');
    setNewPostRecipeId('');
    setView(AppView.COMMUNITY);
  };

  // Render Functions
  const renderHome = () => (
    <div className="pb-24">
      <header className="bg-white/80 backdrop-blur-md p-6 pb-4 sticky top-0 z-10 border-b border-cute-border">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                   <IconBunnyLogo className="w-full h-full" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-cute-text tracking-tight font-sans">Bunny Bakes</h1>
                  <p className="text-cute-subtext text-xs font-medium">今天想做点什么好吃的？</p>
                </div>
            </div>
            {/* Optional: User avatar placeholder */}
            <div className="bg-cute-pink/20 w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                 <span className="text-lg">👩‍🍳</span>
            </div>
        </div>
      </header>

      <div className="p-4 space-y-8">
        {/* Call to Action for Generation */}
        <div 
          onClick={() => setView(AppView.GENERATE)}
          className="group relative bg-cute-pink rounded-[2rem] p-6 text-white shadow-cute hover:shadow-cute-hover cursor-pointer transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:shadow-cute-active overflow-hidden"
        >
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <div className="bg-white/30 w-fit px-3 py-1 rounded-full text-xs font-bold mb-3 backdrop-blur-sm flex items-center gap-1">
                        <IconWand className="w-3 h-3" /> AI 魔法厨房
                    </div>
                    <h2 className="text-2xl font-black mb-1">开始创作！</h2>
                    <p className="text-white/90 text-sm font-medium">输入想法 或 上传美食照片</p>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                    <IconPlus className="w-8 h-8 text-white" />
                </div>
            </div>
        </div>

        {/* Saved Recipes List */}
        <div>
            <div className="flex items-center gap-2 mb-4 px-2">
                <IconBook className="w-5 h-5 text-cute-pinkDark" />
                <h2 className="font-bold text-cute-text text-xl">我的食谱书</h2>
            </div>
            <div className="grid grid-cols-1 gap-5">
                {savedRecipes.map(recipe => (
                    <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        onClick={(r) => {
                            setActiveRecipe(r);
                            setView(AppView.RECIPE_DETAIL);
                        }} 
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );

  const renderGenerator = () => (
    <div className="flex flex-col h-full bg-cute-bg">
      <div className="p-4 flex items-center space-x-4">
        <button onClick={() => setView(AppView.HOME)} className="p-3 bg-white hover:bg-cute-pink/10 rounded-2xl shadow-sm border border-cute-border transition-colors">
            <IconArrowLeft className="w-6 h-6 text-cute-text" />
        </button>
        <h2 className="font-black text-xl text-cute-text">新食谱魔法</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loadingState === 'generating_recipe' ? (
             <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="relative">
                    <div className="w-24 h-24 bg-cute-pink/20 rounded-full animate-ping absolute top-0 left-0"></div>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-cute border-4 border-cute-pink relative z-10 overflow-hidden">
                        <IconBunnyLogo className="w-full h-full" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-cute-text mb-2">Bunny 正在思考...</h3>
                    <p className="text-cute-subtext">正在分析成分并编写步骤 (🐰...)</p>
                </div>
             </div>
        ) : (
            <>
                {/* Tabs */}
                <div className="flex bg-white p-1 rounded-2xl shadow-inner border border-cute-border">
                    <button 
                        onClick={() => setGenerationMode('text')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${generationMode === 'text' ? 'bg-cute-pink text-white shadow-sm' : 'text-cute-subtext hover:bg-cute-bg'}`}
                    >
                        <span className="text-lg">✍️</span> 文字描述
                    </button>
                    <button 
                        onClick={() => setGenerationMode('image')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${generationMode === 'image' ? 'bg-cute-blue text-white shadow-sm' : 'text-cute-subtext hover:bg-cute-bg'}`}
                    >
                        <span className="text-lg">📷</span> 看图反推
                    </button>
                </div>

                {generationMode === 'text' ? (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-cute-text ml-1">你想做什么好吃的？</label>
                            <textarea 
                                className="w-full p-5 bg-white border-2 border-cute-border rounded-3xl focus:ring-4 focus:ring-cute-pink/20 focus:border-cute-pink focus:outline-none min-h-[140px] resize-none text-cute-text placeholder-cute-subtext/60 shadow-sm transition-all"
                                placeholder="比如：我想做那种软软的、拉丝的日式生吐司..."
                                value={promptInput}
                                onChange={(e) => setPromptInput(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-cute-text ml-1">有什么特殊要求吗？</label>
                            <input 
                                type="text"
                                className="w-full p-5 bg-white border-2 border-cute-border rounded-3xl focus:ring-4 focus:ring-cute-pink/20 focus:border-cute-pink focus:outline-none text-cute-text placeholder-cute-subtext/60 shadow-sm transition-all"
                                placeholder="比如：少糖、不要肉桂..."
                                value={dietaryInput}
                                onChange={(e) => setDietaryInput(e.target.value)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fadeIn">
                         <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full h-64 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${selectedImage ? 'border-cute-blue bg-white' : 'border-cute-blue/30 bg-cute-blue/5 hover:bg-cute-blue/10'}`}
                         >
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={(e) => handleImageUpload(e, setSelectedImage)}
                            />
                            {selectedImage ? (
                                <img src={selectedImage} alt="Selected" className="w-full h-full object-contain rounded-2xl p-2" />
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 bg-cute-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 text-cute-blue">
                                        <IconCamera className="w-8 h-8" />
                                    </div>
                                    <p className="font-bold text-cute-text">点击上传美食照片</p>
                                    <p className="text-xs text-cute-subtext mt-1">Bunny 会帮你分析它的做法哦！</p>
                                </div>
                            )}
                         </div>
                         {selectedImage && (
                             <button onClick={() => {setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value = ''}} className="text-xs text-cute-pink font-bold w-full text-center hover:underline">
                                 重新选择
                             </button>
                         )}
                    </div>
                )}

                <div className="pt-4">
                     <button 
                        onClick={handleGenerateRecipe}
                        disabled={(generationMode === 'text' && !promptInput.trim()) || (generationMode === 'image' && !selectedImage)}
                        className={`w-full py-5 rounded-2xl font-black text-lg shadow-cute transform transition-all active:translate-y-1 active:shadow-cute-active flex items-center justify-center gap-2 border-2 ${
                            (generationMode === 'text' && !promptInput.trim()) || (generationMode === 'image' && !selectedImage)
                            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed shadow-none' 
                            : generationMode === 'text' 
                                ? 'bg-cute-pink text-white border-cute-pinkDark hover:bg-cute-pinkDark' 
                                : 'bg-cute-blue text-white border-cute-blueDark hover:bg-cute-blueDark'
                        }`}
                    >
                        <IconWand className="w-6 h-6" />
                        {generationMode === 'text' ? '生成美味食谱' : '分析并生成食谱'}
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="pb-24 bg-cute-bg min-h-screen">
      <div className="bg-white/80 backdrop-blur-md p-6 sticky top-0 z-10 border-b border-cute-border flex items-center justify-between">
          <h2 className="text-2xl font-black text-cute-text">烘焙社区</h2>
          <div className="bg-cute-yellow/20 px-3 py-1 rounded-full text-xs font-bold text-yellow-700 border border-cute-yellow">
              {communityPosts.length} 个分享
          </div>
      </div>
      
      <div className="p-4 space-y-6">
         {communityPosts.map(post => (
             <div key={post.id} className="bg-white rounded-[2rem] p-4 shadow-cute border border-cute-border">
                 <div className="flex items-center gap-3 mb-3">
                     <div className="w-10 h-10 bg-cute-blue/20 rounded-full flex items-center justify-center text-lg border-2 border-white shadow-sm">
                         {post.userAvatar}
                     </div>
                     <div>
                         <h3 className="font-bold text-cute-text text-sm">{post.userName}</h3>
                         <span className="text-[10px] text-cute-subtext">
                             {new Date(post.timestamp).toLocaleDateString()}
                         </span>
                     </div>
                 </div>

                 <div className="rounded-2xl overflow-hidden mb-3 border-2 border-cute-bg">
                     <img src={post.image} alt="Community Post" className="w-full h-64 object-cover" />
                 </div>

                 <p className="text-cute-text text-sm mb-3 leading-relaxed px-1">
                     {post.caption}
                 </p>

                 {post.linkedRecipeTitle && (
                     <div 
                        onClick={() => {
                            const r = savedRecipes.find(sr => sr.id === post.linkedRecipeId);
                            if (r) {
                                setActiveRecipe(r);
                                setView(AppView.RECIPE_DETAIL);
                            }
                        }}
                        className="bg-cute-bg p-3 rounded-xl flex items-center gap-3 mb-3 cursor-pointer hover:bg-cute-pink/10 transition-colors"
                     >
                         <div className="bg-white p-1 rounded-lg">
                             <IconBook className="w-4 h-4 text-cute-pink" />
                         </div>
                         <span className="text-xs font-bold text-cute-text flex-1 truncate">
                             参考: {post.linkedRecipeTitle}
                         </span>
                         <IconArrowLeft className="w-4 h-4 rotate-180 text-cute-subtext" />
                     </div>
                 )}

                 <div className="flex items-center justify-between px-1">
                     <button 
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-1.5 group transition-all"
                     >
                         {post.isLiked ? (
                             <IconHeartFilled className="w-6 h-6 text-red-400 transition-transform active:scale-125" />
                         ) : (
                             <IconHeart className="w-6 h-6 text-cute-subtext group-hover:text-red-400 transition-colors" />
                         )}
                         <span className={`text-sm font-bold ${post.isLiked ? 'text-red-400' : 'text-cute-subtext'}`}>
                             {post.likes}
                         </span>
                     </button>
                 </div>
             </div>
         ))}
      </div>

      {/* FAB to create post */}
      <button 
          onClick={() => setView(AppView.CREATE_POST)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-cute-text text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-20 border-2 border-white"
      >
          <IconPlus className="w-8 h-8" />
      </button>
    </div>
  );

  const renderCreatePost = () => (
    <div className="flex flex-col h-full bg-cute-bg">
      <div className="p-4 flex items-center space-x-4">
        <button onClick={() => setView(AppView.COMMUNITY)} className="p-3 bg-white hover:bg-cute-pink/10 rounded-2xl shadow-sm border border-cute-border transition-colors">
            <IconArrowLeft className="w-6 h-6 text-cute-text" />
        </button>
        <h2 className="font-black text-xl text-cute-text">分享美味</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div 
            onClick={() => postFileInputRef.current?.click()}
            className={`w-full aspect-square border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${newPostImage ? 'border-cute-blue bg-white p-2' : 'border-cute-blue/30 bg-cute-blue/5 hover:bg-cute-blue/10'}`}
        >
            <input 
                type="file" 
                accept="image/*" 
                ref={postFileInputRef} 
                className="hidden" 
                onChange={(e) => handleImageUpload(e, setNewPostImage)}
            />
            {newPostImage ? (
                <div className="relative w-full h-full">
                     <img src={newPostImage} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                     <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setNewPostImage(null);
                        }}
                        className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-cute-pink font-bold shadow-sm"
                     >
                        ✕
                     </button>
                </div>
            ) : (
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-cute-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 text-cute-blue">
                        <IconCamera className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-cute-text">上传成品图</p>
                    <p className="text-xs text-cute-subtext mt-1">让大家看看你的杰作！</p>
                </div>
            )}
        </div>

        <div className="space-y-2">
            <label className="text-sm font-bold text-cute-text ml-1">心得体会</label>
            <textarea 
                className="w-full p-5 bg-white border-2 border-cute-border rounded-3xl focus:ring-4 focus:ring-cute-pink/20 focus:border-cute-pink focus:outline-none min-h-[140px] resize-none text-cute-text placeholder-cute-subtext/60 shadow-sm transition-all"
                placeholder="分享一下制作过程中的趣事或者口感吧..."
                value={newPostCaption}
                onChange={(e) => setNewPostCaption(e.target.value)}
            />
        </div>
        
        <div className="space-y-2">
            <label className="text-sm font-bold text-cute-text ml-1">关联食谱</label>
            <select
                value={newPostRecipeId}
                onChange={(e) => setNewPostRecipeId(e.target.value)}
                className="w-full p-4 bg-white border-2 border-cute-border rounded-3xl focus:ring-4 focus:ring-cute-pink/20 focus:border-cute-pink focus:outline-none text-cute-text shadow-sm transition-all appearance-none"
            >
                <option value="">不关联食谱</option>
                {savedRecipes.map(recipe => (
                    <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                ))}
            </select>
        </div>

        <div className="pt-4 pb-20">
             <button 
                onClick={handlePublishPost}
                disabled={!newPostImage}
                className={`w-full py-5 rounded-2xl font-black text-lg shadow-cute transform transition-all active:translate-y-1 active:shadow-cute-active flex items-center justify-center gap-2 border-2 ${
                    !newPostImage
                    ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed shadow-none' 
                    : 'bg-cute-pink text-white border-cute-pinkDark hover:bg-cute-pinkDark'
                }`}
            >
                <IconSend className="w-6 h-6" />
                发布到社区
            </button>
        </div>
      </div>
    </div>
  );

  const renderRecipeDetail = () => {
      if (!activeRecipe) return null;

      // Default fallback image if none is generated (Unsplash Baking Image)
      const displayImage = activeRecipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80';

      return (
        <div className="pb-24 bg-white min-h-screen">
             <div className="relative h-72 w-full bg-cute-bg group overflow-hidden">
                {/* Image Display Logic */}
                {loadingState === 'generating_image' ? (
                     <div className="w-full h-full flex flex-col items-center justify-center text-cute-pink bg-cute-bg">
                        <div className="w-12 h-12 border-4 border-cute-pink border-t-transparent rounded-full animate-spin mb-3"></div>
                        <span className="font-bold text-sm text-cute-subtext animate-pulse">正在绘制美食插图...</span>
                     </div>
                ) : (
                     <img 
                        src={displayImage} 
                        alt={activeRecipe.title} 
                        className="w-full h-full object-cover animate-fadeIn transition-transform duration-700 hover:scale-105" 
                     />
                )}
                
                {/* Overlay gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

                <button 
                    onClick={() => setView(AppView.HOME)}
                    className="absolute top-6 left-6 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm hover:bg-white transition-all border border-white"
                >
                    <IconArrowLeft className="w-6 h-6 text-cute-text" />
                </button>
             </div>

             <div className="p-8 -mt-10 bg-white rounded-t-[2.5rem] relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col gap-3 mb-6">
                    <span className={`w-fit px-4 py-1.5 rounded-full text-xs font-bold border ${
                        activeRecipe.difficulty === '简单' ? 'bg-cute-green/20 text-cute-greenDark border-cute-green' :
                        activeRecipe.difficulty === '中等' ? 'bg-cute-yellow/20 text-yellow-600 border-cute-yellow' :
                        'bg-cute-pink/20 text-cute-pinkDark border-cute-pink'
                    }`}>
                        难度: {activeRecipe.difficulty}
                    </span>
                    <h1 className="text-3xl font-black text-cute-text leading-tight">{activeRecipe.title}</h1>
                </div>
                
                <p className="text-cute-text/80 mb-8 leading-relaxed bg-cute-bg p-5 rounded-2xl border border-cute-border">
                    {activeRecipe.description}
                </p>

                <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex-1 bg-cute-blue/10 p-4 rounded-3xl text-center border-2 border-cute-blue/20 min-w-[100px]">
                        <span className="block text-xs text-cute-blueDark font-bold uppercase tracking-wider mb-1">准备时间</span>
                        <span className="font-black text-cute-text text-lg">{activeRecipe.prepTime}</span>
                    </div>
                    <div className="flex-1 bg-cute-pink/10 p-4 rounded-3xl text-center border-2 border-cute-pink/20 min-w-[100px]">
                        <span className="block text-xs text-cute-pinkDark font-bold uppercase tracking-wider mb-1">烹饪时间</span>
                        <span className="font-black text-cute-text text-lg">{activeRecipe.cookTime}</span>
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="text-xl font-black text-cute-text mb-6 flex items-center gap-2">
                        <span className="bg-cute-yellow w-8 h-8 rounded-lg flex items-center justify-center text-sm">🥚</span> 
                        准备食材
                    </h3>
                    <ul className="space-y-3">
                        {activeRecipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex justify-between items-center p-3 hover:bg-cute-bg rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cute-subtext group-hover:bg-cute-pink transition-colors"></div>
                                    <span className="text-cute-text font-medium">{ing.name}</span>
                                </div>
                                <span className="font-bold text-cute-text bg-white border border-cute-border px-3 py-1 rounded-lg shadow-sm">{ing.amount}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-24">
                    <h3 className="text-xl font-black text-cute-text mb-6 flex items-center gap-2">
                        <span className="bg-cute-green w-8 h-8 rounded-lg flex items-center justify-center text-sm">🥣</span> 
                        制作步骤
                    </h3>
                    <div className="space-y-8 relative">
                        {/* Connecting line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-cute-border -z-10"></div>
                        
                        {activeRecipe.steps.map((step) => (
                            <div key={step.stepNumber} className="flex gap-5">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-4 border-cute-pink text-cute-pinkDark flex items-center justify-center font-black shadow-sm z-10">
                                    {step.stepNumber}
                                </div>
                                <div className="bg-white border-2 border-cute-bg p-5 rounded-2xl rounded-tl-none shadow-sm flex-1">
                                    <p className="text-cute-text leading-relaxed font-medium">
                                        {step.instruction}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>

             {/* Floating Save Button if not saved */}
             {!savedRecipes.find(r => r.id === activeRecipe.id) && (
                 <div className="fixed bottom-24 left-0 right-0 p-6 pointer-events-none flex justify-center z-50">
                     <button 
                        onClick={saveCurrentRecipe}
                        className="bg-cute-text text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-gray-800 pointer-events-auto transform transition-all active:scale-95 hover:-translate-y-1 flex items-center gap-3 border-4 border-white/20"
                     >
                        <IconPlus className="w-5 h-5" />
                        放入食谱书
                     </button>
                 </div>
             )}
        </div>
      );
  };

  const renderView = () => {
    switch(view) {
        case AppView.HOME: return renderHome();
        case AppView.GENERATE: return renderGenerator();
        case AppView.RECIPE_DETAIL: return renderRecipeDetail();
        case AppView.CHAT: return <ChatInterface history={chatHistory} setHistory={setChatHistory} />;
        case AppView.COMMUNITY: return renderCommunity();
        case AppView.CREATE_POST: return renderCreatePost();
        default: return renderHome();
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-cute-bg overflow-hidden flex flex-col relative shadow-2xl selection:bg-cute-pink selection:text-white">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        {renderView()}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-4 right-4 z-50">
          <nav className="h-20 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex justify-between items-center px-4">
            <button 
                onClick={() => setView(AppView.HOME)}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${view === AppView.HOME ? 'text-cute-pink -translate-y-2' : 'text-cute-subtext hover:text-cute-pink/70'}`}
            >
                <div className={`p-2 rounded-2xl ${view === AppView.HOME ? 'bg-cute-pink/10' : ''}`}>
                    <IconHome className={`w-5 h-5 ${view === AppView.HOME ? 'fill-current' : ''}`} />
                </div>
                <span className={`text-[9px] font-bold mt-1 ${view === AppView.HOME ? 'opacity-100' : 'opacity-0'}`}>首页</span>
            </button>

            <button 
                onClick={() => setView(AppView.GENERATE)}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${view === AppView.GENERATE ? 'text-cute-blue -translate-y-2' : 'text-cute-subtext hover:text-cute-blue/70'}`}
            >
                <div className={`p-2 rounded-2xl ${view === AppView.GENERATE ? 'bg-cute-blue/10' : ''}`}>
                    <IconWand className={`w-5 h-5 ${view === AppView.GENERATE ? 'fill-current' : ''}`} />
                </div>
                <span className={`text-[9px] font-bold mt-1 ${view === AppView.GENERATE ? 'opacity-100' : 'opacity-0'}`}>创作</span>
            </button>

            <button 
                onClick={() => setView(AppView.COMMUNITY)}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${[AppView.COMMUNITY, AppView.CREATE_POST].includes(view) ? 'text-yellow-500 -translate-y-2' : 'text-cute-subtext hover:text-yellow-500/70'}`}
            >
                <div className={`p-2 rounded-2xl ${[AppView.COMMUNITY, AppView.CREATE_POST].includes(view) ? 'bg-yellow-100' : ''}`}>
                    <IconCommunity className={`w-5 h-5 ${[AppView.COMMUNITY, AppView.CREATE_POST].includes(view) ? 'fill-current' : ''}`} />
                </div>
                <span className={`text-[9px] font-bold mt-1 ${[AppView.COMMUNITY, AppView.CREATE_POST].includes(view) ? 'opacity-100' : 'opacity-0'}`}>社区</span>
            </button>

            <button 
                onClick={() => setView(AppView.CHAT)}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${view === AppView.CHAT ? 'text-cute-greenDark -translate-y-2' : 'text-cute-subtext hover:text-cute-greenDark/70'}`}
            >
                <div className={`p-2 rounded-2xl ${view === AppView.CHAT ? 'bg-cute-green/20' : ''}`}>
                    <IconMessage className={`w-5 h-5 ${view === AppView.CHAT ? 'fill-current' : ''}`} />
                </div>
                <span className={`text-[9px] font-bold mt-1 ${view === AppView.CHAT ? 'opacity-100' : 'opacity-0'}`}>问 Bunny</span>
            </button>
          </nav>
      </div>
    </div>
  );
}

export default App;