import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag,
  Palette,
  ChefHat,
  ChevronRight,
  Info
} from 'lucide-react';
import { Category, StoreSettings, ThemeConfig } from '../types';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  theme: ThemeConfig;
  storeSettings: StoreSettings;
  onOpenAdmin: () => void;
  productCount: number;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onSelectCategory,
  theme,
  storeSettings,
  onOpenAdmin,
  productCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className={`w-screen max-w-md ${theme.cardBg} ${theme.glassBlur} shadow-2xl border-r border-white/20 flex flex-col justify-between overflow-y-auto`}>
          
          {/* Header */}
          <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md bg-stone-900 flex-shrink-0">
                <img
                  src={storeSettings.storeLogoUrl}
                  alt={storeSettings.storeName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className={`font-serif font-black text-lg sm:text-xl leading-tight ${
                  theme.category === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  {storeSettings.storeName}
                </h3>
                <p className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
                  {storeSettings.tagline}
                </p>
              </div>
            </div>

            <button
              id="btn-close-side-drawer"
              onClick={onClose}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all text-stone-700 dark:text-stone-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-6 flex-1">
            
            {/* Quick Actions (Call & WhatsApp) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                Quick Contact & Orders
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${storeSettings.phoneNumber.replace(/[^+\d]/g, '')}`}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white border border-emerald-500/30 transition-all font-semibold text-xs shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Store</span>
                </a>

                <a
                  href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^+\d]/g, '')}?text=Bonjour%20Depanneur%20Eilika,%20je%20souhaite%20commander`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-600/10 hover:bg-green-600 text-green-700 dark:text-green-300 hover:text-white border border-green-500/30 transition-all font-semibold text-xs shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Category Navigation List */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Shop Aisles ({categories.length})
                </h4>
                <span className="text-[10px] text-amber-500 font-semibold">
                  {productCount} items available
                </span>
              </div>

              <div className="space-y-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      id={`drawer-category-${cat.id}`}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        onClose();
                        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-xs font-semibold ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold shadow-md'
                          : 'hover:bg-black/5 dark:hover:bg-white/10 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">
                          {cat.id === 'snacks' ? '🍿' : cat.id === 'drinks' ? '🥤' : cat.id === 'chocolate' ? '🍫' : cat.id === 'fresh-deli' ? '🥖' : cat.id === 'bakery' ? '🥐' : cat.id === 'artisanal' ? '⚜️' : '🛍️'}
                        </span>
                        <div className="text-left">
                          <span>{cat.name}</span>
                          {cat.nameFr && (
                            <span className="block text-[10px] opacity-70 font-normal">
                              {cat.nameFr}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Montreal Store Location & Map Link */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                <MapPin className="w-4 h-4" />
                <span>Montreal Store Location</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300">
                {storeSettings.streetAddress}<br />
                {storeSettings.cityProvince}
              </p>
              <a
                href={storeSettings.mapUrl}
                target="_blank"
                rel="noreferrer"
                id="drawer-google-maps-link"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Montreal Opening Hours */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Store Hours (Montreal Time)</span>
              </div>
              <div className="space-y-1 text-stone-600 dark:text-stone-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{storeSettings.openingHours.weekdays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{storeSettings.openingHours.saturday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{storeSettings.openingHours.sunday}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer with Admin Login & Version */}
          <div className="p-5 border-t border-black/10 dark:border-white/10 bg-black/10 dark:bg-black/40 space-y-3">
            <button
              id="drawer-btn-admin"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 hover:from-amber-300 hover:to-orange-400 font-black text-xs shadow-lg shadow-amber-500/25 transition-all active:scale-95 border-2 border-amber-300"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Admin Dashboard (Password: admin 123)</span>
            </button>

            <div className={`text-center text-[10px] ${theme.textMuted}`}>
              Dépanneur Eilika Montreal • Artisanal Delicatessen
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
