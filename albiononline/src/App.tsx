/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Character, 
  CraftingJob, 
  HistoryLog, 
  GlobalPricesState, 
  VisualTheme, 
  VisualTemplate, 
  ItemTier, 
  EnchantmentLevel, 
  AlbionCity 
} from './types';
import { 
  createDefaultPrices, 
  ALBION_CITIES 
} from './data';

import LoginPanel from './components/LoginPanel';
import { InicioPanel } from './components/InicioPanel';
import CraftingPanel from './components/CraftingPanel';
import PurchaseOrderPanel from './components/PurchaseOrderPanel';
import QueuePanel from './components/QueuePanel';
import PricePanel from './components/PricePanel';
import InventoryPanel from './components/InventoryPanel';
import ConfigPanel from './components/ConfigPanel';
import { motion, AnimatePresence } from 'motion/react';

import { 
  Swords, 
  Sparkles, 
  Coins, 
  Settings, 
  Wrench, 
  ShoppingBag, 
  Hammer, 
  CoinsIcon, 
  Archive, 
  LogOut,
  Info,
  Home,
  Cloud
} from 'lucide-react';

import { 
  saveUserDataToCloud, 
  loadUserDataFromCloud, 
  generateSyncId 
} from './lib/firebase';

export const ALBION_OST_TRACKS = [
  { id: 'heroic_theme', title: 'Albion Online - Main Theme', description: 'Por Jonne Valtonen, el épico himno orquestal oficial de Albion', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'lymhurst_forest', title: 'Albion Online - Lymhurst Theme', description: 'Melodía pacífica y majestuosa de los densos bosques', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'martlock_highlands', title: 'Albion Online - Martlock Theme (★ Tu Favorita)', description: 'Poderosa marcha celta de Martlock (Tierras Altas). Pista #6 solicitada de la Playlist Oficial.', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', youtubeUrl: 'https://www.youtube.com/watch?v=uIWxNAeFNPo&list=PLvJxnupyVHJi_sR_uPMlyA1G_U9zFu9pk&index=6' },
  { id: 'fortsterling_mountain', title: 'Albion Online - Fort Sterling Theme', description: 'Coros místicos y misticismo de los picos helados', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'thetford_swamps', title: 'Albion Online - Thetford Theme', description: 'Tonalidades misteriosas y húmedas de la ciénaga sombría', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 'bridgewatch_steppes', title: 'Albion Online - Bridgewatch Theme', description: 'Ambiente festivo y desértico de las estepas soleadas', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'caerleon_underworld', title: 'Albion Online - Caerleon Theme', description: 'Militar y tenso refugio de fugitivos y mercenarios libres', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' }
];

export default function App() {
  // --- STATE DECLARATIONS ---
  const [activeCharName, setActiveCharName] = useState<string>('');
  const [syncId, setSyncId] = useState<string>('');
  const [cloudStatus, setCloudStatus] = useState<'loading' | 'saved' | 'saving' | 'error' | 'idle'>('idle');
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [globalPrices, setGlobalPrices] = useState<GlobalPricesState>(() => createDefaultPrices());
  const [activeTheme, setActiveTheme] = useState<VisualTheme>('crystal_neon');
  const [activeTemplate, setActiveTemplate] = useState<VisualTemplate>('classic_panel');
  const [globalPremium, setGlobalPremium] = useState<boolean>(true);
  const [discountFromInventory, setDiscountFromInventory] = useState<boolean>(true);
  
  // --- AUDIO SYSTEM STATE ---
  const [audioIsPlaying, setAudioIsPlaying] = useState<boolean>(false);
  const [audioTrackId, setAudioTrackId] = useState<string>('heroic_theme');
  const [audioVolume, setAudioVolume] = useState<number>(0.3); // Default 30% volume
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize audio playing
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    
    // Find active url
    const trk = ALBION_OST_TRACKS.find(t => t.id === audioTrackId);
    if (trk && audioRef.current.src !== trk.url) {
      const wasPlaying = audioIsPlaying;
      audioRef.current.src = trk.url;
      // If was playing, resume playing the new URL
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser validation:", e));
      }
    }
    
    audioRef.current.volume = audioVolume;

    if (audioIsPlaying) {
      audioRef.current.play().catch(e => {
        console.log("Audio play blocked by browser validation:", e);
        setAudioIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [audioIsPlaying, audioTrackId, audioVolume]);

  // Character-specific stores
  const [inventories, setInventories] = useState<Record<string, Record<string, number>>>({});
  const [queues, setQueues] = useState<Record<string, CraftingJob[]>>({});
  const [histories, setHistories] = useState<Record<string, HistoryLog[]>>({});

  // Active Menu Tab Selection within Character Portal
  const [activeTab, setActiveTab] = useState<'inicio' | 'crafting' | 'purchase' | 'queue' | 'prices' | 'inventory' | 'config'>('inicio');

  // --- INTEGRATED CLOUD & LOCAL STORAGE HYDRATION ---
  useEffect(() => {
    async function hydrate() {
      // 1. First get baseline from local storage
      let initialActiveChar = '';
      let initialCharacters: Character[] = [];
      let initialPrices = createDefaultPrices();
      let initialTheme: VisualTheme = 'crystal_neon';
      let initialTemplate: VisualTemplate = 'classic_panel';
      let initialPremium = true;
      let initialDiscount = true;
      let initialInventories = {};
      let initialQueues = {};
      let initialHistories = {};

      try {
        const storedActiveChar = localStorage.getItem('albion_craft_active_char');
        const storedCharacters = localStorage.getItem('albion_craft_characters');
        const storedPrices = localStorage.getItem('albion_craft_global_prices');
        const storedTheme = localStorage.getItem('albion_craft_theme');
        const storedTemplate = localStorage.getItem('albion_craft_template');
        const storedPremium = localStorage.getItem('albion_craft_premium');
        const storedDiscount = localStorage.getItem('albion_craft_discount_inventory');
        const storedInventories = localStorage.getItem('albion_craft_inventories');
        const storedQueues = localStorage.getItem('albion_craft_queues');
        const storedHistories = localStorage.getItem('albion_craft_histories');

        if (storedActiveChar) {
          initialActiveChar = storedActiveChar;
          setActiveCharName(storedActiveChar);
        }
        if (storedCharacters) {
          const parsed = JSON.parse(storedCharacters);
          initialCharacters = parsed;
          setCharacters(parsed);
        }
        if (storedPrices) {
          const parsed = JSON.parse(storedPrices);
          initialPrices = parsed;
          setGlobalPrices(parsed);
        }
        if (storedTheme) {
          initialTheme = storedTheme as VisualTheme;
          setActiveTheme(storedTheme as VisualTheme);
        }
        if (storedTemplate) {
          initialTemplate = storedTemplate as VisualTemplate;
          setActiveTemplate(storedTemplate as VisualTemplate);
        }
        if (storedPremium) {
          initialPremium = storedPremium === 'true';
          setGlobalPremium(storedPremium === 'true');
        }
        if (storedDiscount) {
          initialDiscount = storedDiscount === 'true';
          setDiscountFromInventory(storedDiscount === 'true');
        }
        if (storedInventories) {
          const parsed = JSON.parse(storedInventories);
          initialInventories = parsed;
          setInventories(parsed);
        }
        if (storedQueues) {
          const parsed = JSON.parse(storedQueues);
          initialQueues = parsed;
          setQueues(parsed);
        }
        if (storedHistories) {
          const parsed = JSON.parse(storedHistories);
          initialHistories = parsed;
          setHistories(parsed);
        }
      } catch (e) {
        console.error("Local storage baseline hydration failed:", e);
      }

      // 2. Hydrate/Generate Sync ID
      let currentSyncId = localStorage.getItem('albion_craft_sync_id');
      if (!currentSyncId) {
        currentSyncId = generateSyncId();
        localStorage.setItem('albion_craft_sync_id', currentSyncId);
      }
      setSyncId(currentSyncId);

      // 3. Connect to cloud (Firestore)
      setCloudStatus('loading');
      try {
        const cloudData = await loadUserDataFromCloud(currentSyncId);
        if (cloudData) {
          // Cloud exists! Overwrite baseline
          if (cloudData.activeCharName !== undefined) setActiveCharName(cloudData.activeCharName);
          if (cloudData.characters !== undefined) setCharacters(cloudData.characters);
          if (cloudData.globalPrices !== undefined) setGlobalPrices(cloudData.globalPrices);
          if (cloudData.activeTheme !== undefined) setActiveTheme(cloudData.activeTheme as VisualTheme);
          if (cloudData.activeTemplate !== undefined) setActiveTemplate(cloudData.activeTemplate as VisualTemplate);
          if (cloudData.globalPremium !== undefined) setGlobalPremium(cloudData.globalPremium);
          if (cloudData.discountFromInventory !== undefined) setDiscountFromInventory(cloudData.discountFromInventory);
          if (cloudData.inventories !== undefined) setInventories(cloudData.inventories);
          if (cloudData.queues !== undefined) setQueues(cloudData.queues);
          if (cloudData.histories !== undefined) setHistories(cloudData.histories);
          setCloudStatus('saved');
        } else {
          // Cloud has no data yet (new code). Push baseline immediately
          await saveUserDataToCloud(currentSyncId, {
            activeCharName: initialActiveChar,
            characters: initialCharacters,
            globalPrices: initialPrices,
            activeTheme: initialTheme,
            activeTemplate: initialTemplate,
            globalPremium: initialPremium,
            discountFromInventory: initialDiscount,
            inventories: initialInventories,
            queues: initialQueues,
            histories: initialHistories,
          });
          setCloudStatus('saved');
        }
      } catch (err: any) {
        console.error("Cloud hydration failed, working offline:", err);
        setCloudStatus('error');
        setCloudError(err.message || 'Error al conectar con Firestore');
      } finally {
        setIsHydrated(true);
      }
    }

    hydrate();
  }, []);

  // Save states back to local storage whenever they change
  useEffect(() => {
    if (!isHydrated) return; // Prevent overwriting during initial hydration setup
    localStorage.setItem('albion_craft_active_char', activeCharName);
    localStorage.setItem('albion_craft_characters', JSON.stringify(characters));
    localStorage.setItem('albion_craft_global_prices', JSON.stringify(globalPrices));
    localStorage.setItem('albion_craft_theme', activeTheme);
    localStorage.setItem('albion_craft_template', activeTemplate);
    localStorage.setItem('albion_craft_premium', globalPremium ? 'true' : 'false');
    localStorage.setItem('albion_craft_discount_inventory', discountFromInventory ? 'true' : 'false');
    localStorage.setItem('albion_craft_inventories', JSON.stringify(inventories));
    localStorage.setItem('albion_craft_queues', JSON.stringify(queues));
    localStorage.setItem('albion_craft_histories', JSON.stringify(histories));
    if (syncId) localStorage.setItem('albion_craft_sync_id', syncId);
  }, [isHydrated, syncId, activeCharName, characters, globalPrices, activeTheme, activeTemplate, globalPremium, discountFromInventory, inventories, queues, histories]);

  // --- FIRESTORE DEBOUNCED CLOUD SYNCHRONIZATION ---
  useEffect(() => {
    if (!isHydrated || !syncId) return;

    setCloudStatus('saving');
    setCloudError(null);

    const timer = setTimeout(async () => {
      try {
        await saveUserDataToCloud(syncId, {
          activeCharName,
          characters,
          globalPrices,
          activeTheme,
          activeTemplate,
          globalPremium,
          discountFromInventory,
          inventories,
          queues,
          histories,
        });
        setCloudStatus('saved');
      } catch (err: any) {
        console.error("Firestore automatic write failure:", err);
        setCloudStatus('error');
        setCloudError(err.message || 'Error de escritura');
      }
    }, 1500); // 1.5s debounce to cluster inputs and sliders

    return () => clearTimeout(timer);
  }, [
    isHydrated,
    syncId,
    activeCharName,
    characters,
    globalPrices,
    activeTheme,
    activeTemplate,
    globalPremium,
    discountFromInventory,
    inventories,
    queues,
    histories,
  ]);

  // Handle connection & download from a different sync ID
  const handleLoadFromSyncId = async (code: string) => {
    if (!code || !code.trim()) return { success: false, error: 'Código de sincronización en blanco.' };
    const cleanCode = code.toUpperCase().trim();
    
    setCloudStatus('loading');
    setCloudError(null);

    try {
      const data = await loadUserDataFromCloud(cleanCode);
      if (data) {
        // Overwrite all local states
        setSyncId(cleanCode);
        localStorage.setItem('albion_craft_sync_id', cleanCode);

        setActiveCharName(data.activeCharName);
        setCharacters(data.characters);
        if (data.globalPrices) setGlobalPrices(data.globalPrices);
        setActiveTheme(data.activeTheme as VisualTheme);
        setActiveTemplate(data.activeTemplate as VisualTemplate);
        setGlobalPremium(data.globalPremium);
        setDiscountFromInventory(data.discountFromInventory);
        setInventories(data.inventories);
        setQueues(data.queues);
        setHistories(data.histories);

        setCloudStatus('saved');
        return { success: true };
      } else {
        setCloudStatus('error');
        setCloudError('No se encontró ningún registro para el código del dispositivo ingresado.');
        return { success: false, error: 'Código no encontrado en la nube. Verifica que esté correcto.' };
      }
    } catch (err: any) {
      console.error(err);
      setCloudStatus('error');
      setCloudError(err.message || 'Error al descargar datos');
      return { success: false, error: err.message || 'Fallo de conexión de red.' };
    }
  };

  // --- STATE ACTIONS ---

  // Handle Select / Switch character
  const handleSelectCharacter = (name: string) => {
    setActiveCharName(name);
    // Initialize standard structures if this is a newly created character profile
    if (!queues[name]) {
      setQueues(prev => ({ ...prev, [name]: [] }));
    }
    if (!histories[name]) {
      setHistories(prev => ({ ...prev, [name]: [] }));
    }
    if (!inventories[name]) {
      setInventories(prev => ({ ...prev, [name]: {} }));
    }
  };

  // Add new character profile
  const handleAddCharacter = (newChar: Character) => {
    setCharacters(prev => [...prev, newChar]);
    setInventories(prev => ({ ...prev, [newChar.name]: {} }));
    setQueues(prev => ({ ...prev, [newChar.name]: [] }));
    setHistories(prev => ({ ...prev, [newChar.name]: [] }));
  };

  // Delete character profile
  const handleDeleteCharacter = (name: string) => {
    if (confirm(`¿Desea eliminar de forma permanente la base de datos local de ${name}?`)) {
      setCharacters(prev => prev.filter(c => c.name !== name));
      
      const newInventories = { ...inventories };
      delete newInventories[name];
      setInventories(newInventories);

      const newQueues = { ...queues };
      delete newQueues[name];
      setQueues(newQueues);

      const newHistories = { ...histories };
      delete newHistories[name];
      setHistories(newHistories);

      if (activeCharName === name) {
        setActiveCharName('');
      }
    }
  };

  // Add job to crafting queue list
  const handleAddJob = (job: CraftingJob) => {
    const charQueue = queues[activeCharName] || [];
    const newQueue = [...charQueue, job];
    setQueues(prev => ({ ...prev, [activeCharName]: newQueue }));
    
    // Switch to queue page to let user review
    setActiveTab('queue');
  };

  // Craft Job in Queue
  const handleCraftJob = (jobId: string) => {
    const charQueue = queues[activeCharName] || [];
    const updatedQueue = charQueue.map(job => {
      if (job.id === jobId) {
        return { ...job, status: 'crafted_selling' as const };
      }
      return job;
    });
    setQueues(prev => ({ ...prev, [activeCharName]: updatedQueue }));
  };

  // Sell Job and conclude operations
  const handleSellJob = (jobId: string, finalMethod: 'direct' | 'order', actualProfit: number) => {
    const charQueue = queues[activeCharName] || [];
    const job = charQueue.find(j => j.id === jobId);
    if (!job) return;

    // Calculate dynamic net income based on current parameters
    const totalBaseSell = job.unitSellPrice * job.quantity;
    const isOrder = finalMethod === 'order';
    const setupFee = isOrder ? Math.floor(totalBaseSell * 0.025) : 0;
    const transactionTax = Math.round(totalBaseSell * (globalPremium ? 0.04 : 0.08));
    const netSellerRevenueVal = totalBaseSell - (setupFee + transactionTax);

    // 1. Remove from active queue list
    const updatedQueue = charQueue.filter(j => j.id !== jobId);
    setQueues(prev => ({ ...prev, [activeCharName]: updatedQueue }));

    // 2. Add net income to character's capital balance
    setCharacters(prev => prev.map(c => {
      if (c.name === activeCharName) {
        return { ...c, capital: c.capital + netSellerRevenueVal };
      }
      return c;
    }));

    // 3. Register history log
    const log: HistoryLog = {
      id: Math.random().toString(36).substr(2, 9),
      characterName: activeCharName,
      itemName: job.recipe.Item,
      tier: job.tier,
      enchantment: job.enchantment,
      quantity: job.quantity,
      investmentCost: job.investmentTotal,
      revenueReceived: netSellerRevenueVal,
      profit: actualProfit,
      timestamp: new Date().toISOString(),
      dateString: new Date().toISOString().substring(0, 7) // e.g. "2026-06"
    };

    const charHistory = histories[activeCharName] || [];
    setHistories(prev => ({ ...prev, [activeCharName]: [...charHistory, log] }));
  };

  // Partial Sell Direct (Instant Sell)
  const handlePartialSellDirect = (
    jobId: string, 
    qtySold: number, 
    unitPrice: number, 
    revenueRec: number, 
    actualProfit: number
  ) => {
    // 1. Update queue jobs
    setQueues(prev => {
      const charQueue = prev[activeCharName] || [];
      const updatedQueue = charQueue.map(job => {
        if (job.id === jobId) {
          const curUnsold = job.quantityUnsold !== undefined ? job.quantityUnsold : job.quantity;
          const nextUnsold = Math.max(0, curUnsold - qtySold);
          
          const hasListings = job.listings && job.listings.length > 0;
          return {
            ...job,
            quantityUnsold: nextUnsold,
            status: (nextUnsold <= 0 && !hasListings) ? ('completed' as const) : job.status
          };
        }
        return job;
      }).filter(job => job.status !== 'completed');
      return { ...prev, [activeCharName]: updatedQueue };
    });

    // 2. Add revenue received to character's capital balance
    setCharacters(prev => prev.map(c => {
      if (c.name === activeCharName) {
        return { ...c, capital: c.capital + revenueRec };
      }
      return c;
    }));

    // 3. Register history log
    const targetJob = (queues[activeCharName] || []).find(j => j.id === jobId);
    if (targetJob) {
      const log: HistoryLog = {
        id: Math.random().toString(36).substr(2, 9),
        characterName: activeCharName,
        itemName: targetJob.recipe.Item + ` (Directo)`,
        tier: targetJob.tier,
        enchantment: targetJob.enchantment,
        quantity: qtySold,
        investmentCost: Math.round((targetJob.investmentTotal / targetJob.quantity) * qtySold),
        revenueReceived: revenueRec,
        profit: actualProfit,
        timestamp: new Date().toISOString(),
        dateString: new Date().toISOString().substring(0, 7)
      };
      setHistories(prev => {
        const charHistory = prev[activeCharName] || [];
        return { ...prev, [activeCharName]: [...charHistory, log] };
      });
    }
  };

  // Place Sell Order listing (Deducts setup fee immediately from capital)
  const handlePlaceSellOrderList = (
    jobId: string,
    qtyToOrder: number,
    unitPrice: number,
    setupFee: number
  ) => {
    // 1. Update queue with the new active listing
    setQueues(prev => {
      const charQueue = prev[activeCharName] || [];
      const updatedQueue = charQueue.map(job => {
        if (job.id === jobId) {
          const curUnsold = job.quantityUnsold !== undefined ? job.quantityUnsold : job.quantity;
          const nextUnsold = Math.max(0, curUnsold - qtyToOrder);
          
          const newListings = job.listings ? [...job.listings] : [];
          newListings.push({
            id: Math.random().toString(36).substr(2, 9),
            quantity: qtyToOrder,
            price: unitPrice,
            setupFeePaid: setupFee
          });

          return {
            ...job,
            quantityUnsold: nextUnsold,
            listings: newListings
          };
        }
        return job;
      });
      return { ...prev, [activeCharName]: updatedQueue };
    });

    // 2. Subtract setup fee paid from character's capital immediately
    setCharacters(prev => prev.map(c => {
      if (c.name === activeCharName) {
        return { ...c, capital: c.capital - setupFee };
      }
      return c;
    }));
  };

  // Execute listed sell order (Adds revenue received to capital, registers logs)
  const handleExecuteSellOrderList = (
    jobId: string,
    listingId: string,
    qtySold: number,
    unitPrice: number,
    revenueRec: number,
    actualProfit: number
  ) => {
    // 1. Remove listing from active listings
    setQueues(prev => {
      const charQueue = prev[activeCharName] || [];
      const updatedQueue = charQueue.map(job => {
        if (job.id === jobId) {
          const filteredListings = (job.listings || []).filter(l => l.id !== listingId);
          const curUnsold = job.quantityUnsold !== undefined ? job.quantityUnsold : job.quantity;
          const isFinished = curUnsold <= 0 && filteredListings.length === 0;

          return {
            ...job,
            listings: filteredListings,
            status: isFinished ? ('completed' as const) : job.status
          };
        }
        return job;
      }).filter(job => job.status !== 'completed');
      return { ...prev, [activeCharName]: updatedQueue };
    });

    // 2. Add net revenue received to character's capital balance
    setCharacters(prev => prev.map(c => {
      if (c.name === activeCharName) {
        return { ...c, capital: c.capital + revenueRec };
      }
      return c;
    }));

    // 3. Register history log
    const targetJob = (queues[activeCharName] || []).find(j => j.id === jobId);
    if (targetJob) {
      const log: HistoryLog = {
        id: Math.random().toString(36).substr(2, 9),
        characterName: activeCharName,
        itemName: targetJob.recipe.Item + ` (Orden)`,
        tier: targetJob.tier,
        enchantment: targetJob.enchantment,
        quantity: qtySold,
        investmentCost: Math.round((targetJob.investmentTotal / targetJob.quantity) * qtySold),
        revenueReceived: revenueRec,
        profit: actualProfit,
        timestamp: new Date().toISOString(),
        dateString: new Date().toISOString().substring(0, 7)
      };
      setHistories(prev => {
        const charHistory = prev[activeCharName] || [];
        return { ...prev, [activeCharName]: [...charHistory, log] };
      });
    }
  };

  // Cancel listed sell order (returns items back to unsold state, setup fee paid is lost)
  const handleCancelSellOrderList = (
    jobId: string,
    listingId: string
  ) => {
    setQueues(prev => {
      const charQueue = prev[activeCharName] || [];
      const updatedQueue = charQueue.map(job => {
        if (job.id === jobId) {
          const targetListing = (job.listings || []).find(l => l.id === listingId);
          const filteredListings = (job.listings || []).filter(l => l.id !== listingId);
          
          const qtyToReturn = targetListing ? targetListing.quantity : 0;
          const curUnsold = job.quantityUnsold !== undefined ? job.quantityUnsold : job.quantity;
          const nextUnsold = curUnsold + qtyToReturn;

          return {
            ...job,
            quantityUnsold: nextUnsold,
            listings: filteredListings
          };
        }
        return job;
      });
      return { ...prev, [activeCharName]: updatedQueue };
    });
  };

  // Delete Job from queue
  const handleDeleteJobFromQueue = (jobId: string) => {
    const charQueue = queues[activeCharName] || [];
    const updatedQueue = charQueue.filter(j => j.id !== jobId);
    setQueues(prev => ({ ...prev, [activeCharName]: updatedQueue }));
  };

  // Modify specific job in queue details
  const handleUpdateJobDetails = (jobId: string, updatedFields: Partial<CraftingJob>) => {
    setQueues(prev => {
      const currentQueue = prev[activeCharName] || [];
      const updatedQueue = currentQueue.map(job => {
        if (job.id === jobId) {
          const mergedJob = { ...job, ...updatedFields };

          // Recalculate derivative variables if quantity, prices or return rate change
          const unitSellPrice = mergedJob.unitSellPrice;
          const quantity = mergedJob.quantity;
          const totalBaseSell = unitSellPrice * quantity;

          const rate = mergedJob.returnRate;
          const lNeed = mergedJob.recipe.Lingotes * quantity;
          const tNeed = mergedJob.recipe.Tablas * quantity;
          const fNeed = mergedJob.recipe.Telas * quantity;
          const cNeed = mergedJob.recipe.Cueros * quantity;
          const addBuffer = rate > 0 ? 8 : 0;

          // Apply return rate formula and add buffer if requested
          const lFinal = lNeed > 0 ? Math.max(1, Math.round(lNeed * (1 - rate)) + addBuffer) : 0;
          const tFinal = tNeed > 0 ? Math.max(1, Math.round(tNeed * (1 - rate)) + addBuffer) : 0;
          const fFinal = fNeed > 0 ? Math.max(1, Math.round(fNeed * (1 - rate)) + addBuffer) : 0;
          const cFinal = cNeed > 0 ? Math.max(1, Math.round(cNeed * (1 - rate)) + addBuffer) : 0;
          const aFinal = mergedJob.recipe.CantidadArtefacto1 * quantity;

          // Keep purchased, but update needed
          const lPurchased = mergedJob.materialsPurchased.lingotes.purchased;
          const tPurchased = mergedJob.materialsPurchased.tablas.purchased;
          const fPurchased = mergedJob.materialsPurchased.telas.purchased;
          const cPurchased = mergedJob.materialsPurchased.cueros.purchased;
          const aPurchased = mergedJob.materialsPurchased.artefacto.purchased;

          mergedJob.materialsPurchased = {
            lingotes: { ...mergedJob.materialsPurchased.lingotes, needed: lFinal },
            tablas: { ...mergedJob.materialsPurchased.tablas, needed: tFinal },
            telas: { ...mergedJob.materialsPurchased.telas, needed: fFinal },
            cueros: { ...mergedJob.materialsPurchased.cueros, needed: cFinal },
            artefacto: { ...mergedJob.materialsPurchased.artefacto, needed: aFinal },
          };

          mergedJob.materialsReady = (lPurchased >= lFinal) && 
                                     (tPurchased >= tFinal) && 
                                     (fPurchased >= fFinal) && 
                                     (cPurchased >= cFinal) && 
                                     (aPurchased >= aFinal);

          // Proportional adjustment to station fees based on new vs old quantity
          const oldQuantity = job.quantity || 1;
          mergedJob.stationFeeTotal = Math.round((mergedJob.stationFeeTotal / oldQuantity) * quantity);

          mergedJob.totalSellIncome = totalBaseSell;

          const isOrder = mergedJob.sellMethod === 'order';
          const setupFeeVal = isOrder ? Math.floor(totalBaseSell * 0.025) : 0;
          const transactionTaxVal = Math.round(totalBaseSell * (globalPremium ? 0.04 : 0.08));
          mergedJob.taxesTotal = setupFeeVal + transactionTaxVal;
          mergedJob.investmentTotal = mergedJob.materialsCost + mergedJob.stationFeeTotal + setupFeeVal;
          mergedJob.netSellRevenue = totalBaseSell - transactionTaxVal;

          return mergedJob;
        }
        return job;
      });
      return { ...prev, [activeCharName]: updatedQueue };
    });
  };

  // Incremental modify of stockpiled material quantity
  const handleModifyInventoryQuantity = (matKey: string, change: number) => {
    const charInv = inventories[activeCharName] || {};
    const curQty = charInv[matKey] || 0;
    const nextQty = Math.max(0, curQty + change);

    setInventories(prev => ({
      ...prev,
      [activeCharName]: {
        ...charInv,
        [matKey]: nextQty
      }
    }));
  };

  // Overwrite of stockpiled material quantity
  const handleUpdateInventoryQuantity = (matKey: string, quantity: number) => {
    const charInv = inventories[activeCharName] || {};
    setInventories(prev => ({
      ...prev,
      [activeCharName]: {
        ...charInv,
        [matKey]: Math.max(0, quantity)
      }
    }));
  };

  // Complete Material Purchase
  // Satisfies requested remaining materials in queue jobs chronologically (FIFO style)
  const handleCompleteMaterialPurchase = (
    materialType: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'artefacto',
    tier: ItemTier,
    enchantment: EnchantmentLevel,
    artifactName: string,
    quantityBought: number
  ) => {
    const charQueue = queues[activeCharName] || [];
    let remainingAcquired = quantityBought;

    const updatedQueue = charQueue.map(job => {
      if (job.status !== 'pending_materials') return job;

      // Match item specs
      const tierMatches = job.tier === tier;
      const enchantmentMatches = job.enchantment === enchantment;

      let needed = 0;
      let purchased = 0;

      if (materialType === 'artefacto') {
        const hasArtifact = job.recipe.CantidadArtefacto1 > 0;
        const nameMatches = job.recipe.Artefacto1 === artifactName;
        if (hasArtifact && nameMatches && tierMatches && remainingAcquired > 0) {
          needed = job.materialsPurchased.artefacto.needed;
          purchased = job.materialsPurchased.artefacto.purchased;

          const toSatisfy = Math.min(remainingAcquired, needed - purchased);
          remainingAcquired -= toSatisfy;
          
          job.materialsPurchased.artefacto.purchased += toSatisfy;
        }
      } else {
        if (tierMatches && enchantmentMatches && remainingAcquired > 0) {
          needed = job.materialsPurchased[materialType].needed;
          purchased = job.materialsPurchased[materialType].purchased;

          const toSatisfy = Math.min(remainingAcquired, needed - purchased);
          remainingAcquired -= toSatisfy;

          job.materialsPurchased[materialType].purchased += toSatisfy;
        }
      }

      // Check if all ingredients for this job are completely fulfilled
      const lReady = job.materialsPurchased.lingotes.purchased >= job.materialsPurchased.lingotes.needed;
      const tReady = job.materialsPurchased.tablas.purchased >= job.materialsPurchased.tablas.needed;
      const fReady = job.materialsPurchased.telas.purchased >= job.materialsPurchased.telas.needed;
      const cReady = job.materialsPurchased.cueros.purchased >= job.materialsPurchased.cueros.needed;
      const aReady = job.materialsPurchased.artefacto.purchased >= job.materialsPurchased.artefacto.needed;

      if (lReady && tReady && fReady && cReady && aReady) {
        job.materialsReady = true;
        job.status = 'ready_to_craft';
      }

      return job;
    });

    setQueues(prev => ({ ...prev, [activeCharName]: updatedQueue }));
  };

  // Update unit refined material pricing index
  const handleUpdateMaterialPrice = (
    city: AlbionCity,
    materialType: 'lingotes' | 'tablas' | 'telas' | 'cueros',
    tier: ItemTier,
    enchantment: EnchantmentLevel,
    price: number
  ) => {
    setGlobalPrices(prev => {
      const copy = { ...prev };
      copy[city] = { ...copy[city] };
      copy[city][materialType] = { ...copy[city][materialType] };
      copy[city][materialType][tier] = { ...copy[city][materialType][tier] };
      
      copy[city][materialType][tier][enchantment] = price;
      return copy;
    });
  };

  // Update specific artifact pricing index
  const handleUpdateArtifactPrice = (
    city: AlbionCity,
    artifactId: string,
    tier: ItemTier,
    price: number
  ) => {
    setGlobalPrices(prev => {
      const copy = { ...prev };
      copy[city] = { ...copy[city] };
      copy[city].artefactos = { ...copy[city].artefactos };
      copy[city].artefactos[artifactId] = { ...copy[city].artefactos[artifactId] };

      copy[city].artefactos[artifactId][tier] = price;
      return copy;
    });
  };

  // Manual overwrite of current budget
  const handleUpdateCapital = (newCapital: number) => {
    setCharacters(prev => prev.map(c => {
      if (c.name === activeCharName) {
        return { ...c, capital: newCapital };
      }
      return c;
    }));
  };

  // Delete Profit ledger logs
  const handleClearHistory = () => {
    setHistories(prev => ({
      ...prev,
      [activeCharName]: []
    }));
  };

  // stringify full backup of master state
  const handleGetFullBackupState = (): string => {
    return JSON.stringify({
      version: '1.0.0',
      activeCharName,
      characters,
      globalPrices,
      inventories,
      queues,
      histories,
      activeTheme,
      globalPremium
    }, null, 2);
  };

  // parse and restore imported master state
  const handleUpdateEntireState = (importedStateJson: string): boolean => {
    try {
      const parsed = JSON.parse(importedStateJson);
      // Validate schema minimally
      if (Array.isArray(parsed.characters) && typeof parsed.globalPrices === 'object') {
        if (parsed.activeCharName) setActiveCharName(parsed.activeCharName);
        if (parsed.characters) setCharacters(parsed.characters);
        if (parsed.globalPrices) setGlobalPrices(parsed.globalPrices);
        if (parsed.inventories) setInventories(parsed.inventories);
        if (parsed.queues) setQueues(parsed.queues);
        if (parsed.histories) setHistories(parsed.histories);
        if (parsed.activeTheme) setActiveTheme(parsed.activeTheme as VisualTheme);
        if (parsed.globalPremium !== undefined) setGlobalPremium(parsed.globalPremium);
        return true;
      }
    } catch (e) {
      console.error("Backup restoration failed:", e);
    }
    return false;
  };

  // --- THEMATICS & STYLES PROFILES MAP ---
  const styleConfig = useMemo(() => {
    switch (activeTheme) {
      case 'crystal_neon':
        return {
          bg: 'bg-[#02050b] text-[#d1f4ff] selection:bg-cyan-950',
          panelBg: 'bg-slate-900/35 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.06)]',
          headerBg: 'bg-slate-950/50 backdrop-blur-md',
          navBorder: 'border-cyan-500/25',
          cardBg: 'bg-slate-900/40 backdrop-blur-lg border border-cyan-500/15',
          cardBorder: 'border-cyan-500/20 hover:border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.05)] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all',
          accentText: 'text-cyan-400 font-bold drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]',
          primaryBtn: 'bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold border border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all'
        };
      case 'spectral_ghoul':
        return {
          bg: 'bg-[#040807] text-[#c9f1e1] selection:bg-emerald-950',
          panelBg: 'bg-emerald-950/20 backdrop-blur-xl border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.08)]',
          headerBg: 'bg-[#030907]/90 backdrop-blur-sm',
          navBorder: 'border-emerald-500/30',
          cardBg: 'bg-emerald-950/25 backdrop-blur-lg border border-purple-500/15',
          cardBorder: 'border-emerald-500/20 hover:border-purple-400 shadow-[0_0_12px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all',
          accentText: 'text-emerald-400 font-bold drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]',
          primaryBtn: 'bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold border border-purple-400 shadow-[0_0_12px_rgba(52,211,153,0.35)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all'
        };
      case 'sunset_desert':
        return {
          bg: 'bg-[#150a05] text-[#fed7aa] selection:bg-amber-950',
          panelBg: 'bg-orange-950/15 backdrop-blur-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.06)]',
          headerBg: 'bg-[#1e0e07]/90 backdrop-blur-sm',
          navBorder: 'border-amber-600/25',
          cardBg: 'bg-orange-950/20 backdrop-blur-lg border border-amber-500/15',
          cardBorder: 'border-amber-500/20 hover:border-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.05)] hover:shadow-[0_0_20px_rgba(251,146,60,0.35)] transition-all',
          accentText: 'text-amber-400 font-bold drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]',
          primaryBtn: 'bg-amber-500 hover:bg-orange-500 text-black font-extrabold border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)] hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all'
        };
      case 'outlands_abyss':
        return {
          bg: 'bg-[#060608] text-gray-200 selection:bg-red-950',
          panelBg: 'bg-[#0f1014]',
          headerBg: 'bg-[#0a0a0d]',
          navBorder: 'border-red-950',
          cardBg: 'bg-[#12141c]',
          cardBorder: 'border-red-900/20 hover:border-red-500/20',
          accentText: 'text-red-500',
          primaryBtn: 'bg-red-700 hover:bg-red-650 text-white font-bold border border-red-500/40 shadow-sm shadow-red-500/10'
        };
      case 'avalonian_glory':
        return {
          bg: 'bg-[#f4f5f8] text-[#1e2530] selection:bg-yellow-105',
          panelBg: 'bg-[#fafbfc]',
          headerBg: 'bg-[#ffffff]',
          navBorder: 'border-slate-205',
          cardBg: 'bg-[#ffffff]',
          cardBorder: 'border-slate-200 hover:border-yellow-500/25 shadow-sm',
          accentText: 'text-yellow-600',
          primaryBtn: 'bg-yellow-500 hover:bg-yellow-450 text-[#121212] font-bold border border-yellow-400'
        };
      case 'celtic_woodlands':
        return {
          bg: 'bg-[#030906] text-emerald-100 selection:bg-emerald-950',
          panelBg: 'bg-[#091510]',
          headerBg: 'bg-[#060e0a]',
          navBorder: 'border-emerald-900/30',
          cardBg: 'bg-[#0e2118]',
          cardBorder: 'border-[#153a28] hover:border-emerald-500/25',
          accentText: 'text-emerald-400',
          primaryBtn: 'bg-emerald-700 hover:bg-emerald-650 text-white font-bold border border-emerald-500/30 shadow-sm shadow-emerald-500/15'
        };
      case 'brutalist_iron':
        return {
          bg: 'bg-[#090909] text-gray-100 selection:bg-gray-805',
          panelBg: 'bg-[#121212]',
          headerBg: 'bg-[#0e0e0e]',
          navBorder: 'border-[#242424]',
          cardBg: 'bg-[#181818]',
          cardBorder: 'border-[#2a2a2a] hover:border-gray-500/20',
          accentText: 'text-gray-300',
          primaryBtn: 'bg-gray-800 hover:bg-gray-700 text-white font-bold border border-gray-650'
        };
      case 'royal_classic':
      default:
        return {
          bg: 'bg-[#090e16] text-[#c9ccd3] selection:bg-amber-950',
          panelBg: 'bg-[#101724]',
          headerBg: 'bg-[#0b1019]',
          navBorder: 'border-[#1e293b]',
          cardBg: 'bg-[#152030]',
          cardBorder: 'border-[#24344d] hover:border-amber-500/20 shadow-lg shadow-black/20',
          accentText: 'text-amber-400',
          primaryBtn: 'bg-amber-500 hover:bg-amber-450 text-black font-extrabold border border-amber-400 shadow-sm shadow-amber-500/15'
        };
    }
  }, [activeTheme]);

  // Load target Character details
  const activeChar = useMemo(() => {
    return characters.find(c => c.name === activeCharName);
  }, [characters, activeCharName]);

  // Read current inventory of active character
  const activeInventory = useMemo(() => {
    return inventories[activeCharName] || {};
  }, [inventories, activeCharName]);

  // Read active queue of character
  const activeQueue = useMemo(() => {
    return queues[activeCharName] || [];
  }, [queues, activeCharName]);

  // Read active history of character
  const activeHistory = useMemo(() => {
    return histories[activeCharName] || [];
  }, [histories, activeCharName]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 select-none relative overflow-hidden ${styleConfig.bg}`}>
      
      {/* Decorative ambient neon background orbs for neon themes */}
      {activeTheme === 'crystal_neon' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] -left-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[10%] -right-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        </div>
      )}
      {activeTheme === 'spectral_ghoul' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] -left-40 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-[10%] -right-40 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '1.5s' }} />
          <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-teal-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '3s' }} />
        </div>
      )}
      {activeTheme === 'sunset_desert' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] -left-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-[10%] -right-40 w-[600px] h-[600px] bg-yellow-500/8 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2.5s' }} />
        </div>
      )}

      {/* Wrapping the portal content and the main view inside a relative container to stack above orbs */}
      <div className="relative z-10 flex-grow flex flex-col">
      {!activeChar ? (
        <div className="flex-1 flex flex-col justify-center px-4 py-12">
          <div className="max-w-4xl mx-auto w-full">
            
            {/* Minimalist Logo top */}
            <div className="flex items-center justify-center gap-2 mb-8 text-white">
              <Swords className="text-amber-500 w-8 h-8 animate-pulse" />
              <span className="font-serif font-black text-xl tracking-wider uppercase">Albion Craft Master</span>
            </div>

            <LoginPanel
              characters={characters}
              activeCharName={activeCharName}
              onSelectCharacter={handleSelectCharacter}
              onAddCharacter={handleAddCharacter}
              onDeleteCharacter={handleDeleteCharacter}
              primaryColor={styleConfig.primaryBtn}
              surfaceColor={styleConfig.panelBg}
              borderColor={styleConfig.cardBorder}
            />

          </div>
        </div>
      ) : (
        
        // --- MAIN OPERATION BOARD ---
        <>
          {/* Global Header-nav Toolbar */}
          <header className={`border-b sticky top-0 z-40 ${styleConfig.headerBg} ${styleConfig.navBorder}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
              
              {/* Logo / Brand */}
              <div className="flex items-center gap-2 text-white">
                <Swords className="text-amber-500" size={20} />
                <h1 className="font-serif font-extrabold tracking-wide text-sm md:text-base hidden sm:block uppercase">
                  Albion Crafting Companion
                </h1>
              </div>
              {/* Central status tools */}
              <div className="flex items-center gap-4">
                
                {/* Global Inventory toggle button */}
                <button
                  onClick={() => setDiscountFromInventory(!discountFromInventory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all select-none ${
                    discountFromInventory
                      ? 'bg-amber-500/10 border-amber-500/45 text-amber-400 font-bold'
                      : 'bg-black/40 border-gray-800 text-gray-500 hover:text-gray-300'
                  }`}
                  title={discountFromInventory ? "Descontar de Almacén: ACTIVO" : "Descontar de Almacén: INACTIVO"}
                >
                  <Archive size={13} className={discountFromInventory ? "text-amber-500" : "text-gray-500"} />
                  <span className="hidden md:inline">Descontar Almacén:</span>
                  <strong className="uppercase font-mono text-[10px]">{discountFromInventory ? 'SI' : 'NO'}</strong>
                </button>

                {/* Premium Global Selector Switch */}
                <button
                  onClick={() => setGlobalPremium(!globalPremium)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all select-none ${
                    globalPremium
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-black/40 border-gray-800 text-gray-500 hover:text-gray-405'
                  }`}
                  title={globalPremium ? 'Premium Activo (Transacciones con 4% Impuestos)' : 'Sin Premium (Transacciones con 8% Impuestos)'}
                >
                  <Sparkles size={13} className={globalPremium ? 'animate-spin-slow' : ''} />
                  <span>Premium:</span>
                  <strong className="uppercase font-bold">{globalPremium ? 'Activo' : 'Inactivo'}</strong>
                </button>

                {/* Cloud Sync Status Pill */}
                <button
                  type="button"
                  onClick={() => setActiveTab('config')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all select-none ${
                    cloudStatus === 'saved' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : cloudStatus === 'saving'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
                      : cloudStatus === 'loading'
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                  title={syncId ? `Sincronizado bajo Código: ${syncId}` : 'Cargando Sincronización de Firestore'}
                >
                  <Cloud size={13} className={cloudStatus === 'saving' || cloudStatus === 'loading' ? 'animate-pulse' : ''} />
                  <span className="hidden sm:inline">Nube:</span>
                  <strong className="uppercase font-mono text-[10px]">
                    {cloudStatus === 'saved' && (syncId || 'Sincronizado')}
                    {cloudStatus === 'saving' && 'Guardando...'}
                    {cloudStatus === 'loading' && 'Cargando...'}
                    {cloudStatus === 'error' && 'Error'}
                    {cloudStatus === 'idle' && (syncId || 'Listo')}
                  </strong>
                </button>

                {/* Capital Balance Indicator */}
                <div className="hidden md:flex items-center gap-2 bg-black/40 p-1.5 px-3 rounded-lg border border-gray-800 font-mono text-xs">
                  <Coins size={14} className="text-amber-500" />
                  <span className="text-gray-500">Capital:</span>
                  <strong className="text-amber-400 font-extrabold">
                    {activeChar.capital.toLocaleString()}
                  </strong>
                  <span className="text-gray-500">s</span>
                </div>

                {/* Profile Swapper / Logout */}
                <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
                  <div className="hidden lg:block text-right">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider leading-none block">Operador:</span>
                    <strong className="text-xs text-white block mt-0.5 font-mono">{activeChar.name}</strong>
                  </div>
                  <button
                    onClick={() => setActiveCharName('')}
                    className="p-2 text-gray-450 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                    title="Cerrar sesión / Cambiar personaje"
                  >
                    <LogOut size={16} />
                  </button>
                </div>

              </div>

            </div>
          </header>

          <div className={
            activeTemplate === 'compact_bento'
              ? 'flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 max-w-7xl mx-auto w-full p-4'
              : activeTemplate === 'split_minimalist'
              ? 'flex-grow flex flex-col md:flex-row max-w-5xl mx-auto w-full gap-8 py-5 px-6'
              : 'flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full'
          }>
            {/* Tab Navigation Menu Sidebar */}
            <aside className={
              activeTemplate === 'compact_bento'
                ? `w-full md:col-span-3 lg:col-span-2 border ${styleConfig.cardBorder} p-4 rounded-xl flex flex-col gap-4 ${styleConfig.panelBg} h-fit shadow-md`
                : activeTemplate === 'split_minimalist'
                ? 'w-full md:w-56 shrink-0 border-0 p-1 flex flex-col gap-5'
                : `w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r p-4 flex flex-col gap-4 ${styleConfig.headerBg} ${styleConfig.navBorder}`
            }>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider hidden md:block">Categorías de Gestión</span>
              
              <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-2 md:pb-0 whitespace-nowrap scrollbar-none font-medium">
                
                <button
                  type="button"
                  onClick={() => setActiveTab('inicio')}
                  className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all text-xs w-full ${
                    activeTab === 'inicio'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/35 font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.15)]'
                      : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Home size={14} className="shrink-0" />
                  <span>Inicio (Resumen)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('crafting')}
                  className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all text-xs w-full ${
                    activeTab === 'crafting'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Wrench size={14} className="shrink-0" />
                  <span>Estación de Crafteo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('purchase')}
                  className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all text-xs w-full relative ${
                    activeTab === 'purchase'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShoppingBag size={14} className="shrink-0" />
                  <span>Orden de Compra</span>
                  {activeQueue.filter(j => j.status === 'pending_materials').length > 0 && (
                    <span className="absolute right-2 top-2 bg-amber-500 text-black text-[9px] px-1.5 rounded-full font-bold">
                      {activeQueue.filter(j => j.status === 'pending_materials').length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('queue')}
                  className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all text-xs w-full relative ${
                    activeTab === 'queue'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Hammer size={14} className="shrink-0" />
                  <span>Cola de Crafteo</span>
                  {activeQueue.length > 0 && (
                    <span className="absolute right-2 top-2 bg-red-500 text-white text-[9px] px-1.5 rounded-full font-bold">
                      {activeQueue.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('prices')}
                  className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all text-xs w-full ${
                    activeTab === 'prices'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CoinsIcon size={14} className="shrink-0" />
                  <span>Gestión Precios</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all text-xs w-full ${
                    activeTab === 'inventory'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Archive size={14} className="shrink-0" />
                  <span>Inventario Global</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('config')}
                  className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all text-xs w-full ${
                    activeTab === 'config'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings size={14} className="shrink-0" />
                  <span>Configuración e Informes</span>
                </button>

              </div>
            </aside>

            {/* Active Work Environment layout */}
            <main className={
              activeTemplate === 'compact_bento'
                ? 'md:col-span-9 lg:col-span-10 flex-grow w-full px-2 py-2 overflow-y-auto'
                : 'flex-1 w-full px-4 md:px-6 py-6 overflow-y-auto selection-none'
            }>
              
              {/* Visual warning on mobile if profile capital is too low */}
              {activeChar.capital < 100000 && activeTab === 'crafting' && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/5 text-red-400 border border-red-500/10 text-xs flex items-center gap-2">
                  <Info size={14} />
                  <span>
                    Tu capital actual ({activeChar.capital.toLocaleString()} s) es bajo. Puedes aumentarlo en Configuración o liquidando materiales.
                  </span>
                </div>
              )}

              {/* TAB PANEL VIEWER ROUTER */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12, scale: 0.995 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.995 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full h-full"
                >
                  {activeTab === 'inicio' && (
                    <InicioPanel
                      activeChar={activeChar}
                      historyLogs={activeHistory}
                      queue={activeQueue}
                      inventory={activeInventory}
                      setActiveTab={setActiveTab}
                      primaryColor={styleConfig.primaryBtn}
                      surfaceColor={styleConfig.panelBg}
                      borderColor={styleConfig.cardBorder}
                      globalPremium={globalPremium}
                    />
                  )}

                  {activeTab === 'crafting' && (
                    <CraftingPanel
                      globalPrices={globalPrices}
                      globalPremium={globalPremium}
                      onAddJob={handleAddJob}
                      onUpdateMaterialPrice={handleUpdateMaterialPrice}
                      onUpdateArtifactPrice={handleUpdateArtifactPrice}
                      activeCharName={activeCharName}
                      primaryColor={styleConfig.primaryBtn}
                      surfaceColor={styleConfig.panelBg}
                      borderColor={styleConfig.cardBorder}
                    />
                  )}

                  {activeTab === 'purchase' && (
                    <PurchaseOrderPanel
                      queue={activeQueue}
                      inventory={activeInventory}
                      globalPrices={globalPrices}
                      globalPremium={globalPremium}
                      discountFromInventory={discountFromInventory}
                      onModifyInventoryQuantity={handleModifyInventoryQuantity}
                      onCompleteMaterialPurchase={handleCompleteMaterialPurchase}
                      onUpdateCapital={handleUpdateCapital}
                      activeCapital={activeChar.capital}
                      primaryColor={styleConfig.primaryBtn}
                      surfaceColor={styleConfig.panelBg}
                      borderColor={styleConfig.cardBorder}
                    />
                  )}

                  {activeTab === 'queue' && (
                    <QueuePanel
                      queue={activeQueue}
                      globalPremium={globalPremium}
                      onCraftJob={handleCraftJob}
                      onSellJob={handleSellJob}
                      onDeleteJobFromQueue={handleDeleteJobFromQueue}
                      onUpdateJobDetails={handleUpdateJobDetails}
                      onPartialSellDirect={handlePartialSellDirect}
                      onPlaceSellOrderList={handlePlaceSellOrderList}
                      onExecuteSellOrderList={handleExecuteSellOrderList}
                      onCancelSellOrderList={handleCancelSellOrderList}
                      primaryColor={styleConfig.primaryBtn}
                      surfaceColor={styleConfig.panelBg}
                      borderColor={styleConfig.cardBorder}
                    />
                  )}

                  {activeTab === 'prices' && (
                    <PricePanel
                      globalPrices={globalPrices}
                      onUpdateMaterialPrice={handleUpdateMaterialPrice}
                      onUpdateArtifactPrice={handleUpdateArtifactPrice}
                      primaryColor={styleConfig.primaryBtn}
                      surfaceColor={styleConfig.panelBg}
                      borderColor={styleConfig.cardBorder}
                    />
                  )}

                  {activeTab === 'inventory' && (
                    <InventoryPanel
                      inventory={activeInventory}
                      onUpdateInventoryQuantity={handleUpdateInventoryQuantity}
                      activeCharName={activeCharName}
                      primaryColor={styleConfig.primaryBtn}
                      surfaceColor={styleConfig.panelBg}
                      borderColor={styleConfig.cardBorder}
                    />
                  )}

                  {activeTab === 'config' && (
                    <ConfigPanel
                      activeTheme={activeTheme}
                      onChangeTheme={setActiveTheme}
                      activeTemplate={activeTemplate}
                      onChangeTemplate={setActiveTemplate}
                      isPlaying={audioIsPlaying}
                      setIsPlaying={setAudioIsPlaying}
                      activeTrackId={audioTrackId}
                      setActiveTrackId={setAudioTrackId}
                      volume={audioVolume}
                      setVolume={setAudioVolume}
                      character={activeChar}
                      onUpdateCapital={handleUpdateCapital}
                      historyLogs={activeHistory}
                      onClearHistory={handleClearHistory}
                      onUpdateEntireState={handleUpdateEntireState}
                      onGetFullBackupState={handleGetFullBackupState}
                      primaryColor={styleConfig.primaryBtn}
                      surfaceColor={styleConfig.panelBg}
                      borderColor={styleConfig.cardBorder}
                      syncId={syncId}
                      cloudStatus={cloudStatus}
                      cloudError={cloudError}
                      onLoadFromSyncId={handleLoadFromSyncId}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

          </main>
        </div>

          {/* Simple Decorative margin footer */}
          <footer className={`border-t py-4 text-center text-[10px] text-gray-500 font-mono flex items-center justify-center gap-1.5 ${styleConfig.headerBg} ${styleConfig.navBorder}`}>
            <span>Albion Craft Master Database Cloud</span>
            <span>-</span>
            <span className="text-emerald-400">✓ Sincronizado en la Nube con Firestore</span>
          </footer>
        </>
      )}
      </div>
    </div>
  );
}
