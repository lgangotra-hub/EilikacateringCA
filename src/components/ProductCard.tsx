import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, ShoppingBag, Check, Sparkles, Tag } from 'lucide-react';
import { Product, ThemeConfig } from '../types';
import { ProductBadge } from './ProductBadge';

interface ProductCardProps {
  product: Product;
  theme: ThemeConfig;
  cartQuantity: number;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  theme,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [localQty, setLocalQty] = useState(1);

  const handleAdd = () => {
    onAddToCart(product, localQty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between ${theme.cardBg} ${theme.cardBorder} hover:-translate-y-1.5 hover:shadow-2xl border`}
      style={{
        boxShadow: isHovered
          ? `0 20px 35px -10px ${theme.glowColor}, 0 0 15px rgba(0,0,0,0.05)`
          : undefined,
      }}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800/60 mb-3.5">
        {/* Top-Left Corner: Authentic Red Ribbon Corner */}
        {product.offer ? (
          <div className="absolute top-0 left-0 z-20 overflow-hidden w-24 h-24 pointer-events-none">
            <div className="absolute top-[14px] left-[-32px] w-[120px] -rotate-45 bg-gradient-to-r from-red-700 via-red-600 to-rose-600 text-white font-black text-[9px] py-1 text-center uppercase tracking-wider shadow-[0_4px_12px_rgba(220,38,38,0.7)] border-y border-red-200/50">
              <span className="inline-block transform drop-shadow-sm font-extrabold">{product.offer}</span>
            </div>
          </div>
        ) : product.originalPrice && product.originalPrice > product.price ? (
          <div className="absolute top-0 left-0 z-20 overflow-hidden w-24 h-24 pointer-events-none">
            <div className="absolute top-[14px] left-[-32px] w-[120px] -rotate-45 bg-gradient-to-r from-red-700 via-red-600 to-rose-600 text-white font-black text-[9px] py-1 text-center uppercase tracking-wider shadow-[0_4px_12px_rgba(220,38,38,0.7)] border-y border-red-200/50">
              <span className="inline-block transform drop-shadow-sm font-extrabold">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          </div>
        ) : null}

        {/* Top-Right Corner: Selectable 5-Badge Style */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <ProductBadge
            badgeId={product.badgeId}
            customText={product.badgeText}
            size="sm"
          />
        </div>

        {/* Product Image with smooth zoom & shine effect */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs uppercase tracking-widest">
            Currently Out of Stock
          </div>
        )}

        {/* Unit / Weight Tag */}
        {product.unit && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium tracking-wide">
            {product.unit}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
              {product.category.replace('-', ' ')}
            </span>
            {product.isFeatured && (
              <span className="text-[9px] text-amber-500 flex items-center gap-0.5 font-semibold">
                <Sparkles className="w-2.5 h-2.5" /> Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-base font-bold line-clamp-2 mb-1 ${theme.textPrimary} group-hover:text-amber-500 transition-colors`}>
            {product.name}
          </h3>

          {/* French Name Subtitle if available */}
          {product.nameFr && (
            <p className="text-[11px] italic opacity-60 line-clamp-1 mb-1.5">
              {product.nameFr}
            </p>
          )}

          {/* Description */}
          <p className={`text-xs ${theme.textSecondary} line-clamp-2 mb-3 leading-relaxed`}>
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="pt-2 border-t border-black/5 dark:border-white/10 mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs line-through opacity-50 font-mono">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[10px] opacity-60 ml-auto font-sans">CAD + tax</span>
          </div>

          {/* Add to Cart with - + Stepper */}
          <div className="flex items-center gap-2">
            {cartQuantity > 0 ? (
              /* Already in Cart: Active Stepper */
              <div className="flex items-center justify-between w-full p-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200">
                <button
                  id={`btn-cart-decrease-${product.id}`}
                  onClick={() => onUpdateQuantity(product.id, cartQuantity - 1)}
                  className="w-8 h-8 rounded-lg bg-white/80 dark:bg-black/40 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all active:scale-90 font-bold"
                  title="Decrease Quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm px-2 text-center">
                  {cartQuantity} in cart
                </span>
                <button
                  id={`btn-cart-increase-${product.id}`}
                  onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white/80 dark:bg-black/40 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all active:scale-90 font-bold"
                  title="Increase Quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Not in cart: Quantity Selector & Add Button */
              <div className="flex items-center gap-1.5 w-full">
                {/* Stepper for first add */}
                <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-xl p-0.5 border border-white/20">
                  <button
                    onClick={() => setLocalQty(Math.max(1, localQty - 1))}
                    disabled={localQty <= 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-30 transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-xs">
                    {localQty}
                  </span>
                  <button
                    onClick={() => setLocalQty(localQty + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs hover:bg-black/10 dark:hover:bg-white/20 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  id={`btn-add-to-cart-${product.id}`}
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 shadow-[0_4px_15px_rgba(245,158,11,0.3)]'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart - +</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
