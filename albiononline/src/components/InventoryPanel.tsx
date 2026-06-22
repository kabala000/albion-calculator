/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ItemTier, 
  EnchantmentLevel 
} from '../types';
import { 
  getMaterialRenderUrl, 
  getArtifactRenderUrlByName,
  handleImageLoadError
} from '../data';
import { 
  Archive, 
  Layers, 
  Sparkles, 
  Check, 
  Info,
  PackageCheck
} from 'lucide-react';

interface InventoryPanelProps {
  inventory: Record<string, number>; // key: materialKey -> quantity (e.g., "lingotes_T5_2")
  onUpdateInventoryQuantity: (materialKey: string, quantity: number) => void;
  activeCharName: string;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

export default function InventoryPanel({
  inventory,
  onUpdateInventoryQuantity,
  activeCharName,
  primaryColor,
  surfaceColor,
  borderColor,
}: InventoryPanelProps) {
  
  // Selection states
  const [activeTier, setActiveTier] = useState<ItemTier>('T4');
  const [activeEnch, setActiveEnch] = useState<EnchantmentLevel>(0);

  // Success indicator triggers
  const [invUpdatedAlert, setInvUpdatedAlert] = useState<boolean>(false);

  // Format keys to load quantities
  const lKey = `lingotes_${activeTier}_${activeEnch}`;
  const tKey = `tablas_${activeTier}_${activeEnch}`;
  const fKey = `telas_${activeTier}_${activeEnch}`;
  const cKey = `cueros_${activeTier}_${activeEnch}`;

  // Read current quantites
  const qLingote = inventory[lKey] || 0;
  const qTabla = inventory[tKey] || 0;
  const qTela = inventory[fKey] || 0;
  const qCuero = inventory[cKey] || 0;

  // List of unique artifacts to configure stockpile
  const artifactNames = [
    "Atadura antigua", "Relleno demoniaco", "Atadura Inscrita", "Garra de TejeVelos", "Greba Exaltada",
    "Cota de Malla Antigua", "Placas Demoniacas", "Pieles de Animal Precervadas", "Caparazon de TejeVelos",
    "Enchapado Exaltado", "Acolchado Antiguo", "Esquirlas Demoniacas", "Acolchado de Calavera Tallada",
    "Mandibulas de TejeVelos", "Viceras Exaltada", "Hoja Forjada con Sangre", "Hoja Demoniaca", "Hojas Malditas",
    "Restos del Rey Viejo", "Cristal Infinito", "Cabeza de Alabarda de Morgana", "Cabeza de Hoz Demoniaca",
    "Cabeza de Hachas de Guardian", "Recuerdos de Batallas Avaloniana", "Crital Afilado", "Roca Runica",
    "Cabeza de Maza Infernal", "Cabeza de Maza Imbuida", "Juramentos Rotos", "Cristal de la Tormenta",
    "Cabeza de Martillo Antigua", "Cabezas de Martillo Diabolicas", "Tronco Grabado", "Mano Metalica Masiva",
    "Cristal Crepitante", "Restos de Guardian", "Cuernos Demoniacos Rotos", "Placa de Cuervo Deforme",
    "Guantaletes Avalonianos Dañados", "Cristal Pulsantes", "Mecanismo Perdido de Ballesta", "Saetas Diabolicas",
    "Saetas Tentadoras", "Veleta de Zumbido Avaloniano", "Cristal de Luz", "Nucleo de Escudo Antiguo",
    "Nucleo de Escudo Infernal", "Puas Forjadas con Sangre", "Reliquia Avaloniana Destruida", "Cristal Inquebrantable"
  ];

  const handleUpdate = (key: string, value: number) => {
    onUpdateInventoryQuantity(key, value);
    setInvUpdatedAlert(true);
    setTimeout(() => setInvUpdatedAlert(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      
      {/* Title Block */}
      <div className={`p-5 rounded-xl border mb-6 flex flex-col md:flex-row justify-between items-start md:items-center ${surfaceColor} ${borderColor}`}>
        <div>
          <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
            <Archive className="text-amber-500" size={20} />
            Inventario Local de {activeCharName}
          </h2>
          <span className="text-xs text-gray-400 mt-1 block">
            Declara a mano el inventario físico de materiales que ya posees en el juego. Estará disponible para descontar en tus Compras.
          </span>
        </div>

        {invUpdatedAlert && (
          <div className="mt-4 md:mt-0 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-bounce">
            <Check size={14} />
            Stock actualizado en tiempo real
          </div>
        )}
      </div>

      {/* FILTERS PANEL */}
      <div className={`p-5 rounded-xl border mb-6 ${surfaceColor} ${borderColor}`}>
        <span className="text-xs font-semibold text-gray-400 block mb-3 uppercase tracking-wider">
          Seleccionar Tier y Encantamiento del Almacén
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Tier buttons */}
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
              Tier del Material
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['T4', 'T5', 'T6', 'T7', 'T8'] as ItemTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
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
              Encantamiento
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {([0, 1, 2, 3, 4] as EnchantmentLevel[]).map((ench) => (
                <button
                  key={ench}
                  onClick={() => setActiveEnch(ench)}
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

      {/* REFINED STOCK QUANTITIES INPUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        
        {/* Lingotes Quantity */}
        <div className={`p-5 rounded-xl border text-center flex flex-col justify-between items-center ${surfaceColor} ${borderColor}`}>
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block mb-2">CANTIDAD EN MANO</span>
            
            <div className="mb-3 relative w-16 h-16 flex items-center justify-center bg-[#0d1017]/80 hover:bg-[#121620] border border-gray-800 rounded-xl overflow-hidden shadow-inner group transition-all duration-200">
              <img 
                src={getMaterialRenderUrl('lingotes', activeTier, activeEnch)} 
                alt="Lingote Metal" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={handleImageLoadError}
              />
              <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/75 rounded text-[8px] font-mono font-bold text-yellow-500 border border-yellow-500/20">
                T{activeTier}
              </span>
            </div>

            <h4 className="font-serif font-bold text-white text-md mb-1">Lingote Metal</h4>
            <span className="text-xs bg-black/40 text-gray-400 font-mono py-0.5 px-2.5 rounded border border-gray-850">
              T{activeTier}.{activeEnch}
            </span>
          </div>

          <div className="w-full mt-4 relative">
            <input
              type="number"
              min="0"
              value={qLingote === 0 ? '' : qLingote}
              onChange={(e) => {
                const qty = parseInt(e.target.value);
                handleUpdate(lKey, isNaN(qty) ? 0 : qty);
              }}
              className="w-full bg-black/40 border border-gray-750 text-white rounded-lg py-2 px-3 text-center font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Tablas Quantity */}
        <div className={`p-5 rounded-xl border text-center flex flex-col justify-between items-center ${surfaceColor} ${borderColor}`}>
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block mb-2">CANTIDAD EN MANO</span>
            
            <div className="mb-3 relative w-16 h-16 flex items-center justify-center bg-[#0d1017]/80 hover:bg-[#121620] border border-gray-800 rounded-xl overflow-hidden shadow-inner group transition-all duration-200">
              <img 
                src={getMaterialRenderUrl('tablas', activeTier, activeEnch)} 
                alt="Tablas Madera" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={handleImageLoadError}
              />
              <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/75 rounded text-[8px] font-mono font-bold text-yellow-500 border border-yellow-500/20">
                T{activeTier}
              </span>
            </div>

            <h4 className="font-serif font-bold text-white text-md mb-1">Tablas Madera</h4>
            <span className="text-xs bg-black/40 text-gray-400 font-mono py-0.5 px-2.5 rounded border border-gray-850">
              T{activeTier}.{activeEnch}
            </span>
          </div>

          <div className="w-full mt-4 relative">
            <input
              type="number"
              min="0"
              value={qTabla === 0 ? '' : qTabla}
              onChange={(e) => {
                const qty = parseInt(e.target.value);
                handleUpdate(tKey, isNaN(qty) ? 0 : qty);
              }}
              className="w-full bg-black/40 border border-gray-750 text-white rounded-lg py-2 px-3 text-center font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Telas Quantity */}
        <div className={`p-5 rounded-xl border text-center flex flex-col justify-between items-center ${surfaceColor} ${borderColor}`}>
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block mb-2">CANTIDAD EN MANO</span>
            
            <div className="mb-3 relative w-16 h-16 flex items-center justify-center bg-[#0d1017]/80 hover:bg-[#121620] border border-gray-800 rounded-xl overflow-hidden shadow-inner group transition-all duration-200">
              <img 
                src={getMaterialRenderUrl('telas', activeTier, activeEnch)} 
                alt="Telas Fibra" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={handleImageLoadError}
              />
              <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/75 rounded text-[8px] font-mono font-bold text-yellow-500 border border-yellow-500/20">
                T{activeTier}
              </span>
            </div>

            <h4 className="font-serif font-bold text-white text-md mb-1">Telas Fibra</h4>
            <span className="text-xs bg-black/40 text-gray-400 font-mono py-0.5 px-2.5 rounded border border-gray-850">
              T{activeTier}.{activeEnch}
            </span>
          </div>

          <div className="w-full mt-4 relative">
            <input
              type="number"
              min="0"
              value={qTela === 0 ? '' : qTela}
              onChange={(e) => {
                const qty = parseInt(e.target.value);
                handleUpdate(fKey, isNaN(qty) ? 0 : qty);
              }}
              className="w-full bg-black/40 border border-gray-750 text-white rounded-lg py-2 px-3 text-center font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Cueros Quantity */}
        <div className={`p-5 rounded-xl border text-center flex flex-col justify-between items-center ${surfaceColor} ${borderColor}`}>
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block mb-2">CANTIDAD EN MANO</span>
            
            <div className="mb-3 relative w-16 h-16 flex items-center justify-center bg-[#0d1017]/80 hover:bg-[#121620] border border-gray-800 rounded-xl overflow-hidden shadow-inner group transition-all duration-200">
              <img 
                src={getMaterialRenderUrl('cueros', activeTier, activeEnch)} 
                alt="Cueros Piel" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={handleImageLoadError}
              />
              <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/75 rounded text-[8px] font-mono font-bold text-yellow-500 border border-yellow-500/20">
                T{activeTier}
              </span>
            </div>

            <h4 className="font-serif font-bold text-white text-md mb-1">Cueros Piel</h4>
            <span className="text-xs bg-black/40 text-gray-400 font-mono py-0.5 px-2.5 rounded border border-gray-850">
              T{activeTier}.{activeEnch}
            </span>
          </div>

          <div className="w-full mt-4 relative">
            <input
              type="number"
              min="0"
              value={qCuero === 0 ? '' : qCuero}
              onChange={(e) => {
                const qty = parseInt(e.target.value);
                handleUpdate(cKey, isNaN(qty) ? 0 : qty);
              }}
              className="w-full bg-black/40 border border-gray-750 text-white rounded-lg py-2 px-3 text-center font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="0"
            />
          </div>
        </div>

      </div>

      {/* ARTIFACT STOCKPILE CONTROLLER */}
      <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
        <div className="flex items-center gap-1.5 border-b border-gray-800 pb-3 mb-4">
          <Sparkles className="text-amber-400" size={17} />
          <h3 className="font-semibold text-white">Stock de Artefactos Propios (Nivel {activeTier})</h3>
        </div>

        <p className="text-xs text-gray-400 mb-4 leading-normal flex items-center gap-1.5">
          <Info size={14} className="text-amber-500" />
          <span>Escribe las cantidades que tienes guardadas en tus baúles o almacenes de la isla de gremio.</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
          {artifactNames.map((artName) => {
            const artifactKey = `artefacto_${artName}_${activeTier}`;
            const stockQty = inventory[artifactKey] || 0;
            
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
                    <span className="text-[10px] text-gray-500 font-mono block mt-0.5">Stock - {activeTier}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-[110px] shrink-0">
                  <input
                    type="number"
                    min="0"
                    value={stockQty === 0 ? '' : stockQty}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value);
                      handleUpdate(artifactKey, isNaN(qty) ? 0 : qty);
                    }}
                    className="w-full bg-black border border-gray-700 rounded px-2.5 py-1 text-right text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-gray-500 font-bold font-mono">ud</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
