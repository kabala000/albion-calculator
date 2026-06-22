/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Character } from '../types';
import { Shield, User, Coins, ChevronRight, Plus, Trash2, Swords } from 'lucide-react';

interface LoginPanelProps {
  characters: Character[];
  activeCharName: string;
  onSelectCharacter: (name: string) => void;
  onAddCharacter: (character: Character) => void;
  onDeleteCharacter: (name: string) => void;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

export default function LoginPanel({
  characters,
  activeCharName,
  onSelectCharacter,
  onAddCharacter,
  onDeleteCharacter,
  primaryColor,
  surfaceColor,
  borderColor,
}: LoginPanelProps) {
  const [newCharName, setNewCharName] = useState('');
  const [newCharCapital, setNewCharCapital] = useState<number>(1000000); // Default 1M silver

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim()) return;

    const exists = characters.find(
      (c) => c.name.toLowerCase() === newCharName.trim().toLowerCase()
    );

    if (exists) {
      onSelectCharacter(exists.name);
    } else {
      onAddCharacter({
        name: newCharName.trim(),
        capital: newCharCapital,
      });
      onSelectCharacter(newCharName.trim());
    }
    setNewCharName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-4">
      {/* Introduction Card */}
      <div className={`lg:col-span-12 p-6 rounded-xl border text-center relative overflow-hidden ${surfaceColor} ${borderColor}`}>
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-12 -translate-y-12">
          <Shield size={240} className="text-amber-500" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/30">
              <Swords className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2 font-serif">
            Gestor de Capital y Crafteo de Albion Online
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Optimiza tus operaciones de herrería y fabricación de armas. Registra tu capital inicial,
            automatiza los cálculos de tasa de uso del puesto, gestiona tu inventario local, estima impuestos con o sin
            Premium, y planifica tus compras de materiales con precisión matemática.
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className={`lg:col-span-5 p-6 rounded-xl border flex flex-col justify-between ${surfaceColor} ${borderColor}`}>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <User size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Ingresar Personaje</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Nombre del Personaje
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  placeholder="Ej: GalahadTheGreat"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg py-2.5 pl-3 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
                <User className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Capital Inicial (Silver)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  required
                  value={newCharCapital === 0 ? '' : newCharCapital}
                  onChange={(e) => {
                    const price = parseInt(e.target.value);
                    setNewCharCapital(isNaN(price) ? 0 : price);
                  }}
                  placeholder="Ej: 5,000,000"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg py-2.5 pl-3 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
                <Coins className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
              </div>
              <p className="mt-1 text-xs text-gray-500 italic">
                El silver que tienes disponible en el juego para invertir en esta sesión.
              </p>
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${primaryColor}`}
            >
              Iniciar Operaciones
              <ChevronRight size={16} />
            </button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800/60">
          <div className="flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
            <span className="font-semibold text-amber-400 uppercase tracking-widest text-[10px]">Guardado Automático:</span>
            <span className="text-gray-400">Toda tu información se retiene localmente en tu navegador.</span>
          </div>
        </div>
      </div>

      {/* Active Characters List */}
      <div className={`lg:col-span-7 p-6 rounded-xl border flex flex-col ${surfaceColor} ${borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Shield size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Seleccionar Personaje Activo</h3>
          </div>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-md font-mono">
            {characters.length} registrado(s)
          </span>
        </div>

        {characters.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center bg-black/10 rounded-lg border border-gray-800/40 border-dashed">
            <User size={40} className="text-gray-600 mb-2" />
            <p className="text-sm text-gray-400">No hay personajes registrados aún.</p>
            <p className="text-xs text-gray-500 mt-1">Crea tu primer personaje a la izquierda para comenzar.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[300px]">
            {characters.map((char) => {
              const isActive = char.name === activeCharName;
              return (
                <div
                  key={char.name}
                  onClick={() => onSelectCharacter(char.name)}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/5'
                      : 'bg-black/25 border-gray-800 hover:border-gray-700 hover:bg-black/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-amber-400 animate-pulse' : 'bg-gray-600'}`} />
                    <div>
                      <h4 className="font-semibold text-sm text-white font-mono">{char.name}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Coins size={12} className="text-amber-500/80" />
                        <span className="font-mono text-amber-400 font-bold">
                          {char.capital.toLocaleString()}
                        </span>{' '}
                        Sliver
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold text-black bg-amber-400 px-2 py-0.5 rounded-md self-center">
                        Activo
                      </span>
                    )}
                    <button
                      onClick={() => onDeleteCharacter(char.name)}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors duration-150 cursor-pointer"
                      title="Eliminar personaje"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-800/60 flex justify-between text-xs text-gray-500 font-serif italic text-right">
          <span>Albion Crafting v1.0.0</span>
          <span>Sincronizado</span>
        </div>
      </div>
    </div>
  );
}
