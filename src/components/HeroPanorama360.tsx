import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Rotate3d, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Compass, 
  MapPin, 
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface HeroPanorama360Props {
  theme: ThemeConfig;
  panoramaUrl: string;
  onSelectCategory?: (category: string) => void;
}

interface Hotspot {
  id: string;
  yaw: number; // horizontal angle in degrees (0 - 360)
  pitch: number; // vertical angle in degrees (-45 to 45)
  title: string;
  category: string;
  description: string;
  badge: string;
  icon: string;
}

const STORE_HOTSPOTS: Hotspot[] = [
  {
    id: 'hs-drinks',
    yaw: 45,
    pitch: 5,
    title: 'Cold Artisan Drinks & Craft Sodas',
    category: 'drinks',
    description: 'Chilled botanical sodas, nitro cold brews & imported sparkling waters.',
    badge: 'Popular Vault',
    icon: '🥤',
  },
  {
    id: 'hs-chocolate',
    yaw: 130,
    pitch: -2,
    title: 'Artisan Chocolates & Sweet Terroir',
    category: 'chocolate',
    description: 'Single-origin bars, Valrhona truffles & Quebec maple confections.',
    badge: 'Master Selection',
    icon: '🍫',
  },
  {
    id: 'hs-deli',
    yaw: 220,
    pitch: -5,
    title: 'Montreal Fresh Deli & Catering Bar',
    category: 'fresh-deli',
    description: 'Fresh sliced smoked meat, Quebec artisan cheeses & charcuterie platters.',
    badge: 'Chef Prepared',
    icon: '🥖',
  },
  {
    id: 'hs-snacks',
    yaw: 310,
    pitch: 8,
    title: 'Gourmet Snacks & Montreal Kettle Chips',
    category: 'snacks',
    description: 'Hand-cooked maple chips, truffle pretzels & roasted nuts.',
    badge: 'Fresh Stock',
    icon: '🍿',
  },
];

export const HeroPanorama360: React.FC<HeroPanorama360Props> = ({
  theme,
  panoramaUrl,
  onSelectCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // Camera angles in degrees
  const yawRef = useRef<number>(180);
  const pitchRef = useRef<number>(0);
  const fovRef = useRef<number>(75); // Field of View (zoom)

  const [displayFov, setDisplayFov] = useState(75);
  const [displayYaw, setDisplayYaw] = useState(180);

  // Drag coordinates
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Load panorama image
  useEffect(() => {
    setIsLoaded(false);
    setLoadError(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = panoramaUrl;

    img.onload = () => {
      imageObjRef.current = img;
      setIsLoaded(true);
    };

    img.onerror = () => {
      // Fallback to a guaranteed high-res panorama
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = 'anonymous';
      fallbackImg.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80';
      fallbackImg.onload = () => {
        imageObjRef.current = fallbackImg;
        setIsLoaded(true);
      };
      fallbackImg.onerror = () => {
        setLoadError(true);
      };
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [panoramaUrl]);

  // Main Render Loop (Equirectangular cylindrical projection on HTML5 Canvas)
  const renderScene = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img || !isLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Auto rotate yaw
    if (isAutoRotate && !isDragging) {
      yawRef.current = (yawRef.current + 0.15) % 360;
      setDisplayYaw(Math.round(yawRef.current));
    }

    const currentYaw = yawRef.current;
    const currentPitch = pitchRef.current;
    const currentFov = fovRef.current;

    // Calculate source image slice based on yaw, pitch, fov
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Horizontal ratio (0 to 1)
    const normYaw = (currentYaw % 360 + 360) % 360 / 360;
    const fovRatio = currentFov / 360;

    const srcW = imgWidth * fovRatio;
    const srcX = normYaw * imgWidth;

    // Vertical pitch calculation (limit pitch from -40 to 40)
    const pitchOffset = (currentPitch / 90) * (imgHeight * 0.25);
    const srcH = imgHeight * (currentFov / 180);
    const srcY = Math.max(0, Math.min(imgHeight - srcH, (imgHeight - srcH) / 2 + pitchOffset));

    // Render wrap-around horizontal panorama
    if (srcX + srcW <= imgWidth) {
      // Single continuous slice
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, width, height);
    } else {
      // Split into two parts for 360 loop wrap
      const firstPartW = imgWidth - srcX;
      const secondPartW = srcW - firstPartW;

      const destFirstPartW = (firstPartW / srcW) * width;
      const destSecondPartW = width - destFirstPartW;

      ctx.drawImage(img, srcX, srcY, firstPartW, srcH, 0, 0, destFirstPartW, height);
      ctx.drawImage(img, 0, srcY, secondPartW, srcH, destFirstPartW, 0, destSecondPartW, height);
    }

    // Add subtle ambient vignette and lens flare overlay
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      height * 0.25,
      width / 2,
      height / 2,
      width * 0.7
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Request next frame
    animationFrameId.current = requestAnimationFrame(renderScene);
  }, [isAutoRotate, isDragging, isLoaded]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation Loop Trigger
  useEffect(() => {
    if (isLoaded) {
      animationFrameId.current = requestAnimationFrame(renderScene);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isLoaded, renderScene]);

  // Mouse & Touch Controls
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - lastMousePos.current.x;
    const deltaY = clientY - lastMousePos.current.y;

    lastMousePos.current = { x: clientX, y: clientY };

    // Update Yaw (horizontal rotation)
    yawRef.current = (yawRef.current - deltaX * 0.35 + 360) % 360;
    setDisplayYaw(Math.round(yawRef.current));

    // Update Pitch (vertical rotation with clamping)
    pitchRef.current = Math.max(-35, Math.min(35, pitchRef.current + deltaY * 0.25));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Zoom Controls
  const handleZoom = (delta: number) => {
    fovRef.current = Math.max(45, Math.min(100, fovRef.current + delta));
    setDisplayFov(Math.round(fovRef.current));
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <section id="hero-360-tour" className="relative w-full overflow-hidden my-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Info Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Rotate3d className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Interactive 360° Store Tour • Visite Virtuelle</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Dépanneur Eilika</span>
            </h2>
            <p className="text-sm opacity-80 mt-1 max-w-xl">
              Drag anywhere to look around our Montreal delicatessen, discover fresh arrivals, or tap hotspots to browse aisles.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Quick Hotspot Quick-Jump Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-black/20 dark:bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/20">
              {STORE_HOTSPOTS.map((hs) => (
                <button
                  key={hs.id}
                  id={`btn-hotspot-${hs.id}`}
                  onClick={() => {
                    yawRef.current = hs.yaw;
                    pitchRef.current = hs.pitch;
                    setDisplayYaw(hs.yaw);
                    setActiveHotspot(hs);
                  }}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 hover:bg-white/20 active:scale-95 text-stone-800 dark:text-stone-100"
                >
                  <span>{hs.icon}</span>
                  <span className="hidden lg:inline">{hs.category.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 360 Viewer Canvas Container */}
        <div
          ref={containerRef}
          id="panorama-canvas-container"
          className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/40 shadow-2xl bg-stone-900 select-none cursor-grab active:cursor-grabbing group"
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => {
            if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handlePointerUp}
        >
          {/* Main 360 Canvas */}
          <canvas
            ref={canvasRef}
            id="panorama-canvas"
            className="w-full h-full block"
          />

          {/* Loading Spinner */}
          {!isLoaded && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950/80 backdrop-blur-md text-white z-20">
              <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3" />
              <p className="font-semibold text-sm">Loading 360° Montreal Delicatessen Tour...</p>
              <p className="text-xs text-stone-400 mt-1">1000 Sherbrooke St W Level C</p>
            </div>
          )}

          {/* Floating UI Overlays */}

          {/* Top Left Compass & Status Pill */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>360° LIVE TOUR</span>
              <span className="text-amber-400 font-bold">| {displayYaw}°</span>
            </div>
          </div>

          {/* Top Right Quick Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            {/* Auto Rotate Toggle */}
            <button
              id="btn-toggle-auto-rotate"
              onClick={(e) => {
                e.stopPropagation();
                setIsAutoRotate(!isAutoRotate);
              }}
              title={isAutoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              {isAutoRotate ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-white" />}
            </button>

            {/* Zoom In */}
            <button
              id="btn-zoom-in"
              onClick={(e) => {
                e.stopPropagation();
                handleZoom(-8);
              }}
              title="Zoom In"
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Zoom Out */}
            <button
              id="btn-zoom-out"
              onClick={(e) => {
                e.stopPropagation();
                handleZoom(8);
              }}
              title="Zoom Out"
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              id="btn-toggle-fullscreen"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              title="Fullscreen Mode"
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Interactive Dynamic Hotspot Markers in Current View */}
          {STORE_HOTSPOTS.map((hs) => {
            // Calculate if hotspot is currently inside the Field of View
            const fov = fovRef.current;
            let diffYaw = hs.yaw - yawRef.current;
            // Normalize diffYaw to -180 to +180
            while (diffYaw > 180) diffYaw -= 360;
            while (diffYaw < -180) diffYaw += 360;

            const isVisible = Math.abs(diffYaw) < fov / 2;
            if (!isVisible) return null;

            // Screen X percentage
            const screenXPercent = 50 + (diffYaw / (fov / 2)) * 50;
            // Screen Y percentage
            const screenYPercent = 50 - ((hs.pitch - pitchRef.current) / 45) * 40;

            return (
              <div
                key={hs.id}
                style={{
                  left: `${screenXPercent}%`,
                  top: `${screenYPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20 cursor-pointer group/hotspot transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(hs);
                }}
              >
                {/* Pulsing Beacon Ring */}
                <div className="relative flex items-center justify-center">
                  <span className="w-8 h-8 rounded-full bg-amber-400/40 animate-ping absolute" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 border-2 border-white text-white shadow-[0_0_15px_rgba(245,158,11,0.8)] flex items-center justify-center text-sm font-bold transition-transform group-hover/hotspot:scale-125">
                    {hs.icon}
                  </div>
                </div>

                {/* Hotspot Floating Tag */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 shadow-xl opacity-90 group-hover/hotspot:opacity-100 flex items-center gap-1.5 pointer-events-none">
                  <span>{hs.title}</span>
                  <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
                    {hs.badge}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Active Hotspot Modal Card Popup */}
          {activeHotspot && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-[420px] bg-black/85 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-4 text-white shadow-[0_10px_35px_rgba(0,0,0,0.6)] z-30 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                    {activeHotspot.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        {activeHotspot.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-amber-100 mt-0.5">{activeHotspot.title}</h4>
                  </div>
                </div>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xs"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                {activeHotspot.description}
              </p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                <span className="text-[11px] text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Section Spotlight
                </span>
                <button
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(activeHotspot.category);
                    setActiveHotspot(null);
                    // Smooth scroll down to product grid
                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-all active:scale-95"
                >
                  <span>Browse Products</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Bar: Instructions / Store Location Tag */}
          <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-stone-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>1000 Sherbrooke St W Level C • Montreal, QC</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-stone-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Drag to rotate 360°</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
