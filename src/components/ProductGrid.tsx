import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Tag, 
  ShoppingBag, 
  Cookie, 
  CupSoda, 
  Candy, 
  Utensils, 
  Croissant 
} from 'lucide-react';
import { Category, Product, ThemeConfig } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: ThemeConfig;
  cartMap: Record<string, number>;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  theme,
  cartMap,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');
  const [showOffersOnly, setShowOffersOnly] = useState(false);

  // Filter products by category, search query, and offers
  const filteredProducts = products.filter((p) => {
    // Category match
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;

    // Search match
    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameFr && p.nameFr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Offers only filter
    const matchOffers = !showOffersOnly || Boolean(p.offer);

    return matchCategory && matchSearch && matchOffers;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'discount') {
      const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
      const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
      return discB - discA;
    }
    // Default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // Distinct category list for sectioned display when "All" is active
  const categorySections = categories.filter((c) => c.id !== 'all');

  return (
    <section id="products-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 space-y-8">
      
      {/* Category Pills & Filter Controls Bar */}
      <div className={`p-4 sm:p-5 rounded-3xl ${theme.cardBg} ${theme.cardBorder} border shadow-lg backdrop-blur-xl space-y-4`}>
        
        {/* Top Filter & Search Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <div>
              <h2 className={`text-lg sm:text-xl font-black font-serif ${theme.textPrimary}`}>
                Delicatessen & Aisles
              </h2>
              <p className={`text-xs ${theme.textSecondary}`}>
                Showing {sortedProducts.length} curated Montreal convenience & gourmet items
              </p>
            </div>
          </div>

          {/* Search Input Bar + Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input Field */}
            <div className="relative flex-1 md:w-64">
              <input
                id="products-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search snacks, drinks, cheese..."
                className={`w-full pl-9 pr-8 py-2 rounded-2xl text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all shadow-sm ${
                  theme.category === 'dark'
                    ? 'bg-black/40 border-neutral-700 text-white placeholder-neutral-400'
                    : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
                }`}
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white"
                  title="Clear Search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Deals Only Toggle */}
            <button
              id="btn-filter-deals"
              onClick={() => setShowOffersOnly(!showOffersOnly)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                showOffersOnly
                  ? 'bg-red-600 text-white border-red-500 shadow-red-500/20'
                  : theme.category === 'dark'
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-red-400" />
              <span>Deals Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-medium shadow-sm ${
              theme.category === 'dark'
                ? 'bg-neutral-800 border-neutral-700 text-neutral-200'
                : 'bg-slate-100 border-slate-300 text-slate-900'
            }`}>
              <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
              <select
                id="select-sort-products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold"
              >
                <option value="featured" className="bg-stone-900 text-white">Featured Picks</option>
                <option value="price-asc" className="bg-stone-900 text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-stone-900 text-white">Price: High to Low</option>
                <option value="discount" className="bg-stone-900 text-white">Biggest Offers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Selector Pills Bar (Displays All Categories Visibly with Flex-Wrap) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1 select-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = cat.id === 'all'
              ? products.length
              : products.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                id={`btn-cat-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border active:scale-95 shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30 font-black ring-2 ring-amber-400/40'
                    : theme.category === 'dark'
                    ? 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border-neutral-700 hover:text-white hover:border-amber-400/50'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:text-slate-950 hover:border-amber-400/60'
                }`}
              >
                <span className="text-sm">
                  {cat.id === 'all' ? '🛒' : cat.id === 'snacks' ? '🍿' : cat.id === 'drinks' ? '🥤' : cat.id === 'chocolate' ? '🍫' : cat.id === 'fresh-deli' ? '🥖' : cat.id === 'bakery' ? '🥐' : cat.id === 'artisanal' ? '⚜️' : '🏷️'}
                </span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-black/20 text-slate-950'
                    : theme.category === 'dark'
                    ? 'bg-neutral-700 text-neutral-300'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Active Search & Filter Feedback Banner */}
      {searchQuery && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
          <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
            <Search className="w-4 h-4 text-amber-500" />
            <span>Search results for: <strong>"{searchQuery}"</strong></span>
          </div>
          <button
            onClick={() => onSearchChange('')}
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* PRODUCT GRID DISPLAY */}
      {sortedProducts.length === 0 ? (
        /* Empty Query Result */
        <div className="py-16 text-center space-y-3 rounded-3xl border border-white/20 bg-black/5 dark:bg-white/5">
          <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/10 mx-auto flex items-center justify-center text-stone-400">
            <Search className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
            No products matched your selection
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try choosing another category, resetting search filters, or exploring all aisles.
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
              setShowOffersOnly(false);
            }}
            className="mt-2 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
          >
            View All Products
          </button>
        </div>
      ) : activeCategory === 'all' && !searchQuery && !showOffersOnly ? (
        /* SECTIONED AISLES VIEW (Requested: "Snacks, Drinks, और Chocolate etc. के लिए अलग-अलग सेक्शन बनाएँ।") */
        <div className="space-y-12">
          {categorySections.map((section) => {
            const sectionProducts = sortedProducts.filter((p) => p.category === section.id);
            if (sectionProducts.length === 0) return null;

            return (
              <div key={section.id} id={`section-${section.id}`} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">
                      {section.id === 'snacks' ? '🍿' : section.id === 'drinks' ? '🥤' : section.id === 'chocolate' ? '🍫' : section.id === 'fresh-deli' ? '🥖' : section.id === 'bakery' ? '🥐' : section.id === 'artisanal' ? '⚜️' : '🛍️'}
                    </span>
                    <div>
                      <h3 className={`text-xl font-bold font-serif tracking-tight ${theme.textPrimary}`}>
                        {section.name}
                      </h3>
                      {section.nameFr && (
                        <p className={`text-xs font-semibold ${theme.accentText}`}>
                          {section.nameFr}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCategory(section.id)}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All {section.name} ({sectionProducts.length})</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Section Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {sectionProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      theme={theme}
                      cartQuantity={cartMap[product.id] || 0}
                      onAddToCart={onAddToCart}
                      onUpdateQuantity={onUpdateQuantity}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* UNIFIED FILTERED GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              theme={theme}
              cartQuantity={cartMap[product.id] || 0}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      )}

    </section>
  );
};
