
import React, { useState } from 'react';
import { AppScreen, Category, GameSettings } from '../types';
import { CATEGORIES } from '../constants';
import { generateWordPair } from '../services/geminiService';
import { WORD_BANKS } from '../data/wordBanks';

interface CategoryScreenProps {
  onNavigate: (screen: AppScreen) => void;
  updateSettings: (updates: Partial<GameSettings>) => void;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({ onNavigate, updateSettings }) => {
  const [selectedId, setSelectedId] = useState<string>('default');
  const [customA, setCustomA] = useState('');
  const [customB, setCustomB] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Custom Library State
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLibName, setNewLibName] = useState('');
  const [newLibUrl, setNewLibUrl] = useState('');

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // 1. Manual Entry Pair
      if (selectedId === 'custom') {
        if (!customA.trim() || !customB.trim()) {
          alert("请输入自定义词语");
          setIsLoading(false);
          return;
        }
        updateSettings({
          categoryId: 'manual',
          wordPair: { civilian: customA, spy: customB },
          categoryName: '自定义',
          customWordBank: [] // Clear custom bank
        });
        onNavigate(AppScreen.SETUP);
        return;
      }

      // 2. Check if it's a Custom Remote Library
      const customCat = customCategories.find(c => c.id === selectedId);
      if (customCat && customCat.sourceUrl) {
        try {
          const response = await fetch(customCat.sourceUrl);
          if (!response.ok) throw new Error('Network response was not ok');
          
          const data = await response.json();
          if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid JSON: Must be a non-empty array');
          }

          // Validate structure of random item
          const randomItem = data[Math.floor(Math.random() * data.length)];
          if (!randomItem.civilian || !randomItem.spy) {
             throw new Error('Invalid JSON Item: Must contain civilian and spy keys');
          }

          updateSettings({
            categoryId: customCat.id,
            wordPair: randomItem, // Set initial pair
            categoryName: customCat.name,
            customWordBank: data // Store the full bank for re-rolling
          });
          onNavigate(AppScreen.SETUP);
        } catch (err: any) {
          alert(`词库加载失败: ${err.message}`);
        }
        setIsLoading(false);
        return;
      }

      // 3. Local Library or AI Generation
      const category = CATEGORIES.find(c => c.id === selectedId);
      // Pass both ID (for local lookup) and Name (for AI prompt)
      const pair = await generateWordPair(category?.id || 'default', category?.name || '通用');
      
      updateSettings({
        categoryId: category?.id || 'default',
        wordPair: pair,
        categoryName: category?.name || '默认',
        customWordBank: [] // Clear custom bank
      });
      onNavigate(AppScreen.SETUP);
    } catch (e) {
      console.error(e);
      alert("词语生成失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLibrary = () => {
    if (!newLibName.trim() || !newLibUrl.trim()) {
      alert("请填写完整信息");
      return;
    }
    
    const newCat: Category = {
      id: `custom_${Date.now()}`,
      name: newLibName,
      icon: 'link', // Symbol for external link
      description: '远程自定义词库',
      sourceUrl: newLibUrl
    };

    setCustomCategories([...customCategories, newCat]);
    setNewLibName('');
    setNewLibUrl('');
    setIsModalOpen(false);
    // Auto select the new category
    setSelectedId(newCat.id);
  };

  const allCategories = [...CATEGORIES, ...customCategories];

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-charcoal text-white overflow-hidden relative">
      <header className="sticky top-0 z-40 flex items-center p-4 border-b border-white/5 bg-charcoal/90 backdrop-blur-md pt-safe">
         <button onClick={() => onNavigate(AppScreen.SETUP)} className="p-2 -ml-2 text-gray-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
         </button>
        <h2 className="text-lg font-bold flex-1 text-center">选择词库</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 -mr-2 text-primary hover:text-white transition-colors"
          title="新建词库"
        >
          <span className="material-symbols-outlined">add_circle</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="px-5 pt-6 pb-2">
          <p className="text-gray-400 text-sm font-medium text-center">
            选择模式获取随机词，或新建远程词库。
          </p>
        </div>

        <section>
          <div className="px-5 pt-6 pb-3">
            <h3 className="text-lg font-bold">游戏模式</h3>
          </div>
          <div className="flex flex-col gap-3 px-5">
            {allCategories.map((cat) => {
              const count = WORD_BANKS[cat.id]?.length;
              
              return (
                <div 
                  key={cat.id} 
                  onClick={() => handleSelect(cat.id)}
                  className={`relative group cursor-pointer transition-all duration-200 ${selectedId === cat.id ? 'transform scale-[1.01]' : ''}`}
                >
                  <div className={`flex items-center gap-5 p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedId === cat.id 
                      ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10' 
                      : 'bg-charcoal-surface border-transparent hover:border-white/10'
                  }`}>
                    <div className={`size-14 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg ${
                       selectedId === cat.id ? 'bg-primary shadow-primary/20' : 'bg-white/5 text-gray-400'
                    }`}>
                      <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                          <p className={`text-xl font-bold truncate ${selectedId === cat.id ? 'text-white' : 'text-gray-300'}`}>{cat.name}</p>
                          {count !== undefined && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                                  selectedId === cat.id 
                                  ? 'bg-white/20 text-white border-white/20' 
                                  : 'bg-charcoal-element text-gray-500 border-white/5'
                              }`}>
                                  {count}组
                              </span>
                          )}
                      </div>
                      <p className="text-gray-500 text-sm truncate">{cat.description}</p>
                    </div>
                    {selectedId === cat.id && (
                      <div className="bg-primary text-white rounded-full p-1 shadow-sm animate-fade-in shrink-0">
                        <span className="material-symbols-outlined text-base font-bold">check</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="w-full px-5 py-8 flex items-center gap-4">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-xs uppercase tracking-wider font-bold text-gray-500">或</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <section className="px-5" onClick={() => handleSelect('custom')}>
          <div className="flex justify-between items-center pb-4">
            <h3 className="text-lg font-bold">自定义词对</h3>
            {selectedId === 'custom' && (
                <div className="bg-primary text-white rounded-full p-1 shadow-sm animate-fade-in">
                  <span className="material-symbols-outlined text-base font-bold">check</span>
                </div>
            )}
          </div>
          <div className={`bg-charcoal-surface p-4 rounded-2xl border transition-all duration-200 ${selectedId === 'custom' ? 'border-primary ring-1 ring-primary/30' : 'border-white/5'}`}>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 ml-1">平民词 (A)</label>
                <div className="relative">
                  <input 
                    value={customA}
                    onChange={(e) => { setCustomA(e.target.value); if(selectedId !== 'custom') handleSelect('custom'); }}
                    className="w-full h-14 pl-4 pr-10 rounded-xl bg-charcoal border-2 border-transparent focus:border-primary focus:ring-0 text-white placeholder-gray-600 font-medium transition-all outline-none" 
                    placeholder="例如：咖啡" 
                    type="text" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 ml-1">卧底词 (B)</label>
                <div className="relative">
                  <input 
                    value={customB}
                    onChange={(e) => { setCustomB(e.target.value); if(selectedId !== 'custom') handleSelect('custom'); }}
                    className="w-full h-14 pl-4 pr-10 rounded-xl bg-charcoal border-2 border-transparent focus:border-primary focus:ring-0 text-white placeholder-gray-600 font-medium transition-all outline-none" 
                    placeholder="例如：茶" 
                    type="text" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                    <span className="material-symbols-outlined">visibility_off</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-5 bg-charcoal border-t border-white/5 backdrop-blur-xl bg-opacity-95 z-30 max-w-md mx-auto right-0 pb-safe">
        <button 
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-hover text-charcoal font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
             <span className="animate-spin material-symbols-outlined">progress_activity</span>
          ) : (
             <>
                <span>确认选择</span>
                <span className="material-symbols-outlined">check</span>
             </>
          )}
        </button>
      </div>

      {/* New Library Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-charcoal-surface rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">新建远程词库</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 ml-1">词库名称</label>
                  <input 
                    value={newLibName}
                    onChange={(e) => setNewLibName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-charcoal border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-600 outline-none"
                    placeholder="我的自制词库"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 ml-1">JSON 链接 (URL)</label>
                  <input 
                    value={newLibUrl}
                    onChange={(e) => setNewLibUrl(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-charcoal border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-600 outline-none"
                    placeholder="https://example.com/words.json"
                  />
                  <p className="text-[10px] text-gray-500 mt-1.5 ml-1">
                    格式: <code>[{'{"civilian":"A", "spy":"B"}'}, ...]</code>
                  </p>
                </div>
              </div>

              <button 
                onClick={handleAddLibrary}
                className="w-full h-12 bg-primary hover:bg-primary-hover text-charcoal font-bold rounded-xl shadow-lg transition-all active:scale-95"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
