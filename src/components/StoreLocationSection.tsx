import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  MessageCircle, 
  Clock, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { StoreSettings, ThemeConfig } from '../types';

interface StoreLocationSectionProps {
  storeSettings: StoreSettings;
  theme: ThemeConfig;
}

export const StoreLocationSection: React.FC<StoreLocationSectionProps> = ({
  storeSettings,
  theme,
}) => {
  return (
    <section id="store-location-section" className="w-full my-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`rounded-3xl p-6 sm:p-8 md:p-10 border transition-all ${theme.cardBg} ${theme.cardBorder} shadow-2xl relative overflow-hidden`}>
        
        {/* Background ambient decorative glow */}
        <div 
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: theme.glowColor }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Montreal Downtown Heart</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-stone-900 dark:text-stone-50">
                Visit <span className="text-amber-500">{storeSettings.storeName}</span>
              </h2>
              <p className="text-sm opacity-80 mt-2 leading-relaxed">
                Located on Level C of prestigious 1000 Sherbrooke Street West in the heart of Downtown Montreal, steps away from Peel and McGill metros.
              </p>
            </div>

            {/* Address & Hours Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address Box */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Navigation className="w-4 h-4" />
                  <span>Street Address</span>
                </div>
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                  {storeSettings.streetAddress}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {storeSettings.cityProvince}
                </p>
                <a
                  href={storeSettings.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline pt-1"
                >
                  <span>Directions in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Hours Box */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span>Opening Hours (MTL)</span>
                </div>
                <div className="text-[11px] space-y-1 text-stone-600 dark:text-stone-300">
                  <div className="flex justify-between">
                    <span>Mon - Fri:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-100">{storeSettings.openingHours.weekdays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-100">{storeSettings.openingHours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-100">{storeSettings.openingHours.sunday}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${storeSettings.phoneNumber.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Call {storeSettings.phoneNumber}</span>
              </a>

              <a
                href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^+\d]/g, '')}?text=Bonjour%20Depanneur%20Eilika,%20je%20souhaite%20commander`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Instant Order</span>
              </a>

              <a
                href={storeSettings.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 text-stone-800 dark:text-stone-100 font-bold text-xs border border-white/20 transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4 text-sky-400" />
                <span>Open Google Map</span>
              </a>
            </div>

          </div>

          {/* Right Map Preview Box */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-[340px] sm:h-[380px] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl group bg-stone-900">
              {/* Map embed / Interactive View with exact Sherbrooke Montreal coordinates */}
              <iframe
                title="Dépanneur Eilika Montreal Map Location"
                src="https://maps.google.com/maps?q=1000+Sherbrooke+St+W,+Montreal,+QC+H3A+3G4&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter contrast-105 saturate-110"
                loading="lazy"
                allowFullScreen
              />

              {/* Floating Location Overlay Card */}
              <div className="absolute top-4 left-4 p-3 sm:p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md text-white border border-white/20 shadow-xl text-xs flex items-center gap-3 max-w-[300px]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black font-serif text-sm shadow-md flex-shrink-0">
                  DE
                </div>
                <div>
                  <h4 className="font-black text-white text-sm leading-tight">{storeSettings.storeName}</h4>
                  <p className="text-[11px] text-amber-300 font-semibold mt-0.5">1000 Sherbrooke St W (Level C)</p>
                  <p className="text-[10px] text-stone-400">Metro Peel & McGill • Montreal, QC</p>
                </div>
              </div>

              {/* Live Navigate Button & Google Maps Action */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=1000+Sherbrooke+St+W+Montreal+QC+H3A+3G4`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xl transition-all active:scale-95 border border-amber-200"
                >
                  <Navigation className="w-4 h-4 text-slate-950" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
