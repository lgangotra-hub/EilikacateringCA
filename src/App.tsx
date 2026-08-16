import React, { useState, useEffect, useCallback } from 'react';
import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_GITHUB_CONFIG, 
  DEFAULT_PRODUCTS, 
  DEFAULT_STORE_SETTINGS, 
  DEFAULT_ADMIN_PASSWORD 
} from './data/defaultData';
import { THEMES } from './data/themes';
import { 
  CartItem, 
  Category, 
  GithubConfig, 
  Product, 
  StoreSettings, 
  ThemeConfig, 
  ThemeId 
} from './types';
import { fetchLiveStoreDataFromWorldwideCdn } from './services/storeSync';
import { Header } from './components/Header';
import { HeroPanorama360 } from './components/HeroPanorama360';
import { ProductGrid } from './components/ProductGrid';
import { StoreLocationSection } from './components/StoreLocationSection';
import { Footer } from './components/Footer';
import { SideDrawer } from './components/SideDrawer';
import { CartDrawer } from './components/CartDrawer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FixedQuickActions } from './components/FixedQuickActions';

export default function App() {
  // --- PERSISTENT STATE WITH LOCALSTORAGE ---

  // 1. Theme State (10 Themes: 5 Light, 5 Dark)
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('depanneur_eilika_theme');
    return (saved as ThemeId) || 'light-quartz';
  });

  const activeTheme: ThemeConfig =
    THEMES.find((t) => t.id === themeId) || THEMES[0];

  useEffect(() => {
    localStorage.setItem('depanneur_eilika_theme', themeId);
    // Set dark class on html root if dark theme
    if (activeTheme.category === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeId, activeTheme]);

  // 2. Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('depanneur_eilika_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          !parsed.storeLogoUrl ||
          parsed.storeLogoUrl.includes('eilikastore1') ||
          parsed.storeLogoUrl.includes('lgangotra-hub/eilika/') ||
          !parsed.storeLogoUrl.includes('b342ee4f-09da-4caa-80ac-df9cbe79e165')
        ) {
          parsed.storeLogoUrl = DEFAULT_STORE_SETTINGS.storeLogoUrl;
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // Keep browser tab favicon updated with the store logo
  useEffect(() => {
    if (storeSettings.storeLogoUrl) {
      const favicons = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon'], link[rel*='apple-touch-icon']");
      favicons.forEach((fav) => {
        fav.href = storeSettings.storeLogoUrl;
      });
    }
  }, [storeSettings.storeLogoUrl]);

  const handleSaveStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    localStorage.setItem('depanneur_eilika_settings', JSON.stringify(newSettings));
  };

  // 3. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('depanneur_eilika_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_PRODUCTS;
  });

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('depanneur_eilika_products', JSON.stringify(newProducts));
  };

  // 4. Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('depanneur_eilika_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const handleSaveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('depanneur_eilika_categories', JSON.stringify(newCategories));
  };

  // 5. GitHub API Config State
  const [githubConfig, setGithubConfig] = useState<GithubConfig>(() => {
    const saved = localStorage.getItem('depanneur_eilika_github');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_GITHUB_CONFIG;
  });

  const handleSaveGithubConfig = (newConfig: GithubConfig) => {
    setGithubConfig(newConfig);
    localStorage.setItem('depanneur_eilika_github', JSON.stringify(newConfig));
  };

  // Worldwide Live Sync: Fetch the latest committed data from the GitHub CDN repository on launch
  useEffect(() => {
    async function syncWorldwideData() {
      const owner = githubConfig.username?.trim() || 'lgangotra-hub';
      const repo = githubConfig.repository?.trim() || 'EilikacateringCA';
      const branch = githubConfig.branch?.trim() || 'main';

      const liveBundle = await fetchLiveStoreDataFromWorldwideCdn(owner, repo, branch);
      if (liveBundle) {
        if (liveBundle.storeSettings) {
          setStoreSettings(liveBundle.storeSettings);
          localStorage.setItem('depanneur_eilika_settings', JSON.stringify(liveBundle.storeSettings));
        }
        if (Array.isArray(liveBundle.products) && liveBundle.products.length > 0) {
          setProducts(liveBundle.products);
          localStorage.setItem('depanneur_eilika_products', JSON.stringify(liveBundle.products));
        }
        if (Array.isArray(liveBundle.categories) && liveBundle.categories.length > 0) {
          setCategories(liveBundle.categories);
          localStorage.setItem('depanneur_eilika_categories', JSON.stringify(liveBundle.categories));
        }
        if (liveBundle.themeId) {
          setThemeId(liveBundle.themeId);
          localStorage.setItem('depanneur_eilika_theme', liveBundle.themeId);
        }
      }
    }

    syncWorldwideData();
  }, [githubConfig.username, githubConfig.repository, githubConfig.branch]);

  // 6. Admin Password State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('depanneur_eilika_admin_pw') || DEFAULT_ADMIN_PASSWORD;
  });

  const handleSaveAdminPassword = (newPw: string) => {
    setAdminPassword(newPw);
    localStorage.setItem('depanneur_eilika_admin_pw', newPw);
  };

  // 7. Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('depanneur_eilika_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('depanneur_eilika_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Map for quick product card lookups
  const cartMap = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.product.id] = item.quantity;
    return acc;
  }, {});

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- UI NAVIGATION & MODAL STATES ---
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  return (
    <div
      id="depanneur-eilika-root"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 selection:bg-amber-500/30 selection:text-amber-300 ${activeTheme.bgGradient} ${activeTheme.textPrimary}`}
    >
      {/* 1. MAIN HEADER (With Scrolling Line, Hamburger Menu, Theme Clock, Store Logo & Name, Call & WhatsApp) */}
      <Header
        theme={activeTheme}
        storeSettings={storeSettings}
        cartCount={totalCartCount}
        onOpenMenu={() => setIsSideMenuOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminLoginOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. HERO 360° PANORAMA VIRTUAL TOUR SECTION */}
      <HeroPanorama360
        theme={activeTheme}
        panoramaUrl={storeSettings.panoramaHeroUrl}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setSearchQuery('');
        }}
      />

      {/* 3. PRODUCT CATALOG GRID (Snacks, Drinks, Chocolate, Artisanal Deli, 5 Badges, -+ Stepper) */}
      <main className="flex-1">
        <ProductGrid
          products={products}
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={activeTheme}
          cartMap={cartMap}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* 4. MONTREAL STORE LOCATION & MAP PIN */}
        <StoreLocationSection
          storeSettings={storeSettings}
          theme={activeTheme}
        />
      </main>

      {/* 5. FOOTER */}
      <Footer
        storeSettings={storeSettings}
        theme={activeTheme}
        onOpenAdmin={() => setIsAdminLoginOpen(true)}
      />

      {/* 6. FIXED QUICK ACTION BUTTONS (Call & WhatsApp) */}
      <FixedQuickActions
        storeSettings={storeSettings}
        theme={activeTheme}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 7. SLIDE-OVER SIDE DRAWER (☰) */}
      <SideDrawer
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setSearchQuery('');
        }}
        theme={activeTheme}
        storeSettings={storeSettings}
        onOpenAdmin={() => {
          setIsSideMenuOpen(false);
          setIsAdminLoginOpen(true);
        }}
        productCount={products.length}
      />

      {/* 8. SLIDE-OVER SHOPPING CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        theme={activeTheme}
        storeSettings={storeSettings}
      />

      {/* 9. ADMIN LOGIN AUTHENTICATION MODAL */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        correctPassword={adminPassword}
        theme={activeTheme}
      />

      {/* 10. FULL ADMIN DASHBOARD (/admin) */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          onClose={() => setIsAdminDashboardOpen(false)}
          products={products}
          onSaveProducts={handleSaveProducts}
          categories={categories}
          onSaveCategories={handleSaveCategories}
          activeTheme={activeTheme}
          onSelectTheme={(tId) => setThemeId(tId)}
          storeSettings={storeSettings}
          onSaveStoreSettings={handleSaveStoreSettings}
          githubConfig={githubConfig}
          onSaveGithubConfig={handleSaveGithubConfig}
          adminPassword={adminPassword}
          onSaveAdminPassword={handleSaveAdminPassword}
        />
      )}
    </div>
  );
}
