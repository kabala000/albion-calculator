/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CraftingJob, 
  ItemTier, 
  EnchantmentLevel, 
  AlbionCity, 
  HistoryLog 
} from '../types';
import { 
  getAlbionRenderUrl, 
  getAlbionArtifactRenderUrl,
  getMaterialRenderUrl,
  getArtifactRenderUrlByName,
  handleImageLoadError
} from '../data';
import { 
  Hammer, 
  Trash2, 
  CheckCircle2, 
  X, 
  Clock, 
  Coins, 
  ArrowRight, 
  Activity, 
  UserSquare2, 
  CircleDollarSign,
  TrendingUp
} from 'lucide-react';

interface QueuePanelProps {
  queue: CraftingJob[];
  globalPremium: boolean;
  onCraftJob: (jobId: string, keepDiarios?: boolean) => void;
  onSellJob: (jobId: string, sellMethod: 'direct' | 'order', actualProfit: number) => void;
  onDeleteJobFromQueue: (jobId: string) => void;
  onUpdateJobDetails?: (jobId: string, updatedFields: Partial<CraftingJob>) => void;
  onPartialSellDirect: (jobId: string, qtySold: number, unitPrice: number, revenueRec: number, actualProfit: number) => void;
  onPlaceSellOrderList: (jobId: string, qtyToOrder: number, unitPrice: number, setupFee: number) => void;
  onExecuteSellOrderList: (jobId: string, listingId: string, qtySold: number, unitPrice: number, revenueRec: number, actualProfit: number) => void;
  onCancelSellOrderList: (jobId: string, listingId: string) => void;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

export default function QueuePanel({
  queue,
  globalPremium,
  onCraftJob,
  onSellJob,
  onDeleteJobFromQueue,
  onUpdateJobDetails,
  onPartialSellDirect,
  onPlaceSellOrderList,
  onExecuteSellOrderList,
  onCancelSellOrderList,
  primaryColor,
  surfaceColor,
  borderColor,
}: QueuePanelProps) {
  
  // Local states to adjust actual selling price during final sell, in case market fluctuated
  const [sellingPriceAdjustments, setSellingPriceAdjustments] = useState<Record<string, number>>({});
  const [sellingMethodSelections, setSellingMethodSelections] = useState<Record<string, 'direct' | 'order'>>({});
  const [saleInputQuantities, setSaleInputQuantities] = useState<Record<string, number>>({});
  const [confirmDiariosJobId, setConfirmDiariosJobId] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Celebration state
  const [celebration, setCelebration] = useState<{
    show: boolean;
    title: string;
    msg: string;
    silver: number;
    isProfit: boolean;
    profitVal: number;
    quantity: number;
    isLast: boolean;
  } | null>(null);

  const handleDirectSellClick = (
    job: CraftingJob,
    validPartialQty: number,
    adjustedSellPrice: number,
    directNetRevenue: number,
    directActualProfit: number,
    unsoldQty: number
  ) => {
    const isLast = (unsoldQty - validPartialQty) <= 0 && (!job.listings || job.listings.length === 0);

    let msg = "";
    let title = "¡Venta Completada!";
    if (isLast) {
      title = "¡Lote Completado con Éxito! 🎉";
      msg = `Lote de "${job.recipe.Item}" (x${job.quantity}) vendido con éxito total.`;
    } else {
      msg = `¡Venta de ${validPartialQty}x "${job.recipe.Item}" completada!`;
    }

    setCelebration({
      show: true,
      title,
      msg,
      silver: directNetRevenue,
      isProfit: directActualProfit >= 0,
      profitVal: directActualProfit,
      quantity: job.quantity,
      isLast
    });

    setTimeout(() => {
      setCelebration(null);
    }, 4000);

    onPartialSellDirect(job.id, validPartialQty, adjustedSellPrice, directNetRevenue, directActualProfit);
  };

  const handleExecuteSellOrderListClick = (
    job: CraftingJob,
    listingId: string,
    qtySold: number,
    unitPrice: number,
    listNetRevenue: number,
    listProfit: number,
    unsoldQty: number
  ) => {
    const activeListingsCount = job.listings ? job.listings.length : 0;
    const isLast = unsoldQty <= 0 && activeListingsCount <= 1;

    let msg = "";
    let title = "¡Venta de Orden Completada!";
    if (isLast) {
      title = "¡Lote Completado con Éxito! 🎉";
      msg = `Lote de "${job.recipe.Item}" (x${job.quantity}) vendido con éxito total.`;
    } else {
      msg = `¡Venta de ${qtySold}x "${job.recipe.Item}" por orden completada!`;
    }

    setCelebration({
      show: true,
      title,
      msg,
      silver: listNetRevenue,
      isProfit: listProfit >= 0,
      profitVal: listProfit,
      quantity: job.quantity,
      isLast
    });

    setTimeout(() => {
      setCelebration(null);
    }, 4000);

    onExecuteSellOrderList(job.id, listingId, qtySold, unitPrice, listNetRevenue, listProfit);
  };

  // Editing state
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);
  const [editSellPrice, setEditSellPrice] = useState<number>(0);
  const [editMaterialsCost, setEditMaterialsCost] = useState<number>(0);
  const [editReturnRate, setEditReturnRate] = useState<number>(0);

  const startEditing = (job: CraftingJob) => {
    setEditingJobId(job.id);
    setEditQuantity(job.quantity);
    setEditSellPrice(job.unitSellPrice);
    setEditMaterialsCost(job.materialsCost);
    setEditReturnRate(Math.round(job.returnRate * 1000) / 10); // show nicely like 24.8
  };

  const saveEdit = (id: string) => {
    if (onUpdateJobDetails) {
      onUpdateJobDetails(id, {
        quantity: Math.max(1, editQuantity),
        unitSellPrice: Math.max(0, editSellPrice),
        materialsCost: Math.max(0, editMaterialsCost),
        returnRate: Math.max(0, editReturnRate / 100)
      });
    }
    setEditingJobId(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      
      {/* Title block */}
      <div className={`p-5 rounded-xl border mb-6 flex flex-col md:flex-row justify-between items-start md:items-center ${surfaceColor} ${borderColor}`}>
        <div>
          <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
            <Hammer className="text-amber-500" size={20} />
            Cola de Crafteo y Control de Fabricación
          </h2>
          <span className="text-xs text-gray-400 mt-1 block">
            Monitorea el estatus de tus órdenes, confirma la compra de materiales, craftea e ingresa las ventas directamente.
          </span>
        </div>
        <div className="mt-4 md:mt-0 font-mono text-xs bg-black/30 border border-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-gray-300">
          <Clock size={13} className="text-amber-400" />
          <span>Cola Activa: <strong>{queue.length}</strong> items</span>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="text-center py-16 bg-black/20 border border-gray-850 rounded-xl max-w-xl mx-auto">
          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-spin duration-300" />
          <h3 className="text-md font-semibold text-white">Cola de Crafteo Vacía</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            No tienes configuraciones de fabricación activas. Ve al panel de **Crafteo** para diseñar y añadir una orden a esta fábrica.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {queue.map((job) => {
            const recipe = job.recipe;
            
            const lowerArtesano = ((recipe && recipe.Artesano) || '').toLowerCase();
            let professionId = 'WARRIOR';
            let professionName = 'Diario de Herrero (Lleno)';

            if (lowerArtesano.includes('mágico') || lowerArtesano.includes('magico') || lowerArtesano.includes('imbuidor') || lowerArtesano.includes('mago')) {
              professionId = 'MAGE';
              professionName = 'Diario de Herrero Mágico (Lleno)';
            } else if (lowerArtesano.includes('flechero') || lowerArtesano.includes('cazador') || lowerArtesano.includes('hunter') || lowerArtesano.includes('flecha')) {
              professionId = 'HUNTER';
              professionName = 'Diario de Flechero (Lleno)';
            }
            const cleanTierNum = job.tier.replace(/\D/g, '');
            const bookImageUrl = `https://render.albiononline.com/v1/item/T${cleanTierNum}_JOURNAL_${professionId}_FULL.png`;

            // Materials requirements checklist helper
            const lNeed = job.materialsPurchased.lingotes.needed;
            const lBought = job.materialsPurchased.lingotes.purchased;
            const lReady = lBought >= lNeed;

            const tNeed = job.materialsPurchased.tablas.needed;
            const tBought = job.materialsPurchased.tablas.purchased;
            const tReady = tBought >= tNeed;

            const fNeed = job.materialsPurchased.telas.needed;
            const fBought = job.materialsPurchased.telas.purchased;
            const fReady = fBought >= fNeed;

            const cNeed = job.materialsPurchased.cueros.needed;
            const cBought = job.materialsPurchased.cueros.purchased;
            const cReady = cBought >= cNeed;

            const aNeed = job.materialsPurchased.artefacto.needed;
            const aBought = job.materialsPurchased.artefacto.purchased;
            const aReady = aBought >= aNeed;

            // Is everything acquired
            const materialsComplete = lReady && tReady && fReady && cReady && aReady;

            // Selling details
            const activeSellMethod = sellingMethodSelections[job.id] || job.sellMethod;
            const adjustedSellPrice = sellingPriceAdjustments[job.id] !== undefined
              ? sellingPriceAdjustments[job.id]
              : job.unitSellPrice;

            const totalBaseSell = adjustedSellPrice * job.quantity;
            const setupFeeVal = activeSellMethod === 'order' ? Math.floor(totalBaseSell * 0.025) : 0;
            const transactionTaxVal = Math.round(totalBaseSell * (globalPremium ? 0.04 : 0.08));
            const totalSellTaxes = setupFeeVal + transactionTaxVal;
            const finalNetSellRevenue = totalBaseSell - transactionTaxVal;

            const baseCraftCost = job.materialsCost + job.stationFeeTotal;
            const realInvestmentTotal = baseCraftCost + setupFeeVal;

            const finalNetProfit = finalNetSellRevenue - realInvestmentTotal;
            const profitMargin = realInvestmentTotal > 0 ? (finalNetProfit / realInvestmentTotal) * 100 : 0;

            const unsoldQty = job.quantityUnsold !== undefined ? job.quantityUnsold : job.quantity;
            const partialQtyInput = saleInputQuantities[job.id] !== undefined ? saleInputQuantities[job.id] : unsoldQty;
            const validPartialQty = Math.max(1, Math.min(unsoldQty, partialQtyInput));

            const unitInvestmentCost = job.quantity > 0 ? (job.investmentTotal / job.quantity) : 0;
            const partialBaseSell = adjustedSellPrice * validPartialQty;
            
            const partialPremiumTax = Math.round(partialBaseSell * (globalPremium ? 0.04 : 0.08));
            const partialSetupFee = Math.floor(partialBaseSell * 0.025);

            // Calculations for DIRECT
            const directNetRevenue = partialBaseSell - partialPremiumTax;
            const directActualProfit = directNetRevenue - Math.round(unitInvestmentCost * validPartialQty);
            const directProfitMargin = partialBaseSell > 0 ? (directActualProfit / (unitInvestmentCost * validPartialQty)) * 100 : 0;

            // Calculations for PLACING ORDER
            const orderSetupFee = partialSetupFee;
            const orderExpectedNetRevenue = partialBaseSell - partialPremiumTax;
            const orderActualProfit = orderExpectedNetRevenue - Math.round(unitInvestmentCost * validPartialQty) - orderSetupFee;
            const orderProfitMargin = partialBaseSell > 0 ? (orderActualProfit / (unitInvestmentCost * validPartialQty)) * 100 : 0;

            if (editingJobId === job.id) {
              return (
                <div 
                  key={job.id}
                  className={`p-5 rounded-xl border flex flex-col justify-between relative overflow-hidden ${surfaceColor} border-amber-500/50 shadow-lg shadow-black/45`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3 border-b border-gray-800 pb-2.5">
                      <Hammer className="text-amber-500 animate-pulse" size={16} />
                      <h4 className="text-xs font-bold text-white uppercase font-sans">Editar Orden: {recipe.Item}</h4>
                    </div>

                    <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
                      Corrige la cantidad o los precios estimados de esta orden de fabricación seleccionada en cola.
                    </p>

                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <label className="block text-[10px] text-gray-450 mb-1 font-semibold uppercase tracking-wider">Cantidad de Lotes:</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-black/40 border border-gray-750 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-450 mb-1 font-semibold uppercase tracking-wider">Precio Venta Unitario Estimado (s):</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={editSellPrice}
                          onChange={(e) => setEditSellPrice(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-black/40 border border-gray-750 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-gray-450 mb-1 font-semibold uppercase tracking-wider">Costo Mats (s):</label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={editMaterialsCost}
                            onChange={(e) => setEditMaterialsCost(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-black/40 border border-gray-750 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-450 mb-1 font-semibold uppercase tracking-wider">Tasa Retorno (%):</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            value={editReturnRate}
                            onChange={(e) => setEditReturnRate(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full bg-black/40 border border-gray-750 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => saveEdit(job.id)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded cursor-pointer text-center ${primaryColor}`}
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={() => setEditingJobId(null)}
                      className="px-3 py-1.5 bg-black hover:bg-neutral-900 border border-gray-750 text-gray-400 hover:text-white text-xs font-bold rounded cursor-pointer text-center"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={job.id} 
                className={`p-5 rounded-xl border flex flex-col justify-between relative overflow-hidden ${surfaceColor} ${
                  job.status === 'crafted_selling' 
                    ? 'border-emerald-500/30 bg-emerald-500/5' 
                    : materialsComplete 
                      ? 'border-amber-500/30' 
                      : borderColor
                }`}
              >
                
                {/* Upper Details Block */}
                <div>
                  <div className="flex justify-between items-start mb-3 border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAlbionRenderUrl(recipe.Url_Item, job.tier, job.enchantment)}
                        alt={recipe.Item}
                        className="w-[60px] h-[60px] bg-neutral-900 border border-gray-750 p-1 rounded-lg"
                        referrerPolicy="no-referrer"
                        onError={handleImageLoadError}
                      />
                      <div>
                        <h4 className="font-serif font-bold text-white text-md leading-tight">
                          {recipe.Item}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono font-bold bg-neutral-800 text-amber-300 px-1.5 py-0.5 rounded border border-gray-700">
                            T{job.tier}.{job.enchantment}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {job.quantity} unidad(es)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 bg-amber-500/5 border border-amber-500/10 rounded-lg px-2.5 py-1 max-w-fit">
                          <img 
                            src={bookImageUrl} 
                            alt={professionName}
                            className="w-4 h-4 object-contain"
                            referrerPolicy="no-referrer"
                            onError={handleImageLoadError}
                          />
                          <span className="text-xs text-amber-400 font-mono">
                            <strong className="text-white font-extrabold">{job.quantity}</strong> libros necesarios ({professionName} T{job.tier})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {/* Badge of status */}
                      {job.status === 'completed' ? (
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          Completado
                        </span>
                      ) : job.status === 'crafted_selling' ? (
                        <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30 animate-pulse">
                          Vendiendo
                        </span>
                      ) : materialsComplete ? (
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                          Listo para Craftear
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-gray-400 bg-black/30 px-2 py-0.5 rounded border border-gray-800">
                          Faltan Materiales
                        </span>
                      )}

                      {/* Station fee total cost info */}
                      <p className="text-[10px] text-gray-500 font-mono mt-2 uppercase">
                        Ref. Tasa: {job.stationFeeRate} s / 100 n
                      </p>
                    </div>
                  </div>

                  {/* Materials Purchase breakdown Checklist */}
                  {job.status === 'pending_materials' && (
                    <div className="p-3 bg-black/45 rounded-lg border border-gray-800 space-y-2 mb-4">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1.5">
                        Suministro de Materiales Adquiridos:
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                        {lNeed > 0 && (
                          <div className={`flex justify-between items-center p-1.5 rounded-lg border ${lReady ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' : 'text-amber-300 bg-amber-500/5 border-amber-500/10'} gap-2 min-w-0`}>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-7 h-7 rounded bg-black/60 border border-gray-850 flex items-center justify-center shrink-0">
                                <img 
                                  src={getMaterialRenderUrl('lingotes', job.tier, job.enchantment)} 
                                  alt="Lingotes" 
                                  className="w-6 h-6 object-contain"
                                  referrerPolicy="no-referrer"
                                  onError={handleImageLoadError}
                                />
                              </div>
                              <span className="font-serif font-medium truncate">Lingotes</span>
                            </div>
                            <span className="font-bold font-mono shrink-0">{lBought} / {lNeed} <span className="text-[10px] text-gray-500">ud</span></span>
                          </div>
                        )}
                        {tNeed > 0 && (
                          <div className={`flex justify-between items-center p-1.5 rounded-lg border ${tReady ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' : 'text-amber-300 bg-amber-500/5 border-amber-500/10'} gap-2 min-w-0`}>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-7 h-7 rounded bg-black/60 border border-gray-850 flex items-center justify-center shrink-0">
                                <img 
                                  src={getMaterialRenderUrl('tablas', job.tier, job.enchantment)} 
                                  alt="Tablas" 
                                  className="w-6 h-6 object-contain"
                                  referrerPolicy="no-referrer"
                                  onError={handleImageLoadError}
                                />
                              </div>
                              <span className="font-serif font-medium truncate">Tablas</span>
                            </div>
                            <span className="font-bold font-mono shrink-0">{tBought} / {tNeed} <span className="text-[10px] text-gray-500">ud</span></span>
                          </div>
                        )}
                        {fNeed > 0 && (
                          <div className={`flex justify-between items-center p-1.5 rounded-lg border ${fReady ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' : 'text-amber-300 bg-amber-500/5 border-amber-500/10'} gap-2 min-w-0`}>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-7 h-7 rounded bg-black/60 border border-gray-850 flex items-center justify-center shrink-0">
                                <img 
                                  src={getMaterialRenderUrl('telas', job.tier, job.enchantment)} 
                                  alt="Telas" 
                                  className="w-6 h-6 object-contain"
                                  referrerPolicy="no-referrer"
                                  onError={handleImageLoadError}
                                />
                              </div>
                              <span className="font-serif font-medium truncate">Telas</span>
                            </div>
                            <span className="font-bold font-mono shrink-0">{fBought} / {fNeed} <span className="text-[10px] text-gray-500">ud</span></span>
                          </div>
                        )}
                        {cNeed > 0 && (
                          <div className={`flex justify-between items-center p-1.5 rounded-lg border ${cReady ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' : 'text-amber-300 bg-amber-500/5 border-amber-500/10'} gap-2 min-w-0`}>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-7 h-7 rounded bg-black/60 border border-gray-850 flex items-center justify-center shrink-0">
                                <img 
                                  src={getMaterialRenderUrl('cueros', job.tier, job.enchantment)} 
                                  alt="Cueros" 
                                  className="w-6 h-6 object-contain"
                                  referrerPolicy="no-referrer"
                                  onError={handleImageLoadError}
                                />
                              </div>
                              <span className="font-serif font-medium truncate">Cueros</span>
                            </div>
                            <span className="font-bold font-mono shrink-0">{cBought} / {cNeed} <span className="text-[10px] text-gray-500">ud</span></span>
                          </div>
                        )}
                        {aNeed > 0 && (
                          <div className={`flex justify-between items-center p-1.5 rounded-lg border ${aReady ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' : 'text-amber-300 bg-amber-500/5 border-amber-500/10'} gap-2 min-w-0`}>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-7 h-7 rounded bg-black/60 border border-gray-850 flex items-center justify-center shrink-0">
                                <img 
                                  src={getArtifactRenderUrlByName(recipe.Artefacto1, job.tier)} 
                                  alt={recipe.Artefacto1} 
                                  className="w-6 h-6 object-contain"
                                  referrerPolicy="no-referrer"
                                  onError={handleImageLoadError}
                                />
                              </div>
                              <span className="font-serif font-medium truncate">Artefacto</span>
                            </div>
                            <span className="font-bold font-mono shrink-0">{aBought} / {aNeed} <span className="text-[10px] text-gray-500">ud</span></span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Operational indicators layout */}
                  <div className="grid grid-cols-3 gap-3 p-2.5 bg-black/20 rounded-lg border border-gray-850 text-xs font-mono mb-4 text-center">
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase leading-none">Mat Costos:</span>
                      <strong className="text-white mt-1 block">{job.materialsCost.toLocaleString()} s</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase leading-none">Puesto Tasa:</span>
                      <strong className="text-white mt-1 block">{job.stationFeeTotal.toLocaleString()} s</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase leading-none">Total Invertido:</span>
                      <strong className="text-amber-400 mt-1 block">{job.investmentTotal.toLocaleString()} s</strong>
                    </div>
                  </div>

                  {/* Trigger craft action or display crafted panel */}
                  {materialsComplete && job.status !== 'crafted_selling' && (
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-center mb-4 space-y-2">
                      {confirmDiariosJobId === job.id ? (
                        <div className="bg-black/60 p-3 rounded-lg border border-amber-500/30 text-left space-y-2.5 animate-fade-in">
                          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1">
                            <Activity size={12} className="animate-pulse" />
                            ¿Quieres craftear este lote sin Diarios?
                          </h4>
                          <p className="text-[10px] text-gray-300 leading-normal font-sans">
                            {job.diariosReady ? (
                              "Los diarios están listos y completos. Si continúas con diarios, se sumarán los diarios llenos al almacén de tus trabajadores. Si decides omitirlos, aumentarán tus ganancias pero no llenarás diarios."
                            ) : (
                              "No posees los diarios vacíos requeridos todavía. Si decides craftear sin diarios, se omitirá el almacenamiento de diarios llenos."
                            )}
                          </p>
                          
                          {errorToast && (
                            <div className="p-1.5 bg-red-500/15 border border-red-500/25 text-red-400 text-[9px] rounded font-mono leading-tight">
                              {errorToast}
                            </div>
                          )}

                          <div className="flex flex-col gap-1.5 text-[10px] font-bold">
                            {job.diariosReady ? (
                              <button
                                onClick={() => {
                                  setErrorToast(null);
                                  onCraftJob(job.id, true);
                                  setConfirmDiariosJobId(null);
                                }}
                                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer text-center font-bold"
                              >
                                Sí, craftear con Diarios
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setErrorToast("Los diarios no están listos todavía. Cómpralos en la pestaña de Orden de Compra o agrega desde tu almacén de reservas. O selecciona 'Omitir Diarios y craftear ya'.");
                                }}
                                className="w-full py-1.5 bg-gray-800 text-gray-500 rounded cursor-pointer text-center font-bold"
                              >
                                Esperar a comprar Diarios (No)
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setErrorToast(null);
                                onCraftJob(job.id, false);
                                setConfirmDiariosJobId(null);
                              }}
                              className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded cursor-pointer text-center font-bold"
                            >
                              Omitir Diarios y craftear ya (Sí)
                            </button>

                            <button
                              onClick={() => {
                                setErrorToast(null);
                                setConfirmDiariosJobId(null);
                              }}
                              className="w-full py-1 bg-transparent hover:bg-white/5 text-gray-400 rounded cursor-pointer border border-gray-700 text-center font-bold"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-amber-200">
                            ¡Todos los requerimientos de materiales para este lote han sido completados con éxito!
                          </p>
                          <button
                            onClick={() => {
                              if (job.useDiarios) {
                                setConfirmDiariosJobId(job.id);
                              } else {
                                onCraftJob(job.id, false);
                              }
                            }}
                            className={`w-full mt-2 py-2 flex items-center justify-center gap-2 text-xs font-bold rounded-lg cursor-pointer ${primaryColor}`}
                          >
                            <Hammer size={14} />
                            Craftear Item
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* ACTIVE CRAFTED SELLING SUB-PANEL */}
                  {job.status === 'crafted_selling' && (
                    <div className="space-y-4 animate-fade-in mb-4">
                        <div className="p-4 bg-[#0a1912] rounded-lg border border-emerald-500/20 shadow-md">
                          <div className="flex justify-between items-center text-xs font-bold text-emerald-400 mb-1">
                            <span className="flex items-center gap-1.5 font-serif text-sm">
                              <TrendingUp size={15} />
                              Comercialización del Lote
                            </span>
                            <span className="font-mono text-[11px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                              {unsoldQty} unit. disponibles
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-gray-400 mb-3 font-mono">
                            Costo de Inversión unitario de este lote: <strong className="text-gray-200">{Math.round(unitInvestmentCost).toLocaleString()} silver</strong>
                          </p>

                          {/* Inputs group */}
                          <div className="grid grid-cols-2 gap-3 mt-1.5 pb-3 border-b border-gray-800">
                            <div>
                              <label className="block text-[10px] text-gray-500 uppercase font-mono tracking-wide mb-1">
                                Precio Venta Unitario (s):
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={adjustedSellPrice === 0 ? '' : adjustedSellPrice}
                                onChange={(e) => setSellingPriceAdjustments(prev => ({
                                  ...prev,
                                  [job.id]: parseInt(e.target.value) || 0
                                }))}
                                className="w-full bg-black border border-gray-750 rounded text-center py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                                placeholder={job.unitSellPrice.toLocaleString()}
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 uppercase font-mono tracking-wide mb-1">
                                Cantidad a Vender/Listar:
                              </label>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSaleInputQuantities(prev => ({ ...prev, [job.id]: 1 }))}
                                  className="px-2 py-1 bg-black hover:bg-neutral-900 border border-gray-700 text-[9px] font-mono text-gray-400 rounded cursor-pointer"
                                  title="Minimo"
                                >
                                  1
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={unsoldQty}
                                  value={partialQtyInput === 0 ? '' : partialQtyInput}
                                  onChange={(e) => {
                                    const v = parseInt(e.target.value);
                                    setSaleInputQuantities(prev => ({
                                      ...prev,
                                      [job.id]: isNaN(v) ? 0 : Math.min(v, unsoldQty)
                                    }));
                                  }}
                                  className="flex-1 bg-black border border-gray-750 rounded text-center py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                                  placeholder={unsoldQty.toString()}
                                />
                                <button
                                  type="button"
                                  onClick={() => setSaleInputQuantities(prev => ({ ...prev, [job.id]: unsoldQty }))}
                                  className="px-1.5 py-1 bg-black hover:bg-neutral-900 border border-gray-700 text-[9px] font-mono text-gray-400 rounded cursor-pointer"
                                  title="Máximo"
                                >
                                  MAX
                                </button>
                              </div>
                            </div>
                          </div>

                          {unsoldQty <= 0 ? (
                            <div className="py-4 text-center text-xs text-gray-500 italic">
                              No quedan más unidades libres por vender en este lote. Revisa las órdenes activas listadas abajo.
                            </div>
                          ) : (
                            /* Sub-actions split */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                              
                              {/* Option 1: DIRECT SELL */}
                              <div className="p-2.5 bg-black/40 rounded border border-gray-800 space-y-1 text-center">
                                <span className="text-[9px] uppercase font-bold text-gray-500 block">Venta Directa (Instant)</span>
                                <div className="text-[11px] font-mono text-gray-400 space-y-0.5">
                                  <div className="flex justify-between">
                                    <span>Comisión ({globalPremium ? '4%' : '8%'}):</span>
                                    <span>-{partialPremiumTax.toLocaleString()} s</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Recibido Neto:</span>
                                    <strong className="text-gray-200">{directNetRevenue.toLocaleString()} s</strong>
                                  </div>
                                  <div className="flex justify-between border-t border-gray-800/60 pt-1 mt-1 text-xs">
                                    <span>Beneficio:</span>
                                    <strong className={directActualProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                      {directActualProfit >= 0 ? '+' : ''}{directActualProfit.toLocaleString()} s ({directProfitMargin.toFixed(1)}%)
                                    </strong>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDirectSellClick(job, validPartialQty, adjustedSellPrice, directNetRevenue, directActualProfit, unsoldQty)}
                                  className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] uppercase tracking-wide cursor-pointer select-none transition-colors"
                                >
                                  Vender Directo ✓
                                </button>
                              </div>

                              {/* Option 2: PLACE SELL ORDER */}
                              <div className="p-2.5 bg-black/40 rounded border border-gray-800 space-y-1 text-center">
                                <span className="text-[9px] uppercase font-bold text-gray-500 block">Crear Orden de Venta</span>
                                <div className="text-[11px] font-mono text-gray-400 space-y-0.5">
                                  <div className="flex justify-between">
                                    <span>Tasa Setup (2.5% hoy):</span>
                                    <span className="text-amber-400">-{orderSetupFee.toLocaleString()} s</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Esperado al vender:</span>
                                    <strong className="text-gray-200">{orderExpectedNetRevenue.toLocaleString()} s</strong>
                                  </div>
                                  <div className="flex justify-between border-t border-gray-800/60 pt-1 mt-1 text-xs">
                                    <span>Beneficio Real:</span>
                                    <strong className={orderActualProfit >= 0 ? 'text-cyan-400' : 'text-red-400'}>
                                      {orderActualProfit >= 0 ? '+' : ''}{orderActualProfit.toLocaleString()} s ({orderProfitMargin.toFixed(1)}%)
                                    </strong>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => onPlaceSellOrderList(job.id, validPartialQty, adjustedSellPrice, orderSetupFee)}
                                  className="w-full mt-2 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded text-[10px] uppercase tracking-wide cursor-pointer select-none transition-colors"
                                >
                                  Crear Orden de Venta
                                </button>
                              </div>

                            </div>
                          )}
                        </div>

                        {/* List Active Listings */}
                        {job.listings && job.listings.length > 0 && (
                          <div className="p-3 bg-black/35 rounded-lg border border-gray-800">
                            <strong className="text-[11px] uppercase text-gray-400 font-mono tracking-wider block mb-2 font-bold">
                              Colocaciones en Mercado de Albion (Órdenes Activas):
                            </strong>
                            <div className="space-y-2">
                              {job.listings.map((list) => {
                                const listBaseSell = list.price * list.quantity;
                                const listPremiumTax = Math.round(listBaseSell * (globalPremium ? 0.04 : 0.08));
                                const listNetRevenue = listBaseSell - listPremiumTax; // setup fee already deducted when created
                                const listProfit = listNetRevenue - Math.round(unitInvestmentCost * list.quantity);
                                const listMargin = listBaseSell > 0 ? (listProfit / (unitInvestmentCost * list.quantity)) * 100 : 0;

                                return (
                                  <div 
                                    key={list.id} 
                                    className="p-2.5 rounded bg-[#101014] border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                                  >
                                    <div className="text-xs">
                                      <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                        <strong className="text-white font-mono">{list.quantity} u</strong>
                                        <span className="text-gray-450 text-[10px]">a</span>
                                        <strong className="text-amber-300 font-mono">{list.price.toLocaleString()} s</strong>
                                        <span className="text-gray-500 text-[9px]">(Setup pagado: {list.setupFeePaid.toLocaleString()} s)</span>
                                      </div>
                                      <div className="text-[10px] text-gray-450 font-mono mt-0.5">
                                        Ingreso al liquidar: <strong className="text-gray-300">{listNetRevenue.toLocaleString()} s</strong> |
                                        Beneficio: <strong className={listProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}>{listProfit >= 0 ? '+' : ''}{listProfit.toLocaleString()} s ({listMargin.toFixed(1)}%)</strong>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-1 w-full md:w-auto shrink-0 justify-end">
                                      <button
                                        type="button"
                                        onClick={() => handleExecuteSellOrderListClick(job, list.id, list.quantity, list.price, listNetRevenue, listProfit, unsoldQty)}
                                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/20 text-white font-bold rounded text-[10px] cursor-pointer"
                                      >
                                        Se Vendió ✓
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => onCancelSellOrderList(job.id, list.id)}
                                        className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded text-[10px] cursor-pointer"
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {!materialsComplete && (
                    <div className="text-[10px] text-gray-500 p-2 border border-gray-800/40 border-dashed rounded-lg bg-black/10 flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>Compra los materiales en el panel <strong>Orden de Compra</strong> para comenzar a craftear este item.</span>
                    </div>
                  )}

                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span>Destino: {job.sellCity}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEditing(job)}
                      className="flex items-center gap-1 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Editar parámetros de esta orden"
                    >
                      <Hammer size={13} className="text-amber-500" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => onDeleteJobFromQueue(job.id)}
                      className="flex items-center gap-1 text-gray-550 hover:text-red-400 transition-colors cursor-pointer"
                      title="Eliminar de la cola de crafteo"
                    >
                      <Trash2 size={13} />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
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
              <h4 className="text-emerald-400 font-extrabold font-mono text-xs uppercase tracking-widest">{celebration.title}</h4>
              <p className="text-white text-md font-bold font-serif leading-snug">{celebration.msg}</p>
            </div>
            <div className="bg-slate-950 py-3.5 px-4 rounded-xl border border-slate-850/80 space-y-1">
              <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Ingreso Neto Recibido</span>
              <span className="text-xl font-black text-emerald-400 font-mono tracking-wide">+{celebration.silver.toLocaleString()} S</span>
              {celebration.profitVal !== undefined && (
                <div className="border-t border-slate-800/60 pt-1 mt-1.5">
                  <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">Beneficio de Venta</span>
                  <span className={`text-sm font-bold font-mono ${celebration.profitVal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {celebration.profitVal >= 0 ? '+' : ''}{celebration.profitVal.toLocaleString()} S
                  </span>
                </div>
              )}
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
