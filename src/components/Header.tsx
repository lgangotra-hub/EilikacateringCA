import React from 'react';
import { 
  Menu, 
  ShoppingBag, 
  Sparkles,
  MapPin,
  Clock,
  Phone
} from 'lucide-react';
import { StoreSettings, ThemeConfig } from '../types';
import { ThemeClock } from './ThemeClock';

interface HeaderProps {
  theme: ThemeConfig;
  storeSettings: StoreSettings;
  cartCount: number;
  onOpenMenu: () => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  storeSettings,
  cartCount,
  onOpenMenu,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300">
      {/* 1. TOP BAR: Scrolling Line / Marquee Announcement Ticker */}
      <div
        id="top-scrolling-bar"
        className={`w-full py-1.5 px-4 text-xs font-medium overflow-hidden whitespace-nowrap select-none ${theme.marqueeBg}`}
      >
        <div className="flex items-center space-x-12 animate-marquee inline-block">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="font-bold">{storeSettings.storeName}</strong> • {storeSettings.tagline}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{storeSettings.streetAddress}, {storeSettings.cityProvince}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Today: {storeSettings.openingHours.weekdays}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{storeSettings.announcementText}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct Orders: {storeSettings.phoneNumber}</span>
          </span>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className={`w-full transition-all duration-300 ${theme.headerBg} shadow-md border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-3">
          
          {/* LEFT SIDE: Store Logo & Store Name (High Contrast & Visible in every Theme) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="#"
              id="header-logo-name-link"
              className="flex items-center gap-2.5 sm:gap-3 group select-none"
              title={`${storeSettings.storeName} - ${storeSettings.tagline}`}
            >
              {/* Logo with Glowing Border */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md bg-stone-900 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={storeSettings.storeLogoUrl}
                  alt={storeSettings.storeName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('raw.githubusercontent.com')) {
                      target.src = 'https://raw.githubusercontent.com/lgangotra-hub/EilikacateringCA/main/image/b342ee4f-09da-4caa-80ac-df9cbe79e165.jpg';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Store Title & French/Montreal Subtitle */}
              <div className="flex flex-col text-left">
                <span
                  className={`font-serif font-black text-base sm:text-lg md:text-xl leading-tight tracking-tight drop-shadow-sm transition-colors ${
                    theme.category === 'dark' ? 'text-white group-hover:text-amber-400' : 'text-slate-950 group-hover:text-amber-600'
                  }`}
                >
                  {storeSettings.storeName}
                </span>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-none mt-0.5 ${theme.accentText}`}>
                  Montreal • Delicatessen
                </span>
              </div>
            </a>
          </div>

          {/* CENTER: Live Clock Display (Theme-Adaptive & Centered) */}
          <div className="flex-1 flex justify-center items-center px-1 max-w-[260px] sm:max-w-xs md:max-w-sm">
            <ThemeClock theme={theme} />
          </div>

          {/* RIGHT SIDE: Cart Button & Hamburger Menu (☰) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Cart Button with Count Badge */}
            <button
              id="header-btn-cart"
              onClick={onOpenCart}
              aria-label="Open Shopping Cart"
              className="relative p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:from-amber-400 hover:to-orange-500 transition-all active:scale-95 shadow-md flex items-center justify-center font-bold"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-slate-950 font-bold" />
              {cartCount > 0 && (
                <span
                  id="cart-count-badge"
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center border-2 border-white shadow-md animate-bounce"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Menu (☰) Button on the RIGHT */}
            <button
              id="btn-hamburger-menu"
              onClick={onOpenMenu}
              aria-label="Open Navigation Menu"
              className={`p-2.5 sm:p-3 rounded-2xl border transition-all active:scale-90 flex items-center justify-center shadow-sm ${
                theme.category === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-950 border-slate-300'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

