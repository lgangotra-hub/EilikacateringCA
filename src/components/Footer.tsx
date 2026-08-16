import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Heart,
  Store,
  ChevronRight
} from 'lucide-react';
import { StoreSettings, ThemeConfig } from '../types';

interface FooterProps {
  storeSettings: StoreSettings;
  theme: ThemeConfig;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeSettings,
  theme,
  onOpenAdmin,
}) => {
  return (
    <footer className="w-full mt-20 border-t border-black/10 dark:border-white/10 transition-colors duration-300 bg-black/5 dark:bg-black/30 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Store Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-500 shadow-md bg-stone-900 flex-shrink-0">
                <img
                  src={storeSettings.storeLogoUrl}
                  alt={storeSettings.storeName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('raw.githubusercontent.com')) {
                      target.src = 'https://raw.githubusercontent.com/lgangotra-hub/EilikacateringCA/main/image/b342ee4f-09da-4caa-80ac-df9cbe79e165.jpg';
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-stone-900 dark:text-stone-50 leading-tight">
                  {storeSettings.storeName}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  {storeSettings.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs opacity-70 leading-relaxed">
              Montreal's premier downtown destination for artisanal delicatessen, Quebec terroir delicacies, imported snacks, and fine catering.
            </p>

            <div className="pt-1">
              <button
                id="footer-btn-admin-login"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal Login</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Aisles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Aisles & Catering
            </h4>
            <ul className="space-y-2 text-xs opacity-80">
              <li>
                <a href="#hero-360-tour" className="hover:text-amber-500 transition-colors flex items-center gap-1">
                  <span>360° Virtual Store Tour</span>
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-amber-500 transition-colors">
                  Artisanal Snacks & Chips
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-amber-500 transition-colors">
                  Cold Beverages & Craft Sodas
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-amber-500 transition-colors">
                  Single-Origin Chocolates
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-amber-500 transition-colors">
                  Fresh Smoked Meat & Charcuterie Platters
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-amber-500 transition-colors">
                  Quebec Pure Maple Products
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Montreal Store Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Store Location
            </h4>
            <div className="text-xs opacity-80 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  {storeSettings.streetAddress}<br />
                  {storeSettings.cityProvince}
                </span>
              </div>
              <a
                href={storeSettings.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                <span>Open Google Map Pin</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-2">
              <h5 className="text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                Store Hours (Montreal Time)
              </h5>
              <p className="text-xs opacity-75">
                Weekdays: {storeSettings.openingHours.weekdays}<br />
                Saturday: {storeSettings.openingHours.saturday}<br />
                Sunday: {storeSettings.openingHours.sunday}
              </p>
            </div>
          </div>

          {/* Col 4: Direct Orders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Fast Orders & Catering
            </h4>
            <p className="text-xs opacity-80">
              Need catering for your downtown Montreal office or instant doorstep delivery?
            </p>

            <div className="space-y-2 pt-1">
              <a
                href={`tel:${storeSettings.phoneNumber.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call {storeSettings.phoneNumber}</span>
              </a>

              <a
                href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^+\d]/g, '')}?text=Bonjour%20Depanneur%20Eilika`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600/10 hover:bg-green-600 text-green-700 dark:text-green-300 hover:text-white border border-green-500/30 text-xs font-bold transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Live Chat</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-60">
          <p>© {new Date().getFullYear()} {storeSettings.storeName} Montreal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Downtown Montreal Level C</span>
            <span>•</span>
            <span>Artisanal Catering & Delicatessen</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
