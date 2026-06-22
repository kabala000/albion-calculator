/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  CraftingJob, 
  ItemTier, 
  EnchantmentLevel, 
  AlbionCity, 
  GlobalPricesState 
} from '../types';
import { 
  Coins, 
  Plus, 
  Minus, 
  Info, 
  ShoppingBag, 
  Check, 
  Archive, 
  HelpCircle, 
  Scale, 
  SlidersHorizontal 
} from 'lucide-react';

interface PurchaseOrderPanelProps {
  queue: CraftingJob[];
  inventory: Record<string, number>; // key: "lingotes_T4_0", "tablas_T5_2", "artefacto_Atadura antigua_T4", etc.
  globalPrices: GlobalPricesState;
  globalPremium: boolean;
  discountFromInventory?: boolean;
  onModifyInventoryQuantity: (materialKey: string, change: number) => void;
  onCompleteMaterialPurchase: (
    materialType: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'artefacto',
    tier: ItemTier,
    enchantment: EnchantmentLevel,
    artifactName: string,
    quantityBought: number
  ) => void;
  onUpdateCapital: (newCapital: number) => void;
  activeCapital: number;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

// Key structure for tracking remaining buys
interface StackedMaterial {
  key: string; // e.g. "lingotes_T5_2" or "artifact_Atadura antigua_T4"
  type: 'lingotes' | 'tablas' | 'telas' | 'cueros' | 'artefacto';
  nameText: string;
  tier: ItemTier;
  enchantment: EnchantmentLevel;
  artifactName: string;
  totalNeeded: number;
  totalAcquired: number;
}

export default function PurchaseOrderPanel({
  queue,
  inventory,
  globalPrices,
  globalPremium,
  discountFromInventory = true,
  onModifyInventoryQuantity,
  onCompleteMaterialPurchase,
  onUpdateCapital,
  activeCapital,
  primaryColor,
  surfaceColor,
  borderColor,
}: PurchaseOrderPanelProps) {
  // Local states for inputs (extracted quantities and buy splits)
  // key: stackedMaterialKey -> value: quantity extracted from inventory
  const [extractedFromInv, setExtractedFromInv] = useState<Record<string, number>>({});
  
  // Custom purchase methods: key: stackedMaterialKey -> 'order' | 'direct'
  const [customBuyMethods, setCustomBuyMethods] = useState<Record<string, 'order' | 'direct'>>({});
  
  // key: stackedMaterialKey -> how many they manually declare as "completed buying" right now
  const [manualPurchaseInputs, setManualPurchaseInputs] = useState<Record<string, number>>({});

  // 1. Gather all jobs with 'pending_materials' status
  const pendingJobs = useMemo(() => {
    return queue.filter(job => job.status === 'pending_materials');
  }, [queue]);

  // 2. Aggregate / Stack needed resources across all pending jobs
  const stackedMaterials = useMemo((): StackedMaterial[] => {
    const map: Record<string, StackedMaterial> = {};

    pendingJobs.forEach(job => {
      // Loop through materialsPurchased state to inspect items needed vs acquired
      const mp = job.materialsPurchased;

      // 1. Lingotes
      if (mp.lingotes.needed > 0) {
        const key = `lingotes_${job.tier}_${job.enchantment}`;
        const remaining = mp.lingotes.needed - mp.lingotes.purchased;
        if (remaining > 0) {
          if (!map[key]) {
            map[key] = {
              key, type: 'lingotes', nameText: `Lingote T${job.tier}.${job.enchantment}`,
              tier: job.tier, enchantment: job.enchantment, artifactName: '',
              totalNeeded: 0, totalAcquired: 0
            };
          }
          map[key].totalNeeded += remaining;
        }
      }

      // 2. Tablas
      if (mp.tablas.needed > 0) {
        const key = `tablas_${job.tier}_${job.enchantment}`;
        const remaining = mp.tablas.needed - mp.tablas.purchased;
        if (remaining > 0) {
          if (!map[key]) {
            map[key] = {
              key, type: 'tablas', nameText: `Tabla T${job.tier}.${job.enchantment}`,
              tier: job.tier, enchantment: job.enchantment, artifactName: '',
              totalNeeded: 0, totalAcquired: 0
            };
          }
          map[key].totalNeeded += remaining;
        }
      }

      // 3. Telas
      if (mp.telas.needed > 0) {
        const key = `telas_${job.tier}_${job.enchantment}`;
        const remaining = mp.telas.needed - mp.telas.purchased;
        if (remaining > 0) {
          if (!map[key]) {
            map[key] = {
              key, type: 'telas', nameText: `Tela T${job.tier}.${job.enchantment}`,
              tier: job.tier, enchantment: job.enchantment, artifactName: '',
              totalNeeded: 0, totalAcquired: 0
            };
          }
          map[key].totalNeeded += remaining;
        }
      }

      // 4. Cueros
      if (mp.cueros.needed > 0) {
        const key = `cueros_${job.tier}_${job.enchantment}`;
        const remaining = mp.cueros.needed - mp.cueros.purchased;
        if (remaining > 0) {
          if (!map[key]) {
            map[key] = {
              key, type: 'cueros', nameText: `Cuero T${job.tier}.${job.enchantment}`,
              tier: job.tier, enchantment: job.enchantment, artifactName: '',
              totalNeeded: 0, totalAcquired: 0
            };
          }
          map[key].totalNeeded += remaining;
        }
      }

      // 5. Artifacts
      if (mp.artefacto.needed > 0) {
        const key = `artefacto_${job.recipe.Artefacto1}_${job.tier}`;
        const remaining = mp.artefacto.needed - mp.artefacto.purchased;
        if (remaining > 0) {
          if (!map[key]) {
            map[key] = {
              key, type: 'artefacto', nameText: `${job.recipe.Artefacto1} T${job.tier}`,
              tier: job.tier, enchantment: 0, artifactName: job.recipe.Artefacto1,
              totalNeeded: 0, totalAcquired: 0
            };
          }
          map[key].totalNeeded += remaining;
        }
      }
    });

    return Object.values(map);
  }, [pendingJobs]);

  // Execute extraction from local inventory to cover raw material requirements
  const handleExtractFromInventory = (mat: StackedMaterial, maxAvailable: number) => {
    const currentInput = extractedFromInv[mat.key] || 0;
    if (currentInput <= 0) return;

    // We can't extract more than we actually need, or more than what exists in local inventory
    const possibleToExtract = Math.min(currentInput, mat.totalNeeded, maxAvailable);
    if (possibleToExtract <= 0) return;

    // 1. Subtract from character's inventory
    onModifyInventoryQuantity(mat.key, -possibleToExtract);

    // 2. Satisfy queue jobs step-by-step
    onCompleteMaterialPurchase(
      mat.type,
      mat.tier,
      mat.enchantment,
      mat.artifactName,
      possibleToExtract
    );

    // Reset temporary panel state input
    setExtractedFromInv(prev => ({ ...prev, [mat.key]: 0 }));
  };

  // Satisfy material by buying it
  const handleCompleteManualBuy = (mat: StackedMaterial) => {
    const inputVal = manualPurchaseInputs[mat.key];
    const qtyToBuy = inputVal !== undefined ? inputVal : mat.totalNeeded;
    
    if (qtyToBuy <= 0) return;

    const actualBuy = Math.min(qtyToBuy, mat.totalNeeded);

    // Deducing setup fee and total price
    const matchingJob = pendingJobs.find(job => {
      const mp = job.materialsPurchased;
      if (mat.type === 'lingotes' && mp.lingotes.needed > 0) return true;
      if (mat.type === 'tablas' && mp.tablas.needed > 0) return true;
      if (mat.type === 'telas' && mp.telas.needed > 0) return true;
      if (mat.type === 'cueros' && mp.cueros.needed > 0) return true;
      if (mat.type === 'artefacto' && mp.artefacto.needed > 0 && job.recipe.Artefacto1 === mat.artifactName) return true;
      return false;
    });

    let sourceCity: AlbionCity = 'Fort Sterling';
    let sourceMethod: 'direct' | 'order' = 'order';

    if (matchingJob) {
      const mp = matchingJob.materialsPurchased;
      if (mat.type === 'lingotes') {
        sourceCity = mp.lingotes.city || 'Fort Sterling';
        sourceMethod = mp.lingotes.method || 'order';
      } else if (mat.type === 'tablas') {
        sourceCity = mp.tablas.city || 'Fort Sterling';
        sourceMethod = mp.tablas.method || 'order';
      } else if (mat.type === 'telas') {
        sourceCity = mp.telas.city || 'Fort Sterling';
        sourceMethod = mp.telas.method || 'order';
      } else if (mat.type === 'cueros') {
        sourceCity = mp.cueros.city || 'Fort Sterling';
        sourceMethod = mp.cueros.method || 'order';
      } else if (mat.type === 'artefacto') {
        sourceCity = mp.artefacto.city || 'Fort Sterling';
        sourceMethod = mp.artefacto.method || 'order';
      }
    }

    const cityPrices = globalPrices[sourceCity];
    let rawUnitPrice = 0;
    if (mat.type === 'artefacto') {
      rawUnitPrice = cityPrices.artefactos[mat.artifactName]?.[mat.tier] || 0;
    } else {
      rawUnitPrice = cityPrices[mat.type][mat.tier]?.[mat.enchantment] || 0;
    }

    const selectedMethod = customBuyMethods[mat.key] || sourceMethod;
    const baseCost = rawUnitPrice * actualBuy;
    const setupFee = selectedMethod === 'order' ? Math.floor(baseCost * 0.025) : 0;
    const totalCost = baseCost + setupFee;

    // Deduct immediately from character capital
    onUpdateCapital(activeCapital - totalCost);

    // trigger complete purchase
    onCompleteMaterialPurchase(
      mat.type,
      mat.tier,
      mat.enchantment,
      mat.artifactName,
      actualBuy
    );

    // Clear input field state
    setManualPurchaseInputs(prev => ({ ...prev, [mat.key]: 0 }));
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      
      {/* Header section card */}
      <div className={`p-5 rounded-xl border mb-6 flex flex-col md:flex-row justify-between items-start md:items-center ${surfaceColor} ${borderColor}`}>
        <div>
          <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
            <ShoppingBag className="text-amber-500" size={20} />
            Orden de Compra e Insumos Acumulados
          </h2>
          <span className="text-xs text-gray-400 mt-1 block">
            Planifica tus compras y utiliza recursos disponibles en tu inventario para maximizar márgenes de ganancia.
          </span>
        </div>

        <div className="mt-4 md:mt-0 bg-black/30 border border-gray-800 rounded-lg px-4 py-2 text-right">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Empleos Pendientes:</span>
          <strong className="text-sm font-mono text-amber-400">{pendingJobs.length} órdenes en fila</strong>
        </div>
      </div>

      {pendingJobs.length === 0 ? (
        <div className="text-center py-16 bg-black/20 border border-gray-800 rounded-xl max-w-xl mx-auto">
          <Check className="w-12 h-12 text-emerald-400 mx-auto bg-emerald-500/10 p-2.5 rounded-full border border-emerald-500/30 mb-3" />
          <h3 className="text-md font-semibold text-white">¡No hay materiales pendientes por comprar!</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Todos los crafteos activos tienen sus insumos completos o la cola de crafteo está vacía. Añade nuevos items en el panel de Crafteo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stackedMaterials.map((mat) => {
            // Check current availability in inventory state
            const inventoryKey = mat.key;
            const stockInInventory = discountFromInventory ? (inventory[inventoryKey] || 0) : 0;

            const matchingJob = pendingJobs.find(job => {
              const mp = job.materialsPurchased;
              if (mat.type === 'lingotes' && mp.lingotes.needed > 0) return true;
              if (mat.type === 'tablas' && mp.tablas.needed > 0) return true;
              if (mat.type === 'telas' && mp.telas.needed > 0) return true;
              if (mat.type === 'cueros' && mp.cueros.needed > 0) return true;
              if (mat.type === 'artefacto' && mp.artefacto.needed > 0 && job.recipe.Artefacto1 === mat.artifactName) return true;
              return false;
            });

            // Get source city and method from the job metadata
            let sourceCity: AlbionCity = 'Fort Sterling'; // default fallback
            let sourceMethod: 'direct' | 'order' = 'order';

            if (matchingJob) {
              const mp = matchingJob.materialsPurchased;
              if (mat.type === 'lingotes') {
                sourceCity = mp.lingotes.city || 'Fort Sterling';
                sourceMethod = mp.lingotes.method || 'order';
              } else if (mat.type === 'tablas') {
                sourceCity = mp.tablas.city || 'Fort Sterling';
                sourceMethod = mp.tablas.method || 'order';
              } else if (mat.type === 'telas') {
                sourceCity = mp.telas.city || 'Fort Sterling';
                sourceMethod = mp.telas.method || 'order';
              } else if (mat.type === 'cueros') {
                sourceCity = mp.cueros.city || 'Fort Sterling';
                sourceMethod = mp.cueros.method || 'order';
              } else if (mat.type === 'artefacto') {
                sourceCity = mp.artefacto.city || 'Fort Sterling';
                sourceMethod = mp.artefacto.method || 'order';
              }
            }

            const cityPrices = globalPrices[sourceCity];
            let rawUnitPrice = 0;
            if (mat.type === 'artefacto') {
              rawUnitPrice = cityPrices.artefactos[mat.artifactName]?.[mat.tier] || 0;
            } else {
              rawUnitPrice = cityPrices[mat.type][mat.tier]?.[mat.enchantment] || 0;
            }

            // Splitting math based on the configured buy method
            const remainingToAcquire = mat.totalNeeded;
            const currentBuyMethod = customBuyMethods[mat.key] || sourceMethod;
            const calculatedBaseCost = rawUnitPrice * remainingToAcquire;
            const calculatedSetupFee = currentBuyMethod === 'order' ? Math.floor(calculatedBaseCost * 0.025) : 0;
            const calculatedTotalInvestment = calculatedBaseCost + calculatedSetupFee;

            const buyOrderQty = sourceMethod === 'order' ? remainingToAcquire : 0;
            const directBuyQty = sourceMethod === 'direct' ? remainingToAcquire : 0;

            // Calculate cost details
            // Buy Order Cost: P + (P * 0.025) (Setup configuration fee only, no transaction tax for buyers)
            // Direct Cost: P (No taxes for buyers)
            const unitBuyOrderPriceWithTaxes = rawUnitPrice * 1.025;
            const unitDirectPriceWithTaxes = rawUnitPrice;

            const buyOrderTotalCost = Math.round(buyOrderQty * unitBuyOrderPriceWithTaxes);
            const directBuyTotalCost = Math.round(directBuyQty * unitDirectPriceWithTaxes);
            const accumTotalCost = buyOrderTotalCost + directBuyTotalCost;

            return (
              <div 
                key={mat.key}
                className={`p-5 rounded-xl border flex flex-col justify-between ${surfaceColor} ${borderColor} relative overflow-hidden`}
              >
                
                {/* Header item detailed */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                        Material Estaqueado
                      </span>
                      <h4 className="font-serif font-bold text-white text-base leading-tight mt-0.5">
                        {mat.nameText}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1.5 font-mono">
                        <span className="text-[9px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                          Ciudad: {sourceCity}
                        </span>
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase">
                          {sourceMethod === 'direct' ? 'Directo' : 'Por Orden'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 border border-gray-850 px-3 py-1.5 rounded-lg text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Restante:</span>
                      <strong className="text-sm font-mono text-amber-400">{mat.totalNeeded} ud</strong>
                    </div>
                  </div>

                  {/* Stock from Character Inventory Integration */}
                  <div className="p-3 bg-black/40 rounded-lg border border-gray-800 mb-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Archive className="text-gray-500" size={15} />
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase leading-none font-semibold">Tus Reservas:</span>
                        {!discountFromInventory ? (
                          <span className="text-amber-500 font-mono text-[10px] block mt-0.5">
                            Omitido (Ajuste Global: NO)
                          </span>
                        ) : (
                          <strong className={`font-mono text-xs block mt-0.5 ${stockInInventory > 0 ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
                            {stockInInventory} unidades en Inventario
                          </strong>
                        )}
                      </div>
                    </div>

                    {stockInInventory > 0 && (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max={Math.min(stockInInventory, mat.totalNeeded)}
                          placeholder="qty"
                          value={extractedFromInv[mat.key] === 0 ? '' : (extractedFromInv[mat.key] || '')}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setExtractedFromInv(prev => ({
                              ...prev,
                              [mat.key]: isNaN(val) ? 0 : Math.min(val, stockInInventory, mat.totalNeeded)
                            }));
                          }}
                          className="w-12 bg-black border border-gray-700 text-white rounded py-0.5 text-center text-xs font-mono focus:outline-none"
                        />
                        <button
                          onClick={() => handleExtractFromInventory(mat, stockInInventory)}
                          className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/30 text-white font-bold rounded text-[10px] cursor-pointer uppercase select-none transition-colors"
                        >
                          Extraer
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Splitting Buy Methods Configuration sliders */}
                  <div className="space-y-3 p-3 bg-black/20 rounded-lg border border-gray-850">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-semibold flex items-center gap-1 font-serif">
                        <SlidersHorizontal size={13} className="text-amber-400" />
                        Método de Adquisición Preferido:
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono italic">
                        Ref: {sourceCity}
                      </span>
                    </div>

                    {/* Method Switcher Buttons */}
                    <div className="grid grid-cols-2 gap-1 bg-black p-0.5 rounded border border-gray-800">
                      <button
                        type="button"
                        onClick={() => setCustomBuyMethods(prev => ({ ...prev, [mat.key]: 'order' }))}
                        className={`py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          currentBuyMethod === 'order'
                            ? 'bg-amber-500 text-black shadow-sm font-extrabold shadow-amber-500/20'
                            : 'text-gray-400 hover:text-gray-255 bg-transparent'
                        }`}
                      >
                        Orden de Compra (2.5% Setup)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomBuyMethods(prev => ({ ...prev, [mat.key]: 'direct' }))}
                        className={`py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          currentBuyMethod === 'direct'
                            ? 'bg-amber-500 text-black shadow-sm font-extrabold shadow-amber-500/20'
                            : 'text-gray-400 hover:text-gray-255 bg-transparent'
                        }`}
                      >
                        Compra Directa (0% Setup)
                      </button>
                    </div>

                    {/* Cost estimates visualization based on choice */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-mono border-t border-gray-800/40">
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase mb-1">Costo Base Unitario:</span>
                        <strong className="text-gray-300">{rawUnitPrice.toLocaleString()} s</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase mb-1">Setup Fee ({currentBuyMethod === 'order' ? '2.5%' : '0%'}):</span>
                        <strong className="text-amber-400">
                          {currentBuyMethod === 'order' 
                            ? Math.floor(rawUnitPrice * 0.025).toLocaleString() 
                            : '0'} s
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-800 text-xs flex justify-between items-center text-gray-400">
                      <span>Costo de Adquisición de Lote:</span>
                      <strong className="text-amber-400 font-extrabold font-mono text-sm">
                        {calculatedTotalInvestment.toLocaleString()} s
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Confirm Action Button */}
                <div className="mt-4 pt-4 border-t border-gray-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-1 max-w-[150px]">
                    <span className="text-[10px] text-gray-500 font-mono uppercase font-bold leading-none">Declarar:</span>
                    <input
                      type="number"
                      min="1"
                      max={mat.totalNeeded}
                      placeholder={mat.totalNeeded.toString()}
                      value={manualPurchaseInputs[mat.key] === 0 ? '' : (manualPurchaseInputs[mat.key] || '')}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setManualPurchaseInputs(prev => ({
                          ...prev,
                          [mat.key]: isNaN(val) ? 0 : Math.min(val, mat.totalNeeded)
                        }));
                      }}
                      className="w-16 bg-black border border-gray-700 text-white rounded px-2 py-1 text-center text-xs font-mono focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleCompleteManualBuy(mat)}
                    disabled={mat.totalNeeded <= 0}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer ${
                      mat.totalNeeded > 0
                        ? primaryColor
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/20'
                    }`}
                  >
                    <Check size={14} />
                    Compra Realizada
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
