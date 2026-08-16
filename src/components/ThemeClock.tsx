import React, { useEffect, useState } from 'react';
import { ThemeConfig } from '../types';

interface ThemeClockProps {
  theme: ThemeConfig;
  className?: string;
}

export const ThemeClock: React.FC<ThemeClockProps> = ({ theme, className = '' }) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const formattedHours12 = (hours % 12 || 12).toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Rotation angles for analog representations
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  const clockStyle = theme.clockStyle;

  return (
    <div
      id="theme-dynamic-clock"
      className={`relative inline-flex items-center select-none transition-all duration-500 ${className}`}
      title={`Live Montreal Time: ${formattedHours12}:${formattedMinutes}:${formattedSeconds} ${ampm} (EDT)`}
    >
      {/* --- 1. Quartz Digital (Theme: Light Quartz) --- */}
      {clockStyle === 'quartz-digital' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.25)] text-sky-200">
          <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-sky-400/60 bg-sky-950/80">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping absolute" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300 relative" />
          </div>
          <div className="font-mono text-xs md:text-sm font-semibold tracking-wider text-sky-100 flex items-center">
            <span>{formattedHours12}</span>
            <span className="animate-pulse text-sky-400 px-0.5">:</span>
            <span>{formattedMinutes}</span>
            <span className="text-[10px] text-sky-400 font-mono ml-1">{formattedSeconds}</span>
            <span className="text-[9px] uppercase font-bold text-sky-300 ml-1.5 bg-sky-800/60 px-1 py-0.5 rounded">
              {ampm}
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-sky-300/80 border-l border-sky-500/30 pl-2 hidden sm:inline">
            MTL
          </span>
        </div>
      )}

      {/* --- 2. Vintage Analog (Theme: Light Cream / Artisanal) --- */}
      {clockStyle === 'vintage-analog' && (
        <div className="flex items-center gap-2.5 px-3 py-1 rounded-2xl bg-amber-950/90 backdrop-blur-md border border-amber-500/40 shadow-[0_4px_16px_rgba(180,83,9,0.25)] text-amber-100">
          {/* Mini Analog Face */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-amber-900 to-amber-950 border-2 border-amber-400/70 shadow-inner flex items-center justify-center">
            {/* 12, 3, 6, 9 Roman tick markers */}
            <span className="absolute top-0.5 text-[6px] text-amber-300 font-serif font-bold">XII</span>
            <span className="absolute right-0.5 text-[6px] text-amber-300 font-serif font-bold">III</span>
            <span className="absolute bottom-0.5 text-[6px] text-amber-300 font-serif font-bold">VI</span>
            <span className="absolute left-0.5 text-[6px] text-amber-300 font-serif font-bold">IX</span>

            {/* Hour hand */}
            <div
              className="absolute w-[2px] h-2.5 bg-amber-300 rounded-full origin-bottom top-1.5 shadow-sm"
              style={{ transform: `rotate(${hourDeg}deg)` }}
            />
            {/* Minute hand */}
            <div
              className="absolute w-[1.5px] h-3 bg-amber-200 rounded-full origin-bottom top-1 shadow-sm"
              style={{ transform: `rotate(${minuteDeg}deg)` }}
            />
            {/* Second hand */}
            <div
              className="absolute w-[1px] h-3.5 bg-red-400 rounded-full origin-bottom top-0.5"
              style={{ transform: `rotate(${secondDeg}deg)` }}
            />
            {/* Center pin */}
            <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-900 z-10" />
          </div>

          <div className="flex flex-col text-left">
            <span className="font-serif text-xs md:text-sm font-bold text-amber-200 tracking-wide leading-tight">
              {formattedHours12}:{formattedMinutes} <span className="text-[10px] text-amber-400 font-sans">{ampm}</span>
            </span>
            <span className="text-[8px] text-amber-300/80 uppercase font-sans tracking-widest leading-none">
              MONTREAL TIME
            </span>
          </div>
        </div>
      )}

      {/* --- 3. Rose Minimal (Theme: Rose Mont-Royal) --- */}
      {clockStyle === 'rose-minimal' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md border border-rose-400/40 shadow-[0_0_15px_rgba(244,63,94,0.25)] text-rose-100">
          <div className="relative w-6 h-6 rounded-full border border-rose-400/60 flex items-center justify-center bg-rose-950/60">
            <div
              className="absolute w-[1.5px] h-2 bg-rose-300 origin-bottom top-1"
              style={{ transform: `rotate(${hourDeg}deg)` }}
            />
            <div
              className="absolute w-[1px] h-2.5 bg-rose-200 origin-bottom top-0.5"
              style={{ transform: `rotate(${minuteDeg}deg)` }}
            />
            <div className="w-1 h-1 rounded-full bg-rose-400" />
          </div>
          <div className="font-sans text-xs md:text-sm font-medium tracking-wider text-rose-100 flex items-center gap-1">
            <span>{formattedHours12}:{formattedMinutes}</span>
            <span className="text-[10px] text-rose-300 font-mono">:{formattedSeconds}</span>
            <span className="text-[9px] text-rose-300 font-semibold px-1 rounded bg-rose-950/80">{ampm}</span>
          </div>
        </div>
      )}

      {/* --- 4. Emerald Swiss (Theme: Sherbrooke Botanical) --- */}
      {clockStyle === 'emerald-swiss' && (
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)] text-emerald-100">
          <div className="relative w-7 h-7 rounded-full bg-emerald-900/90 border border-emerald-400 flex items-center justify-center">
            {/* Ticks */}
            <span className="absolute top-0.5 w-0.5 h-1 bg-emerald-300 rounded" />
            <span className="absolute bottom-0.5 w-0.5 h-1 bg-emerald-300 rounded" />
            <span className="absolute right-0.5 h-0.5 w-1 bg-emerald-300 rounded" />
            <span className="absolute left-0.5 h-0.5 w-1 bg-emerald-300 rounded" />
            <div
              className="absolute w-[2px] h-2 bg-emerald-200 origin-bottom top-1.5"
              style={{ transform: `rotate(${hourDeg}deg)` }}
            />
            <div
              className="absolute w-[1px] h-2.5 bg-emerald-100 origin-bottom top-1"
              style={{ transform: `rotate(${minuteDeg}deg)` }}
            />
            <div
              className="absolute w-[1px] h-3 bg-amber-400 origin-bottom top-0.5"
              style={{ transform: `rotate(${secondDeg}deg)` }}
            />
            <div className="w-1 h-1 rounded-full bg-emerald-400 z-10" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-mono text-xs md:text-sm font-bold text-emerald-200">
              {formattedHours12}:{formattedMinutes}:{formattedSeconds} <span className="text-[9px] text-emerald-300 font-sans">{ampm}</span>
            </span>
            <span className="text-[8px] tracking-wider text-emerald-400/80 uppercase font-semibold">
              MONTREAL • SHERBROOKE
            </span>
          </div>
        </div>
      )}

      {/* --- 5. Nordic Halo (Theme: Nordic Ice Blue) --- */}
      {clockStyle === 'nordic-halo' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_18px_rgba(6,182,212,0.35)] text-cyan-100">
          <div className="relative w-6 h-6 rounded-full border border-cyan-400/60 flex items-center justify-center bg-cyan-950/70">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="2" />
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeDasharray="56.5"
                strokeDashoffset={56.5 - (56.5 * seconds) / 60}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <span className="absolute text-[8px] font-mono font-bold text-cyan-200">{formattedSeconds}</span>
          </div>
          <div className="font-mono text-xs md:text-sm font-semibold tracking-wide text-cyan-100">
            {formattedHours12}:{formattedMinutes} <span className="text-[9px] text-cyan-300">{ampm}</span>
          </div>
        </div>
      )}

      {/* --- 6. Obsidian Neon (Theme: Dark Obsidian) --- */}
      {clockStyle === 'obsidian-neon' && (
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/95 backdrop-blur-md border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shadow-[0_0_8px_#f59e0b]" />
          <div className="font-mono text-xs md:text-sm font-black tracking-widest text-amber-200">
            {formattedHours12}
            <span className="text-amber-400 animate-pulse">:</span>
            {formattedMinutes}
            <span className="text-[10px] text-amber-400 ml-1">:{formattedSeconds}</span>
          </div>
          <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
            {ampm}
          </span>
        </div>
      )}

      {/* --- 7. Cyber HUD (Theme: Neon Montreal Cyber) --- */}
      {clockStyle === 'cyber-hud' && (
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-950/90 backdrop-blur-md border-x-2 border-y border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-cyan-300 font-mono">
          <div className="flex flex-col gap-0.5">
            <span className="w-2.5 h-0.5 bg-cyan-400 animate-pulse" />
            <span className="w-1.5 h-0.5 bg-fuchsia-400" />
            <span className="w-3 h-0.5 bg-cyan-400" />
          </div>
          <div className="text-xs md:text-sm font-bold tracking-widest text-cyan-100 flex items-center">
            <span>{formattedHours12}:{formattedMinutes}</span>
            <span className="text-fuchsia-400 ml-1 text-xs">:{formattedSeconds}</span>
            <span className="text-[8px] bg-cyan-900/80 text-cyan-300 px-1 ml-1 rounded">SYS.MTL</span>
          </div>
        </div>
      )}

      {/* --- 8. Roast Chronograph (Theme: Dark Café Roast) --- */}
      {clockStyle === 'roast-chronograph' && (
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-stone-950/95 backdrop-blur-md border border-amber-600/40 shadow-[0_0_18px_rgba(217,119,6,0.3)] text-amber-200">
          <div className="relative w-7 h-7 rounded-full bg-stone-900 border border-amber-500/70 flex items-center justify-center">
            <div
              className="absolute w-[2px] h-2 bg-amber-400 origin-bottom top-1.5"
              style={{ transform: `rotate(${hourDeg}deg)` }}
            />
            <div
              className="absolute w-[1px] h-2.5 bg-amber-200 origin-bottom top-1"
              style={{ transform: `rotate(${minuteDeg}deg)` }}
            />
            <div
              className="absolute w-[1px] h-3 bg-orange-500 origin-bottom top-0.5"
              style={{ transform: `rotate(${secondDeg}deg)` }}
            />
            <div className="w-1 h-1 rounded-full bg-amber-400" />
          </div>
          <div className="flex flex-col text-left font-serif">
            <span className="text-xs md:text-sm font-bold text-amber-200">
              {formattedHours12}:{formattedMinutes} <span className="font-sans text-[10px] text-amber-400">{ampm}</span>
            </span>
            <span className="text-[7px] tracking-widest text-amber-400/70 uppercase font-sans">
              DELICATESSEN TIME
            </span>
          </div>
        </div>
      )}

      {/* --- 9. Matrix Ticker (Theme: Dark Emerald Matrix) --- */}
      {clockStyle === 'matrix-ticker' && (
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/95 border border-emerald-500/50 shadow-[0_0_18px_rgba(16,185,129,0.35)] text-emerald-300 font-mono">
          <span className="text-emerald-400 text-xs animate-pulse">❯</span>
          <div className="text-xs md:text-sm font-bold tracking-widest">
            {formattedHours12}:{formattedMinutes}:{formattedSeconds}
          </div>
          <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1 py-0.5 rounded">
            {ampm}
          </span>
        </div>
      )}

      {/* --- 10. Amethyst Gem (Theme: Royal Amethyst) --- */}
      {clockStyle === 'amethyst-gem' && (
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-950/95 backdrop-blur-md border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.35)] text-purple-200">
          <div className="relative w-6 h-6 rounded-full bg-purple-950/90 border border-purple-400/80 flex items-center justify-center">
            <div
              className="absolute w-[1.5px] h-2 bg-purple-200 origin-bottom top-1"
              style={{ transform: `rotate(${hourDeg}deg)` }}
            />
            <div
              className="absolute w-[1px] h-2.5 bg-amber-300 origin-bottom top-0.5"
              style={{ transform: `rotate(${minuteDeg}deg)` }}
            />
            <div className="w-1 h-1 rounded-full bg-amber-400" />
          </div>
          <div className="text-xs md:text-sm font-bold text-purple-100 flex items-center gap-1 font-sans">
            <span>{formattedHours12}:{formattedMinutes}</span>
            <span className="text-[10px] text-purple-300 font-mono">:{formattedSeconds}</span>
            <span className="text-[9px] text-amber-300 uppercase font-semibold ml-0.5">{ampm}</span>
          </div>
        </div>
      )}
    </div>
  );
};
