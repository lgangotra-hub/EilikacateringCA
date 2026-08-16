export type ThemeId =
  | 'light-quartz'
  | 'light-cream'
  | 'light-rose'
  | 'light-emerald'
  | 'light-nordic'
  | 'dark-obsidian'
  | 'dark-cyber'
  | 'dark-roast'
  | 'dark-emerald-matrix'
  | 'dark-amethyst';

export type ClockStyleId =
  | 'quartz-digital'
  | 'vintage-analog'
  | 'rose-minimal'
  | 'emerald-swiss'
  | 'nordic-halo'
  | 'obsidian-neon'
  | 'cyber-hud'
  | 'roast-chronograph'
  | 'matrix-ticker'
  | 'amethyst-gem';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  category: 'light' | 'dark';
  clockStyle: ClockStyleId;
  description: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  badgeAccent: string;
  glowColor: string;
  glassBlur: string;
  marqueeBg: string;
  marqueeText: string;
  clockColors: {
    face: string;
    hands: string;
    secondHand: string;
    ticks: string;
    text: string;
    border: string;
    glow: string;
  };
}

export type BadgeDesignId = 1 | 2 | 3 | 4 | 5;

export interface BadgeOption {
  id: BadgeDesignId;
  name: string;
  labelDefault: string;
  iconName: string;
  containerClass: string;
  iconClass: string;
  textClass: string;
  glowClass: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  nameFr?: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  offer?: string; // e.g. "20% OFF", "BUY 1 GET 1", "SPECIAL"
  badgeId: BadgeDesignId;
  badgeText?: string;
  image: string;
  inStock: boolean;
  unit?: string; // e.g. "355ml", "150g", "Pack of 6"
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  description?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phoneNumber: string;
  whatsappNumber: string;
  streetAddress: string;
  cityProvince: string;
  mapUrl: string;
  storeLogoUrl: string;
  panoramaHeroUrl: string;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  deliveryMinOrder: number;
  deliveryFee: number;
  announcementText: string;
}

export interface GithubConfig {
  username: string;
  repository: string;
  personalAccessToken: string;
  targetDirectory: string;
  branch: string;
  lastTestedAt?: string;
  isConnected: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
