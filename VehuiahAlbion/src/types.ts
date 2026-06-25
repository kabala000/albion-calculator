/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Available Cities in Albion Online
export type AlbionCity = 
  | 'Lymhurst' 
  | 'Martlock' 
  | 'Thetford' 
  | 'Fort Sterling' 
  | 'Bridgewatch' 
  | 'Caerleon' 
  | 'Mercado Negro';

// Available Item Tiers (T4 to T8)
export type ItemTier = 'T4' | 'T5' | 'T6' | 'T7' | 'T8';

// Enchantment Levels (0 to 4)
export type EnchantmentLevel = 0 | 1 | 2 | 3 | 4;

// Base recipe representation from Albion data
export interface ItemRecipe {
  Item: string;
  Artesano: string;
  TipoItem: string;
  Categoria: string;
  Lingotes: number;
  Tablas: number;
  Telas: number;
  Cueros: number;
  Artefacto1: string;
  CantidadArtefacto1: number;
  Url_Item: string;
  Url_Artefacto1: string;
}

// Material Price records by City -> Material -> Tier -> Enchantment
export interface MaterialPriceRecord {
  lingotes: Record<ItemTier, Record<EnchantmentLevel, number>>;
  tablas: Record<ItemTier, Record<EnchantmentLevel, number>>;
  telas: Record<ItemTier, Record<EnchantmentLevel, number>>;
  cueros: Record<ItemTier, Record<EnchantmentLevel, number>>;
  // Artifact prices can be tracked by artifact name (which contains tier or base name + tier lookup)
  artefactos: Record<string, Record<ItemTier, number>>; 
}

// Global material prices state for all cities
export type GlobalPricesState = Record<AlbionCity, MaterialPriceRecord>;

// Crafting job in the Queue (Panel 4)
export interface CraftingJob {
  id: string;
  characterName: string;
  recipe: ItemRecipe;
  tier: ItemTier;
  enchantment: EnchantmentLevel;
  quantity: number;
  
  // Custom bonus settings configuration
  city: AlbionCity;
  idealCityActive: boolean;
  activityBonusActive: boolean;
  hoBonusPercent: number; // e.g. 15 for 15%
  stationFeeRate: number; // e.g. 525 silver per 100 nutrition
  
  // Return rate and material breakdown
  returnRate: number; // e.g., 0.34 for 34%
  materialsCost: number; // calculated raw materials cost
  stationFeeTotal: number; // calculated stations tax
  taxesTotal: number; // transactions tax
  investmentTotal: number; // total cost
  
  // Target selling configuration
  sellCity: AlbionCity;
  unitSellPrice: number; // manually typed by user
  totalSellIncome: number; // calculated base revenue
  netSellRevenue: number; // calculated revenue after taxes (Order vs Direct)
  sellMethod: 'direct' | 'order';
  
  // Material purchase checklist status (Panel 3)
  // For each material, tracks how many have been acquired
  materialsPurchased: {
    lingotes: { needed: number; purchased: number; method: 'direct' | 'order'; city?: AlbionCity };
    tablas: { needed: number; purchased: number; method: 'direct' | 'order'; city?: AlbionCity };
    telas: { needed: number; purchased: number; method: 'direct' | 'order'; city?: AlbionCity };
    cueros: { needed: number; purchased: number; method: 'direct' | 'order'; city?: AlbionCity };
    artefacto: { needed: number; purchased: number; method: 'direct' | 'order'; city?: AlbionCity };
  };
  
  // Flag indicating if all materials are marked as completely acquired
  materialsReady: boolean;
  status: 'pending_materials' | 'ready_to_craft' | 'crafted_selling' | 'completed';
  craftedAt?: string;
  soldAt?: string;
  quantityUnsold?: number;
  listings?: Array<{
    id: string;
    quantity: number;
    price: number;
    setupFeePaid: number;
  }>;

  // Journal configuration fields
  useDiarios?: boolean;
  diariosQty?: number;
  diariosTier?: ItemTier;
  diariosProfession?: string;
  diariosCovered?: number;
  diariosPurchased?: number;
  diariosBuyMethod?: 'direct' | 'order';
  diariosPrice?: number;
  diariosReady?: boolean;
}

// Saved historical logs for performance analysis and charts (Panel 7)
export interface HistoryLog {
  id: string;
  characterName: string;
  itemName: string;
  tier: ItemTier;
  enchantment: EnchantmentLevel;
  quantity: number;
  investmentCost: number;
  revenueReceived: number;
  profit: number;
  timestamp: string; // ISO date
  dateString: string; // e.g. '2026-06'
}

// Character account tracking (Panel 1)
export interface Character {
  name: string;
  capital: number;
}

// Theme naming choices for aesthetic customizer
export type VisualTheme = 
  | 'royal_classic' // Slate dark background with amber/gold borders (Official Albion royal feel)
  | 'outlands_abyss' // Pitch black and deep crimson elements
  | 'avalonian_glory' // Clean white marble borders with luxury yellow accents
  | 'celtic_woodlands' // Deep forest greens with brown and rune elements
  | 'brutalist_iron' // Monochrome dark grays, sharp borders, high industrial contrast
  | 'crystal_neon' // Translucent glassmorphism (crystal) with glowing neon borders
  | 'spectral_ghoul' // Ethereal phantom greens and bright violet-magenta neon
  | 'sunset_desert'; // Warm terracotta sunset, sandbox gold glows and cozy copper accents

// Layout template choices
export type VisualTemplate = 
  | 'classic_panel' // Traditional layout with large sections and standard structure
  | 'compact_bento' // Bento-grid inspired modular layout with dense components
  | 'split_minimalist'; // Minimalist spacing, high breathing room and centered blocks

