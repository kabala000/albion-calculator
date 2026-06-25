/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  GlobalPricesState, 
  AlbionCity, 
  ItemTier, 
  EnchantmentLevel 
} from '../types';
import { 
  ALBION_CITIES,
  getMaterialRenderUrl,
  getArtifactRenderUrlByName,
  handleImageLoadError
} from '../data';
import { 
  DollarSign, 
  Coins, 
  CoinsIcon, 
  Building2, 
  Layers, 
  Sparkles, 
  Check, 
  Search, 
  History 
} from 'lucide-react';

interface PricePanelProps {
  globalPrices: GlobalPricesState;
  onUpdateMaterialPrice: (
    city: AlbionCity,
    materialType: 'lingotes' | 'tablas' | 'telas' | 'cueros',
    tier: ItemTier,
    enchantment: EnchantmentLevel,
    price: number
  ) => void;
  onUpdateArtifactPrice: (
    city: AlbionCity,
    artifactName: string,
    tier: ItemTier,
    price: number
  ) => void;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

export default function PricePanel({
  globalPrices,
  onUpdateMaterialPrice,
  onUpdateArtifactPrice,
  primaryColor,
  surfaceColor,
  borderColor,
}: PricePanelProps) {
  
  // Selection states
  const [activeCity, setActiveCity] = useState<AlbionCity>('Martlock');
  const [activeTier, setActiveTier] = useState<ItemTier>('T4');
  const [activeEnch, setActiveEnch] = useState<EnchantmentLevel>(0);

  // Success indicator triggers
  const [priceUpdatedAlert, setPriceUpdatedAlert] = useState<boolean>(false);

  // Get current selected records
  const cityPrices = globalPrices[activeCity];
  const pLingote = cityPrices.lingotes[activeTier]?.[activeEnch] || 0;
  const pTabla = cityPrices.tablas[activeTier]?.[activeEnch] || 0;
  const pTela = cityPrices.telas[activeTier]?.[activeEnch] || 0;
  const pCuero = cityPrices.cueros[activeTier]?.[activeEnch] || 0;

  // Compile list of unique artifacts in active prices list to let them edit
  const artifactNames = Object.keys(cityPrices.artefactos);

  // Trigger brief alert
  const triggerSaveAlert = () => {
    setPriceUpdatedAlert(true);
    setTimeout(() => setPriceUpdatedAlert(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      
      {/* Title section */}
      <div className={`p-5 rounded-xl border mb-6 flex flex-col md:flex-row justify-between items-start md:items-center ${surfaceColor} ${borderColor}`}>
        <div>
          <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
            <Coins className="text-amber-500 animate-spin-slow" size={20} />
            Gestión Centralizada de Precios de Albion
          </h2>
          <span className="text-xs text-gray-400 mt-1 block">
            Ingresa a mano los precios vigentes según los mercados del juego. Estos valores alimentan el calculador en tiempo real.
          </span>
        </div>

        {priceUpdatedAlert && (
          <div className="mt-4 md:mt-0 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-bounce">
            <Check size={14} />
            Precios sincronizados con éxito
          </div>
        )}
      </div>

      {/* FILTERS PANEL */}
      <div className={`p-5 rounded-xl border mb-6 ${surfaceColor} ${borderColor}`}>
        <span className="text-xs font-semibold text-gray-400 block mb-3 uppercase tracking-wider">
          Filtrar Mercado por Ciudad, Tier y Encantamiento
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* City select */}
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
              Ciudad de Mercado
            </label>
            <select
              value={activeCity}
              onChange={(e) => {
                setActiveCity(e.target.value as AlbionCity);
                triggerSaveAlert();
              }}
              className="w-full bg-black/40 border border-gray-750 text-white rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
            >
              {ALBION_CITIES.map((city) => (
                <option key={city} value={city} className="bg-neutral-900 text-white">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Tier buttons */}
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
              Tier del Recurso
            </label>
            <div className="grid grid-cols-5 gap-1">
              {(['T4', 'T5', 'T6', 'T7', 'T8'] as ItemTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    setActiveTier(tier);
                    triggerSaveAlert();
                  }}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeTier === tier
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60'
                      : 'bg-black/30 text-gray-500 hover:text-gray-300 border border-gray-800'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Enchantments buttons */}
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
              Nivel de Encantamiento
            </label>
            <div className="grid grid-cols-5 gap-1">
              {([0, 1, 2, 3, 4] as EnchantmentLevel[]).map((ench) => (
                <button
                  key={ench}
                  onClick={() => {
                    setActiveEnch(ench);
                    triggerSaveAlert();
                  }}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeEnch === ench
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60'
                      : 'bg-black/30 text-gray-500 hover:text-gray-300 border border-gray-800'
                  }`}
                >
                  .{ench}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* INPUTS FOR REFINED MATERIALS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        
        {/* Lingote Price */}
        <div className={`p-5 rounded-xl border text-center flex flex-col justify-between items-center ${surfaceColor} ${borderColor}`}>
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[#b49257] tracking-wider block mb-2">PRECIO UNITARIO</span>
            
            <div className="mb-3 relative w-16 h-16 flex items-center justify-center bg-[#0d1017]/80 hover:bg-[#121620] border border-gray-800 rounded-xl overflow-hidden shadow-inner group transition-all duration-200">
              <img 
                src={getMaterialRenderUrl('lingotes', activeTier, activeEnch)} 
                alt="Lingote Metal" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={handleImageLoadError}
              />
              <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/75 rounded text-[8px] font-mono font-bold text-amber-500 border border-amber-500/20">
                T{activeTier}
              </span>
            </div>

            <h4 className="font-serif font-bold text-white text-md mb-1">Lingote Metal</h4>
            <span className="text-xs bg-black/40 text-gray-400 font-mono py-0.5 px-2.5 rounded border border-gray-850">
              {activeTier}.{activeEnch}
            </span>
          </div>

          <div className="w-full mt-4 relative">
            <input
              type="number"
              min="0"
              value={pLingote === 0 ? '' : pLingote}
              onChange={(e) => {
                const price = parseInt(e.target.value);
                onUpdateMaterialPrice(activeCity, 'lingotes', activeTier, activeEnch, isNaN(price) ? 0 : price);
              }}
              className="w-full bg-black/40 border border-gray-750 text-white rounded-lg py-2 px-4 pr-10 text-center font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="0"
            />
            <CoinsIcon className="absolute right-3 top-2.5 w-4 h-4 text-amber-500/70" />
          </div>
        </div>

        {/* Tabla Price */}
        <div className={`p-5 rounded-xl border text-center flex flex-col justify-between items-center ${surfaceColor} ${borderColor}`}>
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[#b49257] tracking-wider block mb-2">PRECIO UNITARIO</span>
            
            <div className="mb-3 relative w-16 h-16 flex items-center justify-center bg-[#0d1017]/80 hover:bg-[#121620] border border-gray-800 rounded-xl overflow-hidden shadow-inner group transition-all duration-200">
              <img 
                src={getMaterialRenderUrl('tablas', activeTier, activeEnch)} 
                alt="Tabla de Madera" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={handleImageLoadError}
              />
              <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/75 rounded text-[8px] font-mono font-bold text-amber-500 border border-amber-500/20">
                T{activeTier}
              </span>
            </div>

            <h4 className="font-serif font-bold text-white text-md mb-1">Tabla de Madera</h4>
            <span className="text-xs bg-black/40 text-gray-400 font-mono py-0.5 px-2.5 rounded border border-gray-850">
              {activeTier}.{activeEnch}
            </span>
          </div>

          <div className="w-full mt-4 relative">
            <input
              type="number"
              min="0"
              value={pTabla === 0 ? '' : pTabla}
              onChange={(e) => {
                const price = parseInt(e.target.value);
                onUpdateMaterialPrice(activeCity, 'tablas', activeTier, activeEnch, isNaN(price) ? 0 : price);
              }}
              className="w-full bg-black/40 border border-gray-750 text-white rounded-lg py-2.5 px-4 pr-10 text-center font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="0"
            />
            <CoinsIcon className="absolute right-3 top-2.5 w-4 h-4 text-amber-500/70" />
          </div>
        </div>

        {/* Tela Price */}
        <div className={`p-5 rounded-xl border text-center flex flex-col justify-between items-center ${surfaceColor} ${borderColor}`}>
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[#b49257] tracking-wider block mb-2">PRECIO UNITARIO</span>
            
            <div className="mb-3 relative w-16 h-16 flex items-center justify-center bg-[#0d1017]/80 hover:bg-[#121620] border border-gray-800 rounded-xl overflow-hidden shadow-inner group transition-all duration-200">
              <img 
                src={getMaterialRenderUrl('telas', activeTier, activeEnch)} 
                alt="Tela Refinada" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={handleImageLoadError}
              />
              <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/75 rounded text-[8px] font-mono font-bold text-amber-500 border border-amber-500/20">
                T{activeTier}
              </span>
            </div>

            <h4 className="font-serif font-bold text-white text-md mb-1">Tela Refinada</h4>
            <span className="text-xs bg-black/40 text-gray-400 font-mono py-0.5 px-2.5 rounded border border-gray-850">
              {activeTier}.{activeEnch}
            </span>
          </div>

          <div className="w-full mt-4 relative">
            <input
              type="number"
              min="0"
              value={pTela === 0 ? '' : pTela}
              onChange={(e) => {
                const price = parseInt(e.target.value);
                onUpdateMaterialPrice(activeCity, 'telas', activeTier, activeEnch, isNaN(price) ? 0 : price);
              }}
              className="w-full bg-black/40 border border-gray-750 text-white rounded-lg py-2.5 px-4 pr-10 text-center font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="0"
            />
            <CoinsIcon className="absolute right-3 top-2.5 w-4 h-4 text-amber-500/70" />
          </div>
        </div>

        {/* Cuero Price */}
        <div className={`p-5 rounded-xl border text-center flex flex-col justify-between items-center ${surfaceColor} ${borderColor}`}>
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[#b49257] tracking-wider block mb-2">PRECIO UNITARIO</span>
            
            <div className="mb-3 relative w-16 h-16 flex items-center justify-center bg-[#0d1017]/80 hover:bg-[#121620] border border-gray-800 rounded-xl overflow-hidden shadow-inner group transition-all duration-200">
              <img 
                src={getMaterialRenderUrl('cueros', activeTier, activeEnch)} 
                alt="Cuero Curtido" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={handleImageLoadError}
              />
              <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/75 rounded text-[8px] font-mono font-bold text-amber-500 border border-amber-500/20">
                T{activeTier}
              </span>
            </div>

            <h4 className="font-serif font-bold text-white text-md mb-1">Cuero Curtido</h4>
            <span className="text-xs bg-black/40 text-gray-400 font-mono py-0.5 px-2.5 rounded border border-gray-850">
              {activeTier}.{activeEnch}
            </span>
          </div>

          <div className="w-full mt-4 relative">
            <input
              type="number"
              min="0"
              value={pCuero === 0 ? '' : pCuero}
              onChange={(e) => {
                const price = parseInt(e.target.value);
                onUpdateMaterialPrice(activeCity, 'cueros', activeTier, activeEnch, isNaN(price) ? 0 : price);
              }}
              className="w-full bg-black/40 border border-gray-750 text-white rounded-lg py-2.5 px-4 pr-10 text-center font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="0"
            />
            <CoinsIcon className="absolute right-3 top-2.5 w-4 h-4 text-amber-500/70" />
          </div>
        </div>

      </div>

      {/* INPUTS FOR ARTIFACTS IN THE ACTIVE TIER */}
      <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
        <div className="flex items-center gap-1.5 border-b border-gray-800 pb-3 mb-4">
          <Sparkles className="text-amber-400" size={17} />
          <h3 className="font-semibold text-white">Precios de Artefactos de Fabricación (Específicos de Tier {activeTier})</h3>
        </div>

        <p className="text-xs text-gray-400 mb-4 leading-normal">
          Los artefactos no se ven afectados por encantamientos, pero varían sustancialmente de precio según el Tier (.0 a .4 usan el mismo artefacto del tier base). Introduce aquí sus valores correspondientes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
          {artifactNames.map((artName) => {
            const currentPrice = cityPrices.artefactos[artName]?.[activeTier] || 0;
            return (
              <div 
                key={artName}
                className="p-3 bg-black/25 rounded-lg border border-gray-800/80 hover:border-gray-750 flex justify-between items-center transition-all duration-100 gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-11 h-11 shrink-0 bg-black/45 border border-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative shadow-inner">
                    <img 
                      src={getArtifactRenderUrlByName(artName, activeTier)} 
                      alt={artName} 
                      className="w-10 h-10 object-contain hover:scale-110 transition-transform duration-100"
                      referrerPolicy="no-referrer"
                      onError={handleImageLoadError}
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-serif font-semibold text-white leading-tight truncate" title={artName}>{artName}</h5>
                    <span className="text-[10px] text-gray-500 font-mono block mt-0.5">Unidad - {activeTier}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-[130px] shrink-0">
                  <input
                    type="number"
                    min="0"
                    value={currentPrice === 0 ? '' : currentPrice}
                    onChange={(e) => {
                      const price = parseInt(e.target.value);
                      onUpdateArtifactPrice(activeCity, artName, activeTier, isNaN(price) ? 0 : price);
                    }}
                    className="w-full bg-black border border-gray-700 rounded px-2.5 py-1 text-right text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-gray-500 font-bold font-mono">s</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
