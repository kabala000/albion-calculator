/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ItemRecipe, 
  ItemTier, 
  EnchantmentLevel, 
  AlbionCity, 
  GlobalPricesState, 
  CraftingJob 
} from '../types';
import { 
  ITEM_RECIPES, 
  getIdealCraftingCity, 
  FAME_TIER_MULTIPLIERS, 
  JOURNAL_CAPACITIES_BY_TIER, 
  BASE_MATERIAL_IV, 
  ALBION_CITIES, 
  getAlbionRenderUrl, 
  getAlbionArtifactRenderUrl,
  getMaterialRenderUrl,
  handleImageLoadError
} from '../data';
import { 
  Wrench, 
  ArrowRight, 
  BookOpen, 
  Activity, 
  Building2, 
  CircleDollarSign, 
  Info, 
  Plus, 
  ShieldAlert, 
  Scale, 
  Sparkles,
  Percent
} from 'lucide-react';

interface CraftingPanelProps {
  globalPrices: GlobalPricesState;
  globalPremium: boolean;
  onAddJob: (job: CraftingJob) => void;
  onUpdateMaterialPrice: (city: AlbionCity, type: 'lingotes' | 'tablas' | 'telas' | 'cueros', tier: ItemTier, enchantment: EnchantmentLevel, price: number) => void;
  onUpdateArtifactPrice: (city: AlbionCity, artifactId: string, tier: ItemTier, price: number) => void;
  activeCharName: string;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

export default function CraftingPanel({
  globalPrices,
  globalPremium,
  onAddJob,
  onUpdateMaterialPrice,
  onUpdateArtifactPrice,
  activeCharName,
  primaryColor,
  surfaceColor,
  borderColor,
}: CraftingPanelProps) {
  // 1. Selector States
  const [activeArtisan, setActiveArtisan] = useState<'Herrero' | 'Herrero Mágico' | 'Flechero'>('Herrero');
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  
  // Filtered recipes for the active artisan
  const filteredRecipes = useMemo(() => {
    return ITEM_RECIPES.map((r, idx) => ({ ...r, originalIndex: idx }))
      .filter(r => r.Artesano === activeArtisan);
  }, [activeArtisan]);

  // Adjust selectedRecipeIndex dynamically when the user switches specialization tab
  React.useEffect(() => {
    const firstMatch = ITEM_RECIPES.findIndex(r => r.Artesano === activeArtisan);
    if (firstMatch !== -1) {
      setSelectedRecipeIndex(firstMatch);
    }
  }, [activeArtisan]);

  const [selectedTier, setSelectedTier] = useState<ItemTier>('T4');
  const [selectedEnchantment, setSelectedEnchantment] = useState<EnchantmentLevel>(0);
  const [craftQuantity, setCraftQuantity] = useState<number>(1);
  const [craftCity, setCraftCity] = useState<AlbionCity>('Martlock');
  
  // 2. Bonus States
  const [activityBonus, setActivityBonus] = useState<boolean>(false);
  const [hoBonusText, setHoBonusText] = useState<string>('0');
  const [stationFeeText, setStationFeeText] = useState<string>('525');

  // 3. Individual Material configuration choices
  const [lingotesCity, setLingotesCity] = useState<AlbionCity>('Fort Sterling');
  const [tablasCity, setTablasCity] = useState<AlbionCity>('Fort Sterling');
  const [telasCity, setTelasCity] = useState<AlbionCity>('Fort Sterling');
  const [cuerosCity, setCuerosCity] = useState<AlbionCity>('Fort Sterling');
  const [artifactCity, setArtifactCity] = useState<AlbionCity>('Fort Sterling');

  const [lingotesMethod, setLingotesMethod] = useState<'direct' | 'order'>('order');
  const [tablasMethod, setTablasMethod] = useState<'direct' | 'order'>('order');
  const [telasMethod, setTelasMethod] = useState<'direct' | 'order'>('order');
  const [cuerosMethod, setCuerosMethod] = useState<'direct' | 'order'>('order');
  const [artifactMethod, setArtifactMethod] = useState<'direct' | 'order'>('order');

  const [manualPricesText, setManualPricesText] = useState<{
    lingotes: string;
    tablas: string;
    telas: string;
    cueros: string;
    artefacto: string;
  }>({
    lingotes: '0',
    tablas: '0',
    telas: '0',
    cueros: '0',
    artefacto: '0',
  });

  const [sellCity, setSellCity] = useState<AlbionCity>('Mercado Negro');
  const [manualUnitSellPriceText, setManualUnitSellPriceText] = useState<string>('25000');
  const [sellMethod, setSellMethod] = useState<'direct' | 'order'>('order');

  // Pick Selected Recipe
  const recipe = useMemo(() => ITEM_RECIPES[selectedRecipeIndex], [selectedRecipeIndex]);

  // Is Selected Crafting City matching ideal specialization
  const idealCity = useMemo(() => getIdealCraftingCity(recipe.Categoria), [recipe]);
  const isCitySpecialized = useMemo(() => idealCity === craftCity, [idealCity, craftCity]);

  // Synchronize manual inputs when database, selections, tier or enchantment changes or when target city for a material changes
  React.useEffect(() => {
    const lPrice = globalPrices[lingotesCity].lingotes[selectedTier]?.[selectedEnchantment] || 0;
    const tbPrice = globalPrices[tablasCity].tablas[selectedTier]?.[selectedEnchantment] || 0;
    const tlPrice = globalPrices[telasCity].telas[selectedTier]?.[selectedEnchantment] || 0;
    const cPrice = globalPrices[cuerosCity].cueros[selectedTier]?.[selectedEnchantment] || 0;
    
    const artName = recipe.Artefacto1;
    const artPrice = (artName && artName !== 'N/A' && globalPrices[artifactCity].artefactos[artName])
      ? (globalPrices[artifactCity].artefactos[artName][selectedTier] || 0)
      : 0;

    setManualPricesText({
      lingotes: String(lPrice),
      tablas: String(tbPrice),
      telas: String(tlPrice),
      cueros: String(cPrice),
      artefacto: String(artPrice)
    });
  }, [
    recipe.Item,
    selectedTier,
    selectedEnchantment,
    globalPrices,
    lingotesCity,
    tablasCity,
    telasCity,
    cuerosCity,
    artifactCity
  ]);

  // Sync edited input to global prices database on typing
  const updatePriceAndSyncGlobally = (
    key: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'artefacto',
    valueStr: string
  ) => {
    setManualPricesText(prev => ({ ...prev, [key]: valueStr }));
    const numPrice = parseInt(valueStr) || 0;
    if (key === 'artefacto') {
      const artName = recipe.Artefacto1;
      if (artName && artName !== 'N/A') {
        onUpdateArtifactPrice(artifactCity, artName, selectedTier, numPrice);
      }
    } else {
      const activeCity = 
        key === 'lingotes' ? lingotesCity :
        key === 'tablas' ? tablasCity :
        key === 'telas' ? telasCity : cuerosCity;
      onUpdateMaterialPrice(activeCity, key, selectedTier, selectedEnchantment, numPrice);
    }
  };

  // 4. Return Rate Logic
  const returnRateMath = useMemo(() => {
    const B_ciudad = isCitySpecialized ? 0.315 : 0;
    const B_actividad = activityBonus ? 0.10 : 0;
    
    const parsedHo = parseFloat(hoBonusText);
    const B_HO = isNaN(parsedHo) ? 0 : parsedHo / 100;

    const S = B_ciudad + B_actividad + B_HO;
    const rate = S / (1 + S);

    return {
      bCity: B_ciudad,
      bActivity: B_actividad,
      bHO: B_HO,
      sumBonus: S,
      rate: rate, // decimal representation
      percentageText: (rate * 100).toFixed(1) + '%'
    };
  }, [isCitySpecialized, activityBonus, hoBonusText]);

  // 5. Materials breakdown math
  const materialsBreakdown = useMemo(() => {
    // Return rate is NOT applied when creating a single item (craftQuantity === 1)
    const effectiveRate = craftQuantity === 1 ? 0 : returnRateMath.rate;
    // Buffer recommendation (+8 materials as requested to prevent running short on devolution calculations)
    const addBuffer = effectiveRate > 0 ? 8 : 0;
    
    const lingotesBase = recipe.Lingotes * craftQuantity;
    const tablasBase = recipe.Tablas * craftQuantity;
    const telasBase = recipe.Telas * craftQuantity;
    const cuerosBase = recipe.Cueros * craftQuantity;
    
    // Applying Return Rate ONLY to refined resources (never artifacts as instructed)
    const lingotesFinal = lingotesBase > 0 ? Math.max(1, Math.round(lingotesBase * (1 - effectiveRate)) + addBuffer) : 0;
    const tablasFinal = tablasBase > 0 ? Math.max(1, Math.round(tablasBase * (1 - effectiveRate)) + addBuffer) : 0;
    const telasFinal = telasBase > 0 ? Math.max(1, Math.round(telasBase * (1 - effectiveRate)) + addBuffer) : 0;
    const cuerosFinal = cuerosBase > 0 ? Math.max(1, Math.round(cuerosBase * (1 - effectiveRate)) + addBuffer) : 0;

    const artifactName = recipe.Artefacto1;
    const artifactNeeded = recipe.CantidadArtefacto1 * craftQuantity; // 0% return rate on artifacts

    const pLingote = parseInt(manualPricesText.lingotes) || 0;
    const pTabla = parseInt(manualPricesText.tablas) || 0;
    const pTela = parseInt(manualPricesText.telas) || 0;
    const pCuero = parseInt(manualPricesText.cueros) || 0;
    const pArtifact = parseInt(manualPricesText.artefacto) || 0;

    // Unit prices representation
    const costLingotes = lingotesFinal * pLingote;
    const costTablas = tablasFinal * pTabla;
    const costTelas = telasFinal * pTela;
    const costCueros = cuerosFinal * pCuero;
    const costArtifact = artifactNeeded * pArtifact;

    const totalRawMaterialsCost = costLingotes + costTablas + costTelas + costCueros + costArtifact;

    return {
      lingotes: { base: lingotesBase, final: lingotesFinal, unitPrice: pLingote, cost: costLingotes, city: lingotesCity, method: lingotesMethod },
      tablas: { base: tablasBase, final: tablasFinal, unitPrice: pTabla, cost: costTablas, city: tablasCity, method: tablasMethod },
      telas: { base: telasBase, final: telasFinal, unitPrice: pTela, cost: costTelas, city: telasCity, method: telasMethod },
      cueros: { base: cuerosBase, final: cuerosFinal, unitPrice: pCuero, cost: costCueros, city: cuerosCity, method: cuerosMethod },
      artifact: { name: artifactName, needed: artifactNeeded, unitPrice: pArtifact, cost: costArtifact, city: artifactCity, method: artifactMethod },
      totalRawCost: totalRawMaterialsCost
    };
  }, [recipe, craftQuantity, returnRateMath.rate, manualPricesText, lingotesCity, tablasCity, telasCity, cuerosCity, artifactCity, lingotesMethod, tablasMethod, telasMethod, cuerosMethod, artifactMethod]);

  // 6. Station usage fee math
  const stationFeeMath = useMemo(() => {
    const rawRate = parseFloat(stationFeeText);
    const stationFeeRate = isNaN(rawRate) ? 0 : rawRate;

    // Items volume of base refined materials
    const totalBaseMaterials = recipe.Lingotes + recipe.Tablas + recipe.Telas + recipe.Cueros;
    const baseIV = BASE_MATERIAL_IV[selectedTier];
    const unitIV = baseIV * Math.pow(2, selectedEnchantment);

    // Total IV (excluding artifacts)
    const totalIV = totalBaseMaterials * unitIV;
    
    // Nutrition
    const nutritionPerUnit = totalIV * 0.1125;
    const totalNutrition = nutritionPerUnit * craftQuantity;

    // Silver cost per craft
    const totalSilverCost = Math.round((totalNutrition * stationFeeRate) / 100);

    return {
      totalBaseMaterials,
      unitIV,
      totalIV,
      nutritionPerUnit: nutritionPerUnit.toFixed(2),
      totalNutrition: totalNutrition.toFixed(2),
      totalSilverCost
    };
  }, [recipe, selectedTier, selectedEnchantment, craftQuantity, stationFeeText]);

  // 7. Fame and Books calculation
  const journalsMath = useMemo(() => {
    const totalBaseMaterials = recipe.Lingotes + recipe.Tablas + recipe.Telas + recipe.Cueros;
    const baseMult = FAME_TIER_MULTIPLIERS[selectedTier];
    
    // FB = A * MT
    const FB = totalBaseMaterials * baseMult;
    
    // FC = FB + EL * (FB - 7.5 * A)
    const FC = FB + selectedEnchantment * (FB - 7.5 * totalBaseMaterials);
    
    const famePerUnitResult = FC;
    const totalFame = FC * craftQuantity;
    
    // Book capacities
    const bookCap = JOURNAL_CAPACITIES_BY_TIER[selectedTier];
    const fullBooks = Math.floor(totalFame / bookCap);
    const remainderFame = totalFame % bookCap;
    const partialPercentage = Math.round((remainderFame / bookCap) * 100);

    return {
      famePerUnit: Math.round(famePerUnitResult),
      totalFame: Math.round(totalFame),
      bookCapacity: bookCap,
      fullBooks: fullBooks,
      partialPercentage,
      totalBooksNeeded: remainderFame > 0 ? fullBooks + 1 : fullBooks
    };
  }, [recipe, selectedTier, selectedEnchantment, craftQuantity]);

    // 8. Financial Profits Calculator
    const financials = useMemo(() => {
      const manualUnitSellPrice = parseInt(manualUnitSellPriceText) || 0;
      const totalBaseSellVal = manualUnitSellPrice * craftQuantity;
  
      // Taxes
      const setupFeeMultiplier = sellMethod === 'order' ? 0.025 : 0;
      const transactionTaxMultiplier = globalPremium ? 0.04 : 0.08;
  
      const setupFeeValue = Math.floor(totalBaseSellVal * setupFeeMultiplier);
      const transactionTaxValue = Math.round(totalBaseSellVal * transactionTaxMultiplier);
      const totalTaxes = setupFeeValue + transactionTaxValue;
  
      const netSellRevenue = totalBaseSellVal - transactionTaxValue;
  
      const totalInvestment = materialsBreakdown.totalRawCost + stationFeeMath.totalSilverCost + setupFeeValue;
      const netProfit = netSellRevenue - totalInvestment;
      const profitMargin = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  
      return {
        unitPrice: manualUnitSellPrice,
        totalBaseVal: totalBaseSellVal,
        setupFee: setupFeeValue,
        transactionTax: transactionTaxValue,
        totalTaxes,
        netRevenue: netSellRevenue,
        totalInvestment,
        netProfit,
        margin: profitMargin.toFixed(1) + '%'
      };
    }, [manualUnitSellPriceText, craftQuantity, sellMethod, globalPremium, materialsBreakdown.totalRawCost, stationFeeMath.totalSilverCost]);

  // Handle Add to Queue trigger
  const handleAddToQueue = () => {
    // Generate active material requirements structure
    const job: CraftingJob = {
      id: Math.random().toString(36).substr(2, 9),
      characterName: activeCharName,
      recipe,
      tier: selectedTier,
      enchantment: selectedEnchantment,
      quantity: craftQuantity,
      city: craftCity,
      idealCityActive: isCitySpecialized,
      activityBonusActive: activityBonus,
      hoBonusPercent: parseFloat(hoBonusText) || 0,
      stationFeeRate: parseInt(stationFeeText) || 0,
      
      returnRate: returnRateMath.rate,
      materialsCost: materialsBreakdown.totalRawCost,
      stationFeeTotal: stationFeeMath.totalSilverCost,
      taxesTotal: financials.totalTaxes,
      investmentTotal: financials.totalInvestment,
      
      sellCity,
      unitSellPrice: financials.unitPrice,
      totalSellIncome: financials.totalBaseVal,
      netSellRevenue: financials.netRevenue,
      sellMethod,
      
      materialsPurchased: {
        lingotes: { needed: materialsBreakdown.lingotes.final, purchased: 0, method: lingotesMethod, city: lingotesCity },
        tablas: { needed: materialsBreakdown.tablas.final, purchased: 0, method: tablasMethod, city: tablasCity },
        telas: { needed: materialsBreakdown.telas.final, purchased: 0, method: telasMethod, city: telasCity },
        cueros: { needed: materialsBreakdown.cueros.final, purchased: 0, method: cuerosMethod, city: cuerosCity },
        artefacto: { needed: materialsBreakdown.artifact.needed, purchased: 0, method: artifactMethod, city: artifactCity }
      },
      materialsReady: (
        materialsBreakdown.lingotes.final === 0 &&
        materialsBreakdown.tablas.final === 0 &&
        materialsBreakdown.telas.final === 0 &&
        materialsBreakdown.cueros.final === 0 &&
        materialsBreakdown.artifact.needed === 0
      ),
      status: 'pending_materials'
    };

    onAddJob(job);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-7xl mx-auto">
      
      {/* LEFT COLUMN: Configurations */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Craft Core Setup */}
        <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
          <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Wrench className="text-amber-400" size={18} />
              <h3 className="font-semibold text-white">Configuración Básica de Crafteo</h3>
            </div>
            {activeArtisan !== 'Herrero' && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
                Próximamente
              </span>
            )}
          </div>

          {/* Ocupación / Artesano Selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
              Especialización del Puesto (Artesano)
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-black/45 rounded-lg border border-gray-800">
              <button
                type="button"
                onClick={() => setActiveArtisan('Herrero')}
                className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeArtisan === 'Herrero'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.15)] font-extrabold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>🔨 Herrero</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveArtisan('Herrero Mágico')}
                className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeArtisan === 'Herrero Mágico'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)] font-extrabold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>🔮 H. Mágico</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveArtisan('Flechero')}
                className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeArtisan === 'Flechero'
                    ? 'bg-pink-500/15 text-pink-400 border border-pink-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)] font-extrabold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>🏹 Flechero</span>
              </button>
            </div>
          </div>

          {/* Warning banner for non-active artisans */}
          {filteredRecipes.length === 0 && (
            <div className="mb-5 p-4 rounded-lg bg-yellow-500/5 border border-yellow-550/20 text-yellow-300 flex items-start gap-3 shadow-[0_0_15px_rgba(234,179,8,0.03)] backdrop-blur-md">
              <ShieldAlert className="text-yellow-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1 text-xs">
                <span className="font-bold uppercase tracking-wide block text-yellow-400 text-[11px]">Ramo sin recetas cargadas temporalmente</span>
                <p className="text-gray-300 leading-relaxed">
                  Has seleccionado la especialidad de <strong className="text-yellow-400">{activeArtisan}</strong>. Todavía no tiene datos ingresados en esta base de datos, próximamente habilitaremos las recetas de esta ocupación.
                </p>
                <div className="text-[10px] text-gray-400 font-mono mt-1 pt-1 border-t border-yellow-500/10">
                  ⚠️ Se utiliza la rama estándar de Herrero como simulación de respaldo para que puedas verificar devoluciones y empaques de materiales de igual escala.
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Seleccionar Item de Albion
              </label>
              <select
                value={selectedRecipeIndex}
                onChange={(e) => setSelectedRecipeIndex(parseInt(e.target.value))}
                className="w-full bg-black/40 border border-gray-750 text-white rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                {filteredRecipes.map((r) => (
                  <option key={r.originalIndex} value={r.originalIndex} className="bg-neutral-900 text-white">
                    {r.Item} ({r.Categoria})
                  </option>
                ))}
              </select>
            </div>

            {/* City setup */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Ciudad del Taller / Puesto
              </label>
              <select
                value={craftCity}
                onChange={(e) => setCraftCity(e.target.value as AlbionCity)}
                className="w-full bg-black/40 border border-gray-750 text-white rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                {ALBION_CITIES.map((city) => (
                  <option key={city} value={city} className="bg-neutral-900 text-white">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Tier */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Tier (Nivel del Item)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['T4', 'T5', 'T6', 'T7', 'T8'] as ItemTier[]).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                      selectedTier === tier
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-black/30 text-gray-400 border border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Enchant */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Encantamiento (Raros)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {([0, 1, 2, 3, 4] as EnchantmentLevel[]).map((ench) => (
                  <button
                    key={ench}
                    type="button"
                    onClick={() => setSelectedEnchantment(ench)}
                    className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                      selectedEnchantment === ench
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'bg-black/30 text-gray-400 border border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    .{ench}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Cantidad a Craftear
              </label>
              <input
                type="number"
                min="1"
                value={craftQuantity || ''}
                onChange={(e) => {
                  const qty = parseInt(e.target.value);
                  setCraftQuantity(isNaN(qty) ? 1 : Math.max(1, qty));
                }}
                className="w-full bg-black/40 border border-gray-750 text-white rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Station owner usage fee price */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                Tasa de Uso del Puesto
                <Info size={12} className="text-gray-500 cursor-help" title="Plata cobrada por el dueño del local por cada 100 de nutrición." />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={stationFeeText}
                  onChange={(e) => setStationFeeText(e.target.value)}
                  className="w-full bg-black/40 border border-gray-750 text-white rounded-lg py-2 pl-3 pr-16 text-sm font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  placeholder="525"
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-gray-500 font-bold tracking-wider">
                  / 100 NUTR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Albion Specialization & Return Bonuses */}
        <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
          <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Percent className="text-emerald-400" size={18} />
              <h3 className="font-semibold text-white">Bono de Retorno de Recursos</h3>
            </div>
            <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
              Ref de Retorno: {returnRateMath.percentageText}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City Specialization Info card */}
            <div className={`p-3 rounded-lg border flex flex-col justify-between ${
              isCitySpecialized 
                ? 'bg-amber-500/5 border-amber-500/20 text-amber-200' 
                : 'bg-black/20 border-gray-800/80 text-gray-400'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Bono de Ciudad</span>
                  <Building2 size={14} className={isCitySpecialized ? 'text-amber-400' : 'text-gray-600'} />
                </div>
                <p className="text-[11px] leading-snug">
                  {recipe.Categoria} tiene bonus de devolución del 31.5% en <span className="font-bold text-white">{idealCity}</span>.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs pt-1.5 border-t border-gray-800/30">
                <span>Tu ciudad: {craftCity}</span>
                <span className="font-mono font-bold text-white">{isCitySpecialized ? '+31.5%' : '0%'}</span>
              </div>
            </div>

            {/* Global Activity Bonus Card */}
            <div className={`p-3 rounded-lg border flex flex-col justify-between ${
              activityBonus 
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200' 
                : 'bg-black/20 border-gray-800/80 text-gray-400'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Bono de Actividad</span>
                  <Activity size={14} className={activityBonus ? 'text-emerald-400' : 'text-gray-600'} />
                </div>
                <p className="text-[11px] leading-snug">
                  Un bono adicional para eventos del día que añade un 10.0% extra a los retornos.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-gray-800/20">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activityBonus}
                    onChange={(e) => setActivityBonus(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-500 h-3.5 w-3.5 bg-black"
                  />
                  <span>Activo hoy</span>
                </label>
                <span className="font-mono font-bold text-white">{activityBonus ? '+10.0%' : '0%'}</span>
              </div>
            </div>

            {/* Hideout custom input (written by hand) */}
            <div className="p-3 rounded-lg border bg-black/20 border-gray-800/80 flex flex-col justify-between text-gray-400">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Bono HO (Hideout)</span>
                  <Sparkles size={14} className="text-purple-400" />
                </div>
                <p className="text-[11px] leading-snug">
                  Escribe a mano el valor del bono del Hideout según tu territorio u alianza.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-gray-800/20">
                <span className="text-xs">Bono escrito %:</span>
                <input
                  type="text"
                  value={hoBonusText}
                  onChange={(e) => setHoBonusText(e.target.value)}
                  className="w-14 bg-black/40 border border-gray-700 rounded px-1.5 py-0.5 text-center text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Materials Composition Cards Detail */}
        <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
          <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
            <h3 className="font-semibold text-white">Ingredientes & Materiales Requeridos</h3>
            <span className="text-xs text-gray-400 italic">
              Con descuento de devolución del {returnRateMath.percentageText} aplicado.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Visual rendering of main Albion Item */}
            <div className="p-3 bg-black/40 rounded-lg border border-gray-800 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 mb-2">Item Fabricado (100x100)</span>
              <img
                src={getAlbionRenderUrl(recipe.Url_Item, selectedTier, selectedEnchantment)}
                alt={recipe.Item}
                className="w-[100px] h-[100px] object-contain drop-shadow bg-neutral-900/60 p-1.5 rounded-lg border border-gray-700/40"
                referrerPolicy="no-referrer"
                onError={handleImageLoadError}
              />
              <h5 className="font-serif mt-2 text-sm text-amber-100 font-bold leading-tight">{recipe.Item}</h5>
              <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase">
                {selectedTier}.{selectedEnchantment} | {recipe.Categoria}
              </p>
            </div>

            {/* Basic Materials list (lingotes, tablas, telas, cueros) */}
            <div className="lg:col-span-2 p-3 bg-black/20 rounded-lg border border-gray-800/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-2 uppercase tracking-wide">
                  Ingredientes Base Forjados
                </span>
                
                <div className="space-y-3">
                  {recipe.Lingotes > 0 && (
                    <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5 text-gray-300 gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-black/45 border border-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                          <img 
                            src={getMaterialRenderUrl('lingotes', selectedTier, selectedEnchantment)} 
                            alt="Lingotes" 
                            className="w-7 h-7 object-contain"
                            referrerPolicy="no-referrer"
                            onError={handleImageLoadError}
                          />
                        </div>
                        <span className="text-xs font-serif font-medium truncate">Lingotes de Metal</span>
                      </div>
                      <span className="text-xs font-mono shrink-0">
                        <span className="text-gray-500 line-through mr-1.5 italic text-[10px]">{materialsBreakdown.lingotes.base}</span>
                        <strong className="text-amber-400 font-bold text-sm">{materialsBreakdown.lingotes.final}</strong> u (T{selectedTier}.{selectedEnchantment})
                      </span>
                    </div>
                  )}
                  {recipe.Tablas > 0 && (
                    <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5 text-gray-300 gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-black/45 border border-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                          <img 
                            src={getMaterialRenderUrl('tablas', selectedTier, selectedEnchantment)} 
                            alt="Tablas" 
                            className="w-7 h-7 object-contain"
                            referrerPolicy="no-referrer"
                            onError={handleImageLoadError}
                          />
                        </div>
                        <span className="text-xs font-serif font-medium truncate">Tablas de Madera</span>
                      </div>
                      <span className="text-xs font-mono shrink-0">
                        <span className="text-gray-500 line-through mr-1.5 italic text-[10px]">{materialsBreakdown.tablas.base}</span>
                        <strong className="text-amber-400 font-bold text-sm">{materialsBreakdown.tablas.final}</strong> u (T{selectedTier}.{selectedEnchantment})
                      </span>
                    </div>
                  )}
                  {recipe.Telas > 0 && (
                    <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5 text-gray-300 gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-black/45 border border-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                          <img 
                            src={getMaterialRenderUrl('telas', selectedTier, selectedEnchantment)} 
                            alt="Telas" 
                            className="w-7 h-7 object-contain"
                            referrerPolicy="no-referrer"
                            onError={handleImageLoadError}
                          />
                        </div>
                        <span className="text-xs font-serif font-medium truncate">Telas de Fibra</span>
                      </div>
                      <span className="text-xs font-mono shrink-0">
                        <span className="text-gray-500 line-through mr-1.5 italic text-[10px]">{materialsBreakdown.telas.base}</span>
                        <strong className="text-amber-400 font-bold text-sm">{materialsBreakdown.telas.final}</strong> u (T{selectedTier}.{selectedEnchantment})
                      </span>
                    </div>
                  )}
                  {recipe.Cueros > 0 && (
                    <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5 text-gray-300 gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-black/45 border border-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                          <img 
                            src={getMaterialRenderUrl('cueros', selectedTier, selectedEnchantment)} 
                            alt="Cueros" 
                            className="w-7 h-7 object-contain"
                            referrerPolicy="no-referrer"
                            onError={handleImageLoadError}
                          />
                        </div>
                        <span className="text-xs font-serif font-medium truncate">Cueros de Piel</span>
                      </div>
                      <span className="text-xs font-mono shrink-0">
                        <span className="text-gray-500 line-through mr-1.5 italic text-[10px]">{materialsBreakdown.cueros.base}</span>
                        <strong className="text-amber-400 font-bold text-sm">{materialsBreakdown.cueros.final}</strong> u (T{selectedTier}.{selectedEnchantment})
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3.5 space-y-1.5 border-t border-gray-800/80 pt-2.5">
                  {craftQuantity === 1 ? (
                    <p className="text-[10px] text-amber-400/80 bg-amber-500/5 px-2.0 py-1 rounded border border-amber-500/10 italic leading-normal">
                      ⚠️ Devolución desactivada al fabricar una sola unidad (1 u) de acuerdo a tu solicitud.
                    </p>
                  ) : returnRateMath.rate > 0 ? (
                    <p className="text-[10px] text-emerald-400 bg-emerald-500/5 px-2.0 py-1 rounded border border-emerald-500/10 leading-normal">
                      🛡️ Margen activo: Se sumaron +8 materiales de seguridad a cada recurso con devolución para que no te quedes corto.
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Artifact if selected recipe contains one */}
              {recipe.CantidadArtefacto1 > 0 ? (
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-3 bg-black/40 p-2.5 rounded-md">
                  <img
                    src={getAlbionArtifactRenderUrl(recipe.Url_Artefacto1, selectedTier)}
                    alt={recipe.Artefacto1}
                    className="w-[50px] h-[50px] object-contain p-1 bg-neutral-900 border border-gray-700 rounded-md"
                    referrerPolicy="no-referrer"
                    onError={handleImageLoadError}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-amber-500 block">Artefacto Necesario</span>
                    <strong className="text-xs text-white truncate block">{recipe.Artefacto1}</strong>
                    <div className="text-xs font-mono text-gray-400 flex justify-between mt-0.5">
                      <span>Inmune a Retorno:</span>
                      <strong className="text-white">{materialsBreakdown.artifact.needed} unidad(es)</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2.5 text-xs text-gray-500 italic">
                  Este item es un recurso estándar sin artefacto.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Albion Book Journaling & Fame Tracker */}
        <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
            <BookOpen className="text-blue-400" size={18} />
            <h3 className="font-semibold text-white">Llenado de Libros (Diarios) y Fama</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Fame Column */}
            <div className="lg:col-span-2 p-4 bg-gradient-to-br from-black/50 to-black/30 rounded-xl flex items-center gap-4 border border-gray-800 shadow-inner group">
              <div className="relative shrink-0 flex items-center justify-center w-16 h-16 rounded-lg bg-amber-500/5 border border-amber-500/20 overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent blur-sm animate-pulse" />
                <img 
                  src={`https://render.albiononline.com/v1/item/${selectedTier}_ITEM_BOOK_XP.png`}
                  alt="Fama"
                  className="w-12 h-12 object-contain relative z-10 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
                  referrerPolicy="no-referrer"
                  onError={handleImageLoadError}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-amber-500 uppercase tracking-widest block font-extrabold">Fama de Albion</span>
                <div className="mt-1 font-mono">
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wide">Fama Unitaria:</span>
                  <strong className="text-sm text-yellow-300/90 font-bold">{journalsMath.famePerUnit.toLocaleString()}</strong>
                </div>
                <div className="mt-1.5 pt-1 border-t border-gray-800/60 font-mono">
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wide">Fama del Lote Total:</span>
                  <strong className="text-lg text-amber-400 font-extrabold">{journalsMath.totalFame.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Manufacturer Journals Setup */}
            <div className="lg:col-span-3 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block">
                    Diarios del {activeArtisan || 'Herrero'} Tier {selectedTier}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 font-bold font-mono">
                    Cap: {journalsMath.bookCapacity.toLocaleString()} Fama
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                  Los items fabricados del lote acumulan la fama en diarios del fabricante correspondientes a su profesión.
                </p>
              </div>

              {/* Dynamic Book Icons Grid */}
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {/* 1. COMPLETELY FILLED JOURNALS */}
                <div className="p-2 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-700 transition-colors flex flex-col items-center text-center justify-center relative group min-h-[95px]">
                  <div className="relative">
                    <img 
                      src={`https://render.albiononline.com/v1/item/${selectedTier}_JOURNAL_${
                        activeArtisan === 'Flechero' ? 'FLETCHER' : activeArtisan === 'Herrero Mágico' ? 'MAGE' : 'BLACKSMITH'
                      }_FULL.png`}
                      alt="Diario Lleno"
                      className="w-11 h-11 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                      onError={handleImageLoadError}
                    />
                    <span className="absolute -top-1.5 -right-2 bg-amber-500 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-md">
                      x{journalsMath.fullBooks}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1.5 font-semibold block leading-tight">Totalmente Llenos</span>
                </div>

                {/* 2. PARTIAL EXTRA JOURNAL */}
                <div className="p-2 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-700 transition-colors flex flex-col items-center text-center justify-center relative min-h-[95px]">
                  {journalsMath.partialPercentage > 0 ? (
                    <>
                      <div className="relative">
                        <img 
                          src={`https://render.albiononline.com/v1/item/${selectedTier}_JOURNAL_${
                            activeArtisan === 'Flechero' ? 'FLETCHER' : activeArtisan === 'Herrero Mágico' ? 'MAGE' : 'BLACKSMITH'
                          }_FULL.png`}
                          alt="Diario Parcial"
                          className="w-11 h-11 object-contain opacity-80 filter saturate-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                          referrerPolicy="no-referrer"
                          onError={handleImageLoadError}
                        />
                        <span className="absolute -bottom-1 -right-2 bg-blue-500 text-white text-[9px] font-bold px-1 rounded shadow">
                          {journalsMath.partialPercentage}%
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-300 mt-1.5 font-semibold block leading-tight">Libro Sobrante</span>
                      
                      {/* Interactive sleek progress line */}
                      <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden mt-1 max-w-[42px]">
                        <div 
                          className="bg-blue-400 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${journalsMath.partialPercentage}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-11 h-11 rounded-full border border-dashed border-gray-800 flex items-center justify-center text-gray-700">
                        Ø
                      </div>
                      <span className="text-[9px] text-gray-600 mt-2 italic block">Sin sobrante</span>
                    </>
                  )}
                </div>

                {/* 3. EMPTY JOURNALS REQUIRED */}
                <div className="p-2 rounded-lg bg-black/50 border border-blue-500/10 hover:border-blue-500/20 transition-colors flex flex-col items-center text-center justify-center min-h-[95px]">
                  <div className="relative">
                    <img 
                      src={`https://render.albiononline.com/v1/item/${selectedTier}_JOURNAL_${
                        activeArtisan === 'Flechero' ? 'FLETCHER' : activeArtisan === 'Herrero Mágico' ? 'MAGE' : 'BLACKSMITH'
                      }.png`}
                      alt="Diario Vacío"
                      className="w-11 h-11 object-contain filter sature-75 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                      referrerPolicy="no-referrer"
                      onError={handleImageLoadError}
                    />
                    <span className="absolute -top-1.5 -right-2 bg-blue-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-md">
                      x{journalsMath.totalBooksNeeded}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-300 mt-1.5 font-bold block leading-tight">Llevar Vacíos</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Costs, Cities, Pricing & Profitability */}
      <div className="xl:col-span-4 space-y-6">
        {/* Market Pricing details */}
        <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
            <CircleDollarSign className="text-yellow-400" size={18} />
            <h3 className="font-semibold text-white">Precios y Mercado</h3>
          </div>

          <div className="space-y-4">
            {/* Individual Material Sourcing & Price Details */}
            <div className="space-y-3.5">
              <span className="block text-xs font-semibold text-amber-500 uppercase tracking-wider">
                Origen y Precios de Insumos
              </span>

              {/* 1. LINGOTES */}
              {recipe.Lingotes > 0 && (
                <div className="p-3 bg-black/40 rounded-lg border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-black/55 border border-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                        <img 
                          src={getMaterialRenderUrl('lingotes', selectedTier, selectedEnchantment)} 
                          alt="Lingote" 
                          className="w-6 h-6 object-contain"
                          referrerPolicy="no-referrer"
                          onError={handleImageLoadError}
                        />
                      </div>
                      <strong className="text-xs text-white truncate">Lingote T{selectedTier}.{selectedEnchantment}</strong>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">Req: {materialsBreakdown.lingotes.final} u</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Ciudad de Compra</label>
                      <select
                        value={lingotesCity}
                        onChange={(e) => setLingotesCity(e.target.value as AlbionCity)}
                        className="w-full bg-black/40 border border-gray-700 text-white rounded px-2 py-1 text-[11px] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        {ALBION_CITIES.map((c) => (
                          <option key={c} value={c} className="bg-neutral-900">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Método</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setLingotesMethod('order')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${lingotesMethod === 'order' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Orden
                        </button>
                        <button
                          type="button"
                          onClick={() => setLingotesMethod('direct')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${lingotesMethod === 'direct' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Directo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Precio Compra s (Silver)</label>
                    <input
                      type="number"
                      min="0"
                      value={manualPricesText.lingotes}
                      onChange={(e) => updatePriceAndSyncGlobally('lingotes', e.target.value)}
                      className="w-full bg-black/45 border border-gray-700 text-white font-mono rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      placeholder="Precio s..."
                    />
                    {materialsBreakdown.lingotes.final > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-850 text-[10px] font-mono leading-tight space-y-0.5">
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal Base:</span>
                          <span>{((materialsBreakdown.lingotes.final) * (parseInt(manualPricesText.lingotes) || 0)).toLocaleString()} s</span>
                        </div>
                        <div className="flex justify-between text-amber-400 font-semibold">
                          <span>Total con Impuesto:</span>
                          <span>{Math.round(
                            materialsBreakdown.lingotes.final * 
                            (parseInt(manualPricesText.lingotes) || 0) * 
                            (1 + (lingotesMethod === 'order' ? 0.025 : 0))
                          ).toLocaleString()} s</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. TABLAS */}
              {recipe.Tablas > 0 && (
                <div className="p-3 bg-black/40 rounded-lg border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-black/55 border border-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                        <img 
                          src={getMaterialRenderUrl('tablas', selectedTier, selectedEnchantment)} 
                          alt="Tabla" 
                          className="w-6 h-6 object-contain"
                          referrerPolicy="no-referrer"
                          onError={handleImageLoadError}
                        />
                      </div>
                      <strong className="text-xs text-white truncate">Tabla T{selectedTier}.{selectedEnchantment}</strong>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">Req: {materialsBreakdown.tablas.final} u</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Ciudad de Compra</label>
                      <select
                        value={tablasCity}
                        onChange={(e) => setTablasCity(e.target.value as AlbionCity)}
                        className="w-full bg-black/40 border border-gray-700 text-white rounded px-2 py-1 text-[11px] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        {ALBION_CITIES.map((c) => (
                          <option key={c} value={c} className="bg-neutral-900">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Método</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setTablasMethod('order')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${tablasMethod === 'order' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Orden
                        </button>
                        <button
                          type="button"
                          onClick={() => setTablasMethod('direct')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${tablasMethod === 'direct' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Directo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Precio Compra s (Silver)</label>
                    <input
                      type="number"
                      min="0"
                      value={manualPricesText.tablas}
                      onChange={(e) => updatePriceAndSyncGlobally('tablas', e.target.value)}
                      className="w-full bg-black/45 border border-gray-700 text-white font-mono rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      placeholder="Precio s..."
                    />
                    {materialsBreakdown.tablas.final > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-850 text-[10px] font-mono leading-tight space-y-0.5">
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal Base:</span>
                          <span>{((materialsBreakdown.tablas.final) * (parseInt(manualPricesText.tablas) || 0)).toLocaleString()} s</span>
                        </div>
                        <div className="flex justify-between text-amber-400 font-semibold">
                          <span>Total con Impuesto:</span>
                          <span>{Math.round(
                            materialsBreakdown.tablas.final * 
                            (parseInt(manualPricesText.tablas) || 0) * 
                            (1 + (tablasMethod === 'order' ? 0.025 : 0))
                          ).toLocaleString()} s</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. TELAS */}
              {recipe.Telas > 0 && (
                <div className="p-3 bg-black/40 rounded-lg border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-black/55 border border-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                        <img 
                          src={getMaterialRenderUrl('telas', selectedTier, selectedEnchantment)} 
                          alt="Tela" 
                          className="w-6 h-6 object-contain"
                          referrerPolicy="no-referrer"
                          onError={handleImageLoadError}
                        />
                      </div>
                      <strong className="text-xs text-white truncate">Tela T{selectedTier}.{selectedEnchantment}</strong>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">Req: {materialsBreakdown.telas.final} u</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Ciudad de Compra</label>
                      <select
                        value={telasCity}
                        onChange={(e) => setTelasCity(e.target.value as AlbionCity)}
                        className="w-full bg-black/40 border border-gray-700 text-white rounded px-2 py-1 text-[11px] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        {ALBION_CITIES.map((c) => (
                          <option key={c} value={c} className="bg-neutral-900">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Método</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setTelasMethod('order')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${telasMethod === 'order' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Orden
                        </button>
                        <button
                          type="button"
                          onClick={() => setTelasMethod('direct')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${telasMethod === 'direct' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Directo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Precio Compra s (Silver)</label>
                    <input
                      type="number"
                      min="0"
                      value={manualPricesText.telas}
                      onChange={(e) => updatePriceAndSyncGlobally('telas', e.target.value)}
                      className="w-full bg-black/45 border border-gray-700 text-white font-mono rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      placeholder="Precio s..."
                    />
                    {materialsBreakdown.telas.final > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-850 text-[10px] font-mono leading-tight space-y-0.5">
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal Base:</span>
                          <span>{((materialsBreakdown.telas.final) * (parseInt(manualPricesText.telas) || 0)).toLocaleString()} s</span>
                        </div>
                        <div className="flex justify-between text-amber-400 font-semibold">
                          <span>Total con Impuesto:</span>
                          <span>{Math.round(
                            materialsBreakdown.telas.final * 
                            (parseInt(manualPricesText.telas) || 0) * 
                            (1 + (telasMethod === 'order' ? 0.025 : 0))
                          ).toLocaleString()} s</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. CUEROS */}
              {recipe.Cueros > 0 && (
                <div className="p-3 bg-black/40 rounded-lg border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-black/55 border border-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                        <img 
                          src={getMaterialRenderUrl('cueros', selectedTier, selectedEnchantment)} 
                          alt="Cuero" 
                          className="w-6 h-6 object-contain"
                          referrerPolicy="no-referrer"
                          onError={handleImageLoadError}
                        />
                      </div>
                      <strong className="text-xs text-white truncate">Cuero T{selectedTier}.{selectedEnchantment}</strong>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">Req: {materialsBreakdown.cueros.final} u</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Ciudad de Compra</label>
                      <select
                        value={cuerosCity}
                        onChange={(e) => setCuerosCity(e.target.value as AlbionCity)}
                        className="w-full bg-black/40 border border-gray-700 text-white rounded px-2 py-1 text-[11px] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        {ALBION_CITIES.map((c) => (
                          <option key={c} value={c} className="bg-neutral-900">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Método</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setCuerosMethod('order')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${cuerosMethod === 'order' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Orden
                        </button>
                        <button
                          type="button"
                          onClick={() => setCuerosMethod('direct')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${cuerosMethod === 'direct' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Directo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Precio Compra s (Silver)</label>
                    <input
                      type="number"
                      min="0"
                      value={manualPricesText.cueros}
                      onChange={(e) => updatePriceAndSyncGlobally('cueros', e.target.value)}
                      className="w-full bg-black/45 border border-gray-700 text-white font-mono rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      placeholder="Precio s..."
                    />
                    {materialsBreakdown.cueros.final > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-850 text-[10px] font-mono leading-tight space-y-0.5">
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal Base:</span>
                          <span>{((materialsBreakdown.cueros.final) * (parseInt(manualPricesText.cueros) || 0)).toLocaleString()} s</span>
                        </div>
                        <div className="flex justify-between text-amber-400 font-semibold">
                          <span>Total con Impuesto:</span>
                          <span>{Math.round(
                            materialsBreakdown.cueros.final * 
                            (parseInt(manualPricesText.cueros) || 0) * 
                            (1 + (cuerosMethod === 'order' ? 0.025 : 0))
                          ).toLocaleString()} s</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. ARTEFACTO */}
              {recipe.CantidadArtefacto1 > 0 && recipe.Artefacto1 !== 'N/A' && (
                <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-black border border-amber-500/10 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                        <img 
                          src={getAlbionArtifactRenderUrl(recipe.Url_Artefacto1, selectedTier)} 
                          alt={recipe.Artefacto1} 
                          className="w-6 h-6 object-contain"
                          referrerPolicy="no-referrer"
                          onError={handleImageLoadError}
                        />
                      </div>
                      <strong className="text-xs text-amber-300 truncate">{recipe.Artefacto1} T{selectedTier}</strong>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">Req: {materialsBreakdown.artifact.needed} u</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Ciudad de Compra</label>
                      <select
                        value={artifactCity}
                        onChange={(e) => setArtifactCity(e.target.value as AlbionCity)}
                        className="w-full bg-black/40 border border-amber-500/30 text-white rounded px-2 py-1 text-[11px] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        {ALBION_CITIES.map((c) => (
                          <option key={c} value={c} className="bg-neutral-900">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Método</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setArtifactMethod('order')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${artifactMethod === 'order' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Orden
                        </button>
                        <button
                          type="button"
                          onClick={() => setArtifactMethod('direct')}
                          className={`py-0.5 rounded text-[10px] font-bold cursor-pointer ${artifactMethod === 'direct' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-black/30 text-gray-500 border border-gray-800'}`}
                        >
                          Directo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Precio Compra Artefacto (Silver)</label>
                    <input
                      type="number"
                      min="0"
                      value={manualPricesText.artefacto}
                      onChange={(e) => updatePriceAndSyncGlobally('artefacto', e.target.value)}
                      className="w-full bg-black/45 border border-amber-500/25 text-white font-mono rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      placeholder="Precio s..."
                    />
                    {materialsBreakdown.artifact.needed > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-850 text-[10px] font-mono leading-tight space-y-0.5">
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal Base:</span>
                          <span>{((materialsBreakdown.artifact.needed) * (parseInt(manualPricesText.artefacto) || 0)).toLocaleString()} s</span>
                        </div>
                        <div className="flex justify-between text-amber-400 font-semibold">
                          <span>Total con Impuesto:</span>
                          <span>{Math.round(
                            materialsBreakdown.artifact.needed * 
                            (parseInt(manualPricesText.artefacto) || 0) * 
                            (1 + (artifactMethod === 'order' ? 0.025 : 0))
                          ).toLocaleString()} s</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <p className="text-[9px] text-gray-500 leading-snug italic">
                * El cambio de precios guardará automáticamente el registro en la pestaña de Gestión de Precios.
              </p>
            </div>

            <div className="w-full h-px bg-gray-800 my-3" />

            {/* Target Selling City */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Ciudad Destino (Destinado a Venta)
              </label>
              <select
                value={sellCity}
                onChange={(e) => setSellCity(e.target.value as AlbionCity)}
                className="w-full bg-black/40 border border-gray-750 text-white rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                {ALBION_CITIES.map((city) => (
                  <option key={city} value={city} className="bg-neutral-900 text-white">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Manual unit price */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Precio Unitario de Venta (Silver)
              </label>
              <input
                type="number"
                min="0"
                value={manualUnitSellPriceText === '0' ? '' : manualUnitSellPriceText}
                onChange={(e) => setManualUnitSellPriceText(e.target.value)}
                className="w-full bg-black/40 border border-gray-750 text-white rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                placeholder="Introducir precio de venta..."
              />
              <p className="text-[10px] text-gray-500 mt-1 leading-tight italic">
                Sujeto a impuestos de venta en base a tu estado Premium y modo de orden.
              </p>
            </div>

            {/* Sell Method: Direct vs Order */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Método de Venta Estimado
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setSellMethod('order')}
                  className={`py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    sellMethod === 'order'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-black/30 text-gray-500 border border-gray-800'
                  }`}
                  title="Paga un 2.5% de Setup fee adicional para órdenes de venta."
                >
                  Orden de Venta
                </button>
                <button
                  type="button"
                  onClick={() => setSellMethod('direct')}
                  className={`py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    sellMethod === 'direct'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-black/30 text-gray-500 border border-gray-800'
                  }`}
                  title="Venta directa e instantánea al libro de órdenes."
                >
                  Venta Directa
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdowns & Costs summary */}
        <div className={`p-5 rounded-xl border bg-black/40 ${borderColor}`}>
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
            <Scale className="text-amber-500" size={18} />
            <h3 className="font-semibold text-white">Desglose de Costes Reales</h3>
          </div>

          <div className="space-y-2.5 font-mono text-xs text-gray-300">
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span>Costo Materiales:</span>
              <strong className="text-white">{materialsBreakdown.totalRawCost.toLocaleString()} s</strong>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-1 flex-col pb-2">
              <div className="flex justify-between">
                <span>Tasa de Uso (Taller):</span>
                <strong className="text-white">{stationFeeMath.totalSilverCost.toLocaleString()} s</strong>
              </div>
              <span className="text-[10px] text-gray-500 italic mt-0.5 leading-none">
                Nutrición total: {stationFeeMath.totalNutrition} unidades
              </span>
            </div>
            
            <div className="flex justify-between border-b border-gray-800 pb-1.5 text-gray-400">
              <span>Setup Fee Venta (2.5%):</span>
              <span>{financials.setupFee.toLocaleString()} s</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-1.5 text-gray-400">
              <span className="flex items-center gap-1">
                Impuesto Transacción ({globalPremium ? '4%' : '8%'}):
                {globalPremium ? (
                  <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-400/5 px-1 py-0.2 rounded border border-amber-400/20">PREM</span>
                ) : (
                  <span className="text-[9px] uppercase font-bold text-red-400 bg-red-450/5 px-1 py-0.2 rounded border border-red-400/20">NO PREM</span>
                )}
              </span>
              <span>{financials.transactionTax.toLocaleString()} s</span>
            </div>

            <div className="flex justify-between text-white font-bold pt-1.5 tracking-wider border-b border-gray-750 pb-2">
              <span>Inversión Total Requ.:</span>
              <span className="text-red-400">{financials.totalInvestment.toLocaleString()} s</span>
            </div>

            <div className="flex justify-between text-white font-bold pt-1 tracking-wider border-b border-gray-750 pb-2">
              <span>Retorno Neto Estimado:</span>
              <span className="text-emerald-400">{financials.netRevenue.toLocaleString()} s</span>
            </div>

            {/* Profits card inside details block */}
            <div className={`p-3 rounded-lg mt-4 text-center border ${
              financials.netProfit >= 0 
                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-md shadow-emerald-500/2' 
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider">
                Beneficio Neto Estimado ({craftQuantity} u)
              </span>
              <strong className={`text-xl font-bold block mt-1 tracking-wider ${
                financials.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {financials.netProfit >= 0 ? '+' : ''}
                {financials.netProfit.toLocaleString()} silver
              </strong>
              
              <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-gray-800 text-xs">
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-bold">Margen ROI:</span>
                  <strong className={financials.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {financials.margin}
                  </strong>
                </div>
                <div className="w-px h-6 bg-gray-800" />
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-bold">Por Unidad:</span>
                  <strong className={financials.netProfit >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                    {Math.round(financials.netProfit / craftQuantity).toLocaleString()} s
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Add triggers */}
          <button
            type="button"
            onClick={handleAddToQueue}
            className={`w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all cursor-pointer ${primaryColor}`}
          >
            <Plus size={16} />
            Añadir a la Cola de Crafteo
          </button>
          
          <p className="text-[10px] text-gray-500 text-center mt-2.5 leading-snug">
            Al añadir el item, se registrarán las cantidades de materiales requeridos apilados en el panel de compras.
          </p>
        </div>
      </div>
    </div>
  );
}
