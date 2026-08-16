import React from 'react';
import { Phone, MessageCircle, ShoppingBag, ChevronUp } from 'lucide-react';
import { StoreSettings, ThemeConfig } from '../types';

interface FixedQuickActionsProps {
  storeSettings: StoreSettings;
  theme: ThemeConfig;
  cartCount: number;
  onOpenCart: () => void;
}

export const FixedQuickActions: React.FC<FixedQuickActionsProps> = ({
  storeSettings,
  theme,
  cartCount,
  onOpenCart,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      id="fixed-quick-actions-bar"
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 select-none animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      {/* Scroll To Top Button (Round) */}
      <button
        id="floating-btn-scrolltop"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-950 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 hover:-translate-y-0.5"
      >
        <ChevronUp className="w-5 h-5 text-amber-400" />
      </button>

      {/* Direct Call Floating Button (Round Circle) */}
      <a
        id="floating-btn-call"
        href={`tel:${storeSettings.phoneNumber.replace(/[^+\d]/g, '')}`}
        title={`Direct Call: ${storeSettings.phoneNumber}`}
        aria-label="Call Store"
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_8px_25px_rgba(5,150,105,0.5)] border-2 border-emerald-300/60 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-white/10">
          Call {storeSettings.phoneNumber}
        </span>
      </a>

      {/* WhatsApp Chat Floating Button (Round Circle) */}
      <a
        id="floating-btn-whatsapp"
        href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^+\d]/g, '')}?text=Bonjour%20Depanneur%20Eilika,%20je%20souhaite%20commander`}
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-400 text-white shadow-[0_8px_25px_rgba(34,197,94,0.5)] border-2 border-green-200/60 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-white/10">
          WhatsApp Instant Chat
        </span>
      </a>

      {/* Floating Cart Button (Round Circle with Count Badge) */}
      <button
        id="floating-btn-cart"
        onClick={onOpenCart}
        aria-label="View Shopping Cart"
        title={`View Cart (${cartCount} items)`}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-[0_8px_25px_rgba(245,158,11,0.6)] border-2 border-amber-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
      >
        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 font-bold" />
        
        {/* Live Cart Count Badge on top-right of the circle */}
        {cartCount > 0 && (
          <span
            id="floating-cart-count-badge"
            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-md animate-bounce"
          >
            {cartCount}
          </span>
        )}

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border border-white/10">
          Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </span>
      </button>
    </div>
  );
};
