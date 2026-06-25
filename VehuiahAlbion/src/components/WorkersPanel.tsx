/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Character, 
  GlobalPricesState, 
  ItemTier, 
  EnchantmentLevel,
  AlbionCity
} from '../types';
import { 
  getMaterialRenderUrl,
  ALBION_CITIES
} from '../data';
import { 
  Users, 
  Home, 
  Plus, 
  Coins, 
  Archive, 
  Briefcase, 
  Clock, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  X, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  Flame, 
  Info,
  Layers,
  Sparkles,
  Pencil
} from 'lucide-react';

// Represent an island
interface WorkerIsland {
  id: string;
  name: string;
  city: AlbionCity;
  type: 'guild' | 'personal';
  workerType: 'WARRIOR' | 'MAGE' | 'HUNTER'; // WARRIOR=Herrero, MAGE=Herrero Mágico (Imbuidor), HUNTER=Flechero
  workersCount: number;
  efficiency: number; // e.g., 118 for 118%
  tier: ItemTier; // Tier of the workers/furniture
  assignedBooksCount: number;
  assignedBooksTier: ItemTier | '';
  status: 'idle' | 'working' | 'ready';
  assignedAt: number; // timestamp
}

// Represent returned material in staging
interface ReturnedMaterialStaging {
  id: string;
  type: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'diario_vacio';
  tier: ItemTier;
  enchantment: EnchantmentLevel;
  quantity: number;
  city: AlbionCity;
}

interface MaterialSalesOrder {
  id: string;
  materialName: string;
  type: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'diario_vacio';
  tier: ItemTier;
  enchantment: EnchantmentLevel;
  quantity: number;
  pricePerUnit: number;
  method: 'direct' | 'order';
  taxPaid: number;
  setupFeePaid: number;
  netSilver: number;
  status: 'pending' | 'sold';
  city: AlbionCity;
  createdAt: number;
}

interface WorkersPanelProps {
  activeChar: Character | null;
  activeCharName?: string;
  globalPrices: GlobalPricesState;
  onUpdateCapital: (newCapital: number) => void;
  onModifyInventoryQuantity: (matKey: string, change: number) => void;
  inventory: Record<string, number>;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
  globalPremium?: boolean;
}

// Preloaded initial default islands as requested by the screenshots
const DEFAULT_ISLANDS: WorkerIsland[] = [
  // Lymhurst
  { id: 'lym_guild_1', name: 'Isla Gremial 1', city: 'Lymhurst', type: 'guild', workerType: 'WARRIOR', workersCount: 12, efficiency: 118, tier: 'T6', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'lym_guild_2', name: 'Isla Gremial 2', city: 'Lymhurst', type: 'guild', workerType: 'WARRIOR', workersCount: 15, efficiency: 118, tier: 'T5', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'lym_guild_3', name: 'Isla Gremial 3', city: 'Lymhurst', type: 'guild', workerType: 'WARRIOR', workersCount: 8, efficiency: 112, tier: 'T4', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'lym_pers_1', name: 'Isla Personal 1', city: 'Lymhurst', type: 'personal', workerType: 'WARRIOR', workersCount: 10, efficiency: 115, tier: 'T6', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'lym_pers_2', name: 'Isla Personal 2', city: 'Lymhurst', type: 'personal', workerType: 'WARRIOR', workersCount: 5, efficiency: 100, tier: 'T4', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },

  // Bridgewatch
  { id: 'bw_guild_1', name: 'Isla Gremial 1', city: 'Bridgewatch', type: 'guild', workerType: 'HUNTER', workersCount: 20, efficiency: 112, tier: 'T7', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'bw_guild_2', name: 'Isla Gremial 2', city: 'Bridgewatch', type: 'guild', workerType: 'HUNTER', workersCount: 18, efficiency: 112, tier: 'T6', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'bw_guild_3', name: 'Isla Gremial 3', city: 'Bridgewatch', type: 'guild', workerType: 'HUNTER', workersCount: 15, efficiency: 118, tier: 'T5', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'bw_guild_4', name: 'Isla Gremial 4', city: 'Bridgewatch', type: 'guild', workerType: 'HUNTER', workersCount: 10, efficiency: 115, tier: 'T4', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'bw_pers_1', name: 'Isla Personal 1', city: 'Bridgewatch', type: 'personal', workerType: 'HUNTER', workersCount: 8, efficiency: 100, tier: 'T5', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },

  // Martlock
  { id: 'mar_guild_1', name: 'Isla Gremial 1', city: 'Martlock', type: 'guild', workerType: 'MAGE', workersCount: 15, efficiency: 115, tier: 'T6', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'mar_guild_2', name: 'Isla Gremial 2', city: 'Martlock', type: 'guild', workerType: 'MAGE', workersCount: 10, efficiency: 115, tier: 'T5', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'mar_pers_1', name: 'Isla Personal 1', city: 'Martlock', type: 'personal', workerType: 'MAGE', workersCount: 12, efficiency: 112, tier: 'T6', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'mar_pers_2', name: 'Isla Personal 2', city: 'Martlock', type: 'personal', workerType: 'MAGE', workersCount: 10, efficiency: 112, tier: 'T5', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },
  { id: 'mar_pers_3', name: 'Isla Personal 3', city: 'Martlock', type: 'personal', workerType: 'MAGE', workersCount: 8, efficiency: 100, tier: 'T4', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 },

  // Thetford
  { id: 'the_guild_1', name: 'Isla Gremial 1', city: 'Thetford', type: 'guild', workerType: 'MAGE', workersCount: 15, efficiency: 100, tier: 'T6', assignedBooksCount: 0, assignedBooksTier: '', status: 'idle', assignedAt: 0 }
];

export default function WorkersPanel({
  activeChar,
  activeCharName,
  globalPrices,
  onUpdateCapital,
  onModifyInventoryQuantity,
  inventory,
  primaryColor,
  surfaceColor,
  borderColor,
  globalPremium
}: WorkersPanelProps) {
  
  const charName = activeCharName || activeChar?.name || 'default';

  // State managers
  const [activeWorkerType, setActiveWorkerType] = useState<'WARRIOR' | 'MAGE' | 'HUNTER'>('WARRIOR');
  const [islands, setIslands] = useState<WorkerIsland[]>([]);
  const [expandedCities, setExpandedCities] = useState<Record<AlbionCity, boolean>>({
    'Lymhurst': true,
    'Bridgewatch': false,
    'Martlock': false,
    'Thetford': false,
    'Fort Sterling': false,
    'Caerleon': false,
    'Mercado Negro': false
  } as Record<AlbionCity, boolean>);
  
  const [stagingReturns, setStagingReturns] = useState<ReturnedMaterialStaging[]>([]);
  const [producedBooks, setProducedBooks] = useState<Record<string, any>>({});

  // Sliders for daily simulation
  const [booksPerDay, setBooksPerDay] = useState<number>(120);

  // Modals / forms states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newIslandCity, setNewIslandCity] = useState<AlbionCity>('Lymhurst');
  const [newIslandName, setNewIslandName] = useState<string>('');
  const [newIslandType, setNewIslandType] = useState<'guild' | 'personal'>('guild');
  const [newIslandWorkers, setNewIslandWorkers] = useState<number>(15);
  const [newIslandEfficiency, setNewIslandEfficiency] = useState<number>(118);
  const [newIslandTier, setNewIslandTier] = useState<ItemTier>('T6');

  // Edit island states
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingIslandId, setEditingIslandId] = useState<string | null>(null);
  const [editIslandName, setEditIslandName] = useState<string>('');
  const [editIslandCity, setEditIslandCity] = useState<AlbionCity>('Lymhurst');
  const [editIslandType, setEditIslandType] = useState<'guild' | 'personal'>('guild');
  const [editIslandWorkers, setEditIslandWorkers] = useState<number>(15);
  const [editIslandEfficiency, setEditIslandEfficiency] = useState<number>(118);
  const [editIslandTier, setEditIslandTier] = useState<ItemTier>('T6');
  const [editIslandWorkerType, setEditIslandWorkerType] = useState<'WARRIOR' | 'MAGE' | 'HUNTER'>('WARRIOR');

  // Manual book addition states
  const [showAddBookForm, setShowAddBookForm] = useState<boolean>(false);
  const [addBookTier, setAddBookTier] = useState<ItemTier>('T6');
  const [addBookProfession, setAddBookProfession] = useState<'WARRIOR' | 'MAGE' | 'HUNTER'>('WARRIOR');
  const [addBookQty, setAddBookQty] = useState<number>(10);

  // Sell form state
  const [sellingReturnId, setSellingReturnId] = useState<string | null>(null);
  const [sellPriceInput, setSellPriceInput] = useState<number>(0);
  const [sellQtyInput, setSellQtyInput] = useState<number>(0);
  const [sellMethod, setSellMethod] = useState<'direct' | 'order'>('direct');

  // Assign popover state
  const [assigningIslandId, setAssigningIslandId] = useState<string | null>(null);
  const [assignBookTier, setAssignBookTier] = useState<ItemTier>('T6');
  const [assignQty, setAssignQty] = useState<number>(12);

  // New States for Sales Orders and Collection Popup
  const [salesOrders, setSalesOrders] = useState<MaterialSalesOrder[]>([]);
  const [collectionPopupData, setCollectionPopupData] = useState<{
    islandId: string;
    islandName: string;
    city: AlbionCity;
    bookTier: ItemTier;
    workerType: string;
    items: Array<{
      id: string;
      type: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'diario_vacio';
      enchantment: EnchantmentLevel;
      quantity: number;
      confirmed: boolean;
    }>;
  } | null>(null);

  // Real returns (Manual inputs) modal states
  interface RealReturnRow {
    id: string;
    type: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'diario_vacio';
    tier: ItemTier;
    enchantment: EnchantmentLevel;
    quantity: number;
    action: 'save' | 'sell';
    method: 'direct' | 'order';
    price: number;
  }
  const [showRealReturnModal, setShowRealReturnModal] = useState<boolean>(false);
  const [realReturnRows, setRealReturnRows] = useState<RealReturnRow[]>([]);
  const [realReturnCity, setRealReturnCity] = useState<AlbionCity>('Lymhurst');

  // Success notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ show: boolean; msg: string; silver: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load state on mount/char change
  useEffect(() => {
    if (charName) {
      // 1. Load islands
      const savedIslands = localStorage.getItem(`albion_islands_list_${charName}`);
      if (savedIslands) {
        try {
          setIslands(JSON.parse(savedIslands));
        } catch (e) {
          setIslands(DEFAULT_ISLANDS);
        }
      } else {
        // Filter DEFAULT_ISLANDS to have matching workerType if appropriate or just load all
        setIslands(DEFAULT_ISLANDS);
      }

      // 2. Load returns stockpile (staging)
      const savedReturns = localStorage.getItem(`albion_worker_returns_${charName}`);
      if (savedReturns) {
        try {
          setStagingReturns(JSON.parse(savedReturns));
        } catch (e) {
          setStagingReturns([]);
        }
      } else {
        setStagingReturns([]);
      }

      // 3. Load produced books (from craft queue)
      const savedProduced = localStorage.getItem(`albion_produced_books_list_${charName}`);
      if (savedProduced) {
        try {
          setProducedBooks(JSON.parse(savedProduced));
        } catch (e) {
          setProducedBooks({});
        }
      } else {
        setProducedBooks({});
      }

      // 4. Load material sales orders
      const savedOrders = localStorage.getItem(`albion_sales_orders_${charName}`);
      if (savedOrders) {
        try {
          setSalesOrders(JSON.parse(savedOrders));
        } catch (e) {
          setSalesOrders([]);
        }
      } else {
        setSalesOrders([]);
      }
    }
  }, [charName]);

  // Synchronize/persist changes
  const saveIslands = (updatedIslands: WorkerIsland[]) => {
    setIslands(updatedIslands);
    localStorage.setItem(`albion_islands_list_${charName}`, JSON.stringify(updatedIslands));
  };

  const saveReturns = (updatedReturns: ReturnedMaterialStaging[]) => {
    setStagingReturns(updatedReturns);
    localStorage.setItem(`albion_worker_returns_${charName}`, JSON.stringify(updatedReturns));
  };

  const saveProducedBooks = (updatedProduced: Record<string, any>) => {
    setProducedBooks(updatedProduced);
    localStorage.setItem(`albion_produced_books_list_${charName}`, JSON.stringify(updatedProduced));
  };

  const saveSalesOrders = (orders: MaterialSalesOrder[]) => {
    setSalesOrders(orders);
    localStorage.setItem(`albion_sales_orders_${charName}`, JSON.stringify(orders));
  };

  // Worker progress simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      let changed = false;
      const updated = islands.map(isl => {
        if (isl.status === 'working') {
          const now = Date.now();
          const elapsed = now - isl.assignedAt;
          // Work duration: let's make it 6 seconds (6000 ms)
          if (elapsed >= 6000) {
            changed = true;
            return {
              ...isl,
              status: 'ready' as const
            };
          }
        }
        return isl;
      });

      if (changed) {
        saveIslands(updated);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [islands, charName]);

  // Expand / Collapse all cities
  const handleToggleExpandAll = () => {
    const allExpanded = Object.values(expandedCities).every(v => v);
    const nextState = {} as Record<AlbionCity, boolean>;
    ALBION_CITIES.forEach(city => {
      nextState[city] = !allExpanded;
    });
    setExpandedCities(nextState);
  };

  const handleToggleCity = (city: AlbionCity) => {
    setExpandedCities(prev => ({
      ...prev,
      [city]: !prev[city]
    }));
  };

  // Preloaded translations for materials
  const getMaterialSpanishName = (type: string, tier: ItemTier, ench: EnchantmentLevel) => {
    if (type === 'diario_vacio') {
      return `Diario Vacío (${tier})`;
    }
    const enchStr = ench > 0 ? `.${ench}` : '';
    let baseName = '';
    
    if (type === 'lingotes') {
      switch (tier) {
        case 'T4': baseName = 'Lingote de Acero'; break;
        case 'T5': baseName = 'Lingote de Titanio'; break;
        case 'T6': baseName = 'Lingote de Runas'; break;
        case 'T7': baseName = 'Lingote de Meteorito'; break;
        case 'T8': baseName = 'Lingote Avaloniano'; break;
      }
    } else if (type === 'tablas') {
      switch (tier) {
        case 'T4': baseName = 'Tabla de Pino'; break;
        case 'T5': baseName = 'Tabla de Cedro'; break;
        case 'T6': baseName = 'Tabla de Olmo'; break;
        case 'T7': baseName = 'Tabla de Roble'; break;
        case 'T8': baseName = 'Tabla de Secuoya'; break;
      }
    } else if (type === 'cueros') {
      switch (tier) {
        case 'T4': baseName = 'Cuero Curado'; break;
        case 'T5': baseName = 'Cuero Fortificado'; break;
        case 'T6': baseName = 'Cuero Reforzado'; break;
        case 'T7': baseName = 'Cuero Pesado'; break;
        case 'T8': baseName = 'Cuero Legendario'; break;
      }
    } else if (type === 'telas') {
      switch (tier) {
        case 'T4': baseName = 'Tela de Lino'; break;
        case 'T5': baseName = 'Tela de Seda'; break;
        case 'T6': baseName = 'Tela de Fieltro'; break;
        case 'T7': baseName = 'Tela de Satén'; break;
        case 'T8': baseName = 'Tela de Brocado'; break;
      }
    }
    
    return `${baseName}${enchStr} (${tier}${enchStr})`;
  };

  const getEmptyJournalPrice = (tier: ItemTier) => {
    switch(tier) {
      case 'T4': return 1000;
      case 'T5': return 2500;
      case 'T6': return 5000;
      case 'T7': return 12000;
      case 'T8': return 25000;
      default: return 1000;
    }
  };

  // Calculate material prices from globalPrices state
  const getMaterialPrice = (type: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'diario_vacio', tier: ItemTier, ench: EnchantmentLevel, city: AlbionCity) => {
    if (type === 'diario_vacio') {
      return getEmptyJournalPrice(tier);
    }
    const cityPrices = globalPrices[city] || globalPrices['Lymhurst'];
    const p = cityPrices?.[type]?.[tier]?.[ench];
    if (p && p > 0) return p;

    // Standard baseline pricing fallback
    const baselines = { lingotes: 180, tablas: 160, telas: 150, cueros: 175 };
    const tierMultiplier = { T4: 1, T5: 2.5, T6: 6, T7: 15, T8: 40 };
    const enchMultiplier = { 0: 1, 1: 1.8, 2: 3.5, 3: 8, 4: 15 };
    
    const base = baselines[type as 'lingotes'] || 150;
    const tMult = tierMultiplier[tier] || 1;
    const eMult = enchMultiplier[ench] || 1;
    return Math.round(base * tMult * eMult);
  };

  // Add a new island dynamically
  const handleAddIsland = () => {
    if (!newIslandName.trim()) {
      showToast('Por favor introduce un nombre para la isla.');
      return;
    }

    const newIsland: WorkerIsland = {
      id: `isl_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: newIslandName,
      city: newIslandCity,
      type: newIslandType,
      workerType: activeWorkerType,
      workersCount: newIslandWorkers,
      efficiency: newIslandEfficiency,
      tier: newIslandTier,
      assignedBooksCount: 0,
      assignedBooksTier: '',
      status: 'idle',
      assignedAt: 0
    };

    const updated = [...islands, newIsland];
    saveIslands(updated);
    setShowAddModal(false);
    setNewIslandName('');
    showToast(`Isla "${newIslandName}" creada con éxito en ${newIslandCity}.`);
  };

  const handleDeleteIsland = (id: string, name: string) => {
    const updated = islands.filter(i => i.id !== id);
    saveIslands(updated);
    showToast(`Isla "${name}" eliminada.`);
  };

  const handleOpenEdit = (island: WorkerIsland) => {
    setEditingIslandId(island.id);
    setEditIslandName(island.name);
    setEditIslandCity(island.city);
    setEditIslandType(island.type);
    setEditIslandWorkers(island.workersCount);
    setEditIslandEfficiency(island.efficiency);
    setEditIslandTier(island.tier);
    setEditIslandWorkerType(island.workerType);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editIslandName.trim()) {
      showToast('Por favor introduce un nombre para la isla.');
      return;
    }

    const updated = islands.map(isl => {
      if (isl.id === editingIslandId) {
        return {
          ...isl,
          name: editIslandName,
          city: editIslandCity,
          type: editIslandType,
          workersCount: editIslandWorkers,
          efficiency: editIslandEfficiency,
          tier: editIslandTier,
          workerType: editIslandWorkerType
        };
      }
      return isl;
    });

    saveIslands(updated);
    setShowEditModal(false);
    setEditingIslandId(null);
    showToast(`Isla "${editIslandName}" modificada con éxito.`);
  };

  const handleManualAddBooks = () => {
    if (addBookQty <= 0) {
      showToast('Por favor selecciona una cantidad válida mayor que 0.');
      return;
    }

    const key = `${addBookTier}_${addBookProfession}`;
    const copyBooks = { ...producedBooks };
    
    let professionName = '';
    if (addBookProfession === 'WARRIOR') professionName = 'Diario de Herrero';
    else if (addBookProfession === 'MAGE') professionName = 'Diario de Herrero Mágico';
    else if (addBookProfession === 'HUNTER') professionName = 'Diario de Flechero';

    if (copyBooks[key]) {
      copyBooks[key].quantity += addBookQty;
    } else {
      copyBooks[key] = {
        key,
        tier: addBookTier.replace('T', ''),
        professionId: addBookProfession,
        professionName: `${professionName} (Lleno)`,
        quantity: addBookQty,
        items: {}
      };
    }

    saveProducedBooks(copyBooks);
    setShowAddBookForm(false);
    showToast(`¡Se han añadido +${addBookQty} Diarios ${addBookTier} (${getWorkerClassName(addBookProfession)}) llenos!`);
  };

  // Open assign dialog
  const handleOpenAssign = (island: WorkerIsland) => {
    setAssigningIslandId(island.id);
    
    // Find the highest tier that the user actually has books for, <= island.tier
    const validTiers = getValidTiers(island.tier);

    let bestTier = island.tier;
    for (const t of [...validTiers].reverse()) {
      const k = `${t}_${island.workerType}`;
      if (producedBooks[k] && producedBooks[k].quantity > 0) {
        bestTier = t as ItemTier;
        break;
      }
    }

    setAssignBookTier(bestTier);
    const bookKey = `${bestTier}_${island.workerType}`;
    const avail = producedBooks[bookKey]?.quantity || 0;
    setAssignQty(Math.min(island.workersCount, avail));
  };

  // Enviar a Trabajar (Send to work)
  const handleConfirmAssign = () => {
    if (!assigningIslandId) return;
    const island = islands.find(i => i.id === assigningIslandId);
    if (!island) return;

    const bookKey = `${assignBookTier}_${island.workerType}`;
    const bookData = producedBooks[bookKey] || { quantity: 0 };
    const available = bookData.quantity || 0;

    if (available === 0) {
      showToast(`No tienes Diarios ${assignBookTier} (${getWorkerClassName(island.workerType)}) llenos disponibles en tu cola de crafteo.`);
      return;
    }

    const finalQty = Math.min(assignQty, available, island.workersCount);
    if (finalQty <= 0) {
      showToast('Por favor selecciona una cantidad de diarios válida (mayor que 0).');
      return;
    }

    // Subtract from producedBooks
    const copyBooks = { ...producedBooks };
    copyBooks[bookKey].quantity -= finalQty;
    if (copyBooks[bookKey].quantity <= 0) {
      delete copyBooks[bookKey];
    }
    saveProducedBooks(copyBooks);

    // Update island to working status
    const updatedIslands = islands.map(i => {
      if (i.id === island.id) {
        return {
          ...i,
          status: 'working' as const,
          assignedBooksCount: finalQty,
          assignedBooksTier: assignBookTier,
          assignedAt: Date.now()
        };
      }
      return i;
    });
    saveIslands(updatedIslands);
    setAssigningIslandId(null);
    showToast(`¡Se han enviado ${finalQty} trabajadores a trabajar en "${island.name}"!`);
  };

  // Collect returns (Cobrar Retornos) - Opens the manual interactive collection modal
  const handleCollectReturns = (island: WorkerIsland) => {
    if (island.status !== 'ready') return;

    const bTier = island.assignedBooksTier as ItemTier || island.tier;
    const bCount = island.assignedBooksCount || island.workersCount;
    const wType = island.workerType;
    const city = island.city;

    // Default empty journals row
    const defaultJournalRow = {
      id: `col_journal_${Date.now()}_0`,
      type: 'diario_vacio' as const,
      enchantment: 0 as EnchantmentLevel,
      quantity: bCount,
      confirmed: true // Pre-confirm the empty journals for convenience
    };

    // Default primary material row
    let defaultMatType: 'lingotes' | 'tablas' | 'telas' | 'cueros' = 'lingotes';
    if (wType === 'MAGE') {
      defaultMatType = 'telas';
    } else if (wType === 'HUNTER') {
      defaultMatType = 'cueros';
    }

    const defaultMaterialRow = {
      id: `col_mat_${Date.now()}_1`,
      type: defaultMatType,
      enchantment: 0 as EnchantmentLevel,
      quantity: 12, // helper placeholder, can be edited
      confirmed: false
    };

    setCollectionPopupData({
      islandId: island.id,
      islandName: island.name,
      city: city,
      bookTier: bTier,
      workerType: wType,
      items: [defaultJournalRow, defaultMaterialRow]
    });
  };

  const handleAddCollectionPopupRow = () => {
    if (!collectionPopupData) return;
    const newRow = {
      id: `col_manual_${Date.now()}_${collectionPopupData.items.length}`,
      type: 'lingotes' as const,
      enchantment: 0 as EnchantmentLevel,
      quantity: 1,
      confirmed: false
    };
    setCollectionPopupData({
      ...collectionPopupData,
      items: [...collectionPopupData.items, newRow]
    });
  };

  const handleRemoveCollectionPopupRow = (id: string) => {
    if (!collectionPopupData) return;
    setCollectionPopupData({
      ...collectionPopupData,
      items: collectionPopupData.items.filter(item => item.id !== id)
    });
  };

  const handleUpdateCollectionPopupRow = (id: string, updates: Partial<{ type: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'diario_vacio', enchantment: EnchantmentLevel, quantity: number, confirmed: boolean }>) => {
    if (!collectionPopupData) return;
    setCollectionPopupData({
      ...collectionPopupData,
      items: collectionPopupData.items.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      })
    });
  };

  const handleConfirmCollectionManual = () => {
    if (!collectionPopupData) return;

    // Filter items with positive quantity
    const activeItems = collectionPopupData.items.filter(item => item.quantity > 0);
    if (activeItems.length === 0) {
      showToast('Por favor, ingresa una cantidad mayor a 0 para al menos un recurso.');
      return;
    }

    // Check if any active items are not confirmed
    const unconfirmed = activeItems.find(item => !item.confirmed);
    if (unconfirmed) {
      showToast('Por favor, marca la casilla de verificación (check) de cada recurso para asegurar que es correcto.');
      return;
    }

    // Add generated items to stagingReturns list
    const newStaging = [...stagingReturns];
    activeItems.forEach(item => {
      // Find if we already have this exact resource & city combo in staging
      const existing = newStaging.find(
         st => st.type === item.type && st.tier === collectionPopupData.bookTier && st.enchantment === item.enchantment && st.city === collectionPopupData.city
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        newStaging.push({
          id: `ret_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          type: item.type,
          tier: collectionPopupData.bookTier,
          enchantment: item.enchantment,
          quantity: item.quantity,
          city: collectionPopupData.city
        });
      }
    });

    // Reset island status to idle
    const updatedIslands = islands.map(i => {
      if (i.id === collectionPopupData.islandId) {
        return {
          ...i,
          status: 'idle' as const,
          assignedBooksCount: 0,
          assignedBooksTier: '' as const,
          assignedAt: 0
        };
      }
      return i;
    });

    saveIslands(updatedIslands);
    saveReturns(newStaging);
    setCollectionPopupData(null);
    showToast(`¡Se han agregado los retornos de "${collectionPopupData.islandName}" a la Bandeja de Retornos!`);
  };

  // Guardar en Almacén (Save back into the inventory)
  const handleSaveToInventory = (retItem: ReturnedMaterialStaging) => {
    // Inventory key is formatted as "type_tier_ench" (e.g. lingotes_T6_0)
    const invKey = `${retItem.type}_${retItem.tier}_${retItem.enchantment}`;
    
    // Add to local inventory state
    onModifyInventoryQuantity(invKey, retItem.quantity);

    // Remove from stagingReturns
    const nextStaging = stagingReturns.filter(st => st.id !== retItem.id);
    saveReturns(nextStaging);

    showToast(`¡Guardados ${retItem.quantity}x de ${getMaterialSpanishName(retItem.type, retItem.tier, retItem.enchantment)} en tu Almacén!`);
  };

  // Open selling dialog/input
  const handleOpenSell = (retItem: ReturnedMaterialStaging) => {
    const defaultPrice = getMaterialPrice(retItem.type, retItem.tier, retItem.enchantment, retItem.city);
    setSellingReturnId(retItem.id);
    setSellPriceInput(defaultPrice);
    setSellQtyInput(retItem.quantity);
  };

  // Confirm Sale (Vender)
  const handleConfirmSell = () => {
    if (!sellingReturnId) return;
    const retItem = stagingReturns.find(st => st.id === sellingReturnId);
    if (!retItem) return;

    const finalQty = Math.min(sellQtyInput, retItem.quantity);
    if (finalQty <= 0) {
      showToast('Cantidad inválida para la venta.');
      return;
    }

    const taxRate = globalPremium ? 0.04 : 0.08;
    const setupFeeRate = sellMethod === 'order' ? 0.025 : 0;

    const subtotal = finalQty * sellPriceInput;
    const taxes = Math.round(subtotal * taxRate);
    const setupFee = Math.round(subtotal * setupFeeRate);
    const netSilver = Math.max(0, subtotal - taxes - setupFee);

    // Create a new pending sales order
    const newOrder: MaterialSalesOrder = {
      id: `ord_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      materialName: getMaterialSpanishName(retItem.type, retItem.tier, retItem.enchantment),
      type: retItem.type,
      tier: retItem.tier,
      enchantment: retItem.enchantment,
      quantity: finalQty,
      pricePerUnit: sellPriceInput,
      method: sellMethod,
      taxPaid: taxes,
      setupFeePaid: setupFee,
      netSilver: netSilver,
      status: 'pending',
      city: retItem.city,
      createdAt: Date.now()
    };
    saveSalesOrders([newOrder, ...salesOrders]);

    // Decrement or remove from returns
    let nextStaging = [...stagingReturns];
    if (finalQty === retItem.quantity) {
      nextStaging = nextStaging.filter(st => st.id !== retItem.id);
    } else {
      nextStaging = nextStaging.map(st => {
        if (st.id === retItem.id) {
          return { ...st, quantity: st.quantity - finalQty };
        }
        return st;
      });
    }

    saveReturns(nextStaging);
    setSellingReturnId(null);
    
    showToast(`¡Órden de venta creada para ${finalQty}x de ${newOrder.materialName}! Completa la venta en el nuevo panel de órdenes.`);
  };

  // Complete Sales Order (Mark as sold, award silver, delete order, show celebration)
  const handleToggleSold = (orderId: string) => {
    const order = salesOrders.find(ord => ord.id === orderId);
    if (!order) return;

    if (order.status === 'pending') {
      if (activeChar) {
        onUpdateCapital(activeChar.capital + order.netSilver);
      }
      const nextOrders = salesOrders.filter(ord => ord.id !== orderId);
      saveSalesOrders(nextOrders);
      
      // Trigger striking celebration popup
      setCelebration({
        show: true,
        msg: `¡Venta de ${order.materialName} completada con éxito!`,
        silver: order.netSilver
      });
      
      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setCelebration(null);
      }, 4000);
    }
  };

  // Toggle Sales Order method between direct and order
  const handleToggleMethod = (orderId: string) => {
    const nextOrders = salesOrders.map(ord => {
      if (ord.id === orderId) {
        const nextMethod = ord.method === 'order' ? 'direct' : 'order';
        const taxRate = globalPremium ? 0.04 : 0.08;
        const setupFeeRate = nextMethod === 'order' ? 0.025 : 0;
        
        const subtotal = ord.quantity * ord.pricePerUnit;
        const taxes = Math.round(subtotal * taxRate);
        const setupFee = Math.round(subtotal * setupFeeRate);
        const nextNet = Math.max(0, subtotal - taxes - setupFee);
        
        if (ord.status === 'sold' && activeChar) {
          const diff = nextNet - ord.netSilver;
          onUpdateCapital(Math.max(0, activeChar.capital + diff));
        }
        
        return {
          ...ord,
          method: nextMethod,
          taxPaid: taxes,
          setupFeePaid: setupFee,
          netSilver: nextNet
        };
      }
      return ord;
    });
    saveSalesOrders(nextOrders);
    showToast(`Método de venta actualizado.`);
  };

  // Delete/Cancel sales order (returns items back to staging returns!)
  const handleDeleteSalesOrder = (order: MaterialSalesOrder) => {
    // If it was already sold, subtract from capital!
    if (order.status === 'sold' && activeChar) {
      onUpdateCapital(Math.max(0, activeChar.capital - order.netSilver));
    }

    // Return materials back to staging
    const nextStaging = [...stagingReturns];
    const existing = nextStaging.find(
      st => st.type === order.type && st.tier === order.tier && st.enchantment === order.enchantment && st.city === order.city
    );
    if (existing) {
      existing.quantity += order.quantity;
    } else {
      nextStaging.push({
        id: `ret_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        type: order.type,
        tier: order.tier,
        enchantment: order.enchantment,
        quantity: order.quantity,
        city: order.city
      });
    }

    saveReturns(nextStaging);
    saveSalesOrders(salesOrders.filter(o => o.id !== order.id));
    showToast(`¡Venta cancelada! Los materiales regresaron a la Bandeja de Retornos.`);
  };

  // Real return manual handlers
  const handleOpenRealReturnModal = () => {
    const primaryCity = islands[0]?.city || 'Lymhurst';
    setRealReturnCity(primaryCity);
    setRealReturnRows([
      {
        id: `rr_${Date.now()}_0`,
        type: 'lingotes',
        tier: 'T6',
        enchantment: 0,
        quantity: 1,
        action: 'save',
        method: 'direct',
        price: getMaterialPrice('lingotes', 'T6', 0, primaryCity)
      }
    ]);
    setShowRealReturnModal(true);
  };

  const handleAddRealReturnRow = () => {
    setRealReturnRows([
      ...realReturnRows,
      {
        id: `rr_${Date.now()}_${realReturnRows.length}`,
        type: 'lingotes',
        tier: 'T6',
        enchantment: 0,
        quantity: 1,
        action: 'save',
        method: 'direct',
        price: getMaterialPrice('lingotes', 'T6', 0, realReturnCity)
      }
    ]);
  };

  const handleRemoveRealReturnRow = (id: string) => {
    setRealReturnRows(realReturnRows.filter(r => r.id !== id));
  };

  const handleUpdateRealReturnRow = (id: string, updates: Partial<RealReturnRow>) => {
    setRealReturnRows(realReturnRows.map(row => {
      if (row.id === id) {
        const updated = { ...row, ...updates };
        if (updates.type !== undefined || updates.tier !== undefined || updates.enchantment !== undefined) {
          updated.price = getMaterialPrice(updated.type, updated.tier, updated.enchantment, realReturnCity);
        }
        return updated;
      }
      return row;
    }));
  };

  const handleUpdateRealReturnCity = (city: AlbionCity) => {
    setRealReturnCity(city);
    setRealReturnRows(realReturnRows.map(row => ({
      ...row,
      price: getMaterialPrice(row.type, row.tier, row.enchantment, city)
    })));
  };

  const handleProcessRealReturns = () => {
    if (realReturnRows.length === 0) {
      showToast('Por favor añade al menos un material antes de procesar.');
      return;
    }

    for (const row of realReturnRows) {
      if (row.quantity <= 0) {
        showToast('La cantidad de todos los materiales debe ser mayor que 0.');
        return;
      }
      if (row.action === 'sell' && row.price < 0) {
        showToast('El precio unitario de venta no puede ser negativo.');
        return;
      }
    }

    let savedCount = 0;
    let soldDirectCount = 0;
    let soldOrderCount = 0;
    let totalDirectSilver = 0;
    const newOrders: MaterialSalesOrder[] = [];

    realReturnRows.forEach(row => {
      if (row.action === 'save') {
        const invKey = `${row.type}_${row.tier}_${row.enchantment}`;
        onModifyInventoryQuantity(invKey, row.quantity);
        savedCount += row.quantity;
      } else {
        const subtotal = row.quantity * row.price;
        const taxRate = globalPremium ? 0.04 : 0.08;
        const setupFeeRate = row.method === 'order' ? 0.025 : 0;
        
        const taxes = Math.round(subtotal * taxRate);
        const setupFee = Math.round(subtotal * setupFeeRate);
        const netSilver = Math.max(0, subtotal - taxes - setupFee);

        const newOrder: MaterialSalesOrder = {
          id: `ord_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          materialName: getMaterialSpanishName(row.type, row.tier, row.enchantment),
          type: row.type,
          tier: row.tier,
          enchantment: row.enchantment,
          quantity: row.quantity,
          pricePerUnit: row.price,
          method: row.method,
          taxPaid: taxes,
          setupFeePaid: setupFee,
          netSilver: netSilver,
          status: row.method === 'direct' ? 'sold' : 'pending',
          city: realReturnCity,
          createdAt: Date.now()
        };

        newOrders.push(newOrder);

        if (row.method === 'direct') {
          soldDirectCount += row.quantity;
          totalDirectSilver += netSilver;
        } else {
          soldOrderCount += row.quantity;
        }
      }
    });

    if (newOrders.length > 0) {
      saveSalesOrders([...newOrders, ...salesOrders]);
    }

    if (totalDirectSilver > 0 && activeChar) {
      onUpdateCapital(activeChar.capital + totalDirectSilver);
      setCelebration({
        show: true,
        msg: `¡Venta Directa de Retornos procesada con éxito!`,
        silver: totalDirectSilver
      });
      setTimeout(() => {
        setCelebration(null);
      }, 4000);
    }

    let msg = '¡Retornos manuales procesados!';
    const details = [];
    if (savedCount > 0) details.push(`Guardado: ${savedCount}x en Almacén`);
    if (soldDirectCount > 0) {
      details.push(`Vendido directo: ${soldDirectCount}x (+${totalDirectSilver.toLocaleString()} S)`);
    }
    if (soldOrderCount > 0) {
      details.push(`Órdenes creadas: ${soldOrderCount}x en espera`);
    }
    if (details.length > 0) {
      msg += ' (' + details.join(', ') + ')';
    }

    showToast(msg);
    setShowRealReturnModal(false);
  };

  // Helper functions for names & graphics
  const getValidTiers = (workerTier: ItemTier) => {
    const tiers: ItemTier[] = ['T4', 'T5', 'T6', 'T7', 'T8'];
    const maxIndex = tiers.indexOf(workerTier);
    if (maxIndex === -1) return ['T4'];
    return tiers.slice(0, maxIndex + 1);
  };

  const getWorkerClassName = (type: string) => {
    switch (type) {
      case 'WARRIOR': return 'Herrero';
      case 'MAGE': return 'Herrero Mágico';
      case 'HUNTER': return 'Flechero';
      default: return 'Trabajador';
    }
  };

  // Calculate totals
  const totalWorkers = useMemo(() => {
    return islands.reduce((acc, isl) => acc + isl.workersCount, 0);
  }, [islands]);

  const categoryWorkers = useMemo(() => {
    const counts = { WARRIOR: 0, MAGE: 0, HUNTER: 0 };
    islands.forEach(isl => {
      counts[isl.workerType] += isl.workersCount;
    });
    return counts;
  }, [islands]);

  // Aggregate available books from producedBooks
  const availableBooksList = useMemo(() => {
    // Map keys to readable models
    const list: Array<{ key: string; tier: ItemTier; qty: number; professionId: string; title: string }> = [];
    Object.keys(producedBooks).forEach(key => {
      const data = producedBooks[key];
      // Keys are e.g. T6_WARRIOR, T4_MAGE, etc.
      const tier = data.tier?.replace('T', '') || '';
      const cleanTier = `T${tier}` as ItemTier;
      list.push({
        key,
        tier: cleanTier,
        qty: data.quantity || 0,
        professionId: data.professionId || 'WARRIOR',
        title: data.professionName || `Diario de ${getWorkerClassName(data.professionId)} (Lleno)`
      });
    });
    return list;
  }, [producedBooks]);

  // Total available books count
  const totalAvailableBooks = useMemo(() => {
    return availableBooksList.reduce((acc, b) => acc + b.qty, 0);
  }, [availableBooksList]);

  // Days available simulation calculation
  const daysAvailableText = useMemo(() => {
    if (booksPerDay <= 0 || totalAvailableBooks <= 0) return 'Sin diarios disponibles';
    const totalHours = (totalAvailableBooks / booksPerDay) * 24;
    const days = Math.floor(totalHours / 24);
    const hours = Math.round(totalHours % 24);
    
    if (days === 0) {
      return `${hours} horas de uso disponibles`;
    }
    return `${days} días, ${hours} horas de uso disponibles`;
  }, [totalAvailableBooks, booksPerDay]);

  // Filter islands of the ACTIVE worker type
  const activeIslands = useMemo(() => {
    return islands.filter(isl => isl.workerType === activeWorkerType);
  }, [islands, activeWorkerType]);

  // Group activeIslands by city
  const cityIslandsMap = useMemo(() => {
    const map = {} as Record<AlbionCity, WorkerIsland[]>;
    ALBION_CITIES.forEach(city => {
      map[city] = [];
    });
    activeIslands.forEach(isl => {
      if (map[isl.city]) {
        map[isl.city].push(isl);
      }
    });
    return map;
  }, [activeIslands]);

  // Aggregate stats per city
  const cityStats = useMemo(() => {
    const stats = {} as Record<AlbionCity, { guildCount: number; personalCount: number; workers: number; avgEfficiency: number }>;
    ALBION_CITIES.forEach(city => {
      const isls = cityIslandsMap[city] || [];
      const guildCount = isls.filter(i => i.type === 'guild').length;
      const personalCount = isls.filter(i => i.type === 'personal').length;
      const workers = isls.reduce((sum, i) => sum + i.workersCount, 0);
      const avgEfficiency = isls.length > 0 
        ? Math.round(isls.reduce((sum, i) => sum + i.efficiency, 0) / isls.length) 
        : 100;

      stats[city] = { guildCount, personalCount, workers, avgEfficiency };
    });
    return stats;
  }, [cityIslandsMap]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      
      {/* Action Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/40 text-cyan-400 py-3 px-5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center gap-2 text-xs font-semibold animate-slide-in">
          <Info size={16} className="text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid container splitting 2/3 for islands management and 1/3 for inventory/returns staging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main islands dashboard (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Panel card */}
          <div className={`p-5 rounded-2xl border ${surfaceColor} ${borderColor} shadow-lg relative overflow-hidden`}>
            {/* Background decorative glows */}
            <div className="absolute right-0 top-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
                  <Users className="text-cyan-400" size={24} />
                  Trabajadores
                </h1>
                <p className="text-xs text-slate-400">
                  Gestiona tus trabajadores y producción en todo tu imperio.
                </p>
              </div>

              {/* Total Workers counter stats */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl py-2.5 px-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-500">Total de Trabajadores</p>
                  <p className="text-md font-bold text-white flex items-center gap-1">
                    <span className="text-cyan-400">{totalWorkers}</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-500">300</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Worker Classes Category selector tabs */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              
              {/* Tab Herrero */}
              <button 
                onClick={() => setActiveWorkerType('WARRIOR')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                  activeWorkerType === 'WARRIOR' 
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                    : 'bg-slate-900/45 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeWorkerType === 'WARRIOR' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Flame size={14} />
                  </div>
                  <span className="text-xs font-semibold tracking-wide">Herrero</span>
                </div>
                <span className="font-mono font-bold text-sm bg-slate-950/60 px-2 py-0.5 rounded-md text-slate-300 border border-slate-800/80">
                  {categoryWorkers.WARRIOR}
                </span>
              </button>

              {/* Tab Herrero Mágico */}
              <button 
                onClick={() => setActiveWorkerType('MAGE')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                  activeWorkerType === 'MAGE' 
                    ? 'bg-violet-500/10 border-violet-500/40 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                    : 'bg-slate-900/45 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeWorkerType === 'MAGE' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Sparkles size={14} />
                  </div>
                  <span className="text-xs font-semibold tracking-wide">Herrero Mágico</span>
                </div>
                <span className="font-mono font-bold text-sm bg-slate-950/60 px-2 py-0.5 rounded-md text-slate-300 border border-slate-800/80">
                  {categoryWorkers.MAGE}
                </span>
              </button>

              {/* Tab Flecheros */}
              <button 
                onClick={() => setActiveWorkerType('HUNTER')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                  activeWorkerType === 'HUNTER' 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-slate-900/45 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeWorkerType === 'HUNTER' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Briefcase size={14} />
                  </div>
                  <span className="text-xs font-semibold tracking-wide">Flecheros</span>
                </div>
                <span className="font-mono font-bold text-sm bg-slate-950/60 px-2 py-0.5 rounded-md text-slate-300 border border-slate-800/80">
                  {categoryWorkers.HUNTER}
                </span>
              </button>

            </div>

          </div>

          {/* Distribution section by City */}
          <div className="space-y-4">
            
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                  <Home size={15} className="text-cyan-400" />
                  Distribución por Ciudades
                </h3>
                <span className="text-[10px] text-slate-500">
                  Organiza y asigna diarios a tus trabajadores distribuidos en islas.
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Cities display filter dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500">Ver por:</span>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 font-medium">
                    Ciudades
                  </div>
                </div>

                {/* Expand All trigger button */}
                <button 
                  onClick={handleToggleExpandAll}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-lg py-1 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Layers size={13} className="text-cyan-400" />
                  <span>Expandir Todo</span>
                </button>
              </div>
            </div>

            {/* Grid layout of City Cards */}
            <div className="grid grid-cols-1 gap-4">
              
              {ALBION_CITIES.map(city => {
                const isExpanded = !!expandedCities[city];
                const stats = cityStats[city] || { guildCount: 0, personalCount: 0, workers: 0, avgEfficiency: 100 };
                const isls = cityIslandsMap[city] || [];
                
                // Skip rendering empty cities to keep UI clean, unless they click to expand or we preloaded them
                const isPreloaded = ['Lymhurst', 'Bridgewatch', 'Martlock', 'Thetford'].includes(city);
                if (isls.length === 0 && !isPreloaded) return null;

                // Configure elegant gradients for each city name to give real Albion atmosphere
                let cityGlow = 'from-emerald-950/20 to-slate-950';
                let cityText = 'text-emerald-400';
                let cityBorder = 'border-emerald-950/45';
                
                if (city === 'Lymhurst') {
                  cityGlow = 'from-emerald-950/25 to-slate-950';
                  cityText = 'text-emerald-400';
                  cityBorder = 'border-emerald-500/30';
                } else if (city === 'Bridgewatch') {
                  cityGlow = 'from-amber-600/15 to-slate-950';
                  cityText = 'text-amber-500';
                  cityBorder = 'border-amber-500/30';
                } else if (city === 'Martlock') {
                  cityGlow = 'from-blue-600/15 to-slate-950';
                  cityText = 'text-blue-400';
                  cityBorder = 'border-blue-500/30';
                } else if (city === 'Thetford') {
                  cityGlow = 'from-fuchsia-950/25 to-slate-950';
                  cityText = 'text-purple-400';
                  cityBorder = 'border-purple-500/30';
                } else if (city === 'Fort Sterling') {
                  // Silver / Plateado
                  cityGlow = 'from-slate-700/20 to-slate-950';
                  cityText = 'text-slate-300';
                  cityBorder = 'border-slate-500/30';
                } else if (city === 'Caerleon') {
                  cityGlow = 'from-red-950/25 to-slate-950';
                  cityText = 'text-red-500';
                  cityBorder = 'border-red-500/30';
                }

                return (
                  <div key={city} className={`rounded-xl border border-slate-800 overflow-hidden bg-slate-900/25`}>
                    
                    {/* Header City button */}
                    <button 
                      onClick={() => handleToggleCity(city)}
                      className={`w-full p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left bg-gradient-to-r ${cityGlow} hover:from-slate-900 hover:to-slate-950 transition-all`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Roman styled visual placeholder banner matching Albion style */}
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs ${cityBorder} bg-slate-950/60 ${cityText}`}>
                          {city.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-md font-serif font-bold text-white flex items-center gap-2">
                            {city}
                          </h4>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>Islas Gremiales: <strong className={cityText}>{stats.guildCount} / 5</strong></span>
                            <span>•</span>
                            <span>Islas Personales: <strong className={cityText}>{stats.personalCount} / 5</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-800/60 pt-2 sm:pt-0">
                        
                        <div className="text-right">
                          <span className="block text-[10px] text-slate-500 font-mono">TRABAJADORES</span>
                          <strong className="text-sm font-bold text-white">{stats.workers}</strong>
                        </div>

                        <div className="text-right">
                          <span className="block text-[10px] text-slate-500 font-mono">EFICIENCIA PROMEDIO</span>
                          <span className="text-sm font-bold text-emerald-400">{stats.avgEfficiency}%</span>
                        </div>

                        <div className="p-1 rounded-lg bg-slate-900/65 text-slate-400">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>

                      </div>

                    </button>

                    {/* Collapsible expanded detail panel */}
                    {isExpanded && (
                      <div className="p-4 bg-slate-950/40 border-t border-slate-900/70 space-y-4">
                        
                        {/* List of islands horizontally or in cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          
                          {isls.map(isl => {
                            // Status specific colors
                            let statusColor = 'border-slate-800 bg-slate-900/35';
                            let statusBadge = 'bg-slate-950 text-slate-500';
                            let statusText = 'Inactivo';

                            if (isl.status === 'working') {
                              statusColor = 'border-amber-500/20 bg-amber-500/5';
                              statusBadge = 'bg-amber-900/20 text-amber-400 animate-pulse';
                              statusText = 'Trabajando...';
                            } else if (isl.status === 'ready') {
                              statusColor = 'border-emerald-500/35 bg-emerald-500/5 shadow-[0_0_12px_rgba(16,185,129,0.05)]';
                              statusBadge = 'bg-emerald-950 text-emerald-400';
                              statusText = '¡Listo para Cobrar!';
                            }

                            return (
                              <div 
                                key={isl.id} 
                                className={`p-3.5 rounded-xl border relative group transition-all duration-300 ${statusColor}`}
                              >
                                
                                {/* Action buttons in top right corner */}
                                <div className="absolute right-2 top-2 flex items-center gap-1.5 z-10">
                                  {/* Edit button */}
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEdit(isl);
                                    }}
                                    className="p-1 rounded bg-slate-950/40 border border-slate-850 hover:bg-cyan-500/10 hover:border-cyan-500/35 text-slate-500 hover:text-cyan-400 transition-all"
                                    title="Editar Isla"
                                  >
                                    <Pencil size={11} />
                                  </button>

                                  {/* Trash delete button */}
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteIsland(isl.id, isl.name);
                                    }}
                                    className="p-1 rounded bg-slate-950/40 border border-slate-850 hover:bg-red-500/10 hover:border-red-500/35 text-slate-500 hover:text-red-400 transition-all"
                                    title="Eliminar Isla"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>

                                {/* Icon indicator */}
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-center text-slate-400">
                                    {isl.type === 'guild' ? '🏰' : '🏡'}
                                  </div>
                                  <div className="truncate pr-4">
                                    <h5 className="text-xs font-bold text-white truncate">{isl.name}</h5>
                                    <span className="block text-[8px] uppercase font-mono text-slate-500">
                                      {isl.type === 'guild' ? 'Isla Gremial' : 'Isla Personal'}
                                    </span>
                                  </div>
                                </div>

                                {/* Detail list */}
                                <div className="space-y-1 font-mono text-[10px] text-slate-400 border-t border-slate-900/60 pt-2 mb-3">
                                  <div className="flex justify-between">
                                    <span>Trabajadores:</span>
                                    <strong className="text-white">{isl.workersCount}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Eficiencia:</span>
                                    <strong className="text-emerald-400">{isl.efficiency}%</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Tier Isla:</span>
                                    <strong className="text-white">{isl.tier}</strong>
                                  </div>
                                  {isl.status !== 'idle' && (
                                    <div className="flex justify-between text-slate-500">
                                      <span>Diarios:</span>
                                      <strong className="text-amber-400">{isl.assignedBooksCount} ({isl.assignedBooksTier})</strong>
                                    </div>
                                  )}
                                </div>

                                {/* Active workflow status badge & execution controls */}
                                <div className="flex flex-col gap-2 mt-2">
                                  
                                  {/* Status indicator badge */}
                                  <div className={`w-full py-1 px-2.5 rounded text-center text-[9px] font-mono font-semibold tracking-wider ${statusBadge}`}>
                                    {statusText}
                                  </div>

                                  {/* Button states */}
                                  {isl.status === 'idle' && (
                                    <button
                                      onClick={() => handleOpenAssign(isl)}
                                      className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_18px_rgba(6,182,212,0.4)] active:scale-[0.98]"
                                    >
                                      <Briefcase size={12} className="text-slate-950 fill-slate-950/20" />
                                      <span>Enviar Trabajadores 🚀</span>
                                    </button>
                                  )}

                                  {isl.status === 'working' && (
                                    <div className="space-y-1">
                                      {/* Polish mini-progress indicator bar */}
                                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full animate-pulse" style={{ width: '60%' }} />
                                      </div>
                                      <span className="block text-center text-[8px] text-slate-500 font-mono">Retornos procesándose...</span>
                                    </div>
                                  )}

                                  {isl.status === 'ready' && (
                                    <button
                                      onClick={() => handleCollectReturns(isl)}
                                      className="w-full py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] animate-pulse"
                                    >
                                      <Coins size={12} />
                                      <span>Cobrar Retorno</span>
                                    </button>
                                  )}

                                </div>

                              </div>
                            );
                          })}

                          {/* "+" Añadir Isla card slot */}
                          <button 
                            onClick={() => {
                              setNewIslandCity(city);
                              setNewIslandName(`${city === 'Lymhurst' || city === 'Bridgewatch' ? 'Isla' : 'Isla'} ${isls.length + 1}`);
                              setShowAddModal(true);
                            }}
                            className="p-4 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/20 text-slate-500 hover:text-slate-300 flex flex-col items-center justify-center gap-2 transition-all min-h-[140px]"
                          >
                            <div className="w-8 h-8 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-slate-200">
                              <Plus size={16} />
                            </div>
                            <span className="text-xs font-semibold">Añadir Isla</span>
                            <span className="text-[9px] font-mono text-slate-600 block uppercase">RANURA EN {city.toUpperCase()}</span>
                          </button>

                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar inventory & Returns staging area (1/3 width) */}
        <div className="space-y-6">
          
          {/* AVAILABLE BOOKS STATUS WIDGET (Libros) */}
          <div className={`p-4 rounded-2xl border ${surfaceColor} ${borderColor} shadow-lg space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Briefcase size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-serif">Libros</h3>
                  <span className="text-[10px] text-slate-500 block">Inventario de diarios llenos acumulados</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAddBookForm(!showAddBookForm)}
                className="py-1 px-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-cyan-400 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-all"
                title="Agregar Diarios Manualmente"
              >
                <Plus size={11} />
                <span>Agregar</span>
              </button>
            </div>

            {/* Inline Manual Book Addition Form */}
            {showAddBookForm && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs animate-fadeIn">
                <div className="flex justify-between items-center pb-1 border-b border-slate-900">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Agregar Diarios</span>
                  <button onClick={() => setShowAddBookForm(false)} className="text-slate-500 hover:text-slate-300">
                    <X size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-medium block">Profesión</label>
                    <select 
                      value={addBookProfession}
                      onChange={(e) => setAddBookProfession(e.target.value as 'WARRIOR' | 'MAGE' | 'HUNTER')}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white text-[11px] font-mono focus:outline-none"
                    >
                      <option value="WARRIOR">Herrero</option>
                      <option value="MAGE">Herrero Mágico / Imbuidor</option>
                      <option value="HUNTER">Flechero</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-medium block">Tier</label>
                    <select 
                      value={addBookTier}
                      onChange={(e) => setAddBookTier(e.target.value as ItemTier)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white text-[11px] font-mono focus:outline-none"
                    >
                      <option value="T4">T4</option>
                      <option value="T5">T5</option>
                      <option value="T6">T6</option>
                      <option value="T7">T7</option>
                      <option value="T8">T8</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-slate-400 font-medium block">Cantidad</label>
                    <input 
                      type="number"
                      min="1"
                      value={addBookQty}
                      onChange={(e) => setAddBookQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white text-[11px] font-mono focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleManualAddBooks}
                    className="py-1.5 px-3 rounded bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-[11px] transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {/* List of produced books available */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              
              {availableBooksList.length === 0 ? (
                <div className="py-6 text-center text-slate-500 font-mono space-y-1 bg-slate-950/20 rounded-xl border border-dashed border-slate-900">
                  <span className="text-lg block">📓</span>
                  <p className="text-[10px]">No tienes diarios en inventario.</p>
                  <p className="text-[8px] text-slate-600 max-w-[180px] mx-auto">
                    Planifica ítems en tu <strong className="text-cyan-400">Cola de Crafteo</strong> y dale a "Craftear" para acumular diarios llenos.
                  </p>
                </div>
              ) : (
                availableBooksList.map(book => {
                  const cleanTierNum = book.tier.replace(/\D/g, '');
                  const imgUrl = `https://render.albiononline.com/v1/item/T${cleanTierNum}_JOURNAL_${book.professionId}_FULL.png`;
                  
                  // Accent color depends on class
                  let classColor = 'bg-amber-500/25 border-amber-500/40 text-amber-300';
                  if (book.professionId === 'MAGE') classColor = 'bg-violet-500/25 border-violet-500/40 text-violet-300';
                  if (book.professionId === 'HUNTER') classColor = 'bg-emerald-500/25 border-emerald-500/40 text-emerald-300';

                  return (
                    <div key={book.key} className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/30 flex items-center justify-between gap-3">
                      
                      <div className="flex items-center gap-2">
                        <img 
                          src={imgUrl} 
                          alt={book.title} 
                          className="w-9 h-9 object-contain drop-shadow"
                          onError={(e) => {
                            // general image fallback
                            e.currentTarget.src = 'https://render.albiononline.com/v1/item/T4_JOURNAL_WARRIOR_FULL.png';
                          }}
                        />
                        <div className="truncate">
                          <span className={`inline-block py-0.5 px-1.5 rounded text-[8px] font-mono font-bold uppercase mb-1 ${classColor}`}>
                            {getWorkerClassName(book.professionId)} {book.tier}
                          </span>
                          <span className="block text-[10px] text-slate-300 truncate max-w-[150px]">{book.title}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] text-slate-500 font-mono">DISPONIBLE</span>
                        <strong className="text-sm font-bold font-mono text-cyan-400">{book.qty.toLocaleString()}</strong>
                      </div>

                    </div>
                  );
                })
              )}

            </div>

            {/* Slider to simulate daily consumption as requested by mockup */}
            <div className="bg-slate-950/45 rounded-xl border border-slate-900 p-3 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Libros a usar por día</span>
                <strong className="text-white">{booksPerDay.toLocaleString()} / día</strong>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setBooksPerDay(prev => Math.max(0, prev - 10))}
                  className="w-6 h-6 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 flex items-center justify-center text-xs"
                >
                  -
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1200"
                  step="10"
                  value={booksPerDay}
                  onChange={(e) => setBooksPerDay(parseInt(e.target.value) || 0)}
                  className="flex-1 accent-cyan-500"
                />
                <button 
                  onClick={() => setBooksPerDay(prev => Math.min(1200, prev + 10))}
                  className="w-6 h-6 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>

              <div className="border-t border-slate-900/60 pt-2 flex items-center gap-1.5 text-[10px] font-mono">
                <Clock size={11} className="text-amber-400" />
                <span className="text-slate-500">Días de uso disponibles:</span>
                <strong className="text-emerald-400">{daysAvailableText}</strong>
              </div>
            </div>

          </div>

          {/* RETURNED MATERIALS STAGING WIDGET (Ventas de Materiales) */}
          <div className={`p-4 rounded-2xl border ${surfaceColor} ${borderColor} shadow-lg space-y-4`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Archive size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-serif">Bandeja de Retornos</h3>
                  <span className="text-[10px] text-slate-500 block">Recursos devueltos esperando acción</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleOpenRealReturnModal}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[9px] font-mono font-bold uppercase py-1 px-2 rounded-md transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                  title="Registrar manualmente lo que tus trabajadores trajeron del juego realmente"
                >
                  <span>📝 Registrar Real</span>
                </button>

                {stagingReturns.length > 0 && (
                  <button 
                    onClick={() => {
                      // Save all to inventory
                      stagingReturns.forEach(ret => {
                        const invKey = `${ret.type}_${ret.tier}_${ret.enchantment}`;
                        onModifyInventoryQuantity(invKey, ret.quantity);
                      });
                      saveReturns([]);
                      showToast('¡Se han guardado todos los materiales devueltos en tu Almacén local!');
                    }}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[9px] font-mono font-bold uppercase py-1 px-2 rounded-md transition-all"
                  >
                    Guardar Todo
                  </button>
                )}
              </div>
            </div>

            {/* List of returned staging items */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              
              {stagingReturns.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-mono space-y-1 bg-slate-950/20 rounded-xl border border-dashed border-slate-900">
                  <span className="text-2xl block">🎒</span>
                  <p className="text-[11px] font-bold text-slate-400">Bandeja de Retornos Vacía</p>
                  <p className="text-[9px] text-slate-600 max-w-[210px] mx-auto mt-1">
                    Envía trabajadores llenos a tus islas. Una vez que regresen, los recursos refinados (.0, .1, .2, .3) aparecerán listos aquí.
                  </p>
                </div>
              ) : (
                stagingReturns.map(ret => {
                  const nameStr = getMaterialSpanishName(ret.type, ret.tier, ret.enchantment);
                  const imgUrl = ret.type === 'diario_vacio'
                    ? `https://render.albiononline.com/v1/item/${ret.tier}_JOURNAL_WARRIOR.png`
                    : getMaterialRenderUrl(ret.type as any, ret.tier, ret.enchantment);
                  const price = getMaterialPrice(ret.type, ret.tier, ret.enchantment, ret.city);
                  const totalVal = price * ret.quantity;

                  // Enchantment specific background accents
                  let borderClass = 'border-slate-800';
                  let bgClass = 'bg-slate-950/40';
                  if (ret.enchantment === 1) {
                    borderClass = 'border-emerald-500/20';
                    bgClass = 'bg-emerald-950/10';
                  } else if (ret.enchantment === 2) {
                    borderClass = 'border-blue-500/20';
                    bgClass = 'bg-blue-950/10';
                  } else if (ret.enchantment === 3) {
                    borderClass = 'border-purple-500/25';
                    bgClass = 'bg-purple-950/10';
                  }

                  return (
                    <div 
                      key={ret.id} 
                      className={`p-3 rounded-xl border ${borderClass} ${bgClass} space-y-2.5 transition-all`}
                    >
                      
                      <div className="flex justify-between items-start gap-2">
                        
                        <div className="flex items-center gap-2">
                          <img 
                            src={imgUrl} 
                            alt={nameStr} 
                            className="w-10 h-10 object-contain drop-shadow" 
                            onError={(e) => {
                              e.currentTarget.src = 'https://render.albiononline.com/v1/item/T4_METALBAR.png';
                            }}
                          />
                          <div className="truncate">
                            <span className="block text-[11px] font-bold text-white truncate max-w-[140px]" title={nameStr}>
                              {nameStr}
                            </span>
                            <span className="block text-[8px] uppercase font-mono text-slate-500 mt-0.5">
                              Enviados en {ret.city}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block text-[10px] text-slate-500 font-mono">CANTIDAD</span>
                          <strong className="text-sm font-bold font-mono text-emerald-400">{ret.quantity.toLocaleString()}</strong>
                        </div>

                      </div>

                      {/* Financial info summary */}
                      <div className="bg-slate-950/60 rounded-lg p-2 flex justify-between items-center text-[10px] font-mono border border-slate-900/60">
                        <div className="text-slate-500">
                          <span>Precio:</span>
                          <span className="text-slate-300 ml-1">{price.toLocaleString()} S</span>
                        </div>
                        <div className="text-slate-300">
                          <span>Total:</span>
                          <strong className="text-yellow-400 ml-1">{(totalVal).toLocaleString()} S</strong>
                        </div>
                      </div>

                      {/* Action trigger row */}
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        
                        <button 
                          onClick={() => handleOpenSell(ret)}
                          className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                        >
                          <Coins size={11} className="text-amber-500" />
                          <span>Vender</span>
                        </button>

                        <button 
                          onClick={() => handleSaveToInventory(ret)}
                          className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                        >
                          <Archive size={11} className="text-cyan-400" />
                          <span>Almacenar</span>
                        </button>

                      </div>

                    </div>
                  );
                })
              )}

            </div>

          </div>

          {/* MATERIAL SALES ORDERS WIDGET (Órdenes de Venta de Materiales) */}
          <div className={`p-4 rounded-2xl border ${surfaceColor} ${borderColor} shadow-lg space-y-4`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Coins size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-serif">Órdenes de Venta</h3>
                  <span className="text-[10px] text-slate-500 block">Control de ventas de materiales devueltos</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {salesOrders.length === 0 ? (
                <div className="py-8 text-center text-slate-500 font-mono space-y-1 bg-slate-950/20 rounded-xl border border-dashed border-slate-900">
                  <p className="text-[10px] text-slate-400 font-bold">Sin Órdenes de Venta</p>
                  <p className="text-[8px] text-slate-600 max-w-[200px] mx-auto mt-0.5">
                    Cuando vendes un material en la bandeja de retornos, se creará una orden aquí para que elijas cómo y cuándo consolidar el capital.
                  </p>
                </div>
              ) : (
                salesOrders.map(order => {
                  const isSold = order.status === 'sold';
                  const isOrder = order.method === 'order';
                  const imgUrl = order.type === 'diario_vacio'
                    ? `https://render.albiononline.com/v1/item/${order.tier}_JOURNAL_WARRIOR.png`
                    : getMaterialRenderUrl(order.type as any, order.tier, order.enchantment);

                  return (
                    <div 
                      key={order.id} 
                      className={`p-3 rounded-xl border transition-all space-y-2.5 ${
                        isSold 
                          ? 'border-emerald-500/30 bg-emerald-950/5' 
                          : 'border-slate-800 bg-slate-950/30'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <img 
                            src={imgUrl} 
                            alt={order.materialName} 
                            className="w-8 h-8 object-contain drop-shadow" 
                            onError={(e) => {
                              e.currentTarget.src = 'https://render.albiononline.com/v1/item/T4_METALBAR.png';
                            }}
                          />
                          <div className="truncate">
                            <span className="block text-[10px] font-bold text-white truncate max-w-[130px]" title={order.materialName}>
                              {order.materialName}
                            </span>
                            <span className="block text-[8px] font-mono text-slate-500">
                              {order.quantity}x @ {order.pricePerUnit.toLocaleString()} S
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDeleteSalesOrder(order)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-950/80 transition-colors"
                          title="Cancelar Órden (Regresar a Bandeja)"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Method selector and Sold switch */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900/60">
                        {/* Sold toggle */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleSold(order.id)}
                            className={`w-full py-1 px-2 rounded text-[9px] font-bold font-mono uppercase text-center transition-all ${
                              isSold 
                                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {isSold ? 'Vendido: SÍ' : 'Vendido: NO'}
                          </button>
                        </div>

                        {/* Method toggle */}
                        <button
                          onClick={() => handleToggleMethod(order.id)}
                          className={`w-full py-1 px-2 rounded text-[9px] font-bold font-mono uppercase text-center border transition-all ${
                            isOrder 
                              ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400' 
                              : 'border-slate-800 bg-slate-900 text-slate-400'
                          }`}
                        >
                          {isOrder ? 'Orden de Venta' : 'Venta Directa'}
                        </button>
                      </div>

                      {/* Calculations summary */}
                      <div className="bg-slate-950/80 rounded-lg p-2 space-y-1 text-[9px] font-mono border border-slate-900">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal:</span>
                          <span>{(order.quantity * order.pricePerUnit).toLocaleString()} S</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Impuestos:</span>
                          <span>-{order.taxPaid.toLocaleString()} S</span>
                        </div>
                        {order.setupFeePaid > 0 && (
                          <div className="flex justify-between text-slate-500">
                            <span>Tasa Setup (2.5%):</span>
                            <span>-{order.setupFeePaid.toLocaleString()} S</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-slate-900/80">
                          <span className="text-slate-400">Total Neto:</span>
                          <strong className="text-yellow-400">{order.netSilver.toLocaleString()} S</strong>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* PRICES WIDGET REFERENCE (Precios de Venta) */}
          <div className={`p-4 rounded-2xl border ${surfaceColor} ${borderColor} shadow-lg space-y-3`}>
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-850">
              <h3 className="text-xs font-bold text-white font-serif flex items-center gap-1.5">
                <TrendingUp size={13} className="text-emerald-400" />
                Precios de Referencia (Lymhurst)
              </h3>
            </div>

            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Lingote de Acero T4.0</span>
                <span className="text-white">125 S</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tabla de Pino T4.0</span>
                <span className="text-white">110 S</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cuero Curado T4.0</span>
                <span className="text-white">115 S</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tela de Lino T4.0</span>
                <span className="text-white">105 S</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL: ADD ISLAND popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                <Home className="text-cyan-400" size={18} />
                Añadir Nueva Isla
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded bg-slate-950/40 border border-slate-850"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-400 font-medium block">Nombre de la Isla</label>
                <input 
                  type="text" 
                  value={newIslandName}
                  onChange={(e) => setNewIslandName(e.target.value)}
                  placeholder="e.g. Isla Gremial de Refino"
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Ciudad</label>
                  <select 
                    value={newIslandCity}
                    onChange={(e) => setNewIslandCity(e.target.value as AlbionCity)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {ALBION_CITIES.map(city => city !== 'Mercado Negro' && (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Tipo</label>
                  <select 
                    value={newIslandType}
                    onChange={(e) => {
                      const t = e.target.value as 'guild' | 'personal';
                      setNewIslandType(t);
                      // default counts
                      setNewIslandWorkers(t === 'guild' ? 15 : 12);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="guild">Isla Gremial (Gremio)</option>
                    <option value="personal">Isla Personal (Solo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Trabajadores</label>
                  <input 
                    type="number" 
                    value={newIslandWorkers}
                    onChange={(e) => setNewIslandWorkers(Math.max(1, parseInt(e.target.value) || 15))}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Eficiencia %</label>
                  <input 
                    type="number" 
                    value={newIslandEfficiency}
                    onChange={(e) => setNewIslandEfficiency(Math.max(50, parseInt(e.target.value) || 100))}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Tier</label>
                  <select 
                    value={newIslandTier}
                    onChange={(e) => setNewIslandTier(e.target.value as ItemTier)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="T4">T4</option>
                    <option value="T5">T5</option>
                    <option value="T6">T6</option>
                    <option value="T7">T7</option>
                    <option value="T8">T8</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 mt-1">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  * Las islas se asociarán con el tipo de trabajador activo seleccionado actualmente: <strong className="text-cyan-400">{getWorkerClassName(activeWorkerType)}</strong>.
                </p>
              </div>

            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddIsland}
                className="flex-1 py-2 px-4 rounded-xl text-slate-950 text-xs font-bold font-mono tracking-wide"
                style={{ backgroundColor: primaryColor }}
              >
                Crear Isla
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: EDIT ISLAND popup */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                <Pencil className="text-cyan-400" size={18} />
                Editar Isla
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded bg-slate-950/40 border border-slate-850"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-400 font-medium block">Nombre de la Isla</label>
                <input 
                  type="text" 
                  value={editIslandName}
                  onChange={(e) => setEditIslandName(e.target.value)}
                  placeholder="e.g. Isla Gremial de Refino"
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Ciudad</label>
                  <select 
                    value={editIslandCity}
                    onChange={(e) => setEditIslandCity(e.target.value as AlbionCity)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {ALBION_CITIES.map(city => city !== 'Mercado Negro' && (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Tipo</label>
                  <select 
                    value={editIslandType}
                    onChange={(e) => setEditIslandType(e.target.value as 'guild' | 'personal')}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="guild">Isla Gremial (Gremio)</option>
                    <option value="personal">Isla Personal (Solo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Tipo de Trabajador</label>
                  <select 
                    value={editIslandWorkerType}
                    onChange={(e) => setEditIslandWorkerType(e.target.value as 'WARRIOR' | 'MAGE' | 'HUNTER')}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="WARRIOR">Herrero</option>
                    <option value="MAGE">Herrero Mágico / Imbuidor</option>
                    <option value="HUNTER">Flechero</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Tier de Trabajador</label>
                  <select 
                    value={editIslandTier}
                    onChange={(e) => setEditIslandTier(e.target.value as ItemTier)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="T4">T4</option>
                    <option value="T5">T5</option>
                    <option value="T6">T6</option>
                    <option value="T7">T7</option>
                    <option value="T8">T8</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Cant. Trabajadores</label>
                  <input 
                    type="number" 
                    value={editIslandWorkers}
                    onChange={(e) => setEditIslandWorkers(Math.max(1, parseInt(e.target.value) || 15))}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Eficiencia %</label>
                  <input 
                    type="number" 
                    value={editIslandEfficiency}
                    onChange={(e) => setEditIslandEfficiency(Math.max(50, parseInt(e.target.value) || 100))}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-1 py-2 px-4 rounded-xl text-slate-950 text-xs font-bold font-mono tracking-wide"
                style={{ backgroundColor: primaryColor }}
              >
                Guardar Cambios
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: ASSIGN JOURNALS popup */}
      {assigningIslandId && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {(() => {
              const island = islands.find(i => i.id === assigningIslandId);
              if (!island) return null;
              
              const bookKey = `${assignBookTier}_${island.workerType}`;
              const available = producedBooks[bookKey]?.quantity || 0;

              return (
                <>
                  <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <Briefcase className="text-cyan-400" size={18} />
                      Asignar Diarios: {island.name}
                    </h3>
                    <button 
                      onClick={() => setAssigningIslandId(null)}
                      className="text-slate-500 hover:text-white p-1 rounded bg-slate-950/40 border border-slate-850"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    
                    <div className="flex justify-between text-[11px] bg-slate-950/40 p-2.5 rounded-lg border border-slate-900 font-mono">
                      <span className="text-slate-500">Capacidad Trabajadores:</span>
                      <strong className="text-white">{island.workersCount}</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium block">Tier de Diario</label>
                        <select 
                          value={assignBookTier}
                          onChange={(e) => {
                            const selectedT = e.target.value as ItemTier;
                            setAssignBookTier(selectedT);
                            const selectedKey = `${selectedT}_${island.workerType}`;
                            const avail = producedBooks[selectedKey]?.quantity || 0;
                            setAssignQty(Math.min(island.workersCount, avail));
                          }}
                          className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                        >
                          {getValidTiers(island.tier).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium block">Diarios Disponibles</label>
                        <div className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-cyan-400 font-bold font-mono">
                          {available} llenos
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-slate-400 font-medium block">Cantidad a Enviar</label>
                        <button 
                          onClick={() => setAssignQty(Math.min(island.workersCount, available))}
                          className="text-[10px] text-cyan-400 hover:underline"
                        >
                          Máximo ({Math.min(island.workersCount, available)})
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input 
                          type="range"
                          min="0"
                          max={Math.min(island.workersCount, available)}
                          value={assignQty}
                          onChange={(e) => setAssignQty(parseInt(e.target.value) || 0)}
                          className="flex-1 accent-cyan-500"
                        />
                        <input 
                          type="number"
                          min="0"
                          max={Math.min(island.workersCount, available)}
                          value={assignQty}
                          onChange={(e) => setAssignQty(Math.min(Math.min(island.workersCount, available), parseInt(e.target.value) || 0))}
                          className="w-16 bg-slate-950 border border-slate-800 text-center rounded-lg py-1.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    {available === 0 && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-[10px] leading-relaxed">
                        No posees Diarios de {getWorkerClassName(island.workerType)} Tier {assignBookTier} llenos en tu inventario. Realiza crafteos correspondientes en tu estación para rellenar diarios antes de poder enviarlos.
                      </div>
                    )}

                  </div>

                  <div className="flex gap-3 pt-3 border-t border-slate-850/60">
                    <button 
                      onClick={() => setAssigningIslandId(null)}
                      className="flex-1 py-2 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleConfirmAssign}
                      disabled={available === 0 || assignQty === 0}
                      className="flex-1 py-2.5 px-5 rounded-xl text-slate-950 text-xs font-black uppercase tracking-wider font-mono disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:brightness-110 active:scale-[0.98] shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-cyan-400 hover:bg-cyan-300"
                    >
                      🚀 Enviar a Trabajar
                    </button>
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      )}

      {/* MODAL: SELLING CONFIRM popup */}
      {sellingReturnId && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {(() => {
              const retItem = stagingReturns.find(st => st.id === sellingReturnId);
              if (!retItem) return null;

              const matName = getMaterialSpanishName(retItem.type, retItem.tier, retItem.enchantment);
              
              const taxRate = globalPremium ? 0.04 : 0.08;
              const setupFeeRate = sellMethod === 'order' ? 0.025 : 0;

              const subtotal = sellQtyInput * sellPriceInput;
              const taxes = Math.round(subtotal * taxRate);
              const setupFee = Math.round(subtotal * setupFeeRate);
              const netSilver = Math.max(0, subtotal - taxes - setupFee);

              return (
                <>
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <Coins className="text-amber-500" size={18} />
                      Vender Material Refinado
                    </h3>
                    <button 
                      onClick={() => setSellingReturnId(null)}
                      className="text-slate-500 hover:text-white p-1 rounded bg-slate-950/40 border border-slate-850"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    
                    <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                      <span className="block text-[10px] text-slate-500 font-mono">MATERIAL SELECCIONADO</span>
                      <strong className="text-white text-xs">{matName}</strong>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium block">Método de Venta</label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-850">
                        <button
                          type="button"
                          onClick={() => setSellMethod('direct')}
                          className={`py-1.5 px-2 rounded-md font-semibold text-[10px] uppercase transition-all ${
                            sellMethod === 'direct'
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Venta Directa
                        </button>
                        <button
                          type="button"
                          onClick={() => setSellMethod('order')}
                          className={`py-1.5 px-2 rounded-md font-semibold text-[10px] uppercase transition-all ${
                            sellMethod === 'order'
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Orden de Venta
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium block">Cantidad a Vender</label>
                        <input 
                          type="number"
                          min="1"
                          max={retItem.quantity}
                          value={sellQtyInput}
                          onChange={(e) => setSellQtyInput(Math.min(retItem.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">Max disponible: {retItem.quantity}</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium block">Precio Unitario (S)</label>
                        <input 
                          type="number"
                          min="0"
                          value={sellPriceInput}
                          onChange={(e) => setSellPriceInput(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal:</span>
                        <span className="text-slate-300">{subtotal.toLocaleString()} S</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Impuesto ({Math.round(taxRate * 100)}%):</span>
                        <span className="text-red-400">-{taxes.toLocaleString()} S</span>
                      </div>
                      {setupFee > 0 && (
                        <div className="flex justify-between text-slate-500">
                          <span>Tasa de Configuración (2.5%):</span>
                          <span className="text-red-400">-{setupFee.toLocaleString()} S</span>
                        </div>
                      )}
                      <div className="border-t border-slate-900 pt-1.5 flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-400">Ganancia Neta:</span>
                        <strong className="text-yellow-400 font-bold">{netSilver.toLocaleString()} S</strong>
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setSellingReturnId(null)}
                      className="flex-1 py-2 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleConfirmSell}
                      className="flex-1 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-mono tracking-wide shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    >
                      Confirmar Venta
                    </button>
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      )}

      {/* POPUP: FLOATING REPORT OF COLLECTED RETURNS */}
      {collectionPopupData && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-fadeIn max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-850 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <div>
                  <h3 className="text-md font-bold text-white font-serif">Cobrar Retornos de Trabajadores</h3>
                  <span className="text-[10px] text-slate-500 block">
                    Registra lo que te trajeron los trabajadores de <strong className="text-cyan-400">"{collectionPopupData.islandName}"</strong> en ({collectionPopupData.city})
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setCollectionPopupData(null)}
                className="text-slate-500 hover:text-white p-1 rounded bg-slate-950/40 border border-slate-850"
              >
                <X size={15} />
              </button>
            </div>

            {/* Info bar with locked tier */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 flex items-center justify-between gap-4 flex-shrink-0">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span>📚</span>
                <span>
                  El Tier de recursos está definido por el libro entregado: <strong className="text-emerald-400 font-mono text-sm">{collectionPopupData.bookTier}</strong>
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono font-bold uppercase py-1 px-2.5 rounded-md flex items-center gap-1">
                <span>🔒 Tier Fijo</span>
              </div>
            </div>

            {/* Rows list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[150px] py-1">
              {collectionPopupData.items.map((row, idx) => {
                const isJournal = row.type === 'diario_vacio';

                return (
                  <div 
                    key={row.id} 
                    className={`p-3 rounded-xl border transition-all relative flex flex-col md:flex-row md:items-center gap-3 ${
                      row.confirmed 
                        ? 'border-emerald-500/30 bg-emerald-950/5' 
                        : 'border-slate-850 bg-slate-950/20'
                    }`}
                  >
                    {/* Material selection */}
                    <div className="flex-1 space-y-1">
                      <label className="text-[9px] text-slate-500 uppercase block font-mono">Recurso</label>
                      <select
                        value={row.type}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          handleUpdateCollectionPopupRow(row.id, { 
                            type: val, 
                            ...(val === 'diario_vacio' ? { enchantment: 0 } : {}) 
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                      >
                        <option value="lingotes">Lingote</option>
                        <option value="tablas">Tablas</option>
                        <option value="telas">Tela</option>
                        <option value="cueros">Cuero</option>
                        {idx === 0 && <option value="diario_vacio">Diario Vacío</option>}
                      </select>
                    </div>

                    {/* Tier display (fixed) */}
                    <div className="w-20 space-y-1">
                      <label className="text-[9px] text-slate-500 uppercase block font-mono">Tier</label>
                      <div className="w-full bg-slate-950/80 border border-slate-850/60 text-slate-400 rounded-lg py-1.5 px-2 text-xs font-mono font-bold text-center flex items-center justify-center gap-1">
                        <span>{collectionPopupData.bookTier}</span>
                        <span className="text-[9px]">🔒</span>
                      </div>
                    </div>

                    {/* Enchantment selection */}
                    <div className="w-28 space-y-1">
                      <label className="text-[9px] text-slate-500 uppercase block font-mono">Encantamiento</label>
                      <select
                        value={row.enchantment}
                        disabled={isJournal}
                        onChange={(e) => handleUpdateCollectionPopupRow(row.id, { enchantment: parseInt(e.target.value) as EnchantmentLevel })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <option value="0">.0 (Plano)</option>
                        <option value="1">.1</option>
                        <option value="2">.2</option>
                        <option value="3">.3</option>
                      </select>
                    </div>

                    {/* Quantity selection */}
                    <div className="w-24 space-y-1">
                      <label className="text-[9px] text-slate-500 uppercase block font-mono">Cantidad</label>
                      <input
                        type="number"
                        min="0"
                        value={row.quantity === 0 ? '' : row.quantity}
                        placeholder="0"
                        onChange={(e) => handleUpdateCollectionPopupRow(row.id, { quantity: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono text-center font-bold text-emerald-400"
                      />
                    </div>

                    {/* Checkbox (Asegurar que es correcto) */}
                    <div className="flex items-center gap-2 pt-4 md:pt-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateCollectionPopupRow(row.id, { confirmed: !row.confirmed })}
                        className={`py-1.5 px-3 rounded-lg border text-[10px] font-bold font-mono uppercase transition-all flex items-center gap-1.5 ${
                          row.confirmed
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300'
                        }`}
                        title="Verificar que este recurso y su cantidad son correctos"
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                          row.confirmed ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                        }`}>
                          {row.confirmed && '✓'}
                        </span>
                        <span>Confirmado</span>
                      </button>

                      {/* Delete button (only show if we have more than 1 row) */}
                      {collectionPopupData.items.length > 1 && (
                        <button
                          onClick={() => handleRemoveCollectionPopupRow(row.id)}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-slate-950/60 transition-colors"
                          title="Eliminar fila"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}

              {/* Add row button */}
              <button
                onClick={handleAddCollectionPopupRow}
                className="w-full py-2.5 border-2 border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all bg-slate-950/10 hover:bg-slate-950/30"
              >
                <span>➕ Agregar Otro Recurso</span>
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-3 border-t border-slate-850/60 flex-shrink-0">
              <button 
                onClick={() => setCollectionPopupData(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmCollectionManual}
                className="flex-1 py-2.5 px-4 rounded-xl text-slate-950 text-xs font-bold font-mono tracking-wide bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Agregar a Bandeja
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP: MANUAL REAL RETURNS REGISTRAR */}
      {showRealReturnModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-fadeIn max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-850 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <div>
                  <h3 className="text-md font-bold text-white font-serif">Registrar Retorno Real (Juego)</h3>
                  <span className="text-[10px] text-slate-500 block">Ingresa exactamente lo que tus trabajadores te trajeron en Albion</span>
                </div>
              </div>
              <button 
                onClick={() => setShowRealReturnModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded bg-slate-950/40 border border-slate-850"
              >
                <X size={15} />
              </button>
            </div>

            {/* City Selection */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 flex items-center justify-between gap-4 flex-shrink-0">
              <div className="text-xs text-slate-300">
                <span className="font-bold text-cyan-400">Paso 1:</span> Selecciona la ciudad donde se cobran estos retornos para calcular los precios sugeridos del mercado:
              </div>
              <select
                value={realReturnCity}
                onChange={(e) => handleUpdateRealReturnCity(e.target.value as AlbionCity)}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg py-1.5 px-3 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              >
                {['Lymhurst', 'Bridgewatch', 'Martlock', 'Thetford', 'Fort Sterling', 'Caerleon', 'Mercado Negro'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Rows list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[150px] py-1">
              {realReturnRows.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-mono space-y-2 bg-slate-950/20 rounded-xl border border-dashed border-slate-850">
                  <p className="text-[11px] font-bold text-slate-400">No hay materiales añadidos</p>
                  <p className="text-[9px] text-slate-600">Haz clic en "Agregar Material" para registrar lo que te trajeron.</p>
                </div>
              ) : (
                realReturnRows.map((row, index) => {
                  const isJournal = row.type === 'diario_vacio';
                  const isSelling = row.action === 'sell';

                  return (
                    <div 
                      key={row.id} 
                      className="p-3.5 rounded-xl border border-slate-850 bg-slate-950/20 space-y-3 transition-all relative"
                    >
                      {/* Delete Row button */}
                      <button
                        onClick={() => handleRemoveRealReturnRow(row.id)}
                        className="absolute top-3.5 right-3.5 text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-900 transition-colors"
                        title="Eliminar fila"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase font-mono">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[9px]">{index + 1}</span>
                        <span>Material</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                        
                        {/* Type selection */}
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] text-slate-500 block">Tipo</label>
                          <select
                            value={row.type}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              handleUpdateRealReturnRow(row.id, { 
                                type: val, 
                                ...(val === 'diario_vacio' ? { enchantment: 0 } : {}) 
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                          >
                            <option value="lingotes">Lingote</option>
                            <option value="tablas">Tablas</option>
                            <option value="telas">Tela</option>
                            <option value="cueros">Cuero</option>
                            {index === 0 && <option value="diario_vacio">Diario Vacío</option>}
                          </select>
                        </div>

                        {/* Tier selection */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] text-slate-500 block">Tier</label>
                          <select
                            value={row.tier}
                            onChange={(e) => handleUpdateRealReturnRow(row.id, { tier: e.target.value as ItemTier })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                          >
                            <option value="T4">T4</option>
                            <option value="T5">T5</option>
                            <option value="T6">T6</option>
                            <option value="T7">T7</option>
                            <option value="T8">T8</option>
                          </select>
                        </div>

                        {/* Enchantment selection */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] text-slate-500 block">Encantamiento</label>
                          <select
                            value={row.enchantment}
                            disabled={isJournal}
                            onChange={(e) => handleUpdateRealReturnRow(row.id, { enchantment: parseInt(e.target.value) as EnchantmentLevel })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <option value="0">.0 (Plano)</option>
                            <option value="1">.1</option>
                            <option value="2">.2</option>
                            <option value="3">.3</option>
                          </select>
                        </div>

                        {/* Quantity selection */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] text-slate-500 block">Cantidad</label>
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleUpdateRealReturnRow(row.id, { quantity: Math.max(1, parseInt(e.target.value) || 0) })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono text-center"
                          />
                        </div>

                        {/* Action selector */}
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] text-slate-500 block">Destino del Recurso</label>
                          <select
                            value={row.action}
                            onChange={(e) => handleUpdateRealReturnRow(row.id, { action: e.target.value as 'save' | 'sell' })}
                            className={`w-full border rounded-lg py-1.5 px-2 text-xs focus:outline-none font-medium ${
                              isSelling 
                                ? 'border-amber-500/30 bg-amber-950/10 text-amber-400' 
                                : 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400'
                            }`}
                          >
                            <option value="save">📥 Guardar en Almacén</option>
                            <option value="sell">💰 Vender en Mercado</option>
                          </select>
                        </div>

                      </div>

                      {/* Selling Configuration Sub-row */}
                      {isSelling && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-2.5 rounded-lg bg-slate-950/50 border border-amber-500/10 animate-fadeIn">
                          
                          {/* Method selection */}
                          <div className="md:col-span-4 space-y-1">
                            <label className="text-[10px] text-slate-500 block font-mono uppercase">Método de Venta</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateRealReturnRow(row.id, { method: 'direct' })}
                                className={`py-1 px-2 rounded text-[10px] font-bold font-mono uppercase transition-all border ${
                                  row.method === 'direct'
                                    ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                Venta Directa
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateRealReturnRow(row.id, { method: 'order' })}
                                className={`py-1 px-2 rounded text-[10px] font-bold font-mono uppercase transition-all border ${
                                  row.method === 'order'
                                    ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                Orden Venta
                              </button>
                            </div>
                          </div>

                          {/* Price input */}
                          <div className="md:col-span-3 space-y-1">
                            <label className="text-[10px] text-slate-500 block font-mono uppercase">Precio Unitario (Plata)</label>
                            <input
                              type="number"
                              min="0"
                              value={row.price}
                              onChange={(e) => handleUpdateRealReturnRow(row.id, { price: Math.max(0, parseInt(e.target.value) || 0) })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1 px-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono text-center text-yellow-400 font-bold"
                            />
                          </div>

                          {/* Calculation feedback */}
                          {(() => {
                            const subtotal = row.quantity * row.price;
                            const taxRate = globalPremium ? 0.04 : 0.08;
                            const setupFeeRate = row.method === 'order' ? 0.025 : 0;
                            const taxes = Math.round(subtotal * taxRate);
                            const setupFee = Math.round(subtotal * setupFeeRate);
                            const netSilver = Math.max(0, subtotal - taxes - setupFee);

                            return (
                              <div className="md:col-span-5 text-[10px] font-mono text-slate-400 flex flex-col justify-center space-y-0.5 border-l border-slate-800 pl-3">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span className="text-slate-300">{subtotal.toLocaleString()} S</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                  <span>Impuestos/Tasas:</span>
                                  <span>-{(taxes + setupFee).toLocaleString()} S</span>
                                </div>
                                <div className="flex justify-between pt-0.5 border-t border-slate-800 font-bold">
                                  <span className="text-slate-300">Neto Estimado:</span>
                                  <span className="text-yellow-400">{netSilver.toLocaleString()} S</span>
                                </div>
                              </div>
                            );
                          })()}

                        </div>
                      )}

                    </div>
                  );
                })
              )}

              {/* Add row button */}
              <button
                onClick={handleAddRealReturnRow}
                className="w-full py-2 border-2 border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all bg-slate-950/10 hover:bg-slate-950/30"
              >
                <span>➕ Agregar Otro Material</span>
              </button>
            </div>

            {/* Calculations Summary Card */}
            {realReturnRows.length > 0 && (
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
                <div className="text-[11px] font-mono space-y-1 text-slate-400">
                  <span className="font-bold text-white block pb-1 border-b border-slate-850 mb-1 font-serif uppercase text-[9px] tracking-wider text-slate-400">Resumen de Destino</span>
                  <div className="flex justify-between">
                    <span>Materiales a Guardar en Almacén:</span>
                    <strong className="text-emerald-400">
                      {realReturnRows.filter(r => r.action === 'save').reduce((acc, r) => acc + r.quantity, 0)} unidades
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Ventas Directas (Al Instante):</span>
                    <strong className="text-amber-400">
                      {realReturnRows.filter(r => r.action === 'sell' && r.method === 'direct').reduce((acc, r) => acc + r.quantity, 0)} unidades
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Órdenes de Venta (En Espera):</span>
                    <strong className="text-cyan-400">
                      {realReturnRows.filter(r => r.action === 'sell' && r.method === 'order').reduce((acc, r) => acc + r.quantity, 0)} unidades
                    </strong>
                  </div>
                </div>

                {(() => {
                  let totalSubtotal = 0;
                  let totalTaxes = 0;
                  let totalSetupFees = 0;
                  let totalNetSilver = 0;

                  realReturnRows.forEach(row => {
                    if (row.action === 'sell') {
                      const subtotal = row.quantity * row.price;
                      const taxRate = globalPremium ? 0.04 : 0.08;
                      const setupFeeRate = row.method === 'order' ? 0.025 : 0;
                      
                      const taxes = Math.round(subtotal * taxRate);
                      const setupFee = Math.round(subtotal * setupFeeRate);
                      const net = Math.max(0, subtotal - taxes - setupFee);

                      totalSubtotal += subtotal;
                      totalTaxes += taxes;
                      totalSetupFees += setupFee;
                      totalNetSilver += net;
                    }
                  });

                  return (
                    <div className="text-[11px] font-mono space-y-1 text-slate-400 border-t md:border-t-0 md:border-l border-slate-850 pt-3 md:pt-0 md:pl-4">
                      <span className="font-bold text-white block pb-1 border-b border-slate-850 mb-1 font-serif uppercase text-[9px] tracking-wider text-slate-400">Consolidación de Plata (Ventas)</span>
                      <div className="flex justify-between">
                        <span>Subtotal Bruto:</span>
                        <span className="text-slate-300">{totalSubtotal.toLocaleString()} S</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>Tasa de Configuración (Setup):</span>
                        <span>-{totalSetupFees.toLocaleString()} S</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>Impuesto de Mercado (Tax):</span>
                        <span>-{totalTaxes.toLocaleString()} S</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-xs">
                        <span className="text-yellow-400 font-serif">Retorno Neto Total:</span>
                        <strong className="text-yellow-400">{totalNetSilver.toLocaleString()} S</strong>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-3 border-t border-slate-850/60 flex-shrink-0">
              <button 
                onClick={() => setShowRealReturnModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleProcessRealReturns}
                className="flex-1 py-2.5 px-4 rounded-xl text-slate-950 text-xs font-bold font-mono tracking-wide bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                Confirmar y Procesar Retornos
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CELEBRATION MODAL OVERLAY */}
      {celebration && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.35)] transform scale-105 transition-all">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl border-2 border-emerald-400/30 animate-bounce">
              💰
            </div>
            <div className="space-y-1">
              <h4 className="text-emerald-400 font-extrabold font-mono text-xs uppercase tracking-widest">¡Venta Completada!</h4>
              <p className="text-white text-md font-bold font-serif leading-snug">{celebration.msg}</p>
            </div>
            <div className="bg-slate-950 py-3.5 px-4 rounded-xl border border-slate-850/80">
              <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Suma al Capital</span>
              <span className="text-2xl font-black text-emerald-400 font-mono tracking-wide">+{celebration.silver.toLocaleString()} S</span>
            </div>
            <button
              onClick={() => setCelebration(null)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl transition-colors font-mono uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
            >
              ¡Excelente!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
