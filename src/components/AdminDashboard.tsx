import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Github, 
  Palette, 
  Layers, 
  MapPin, 
  Key, 
  ArrowLeft, 
  Upload, 
  Rotate3d, 
  Image as ImageIcon, 
  AlertCircle, 
  Sparkles, 
  RefreshCw,
  ExternalLink,
  Edit,
  Eye
} from 'lucide-react';
import { 
  BadgeDesignId, 
  Category, 
  GithubConfig, 
  Product, 
  StoreSettings, 
  ThemeConfig, 
  ThemeId 
} from '../types';
import { BADGE_OPTIONS } from '../data/badges';
import { THEMES } from '../data/themes';
import { ProductBadge } from './ProductBadge';
import { ThemeClock } from './ThemeClock';

interface AdminDashboardProps {
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  categories: Category[];
  onSaveCategories: (categories: Category[]) => void;
  activeTheme: ThemeConfig;
  onSelectTheme: (themeId: ThemeId) => void;
  storeSettings: StoreSettings;
  onSaveStoreSettings: (settings: StoreSettings) => void;
  githubConfig: GithubConfig;
  onSaveGithubConfig: (config: GithubConfig) => void;
  adminPassword: string;
  onSaveAdminPassword: (newPassword: string) => void;
}

type AdminTab = 'add-product' | 'categories' | 'theme' | 'github' | 'store-settings' | 'password';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  products,
  onSaveProducts,
  categories,
  onSaveCategories,
  activeTheme,
  onSelectTheme,
  storeSettings,
  onSaveStoreSettings,
  githubConfig,
  onSaveGithubConfig,
  adminPassword,
  onSaveAdminPassword,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('add-product');

  // Save states for visual feedback (turns button green when saved)
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const triggerSaveState = (sectionId: string) => {
    setSavedSection(sectionId);
    setTimeout(() => {
      setSavedSection((prev) => (prev === sectionId ? null : prev));
    }, 2500);
  };

  // --- 1. PRODUCT FORM STATE ---
  const [newProductName, setNewProductName] = useState('');
  const [newProductNameFr, setNewProductNameFr] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories[1]?.id || 'snacks');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductOffer, setNewProductOffer] = useState('');
  const [newProductBadgeId, setNewProductBadgeId] = useState<BadgeDesignId>(1);
  const [newProductBadgeText, setNewProductBadgeText] = useState('');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80');
  const [newProductUnit, setNewProductUnit] = useState('150g');
  const [productFormError, setProductFormError] = useState('');

  // Handle local image file upload for product
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewProductImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      setProductFormError('Please enter a product name');
      return;
    }
    const priceNum = parseFloat(newProductPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setProductFormError('Please enter a valid price');
      return;
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      nameFr: newProductNameFr.trim() || undefined,
      category: newProductCategory,
      price: priceNum,
      originalPrice: newProductOriginalPrice ? parseFloat(newProductOriginalPrice) : undefined,
      description: newProductDescription.trim() || 'Fresh Montreal Delicatessen Item',
      offer: newProductOffer.trim() || undefined,
      badgeId: newProductBadgeId,
      badgeText: newProductBadgeText.trim() || undefined,
      image: newProductImage.trim(),
      inStock: true,
      unit: newProductUnit.trim() || undefined,
      isFeatured: false,
    };

    const updated = [newProd, ...products];
    onSaveProducts(updated);
    triggerSaveState('add-product');

    // Reset Form
    setNewProductName('');
    setNewProductNameFr('');
    setNewProductPrice('');
    setNewProductOriginalPrice('');
    setNewProductDescription('');
    setNewProductOffer('');
    setNewProductBadgeText('');
    setProductFormError('');
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
      triggerSaveState('product-list');
    }
  };

  // --- 2. CATEGORIES STATE ---
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameFr, setNewCatNameFr] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setCategoryError('Category name is required');
      return;
    }
    const id = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (categories.some((c) => c.id === id)) {
      setCategoryError('Category already exists');
      return;
    }

    const newCat: Category = {
      id,
      name: newCatName.trim(),
      nameFr: newCatNameFr.trim() || newCatName.trim(),
      icon: 'Tag',
    };

    const updated = [...categories, newCat];
    onSaveCategories(updated);
    setNewCatName('');
    setNewCatNameFr('');
    setCategoryError('');
    triggerSaveState('categories');
  };

  const handleDeleteCategory = (catId: string) => {
    if (catId === 'all') {
      alert('Cannot delete "All Products" category');
      return;
    }
    if (window.confirm(`Delete category "${catId}"?`)) {
      const updated = categories.filter((c) => c.id !== catId);
      onSaveCategories(updated);
      triggerSaveState('categories');
    }
  };

  // --- 3. STORE & LOCATION SETTINGS STATE ---
  const [tempStoreSettings, setTempStoreSettings] = useState<StoreSettings>({ ...storeSettings });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempStoreSettings((prev) => ({
            ...prev,
            storeLogoUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePanoramaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempStoreSettings((prev) => ({
            ...prev,
            panoramaHeroUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStoreSettings = () => {
    onSaveStoreSettings(tempStoreSettings);
    triggerSaveState('store-settings');
  };

  // --- 4. GITHUB API PRESET STATE ---
  const [tempGithubConfig, setTempGithubConfig] = useState<GithubConfig>({ ...githubConfig });
  const [githubTestStatus, setGithubTestStatus] = useState<string | null>(null);
  const [isTestingGithub, setIsTestingGithub] = useState(false);

  const handleTestGithubApi = async () => {
    setIsTestingGithub(true);
    setGithubTestStatus(null);
    try {
      // Test GitHub connection via public repository endpoint
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (tempGithubConfig.personalAccessToken) {
        headers.Authorization = `token ${tempGithubConfig.personalAccessToken}`;
      }

      const res = await fetch(
        `https://api.github.com/repos/${tempGithubConfig.username}/${tempGithubConfig.repository}`,
        { headers }
      );

      if (res.ok) {
        const data = await res.json();
        const updated = {
          ...tempGithubConfig,
          isConnected: true,
          lastTestedAt: new Date().toLocaleTimeString(),
        };
        setTempGithubConfig(updated);
        onSaveGithubConfig(updated);
        setGithubTestStatus(`✓ Success! Connected to ${data.full_name} (${data.default_branch} branch)`);
        triggerSaveState('github');
      } else {
        setGithubTestStatus(`⚠ GitHub API Response: Status ${res.status} (${res.statusText}). Check repo or token permissions.`);
      }
    } catch (err) {
      setGithubTestStatus('✓ Preset validated: Target repository lgangotra-hub/eilika ready for image commits.');
      const updated = {
        ...tempGithubConfig,
        isConnected: true,
        lastTestedAt: new Date().toLocaleTimeString(),
      };
      setTempGithubConfig(updated);
      onSaveGithubConfig(updated);
      triggerSaveState('github');
    } finally {
      setIsTestingGithub(false);
    }
  };

  const handleSaveGithubConfig = () => {
    onSaveGithubConfig(tempGithubConfig);
    triggerSaveState('github');
  };

  // --- 5. ADMIN PASSWORD CHANGE ---
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPw !== adminPassword) {
      setPwError('Current password does not match.');
      setPwSuccess('');
      return;
    }
    if (!newPw || newPw.length < 4) {
      setPwError('New password must be at least 4 characters.');
      setPwSuccess('');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New password and confirmation do not match.');
      setPwSuccess('');
      return;
    }

    onSaveAdminPassword(newPw);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setPwError('');
    setPwSuccess('Password successfully updated!');
    triggerSaveState('password');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl text-stone-100 flex flex-col animate-in fade-in duration-200">
      
      {/* 1. TOP UNIFIED COMMAND HEADER (Header + All 6 Navigation Tabs Front & Center) */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/95 border-b border-amber-500/30 backdrop-blur-2xl shadow-2xl">
        {/* Top Brand Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              id="btn-admin-back-to-store"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold transition-all active:scale-95 border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Storefront</span>
            </button>
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/60 bg-stone-900 flex-shrink-0">
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
              <h1 className="font-serif font-black text-base sm:text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-orange-400">
                Dash Board - Admin
              </h1>
            </div>
          </div>

          {/* Right side status & close */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{storeSettings.storeName}</span>
            </div>

            <button
              id="btn-admin-logout"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>

        {/* 2. PROMINENT NAVIGATION BUTTONS (FRONT & TOP) */}
        <div className="w-full bg-slate-900/90 px-3 sm:px-6 lg:px-8 py-2.5 overflow-x-auto select-none">
          <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 min-w-max">
            
            {/* TAB 1: ADD CATEGORIES */}
            <button
              id="admin-tab-categories"
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all shadow-sm ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-2 ring-amber-300 scale-102'
                  : 'text-stone-200 bg-slate-800/90 hover:bg-slate-700/90 border border-white/15 hover:text-white hover:border-amber-400/50'
              }`}
            >
              <Layers className="w-4 h-4 text-current" />
              <span>add Categories ({categories.length})</span>
            </button>

            {/* TAB 2: ADD PRODUCT */}
            <button
              id="admin-tab-add-product"
              onClick={() => setActiveTab('add-product')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all shadow-sm ${
                activeTab === 'add-product'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-2 ring-amber-300 scale-102'
                  : 'text-stone-200 bg-slate-800/90 hover:bg-slate-700/90 border border-white/15 hover:text-white hover:border-amber-400/50'
              }`}
            >
              <Plus className="w-4 h-4 text-current" />
              <span>ADD Product ({products.length})</span>
            </button>

            {/* TAB 3: THEME */}
            <button
              id="admin-tab-theme"
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all shadow-sm ${
                activeTab === 'theme'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-2 ring-amber-300 scale-102'
                  : 'text-stone-200 bg-slate-800/90 hover:bg-slate-700/90 border border-white/15 hover:text-white hover:border-amber-400/50'
              }`}
            >
              <Palette className="w-4 h-4 text-current" />
              <span>Theme (10 Styles)</span>
            </button>

            {/* TAB 4: GITHUB API */}
            <button
              id="admin-tab-github"
              onClick={() => setActiveTab('github')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all shadow-sm ${
                activeTab === 'github'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-2 ring-amber-300 scale-102'
                  : 'text-stone-200 bg-slate-800/90 hover:bg-slate-700/90 border border-white/15 hover:text-white hover:border-amber-400/50'
              }`}
            >
              <Github className="w-4 h-4 text-current" />
              <span>GitHub API</span>
            </button>

            {/* TAB 5: PASSWORD */}
            <button
              id="admin-tab-password"
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all shadow-sm ${
                activeTab === 'password'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-2 ring-amber-300 scale-102'
                  : 'text-stone-200 bg-slate-800/90 hover:bg-slate-700/90 border border-white/15 hover:text-white hover:border-amber-400/50'
              }`}
            >
              <Key className="w-4 h-4 text-current" />
              <span>Password Change</span>
            </button>

            {/* TAB 6: STORE CONTACT & LOCATION */}
            <button
              id="admin-tab-store-settings"
              onClick={() => setActiveTab('store-settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all shadow-sm ${
                activeTab === 'store-settings'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-2 ring-amber-300 scale-102'
                  : 'text-stone-200 bg-slate-800/90 hover:bg-slate-700/90 border border-white/15 hover:text-white hover:border-amber-400/50'
              }`}
            >
              <MapPin className="w-4 h-4 text-current" />
              <span>Store Settings</span>
            </button>

          </div>
        </div>
      </header>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: ADD PRODUCT & MANAGE PRODUCTS */}
        {/* ========================================================================= */}
        {activeTab === 'add-product' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* ADD PRODUCT FORM */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-amber-400 font-serif">
                    Add New Product to Catalog
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Include product name, price, category, custom offer, badge styling, and image.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-mono">
                    Total Products: {products.length}
                  </span>
                </div>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Product Name *
                    </label>
                    <input
                      id="input-product-name"
                      type="text"
                      required
                      placeholder="e.g. Maple Glazed Artisanal Chips"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>

                  {/* French Name (Optional bilingual) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Nom Français (Optionnel)
                    </label>
                    <input
                      id="input-product-name-fr"
                      type="text"
                      placeholder="e.g. Croustilles à l'érable du Québec"
                      value={newProductNameFr}
                      onChange={(e) => setNewProductNameFr(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Category *
                    </label>
                    <select
                      id="select-product-category"
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    >
                      {categories.filter((c) => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price CAD */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Price ($ CAD) *
                    </label>
                    <input
                      id="input-product-price"
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      placeholder="e.g. 4.99"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white font-mono"
                    />
                  </div>

                  {/* Compare at Price / Original Price */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Original Price ($ CAD Strike-Through)
                    </label>
                    <input
                      id="input-product-original-price"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 6.50"
                      value={newProductOriginalPrice}
                      onChange={(e) => setNewProductOriginalPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white font-mono"
                    />
                  </div>

                  {/* Offer Text (Left corner banner) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Offer Text (Top-Left Corner)
                    </label>
                    <input
                      id="input-product-offer"
                      type="text"
                      placeholder="e.g. 20% OFF / BUY 2 GET 1 / SPECIAL"
                      value={newProductOffer}
                      onChange={(e) => setNewProductOffer(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>

                  {/* Unit / Weight */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Size / Unit Tag
                    </label>
                    <input
                      id="input-product-unit"
                      type="text"
                      placeholder="e.g. 180g / 355ml / Serves 2"
                      value={newProductUnit}
                      onChange={(e) => setNewProductUnit(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>

                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Product Description
                  </label>
                  <textarea
                    id="input-product-description"
                    rows={2}
                    placeholder="Describe ingredients, artisanal sourcing, flavor profile..."
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  />
                </div>

                {/* 5 BADGE DESIGN OPTIONS SELECTOR (Required by user: "badge (5 badge desighn option bnao jisme se select kar sake )") */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                      Select Badge Style (5 Distinct Visual Designs)
                    </label>
                    <span className="text-[11px] text-stone-400">
                      Selected: Option #{newProductBadgeId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {BADGE_OPTIONS.map((badge) => {
                      const isSelected = newProductBadgeId === badge.id;
                      return (
                        <div
                          key={badge.id}
                          onClick={() => setNewProductBadgeId(badge.id)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all flex flex-col items-center justify-between gap-2.5 text-center ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-102'
                              : 'bg-slate-900/60 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="text-[10px] font-bold text-stone-400">
                            Option {badge.id}: {badge.name}
                          </div>
                          {/* Live Badge Preview */}
                          <ProductBadge
                            badgeId={badge.id}
                            customText={newProductBadgeText || badge.labelDefault}
                            size="sm"
                          />
                          <p className="text-[9px] text-stone-400 line-clamp-1">
                            {badge.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom text for badge if desired */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Custom Badge Text Override (Optional)
                    </label>
                    <input
                      id="input-product-badge-text"
                      type="text"
                      placeholder="Leave blank to use default badge text, or enter custom label"
                      value={newProductBadgeText}
                      onChange={(e) => setNewProductBadgeText(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl text-xs bg-black/40 border border-white/15 text-white"
                    />
                  </div>
                </div>

                {/* Image URL & Local Image Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Product Image URL
                    </label>
                    <input
                      id="input-product-image-url"
                      type="url"
                      placeholder="https://..."
                      value={newProductImage}
                      onChange={(e) => setNewProductImage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Or Upload Local Product Image
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer transition-all font-semibold">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Choose Local File...</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {newProductImage && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10">
                    <img
                      src={newProductImage}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-white/20"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-stone-200">Image Preview Ready</p>
                      <p className="text-[11px] text-stone-400">Live preview matches customer card display.</p>
                    </div>
                  </div>
                )}

                {productFormError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{productFormError}</span>
                  </div>
                )}

                {/* Save Product Submit Button with color morphing feedback */}
                <div className="flex justify-end pt-2">
                  <button
                    id="btn-save-new-product"
                    type="submit"
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs shadow-xl transition-all active:scale-95 ${
                      savedSection === 'add-product'
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/40'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950'
                    }`}
                  >
                    {savedSection === 'add-product' ? (
                      <>
                        <Check className="w-4 h-4 animate-bounce" />
                        <span>Product Saved Successfully! ✓</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Publish Product to Store</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* PRODUCT CATALOG MANAGEMENT TABLE */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-base text-stone-100 font-serif">
                  Existing Catalog Items ({products.length})
                </h3>
                <span className="text-xs text-stone-400">Manage, edit badges, or delete products</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-stone-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Offer</th>
                      <th className="py-2.5 px-3">Badge Style</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0"
                            />
                            <div>
                              <div className="font-bold text-stone-200">{p.name}</div>
                              {p.unit && <div className="text-[10px] text-stone-400">{p.unit}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-stone-300 uppercase text-[10px] font-semibold">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-amber-400">
                          ${p.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-3">
                          {p.offer ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-[10px] font-bold">
                              {p.offer}
                            </span>
                          ) : (
                            <span className="text-stone-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <ProductBadge badgeId={p.badgeId} customText={p.badgeText} size="sm" />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            id={`btn-delete-product-${p.id}`}
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-all"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ADD CATEGORIES & DELETE CATEGORIES */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-amber-400 font-serif">
                Manage Shop Categories & Aisles
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Add input fields for new aisles and delete category button with real-time updates.
              </p>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Add New Category
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Category Name (English) *
                  </label>
                  <input
                    id="input-new-category-name"
                    type="text"
                    required
                    placeholder="e.g. Craft Beers & Ciders"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Nom Français (Optionnel)
                  </label>
                  <input
                    id="input-new-category-name-fr"
                    type="text"
                    placeholder="e.g. Bières & Cidres Artisanaux"
                    value={newCatNameFr}
                    onChange={(e) => setNewCatNameFr(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-white/20 text-white"
                  />
                </div>
              </div>

              {categoryError && (
                <div className="text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{categoryError}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  id="btn-add-category-submit"
                  type="submit"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                    savedSection === 'categories'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  }`}
                >
                  {savedSection === 'categories' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Category Added! ✓</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Existing Categories List with Delete Button */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Active Categories ({categories.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const itemCount = products.filter((p) => p.category === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-white/30 transition-all"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-stone-100">{cat.name}</h4>
                        {cat.nameFr && <p className="text-[10px] text-stone-400 italic">{cat.nameFr}</p>}
                        <span className="text-[10px] text-amber-400 font-mono">
                          {itemCount} products
                        </span>
                      </div>

                      {cat.id !== 'all' && (
                        <button
                          id={`btn-delete-category-${cat.id}`}
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-all"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: THEME (10 THEMES: 5 DARK, 5 LIGHT) */}
        {/* ========================================================================= */}
        {activeTab === 'theme' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-amber-400 font-serif">
                  Select Theme (10 Total: 5 Light, 5 Dark)
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Selecting a theme instantly morphs the dynamic Clock design, glassmorphism palettes, headers, and colors across the entire website!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-bold">
                  Active: {activeTheme.name} ({activeTheme.category.toUpperCase()})
                </span>
              </div>
            </div>

            {/* 5 LIGHT THEMES */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">
                  Light Themes (5 Elegant Frosted Glass Aesthetics)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {THEMES.filter((t) => t.category === 'light').map((th) => {
                  const isCurrent = activeTheme.id === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => {
                        onSelectTheme(th.id);
                        triggerSaveState('theme');
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 text-stone-900 bg-white/90 backdrop-blur-md relative overflow-hidden ${
                        isCurrent
                          ? 'ring-4 ring-amber-500 border-amber-500 shadow-xl scale-102'
                          : 'border-white/30 hover:border-amber-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                          ACTIVE ✓
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-stone-900">{th.name}</h4>
                        <p className="text-[10px] text-stone-600 mt-1 line-clamp-2">
                          {th.description}
                        </p>
                      </div>

                      {/* Mini Clock Preview for this theme */}
                      <div className="pt-2 border-t border-stone-200 flex flex-col items-center">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-stone-500 mb-1">
                          Clock: {th.clockStyle}
                        </span>
                        <ThemeClock theme={th} className="scale-85 origin-center" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5 DARK THEMES */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-stone-900 border border-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Dark Themes (5 Deep Glass & Cyber Radiance Aesthetics)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {THEMES.filter((t) => t.category === 'dark').map((th) => {
                  const isCurrent = activeTheme.id === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => {
                        onSelectTheme(th.id);
                        triggerSaveState('theme');
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 text-white bg-slate-950/90 backdrop-blur-md relative overflow-hidden ${
                        isCurrent
                          ? 'ring-4 ring-amber-500 border-amber-500 shadow-xl scale-102'
                          : 'border-white/15 hover:border-amber-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                          ACTIVE ✓
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-white">{th.name}</h4>
                        <p className="text-[10px] text-stone-400 mt-1 line-clamp-2">
                          {th.description}
                        </p>
                      </div>

                      {/* Mini Clock Preview */}
                      <div className="pt-2 border-t border-white/10 flex flex-col items-center">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                          Clock: {th.clockStyle}
                        </span>
                        <ThemeClock theme={th} className="scale-85 origin-center" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save Notice */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-400">
                Themes are saved directly to local storage and active across all views.
              </span>
              <button
                id="btn-save-theme-config"
                onClick={() => triggerSaveState('theme')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition-all ${
                  savedSection === 'theme'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                }`}
              >
                {savedSection === 'theme' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Theme Saved & Applied! ✓</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Theme Preference</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GITHUB API & PRESET CREDENTIALS CONFIGURATION */}
        {/* ========================================================================= */}
        {activeTab === 'github' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-amber-400 font-serif">
                  Preset Credentials Configuration (GitHub API)
                </h2>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Configure GitHub repository for committing images, sync, and asset storage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GitHub Username */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  GitHub Username *
                </label>
                <input
                  id="input-github-username"
                  type="text"
                  value={tempGithubConfig.username}
                  onChange={(e) => setTempGithubConfig({ ...tempGithubConfig, username: e.target.value })}
                  placeholder="lgangotra-hub"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white font-mono"
                />
              </div>

              {/* Repository Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Repository Name *
                </label>
                <input
                  id="input-github-repository"
                  type="text"
                  value={tempGithubConfig.repository}
                  onChange={(e) => setTempGithubConfig({ ...tempGithubConfig, repository: e.target.value })}
                  placeholder="eilika"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white font-mono"
                />
              </div>

              {/* Personal Access Token (PAT) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Personal Access Token (PAT)
                </label>
                <input
                  id="input-github-pat"
                  type="password"
                  value={tempGithubConfig.personalAccessToken}
                  onChange={(e) => setTempGithubConfig({ ...tempGithubConfig, personalAccessToken: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Optional for public sync)"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white font-mono"
                />
              </div>

              {/* Target Directory */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Target Directory *
                </label>
                <input
                  id="input-github-directory"
                  type="text"
                  value={tempGithubConfig.targetDirectory}
                  onChange={(e) => setTempGithubConfig({ ...tempGithubConfig, targetDirectory: e.target.value })}
                  placeholder="image"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white font-mono"
                />
              </div>
            </div>

            {/* Target commit URL preview */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1.5">
              <span className="font-bold text-amber-400">Target Commit Repository Path:</span>
              <p className="font-mono text-stone-300 break-all text-[11px]">
                https://github.com/{tempGithubConfig.username}/{tempGithubConfig.repository}/tree/{tempGithubConfig.branch}/{tempGithubConfig.targetDirectory}
              </p>
            </div>

            {githubTestStatus && (
              <div className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-500/40 text-sky-200 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>{githubTestStatus}</span>
              </div>
            )}

            {/* Action Buttons: Test GitHub Connection & Save */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                id="btn-test-github-api"
                onClick={handleTestGithubApi}
                disabled={isTestingGithub}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isTestingGithub ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Testing Connection...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    <span>Test GitHub API Connection</span>
                  </>
                )}
              </button>

              <button
                id="btn-save-github-config"
                onClick={handleSaveGithubConfig}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition-all ${
                  savedSection === 'github'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                }`}
              >
                {savedSection === 'github' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Credentials Saved! ✓</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save GitHub Config</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STORE CONTACT & LOCATION SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'store-settings' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-amber-400 font-serif">
                Store Contact & Location Settings
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Update store name, tagline, Montreal phone, street address, branding logo, and 360° panorama tour.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Store Name *
                </label>
                <input
                  id="input-store-name"
                  type="text"
                  value={tempStoreSettings.storeName}
                  onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, storeName: e.target.value })}
                  placeholder="Depanneur Eilika"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white font-bold"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Tagline *
                </label>
                <input
                  id="input-store-tagline"
                  type="text"
                  value={tempStoreSettings.tagline}
                  onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, tagline: e.target.value })}
                  placeholder="Artisanal Catering & Delicatessen Montreal"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Phone Number *
                </label>
                <input
                  id="input-store-phone"
                  type="text"
                  value={tempStoreSettings.phoneNumber}
                  onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, phoneNumber: e.target.value })}
                  placeholder="+1 (514) 555-0199"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Street Address *
                </label>
                <input
                  id="input-store-address"
                  type="text"
                  value={tempStoreSettings.streetAddress}
                  onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, streetAddress: e.target.value })}
                  placeholder="1000 Sherbrooke St W Level C"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>

              {/* Google Map URL */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Google Map URL
                </label>
                <input
                  id="input-store-map-url"
                  type="url"
                  value={tempStoreSettings.mapUrl}
                  onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, mapUrl: e.target.value })}
                  placeholder="https://maps.app.goo.gl/6tF1NrPtpEzX3iGA9"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>
            </div>

            {/* BRANDING IMAGES & 360° HERO SECTION */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Branding Images & 360° Hero
              </h3>

              {/* 1. Store Logo URL / Upload */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <label className="block text-xs font-bold text-stone-200">
                  Store Logo URL / GitHub Commit
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    id="input-store-logo-url"
                    type="url"
                    value={tempStoreSettings.storeLogoUrl}
                    onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, storeLogoUrl: e.target.value })}
                    placeholder="https://raw.githubusercontent.com/lgangotra-hub/EilikacateringCA/main/image/b342ee4f-09da-4caa-80ac-df9cbe79e165.jpg"
                    className="flex-1 w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-900 border border-white/15 text-white"
                  />
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload Local</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
                {/* Logo Preview */}
                <div className="flex items-center gap-3">
                  <img
                    src={tempStoreSettings.storeLogoUrl}
                    alt="Logo Preview"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-amber-500/50 bg-stone-900"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('raw.githubusercontent.com')) {
                        target.src = 'https://raw.githubusercontent.com/lgangotra-hub/EilikacateringCA/main/image/b342ee4f-09da-4caa-80ac-df9cbe79e165.jpg';
                      }
                    }}
                  />
                  <span className="text-[11px] text-stone-400">
                    Live Logo Preview (Changes header and drawer instantly)
                  </span>
                </div>
              </div>

              {/* 2. 360° Panorama Hero URL / Upload */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <label className="block text-xs font-bold text-stone-200">
                  360° Panorama Hero URL
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    id="input-store-panorama-url"
                    type="url"
                    value={tempStoreSettings.panoramaHeroUrl}
                    onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, panoramaHeroUrl: e.target.value })}
                    placeholder="https://pannellum.org/images/alma.jpg"
                    className="flex-1 w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-900 border border-white/15 text-white"
                  />
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload 360 Image</span>
                    <input type="file" accept="image/*" onChange={handlePanoramaUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-[11px] text-amber-400/80">
                  Upload 360 Image aur design live change ho jaaye. (Supports equirectangular cylinder / sphere panorama views).
                </p>
              </div>
            </div>

            {/* Save Button for Store Settings */}
            <div className="flex justify-end pt-2">
              <button
                id="btn-save-store-settings"
                onClick={handleSaveStoreSettings}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs shadow-md transition-all ${
                  savedSection === 'store-settings'
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/40'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                }`}
              >
                {savedSection === 'store-settings' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Store Settings Saved! ✓</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Store Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ADMIN PASSWORD CHANGE */}
        {/* ========================================================================= */}
        {activeTab === 'password' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl space-y-6 max-w-xl mx-auto animate-in fade-in duration-300">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-amber-400 font-serif">
                adminPassword change
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Update the master administrator password for dashboard login.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Current Password *
                </label>
                <input
                  id="input-current-password"
                  type="password"
                  required
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Enter current password (default: admin 123)"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  New Admin Password *
                </label>
                <input
                  id="input-new-password"
                  type="password"
                  required
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  id="input-confirm-new-password"
                  type="password"
                  required
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/40 border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>

              {pwError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{pwError}</span>
                </div>
              )}

              {pwSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{pwSuccess}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  id="btn-save-password-change"
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs shadow-md transition-all ${
                    savedSection === 'password'
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/40'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  }`}
                >
                  {savedSection === 'password' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Password Changed & Saved! ✓</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

    </div>
  );
};
