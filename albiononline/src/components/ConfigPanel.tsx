/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ALBION_OST_TRACKS } from '../App';
import { 
  VisualTheme, 
  VisualTemplate,
  HistoryLog, 
  Character 
} from '../types';
import { 
  Settings, 
  Palette, 
  Coins, 
  BarChart3, 
  History, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  LayoutGrid,
  Cloud,
  CloudDownload,
  Copy,
  RefreshCw
} from 'lucide-react';

interface ConfigPanelProps {
  activeTheme: VisualTheme;
  onChangeTheme: (theme: VisualTheme) => void;
  activeTemplate: VisualTemplate;
  onChangeTemplate: (template: VisualTemplate) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  activeTrackId: string;
  setActiveTrackId: (id: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
  character: Character;
  onUpdateCapital: (newCapital: number) => void;
  historyLogs: HistoryLog[];
  onClearHistory: () => void;
  onUpdateEntireState: (importedStateJson: string) => boolean;
  onGetFullBackupState: () => string;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
  syncId: string;
  cloudStatus: 'loading' | 'saved' | 'saving' | 'error' | 'idle';
  cloudError: string | null;
  onLoadFromSyncId: (code: string) => Promise<{ success: boolean; error?: string }>;
}

export default function ConfigPanel({
  activeTheme,
  onChangeTheme,
  activeTemplate,
  onChangeTemplate,
  isPlaying,
  setIsPlaying,
  activeTrackId,
  setActiveTrackId,
  volume,
  setVolume,
  character,
  onUpdateCapital,
  historyLogs,
  onClearHistory,
  onUpdateEntireState,
  onGetFullBackupState,
  primaryColor,
  surfaceColor,
  borderColor,
  syncId,
  cloudStatus,
  cloudError,
  onLoadFromSyncId,
}: ConfigPanelProps) {
  
  // Local states
  const [editedCapitalText, setEditedCapitalText] = useState<string>(character.capital.toString());
  const [capitalAlert, setCapitalAlert] = useState<boolean>(false);
  const [backupJsonText, setBackupJsonText] = useState<string>('');
  const [backupAlert, setBackupAlert] = useState<{ status: 'success' | 'error' | null; msg: string }>({ status: null, msg: '' });
  const [syncInputCode, setSyncInputCode] = useState<string>('');
  const [syncAlert, setSyncAlert] = useState<{ status: 'success' | 'error' | null; msg: string }>({ status: null, msg: '' });
  const [isCopying, setIsCopying] = useState<boolean>(false);

  // Handle Capital update
  const handleSaveCapital = (e: React.FormEvent) => {
    e.preventDefault();
    const cap = parseInt(editedCapitalText);
    if (!isNaN(cap) && cap >= 0) {
      onUpdateCapital(cap);
      setCapitalAlert(true);
      setTimeout(() => setCapitalAlert(false), 2000);
    }
  };

  const handleLoadCloudDataDesc = async () => {
    if (!syncInputCode.trim()) {
      setSyncAlert({ status: 'error', msg: 'Por favor introduce un código de sincronización válido.' });
      return;
    }
    setSyncAlert({ status: 'success', msg: 'Conectando con la nube...' });
    const result = await onLoadFromSyncId(syncInputCode);
    if (result.success) {
      setSyncAlert({ status: 'success', msg: '¡Datos de la nube sincronizados con éxito!' });
      setSyncInputCode('');
    } else {
      setSyncAlert({ status: 'error', msg: result.error || 'No se pudieron descargar los datos.' });
    }
  };

  const handleCopyCode = () => {
    if (!syncId) return;
    navigator.clipboard.writeText(syncId);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2500);
  };

  // Generate Backup content in textbox
  const handleLoadExportData = () => {
    const backupStr = onGetFullBackupState();
    setBackupJsonText(backupStr);
    setBackupAlert({ status: 'success', msg: 'Base de datos exportada. Copia el texto inferior.' });
  };

  // Handle Import database content
  const handleImportData = () => {
    if (!backupJsonText.trim()) {
      setBackupAlert({ status: 'error', msg: 'Introduce un texto JSON válido para importar.' });
      return;
    }
    const success = onUpdateEntireState(backupJsonText);
    if (success) {
      setBackupAlert({ status: 'success', msg: '¡Base de datos importada y restaurada con éxito!' });
      setBackupJsonText('');
    } else {
      setBackupAlert({ status: 'error', msg: 'Formato incorrecto o datos dañados. No se importó.' });
    }
  };

  // 1. Theme parameters list
  const themeList: { key: VisualTheme; title: string; desc: string; previewClass: string }[] = [
    { 
      key: 'crystal_neon', 
      title: 'Multiverso de Cristal y Neón (Cyber)', 
      desc: 'Plantilla de vidrio soplado translúcido con orbes y bordes eléctricos de neón cian y áureo.', 
      previewClass: 'bg-slate-900 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
    },
    { 
      key: 'spectral_ghoul', 
      title: 'Espectro Fantasmal (Phantom)', 
      desc: 'Efectos translúcidos de niebla verde esmeralda y destellos violetas de neón.', 
      previewClass: 'bg-[#040807] border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' 
    },
    { 
      key: 'sunset_desert', 
      title: 'Atardecer en el Desierto (Terracotta)', 
      desc: 'Colores cálidos del ocaso, naranjas cobre, arenas doradas y acogedores efectos acogedores.', 
      previewClass: 'bg-[#150a05] border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' 
    },
    { 
      key: 'royal_classic', 
      title: 'Monarquía Clásica (Slate)', 
      desc: 'El look oficial de las ciudades reales de Albion. Gris pizarra y filamentos dorados.', 
      previewClass: 'bg-[#10151E] border-amber-500/50' 
    },
    { 
      key: 'outlands_abyss', 
      title: 'Abismo de Tierras Negras (Crimson)', 
      desc: 'Inspirado en la hostilidad de Zona Negra. Negro puro y acentos de fuego.', 
      previewClass: 'bg-[#0B0C10] border-red-500/50' 
    },
    { 
      key: 'avalonian_glory', 
      title: 'Esplendor Avaloniano (Light)', 
      desc: 'Limpieza visual de los caminos antiguos. Blanco imperial y texturas áuricas.', 
      previewClass: 'bg-[#F0F2F5] border-yellow-500/50 text-[#121212]' 
    },
    { 
      key: 'celtic_woodlands', 
      title: 'Arboleda Celta (Emerald)', 
      desc: 'La frescura mágica de Lymhurst. Verdes musgosos y grabados druídicos.', 
      previewClass: 'bg-[#0A1A12] border-emerald-500/50' 
    },
    { 
      key: 'brutalist_iron', 
      title: 'Hierro Brutalista (Indus)', 
      desc: 'Para mercaderes pragmáticos. Cimentación metálica y altísimo contraste gris.', 
      previewClass: 'bg-[#121212] border-gray-500/50' 
    },
  ];

  const templateList = [
    { 
      key: 'classic_panel' as VisualTemplate, 
      title: 'Panel Tradicional de Albion', 
      desc: 'El diseño clásico con listas espaciosas, bordes amplios y control total estructurado.', 
      previewClass: 'border-dashed border-2 border-gray-650' 
    },
    { 
      key: 'compact_bento' as VisualTemplate, 
      title: 'Cuadrícula Bento Compacta', 
      desc: 'Información concentrada de alta densidad con esquinas redondeadas y micro-gaps.', 
      previewClass: 'grid grid-cols-2 gap-1 border border-gray-750 p-1' 
    },
    { 
      key: 'split_minimalist' as VisualTemplate, 
      title: 'Diseño Dividido Minimalista', 
      desc: 'Enfoque limpio centrado, altos márgenes de respiración visual y menor distracción.', 
      previewClass: 'flex gap-1 items-center justify-center border border-gray-750/50' 
    },
  ];

  // 2. SVG Analytics Graph calculations (grouped by Month-Year or Date)
  const chartData = useMemo(() => {
    // Group profits per date key
    const groups: Record<string, number> = {};
    
    // Seed at least some dynamic months to make chart look gorgeous on initial inspect
    const sortedLogs = [...historyLogs].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    
    // If no real logs yet, let's inject simple placeholder structures to demonstrate visual performance
    if (sortedLogs.length === 0) {
      return [
        { label: 'Enero', value: 1200000 },
        { label: 'Febrero', value: 2400000 },
        { label: 'Marzo', value: 1800000 },
        { label: 'Abril', value: 3900000 },
        { label: 'Mayo', value: 3100000 },
        { label: 'Mes actual', value: 0 }
      ];
    }

    sortedLogs.forEach(log => {
      // Create a nice visual label from timestamp (e.g., June 2026 or just Short Date)
      const date = new Date(log.timestamp);
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const label = `${months[date.getMonth()]} ${date.getFullYear() % 100}`;
      
      groups[label] = (groups[label] || 0) + log.profit;
    });

    return Object.entries(groups).map(([label, val]) => ({
      label,
      value: val
    }));
  }, [historyLogs]);

  // Max value for SVG height scaling
  const maxChartValue = useMemo(() => {
    const vals = chartData.map(d => Math.abs(d.value));
    const max = Math.max(...vals);
    return max === 0 ? 1000000 : max;
  }, [chartData]);

  // Overall calculations of closed ledger
  const aggregates = useMemo(() => {
    let totalInv = 0;
    let totalRev = 0;
    let totalProfit = 0;

    historyLogs.forEach(log => {
      totalInv += log.investmentCost;
      totalRev += log.revenueReceived;
      totalProfit += log.profit;
    });

    return {
      totalInv,
      totalRev,
      totalProfit,
      avgROI: totalInv > 0 ? ((totalProfit / totalInv) * 100).toFixed(1) : '0'
    };
  }, [historyLogs]);

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-8">
      
      {/* ROW 1: Settings and Visual Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Customizer Panel */}
        <div className={`lg:col-span-8 p-5 rounded-xl border flex flex-col justify-between ${surfaceColor} ${borderColor}`}>
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
              <Palette className="text-amber-500" size={18} />
              <h3 className="font-semibold text-white">Selector de Temas Visuales</h3>
            </div>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Modifica instantáneamente el estilo estético de la interfaz para que ruede perfectamente según tu ambiente de crafteo.
            </p>

            <div className="space-y-2.5">
              {themeList.map((theme) => {
                const isSelected = theme.key === activeTheme;
                return (
                  <div
                    key={theme.key}
                    onClick={() => onChangeTheme(theme.key)}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/70 shadow-md shadow-amber-500/5'
                        : 'bg-black/25 border-gray-800 hover:border-gray-750 hover:bg-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs ${theme.previewClass}`}>
                        Alb
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{theme.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{theme.desc}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold text-black bg-amber-400 px-2 py-0.5 rounded-md">
                        Seleccionado
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Capital Balance Editor */}
        <div className={`lg:col-span-4 p-5 rounded-xl border flex flex-col justify-between ${surfaceColor} ${borderColor}`}>
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
              <Coins className="text-amber-500" size={18} />
              <h3 className="font-semibold text-white">Configurar Capital Inicial</h3>
            </div>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              ¿Retiraste fondos del juego o depositaste para comprar más materiales? Corrige la tesorería de tu personaje activo aquí.
            </p>

            <form onSubmit={handleSaveCapital} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
                  Capital de {character.name} (Silver)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editedCapitalText}
                  onChange={(e) => setEditedCapitalText(e.target.value)}
                  className="w-full bg-black/40 border border-gray-750 rounded-lg px-3 py-2 text-sm text-white font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {capitalAlert && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded text-center font-bold">
                  ✓ Presupuesto actualizado con éxito
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${primaryColor}`}
              >
                Guardar Presupuesto
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-gray-800/80 mt-6 grid grid-cols-2 gap-2 text-center font-mono">
            <div className="bg-black/30 p-2 rounded border border-gray-850">
              <span className="text-[9px] text-gray-500 block uppercase font-bold">Nombre Char:</span>
              <span className="text-xs text-white truncate font-bold block mt-0.5">{character.name}</span>
            </div>
            <div className="bg-black/30 p-2 rounded border border-gray-850">
              <span className="text-[9px] text-gray-500 block uppercase font-bold">Saldo Guardado:</span>
              <span className="text-xs text-amber-400 font-bold block mt-0.5">{character.capital.toLocaleString()} s</span>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 2: Layout Template Selector and Music OST Reproductor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Template Selector */}
        <div className={`lg:col-span-7 p-5 rounded-xl border flex flex-col justify-between ${surfaceColor} ${borderColor}`}>
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
              <LayoutGrid className="text-amber-500" size={18} />
              <h3 className="font-semibold text-white">Selector de Plantillas de Diseño</h3>
            </div>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Elige cómo se presentará la estructura y densidad visual de la aplicación. Cambia instantáneamente la distribución de bento, dividido o tradicional.
            </p>

            <div className="space-y-2.5">
              {templateList.map((tmpl) => {
                const isSelected = tmpl.key === activeTemplate;
                return (
                  <div
                    key={tmpl.key}
                    onClick={() => onChangeTemplate(tmpl.key)}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/70 shadow-md shadow-amber-500/5'
                        : 'bg-black/25 border-gray-800 hover:border-gray-750 hover:bg-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-[8px] uppercase ${tmpl.previewClass}`}>
                        UI
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{tmpl.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{tmpl.desc}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold text-black bg-amber-400 px-2 py-0.5 rounded-md">
                        Activo
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Albion OST Music Reproductor */}
        <div className={`lg:col-span-5 p-5 rounded-xl border flex flex-col justify-between ${surfaceColor} ${borderColor}`}>
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
              <Music className="text-amber-500" size={18} />
              <h3 className="font-semibold text-white">Albion Online OST Reproductor</h3>
            </div>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Disfruta de la banda sonora oficial de Albion Online mientras gestionas tu capital y crafteos sin salir de la app.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
                  Seleccionar Pista OST:
                </label>
                <select
                  value={activeTrackId}
                  onChange={(e) => {
                    setActiveTrackId(e.target.value);
                    setIsPlaying(true);
                  }}
                  className="w-full bg-black/40 border border-gray-750 text-xs rounded-lg p-2.5 text-white font-sans focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {ALBION_OST_TRACKS.map(track => (
                    <option key={track.id} value={track.id} className="bg-neutral-900 text-xs text-gray-300">
                      {track.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Player widget */}
              <div className="flex items-center gap-3 bg-black/25 border border-gray-850 p-3 rounded-lg">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500 hover:bg-amber-450 text-black font-bold transition-all cursor-pointer shadow-md shadow-amber-500/10"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1 font-mono">
                    <span>Volumen OST:</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {volume === 0 ? (
                      <VolumeX size={15} className="text-gray-500 cursor-pointer" onClick={() => setVolume(0.3)} />
                    ) : (
                      <Volume2 size={15} className="text-amber-500 cursor-pointer" onClick={() => setVolume(0)} />
                    )}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-gray-850 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Now playing indicator */}
              <div className="p-2.5 bg-[#10141d]/80 border border-gray-850/60 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-2 w-full">
                  <div className="relative flex items-center justify-center font-sans shrink-0">
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-gray-500'}`} />
                    <div className={`absolute w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">
                      {isPlaying ? 'Reproduciendo Hilo' : 'En Pausa'}
                    </span>
                    <span className="text-xs text-white block truncate font-medium">
                      {ALBION_OST_TRACKS.find(t => t.id === activeTrackId)?.title || 'Desconocido'}
                    </span>
                  </div>
                </div>
                {ALBION_OST_TRACKS.find(t => t.id === activeTrackId)?.hasOwnProperty('youtubeUrl') && (
                  <div className="border-t border-gray-850/50 pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-amber-500/90 font-medium">★ Canción Pedida por el Usuario</span>
                    <a
                      href={(ALBION_OST_TRACKS.find(t => t.id === activeTrackId) as any).youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Ver en YouTube</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>

              {/* YouTube Playlist Link Button */}
              <a
                href="https://www.youtube.com/playlist?list=PLvJxnupyVHJi_sR_uPMlyA1G_U9zFu9pk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-lg border border-red-900/35 bg-red-950/15 hover:bg-red-950/30 text-red-400 hover:text-red-300 transition-all text-xs font-semibold cursor-pointer"
              >
                <Music size={13} className="text-red-500" />
                <span>Ver Playlist Oficial en YouTube</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3: Visual Performance reports and charts */}
      <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
          <BarChart3 className="text-indigo-400" size={18} />
          <h3 className="font-semibold text-white font-serif">Informes Gráficos de Beneficios Mensuales</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Aggregates overview log */}
          <div className="p-4 bg-black/30 rounded-lg border border-gray-850/80 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Acumulados de Ventas Cerradas</span>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                Basado en {historyLogs.length} operaciones exitosas registradas históricamente.
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-gray-800 pb-1 text-gray-400">
                <span>Inversión Total:</span>
                <span className="text-white">{aggregates.totalInv.toLocaleString()} s</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1 text-gray-400">
                <span>Liquidaciones Netas:</span>
                <span className="text-white">{aggregates.totalRev.toLocaleString()} s</span>
              </div>
              <div className="flex justify-between border-b border-[#22C55E]/10 pb-1 text-gray-450">
                <span>Ganancia Neta Total:</span>
                <strong className="text-emerald-400 font-bold">+{aggregates.totalProfit.toLocaleString()} s</strong>
              </div>
              <div className="flex justify-between text-white font-bold">
                <span>Retorno ROI Promedio:</span>
                <strong className="text-indigo-400">{aggregates.avgROI}%</strong>
              </div>
            </div>
          </div>

          {/* SVG Responsive interactive bar-chart */}
          <div className="lg:col-span-3 p-4 bg-black/40 rounded-lg border border-gray-850 flex flex-col justify-between h-[230px]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block font-bold mb-3">
              Evolución Mensual de Beneficios (Silver)
            </span>

            {/* SVG Chart Frame */}
            <div className="flex-1 w-full relative min-h-[140px] flex items-end">
              <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="10" x2="500" y2="10" stroke="#333" strokeDasharray="3,3" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#333" strokeDasharray="3,3" strokeWidth="0.5" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#333" strokeDasharray="3,3" strokeWidth="0.5" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#555" strokeWidth="1" />

                {/* Draw columns */}
                {chartData.map((d, idx) => {
                  const barCount = chartData.length;
                  const xSpacing = 500 / barCount;
                  const x = idx * xSpacing + xSpacing / 4;
                  const barWidth = xSpacing / 2;
                  
                  // Height scale math (making columns responsive to max value)
                  const height = maxChartValue > 0 ? (Math.abs(d.value) / maxChartValue) * 105 : 0;
                  const y = 120 - height;

                  return (
                    <g key={idx} className="group">
                      {/* Bar shadow */}
                      <rect
                        x={x}
                        y={Math.max(10, y)}
                        width={barWidth}
                        height={Math.max(1, height)}
                        fill={d.value >= 0 ? "url(#barGradient)" : "url(#barGradientRed)"}
                        rx="4"
                        className="transition-all duration-300 hover:opacity-80"
                      />

                      {/* Tooltip text showing value */}
                      <text
                        x={x + barWidth / 2}
                        y={Math.max(15, y - 5)}
                        fill={d.value >= 0 ? "#10B981" : "#EF4444"}
                        fontSize="9"
                        textAnchor="middle"
                        fontWeight="bold"
                        className="opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none"
                      >
                        {d.value >= 0 ? '+' : ''}{Math.round(d.value / 1000)}k
                      </text>

                      {/* Bottom axis tag */}
                      <text
                        x={x + barWidth / 2}
                        y="130"
                        fill="#888"
                        fontSize="8"
                        textAnchor="middle"
                        className="font-mono"
                      >
                        {d.label}
                      </text>
                    </g>
                  );
                })}

                {/* SVG Definitions for Gradients */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.25" />
                  </linearGradient>
                  <linearGradient id="barGradientRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#B91C1C" stopOpacity="0.25" />
                  </linearGradient>
                </defs>

              </svg>
            </div>
            
            <p className="text-[9px] text-gray-500 italic mt-2.5 leading-none text-right">
              * Desplaza el cursor por las barras para ver el valor exacto en miles de silver (k).
            </p>
          </div>

        </div>
      </div>

      {/* ROW 4: History Logs Database Ledger */}
      <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="text-amber-500" size={18} />
            <h3 className="font-semibold text-white font-serif">Historial Operativo de Rentabilidad</h3>
          </div>

          {historyLogs.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer select-none"
            >
              <Trash2 size={13} />
              <span>Vaciar Historial</span>
            </button>
          )}
        </div>

        {historyLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 italic text-xs">
            Aún no has liquidado ninguna venta. Los registros aparecerán aquí cuando pulses **Venta Exitosa** en el panel de Cola.
          </div>
        ) : (
          <div className="overflow-x-auto select-text">
            <table className="w-full text-left font-mono border-collapse text-xs text-gray-300">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-[10px] uppercase tracking-wider">
                  <th className="py-2.5">Fecha</th>
                  <th className="py-2.5">Item</th>
                  <th className="py-2.5 text-right">Cantidad</th>
                  <th className="py-2.5 text-right">Inversión</th>
                  <th className="py-2.5 text-right">Retorno Neto</th>
                  <th className="py-2.5 text-right">Beneficio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850">
                {historyLogs.slice().reverse().map((log) => {
                  const date = new Date(log.timestamp);
                  const formatStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                  const isGain = log.profit >= 0;

                  return (
                    <tr key={log.id} className="hover:bg-white/2">
                      <td className="py-2.5 text-gray-500 text-[10px]">{formatStr}</td>
                      <td className="py-2.5 text-white font-serif">
                        {log.itemName} <span className="text-[10px] font-mono bg-neutral-900 border px-1 rounded border-gray-800 text-amber-300">T{log.tier}.{log.enchantment}</span>
                      </td>
                      <td className="py-2.5 text-right text-gray-400">{log.quantity}</td>
                      <td className="py-2.5 text-right text-red-400">{log.investmentCost.toLocaleString()} s</td>
                      <td className="py-2.5 text-right text-emerald-400">{log.revenueReceived.toLocaleString()} s</td>
                      <td className={`py-2.5 text-right font-bold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isGain ? '+' : ''}{log.profit.toLocaleString()} s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ROW Cloud Sincronización */}
      <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Cloud className="text-cyan-400" size={18} />
            <h3 className="font-semibold text-white font-serif">Sincronización en la Nube (Base de Datos En Vivo)</h3>
          </div>
          
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="text-gray-500">Estado:</span>
            {cloudStatus === 'saving' && (
              <span className="text-yellow-400 font-bold animate-pulse flex items-center gap-1">
                <RefreshCw size={10} className="animate-spin" /> Guardando...
              </span>
            )}
            {cloudStatus === 'loading' && (
              <span className="text-cyan-400 font-bold animate-pulse flex items-center gap-1">
                <RefreshCw size={10} className="animate-spin" /> Cargando...
              </span>
            )}
            {cloudStatus === 'saved' && (
              <span className="text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                ✓ Sincronizado
              </span>
            )}
            {cloudStatus === 'error' && (
              <span className="text-red-400 font-bold flex items-center gap-1">
                ⚠️ Error al guardar
              </span>
            )}
            {cloudStatus === 'idle' && (
              <span className="text-gray-400 flex items-center gap-1">
                Inactivo
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              Todos tus personajes, inventarios de plata, cola de fabricación de armas e historial ahora se sincronizan automáticamente en tiempo real en la base de datos de <strong>Firestore Cloud</strong>. 
            </p>
            
            {/* Sync Code display */}
            <div className="p-4 bg-black/40 rounded-lg border border-gray-800 flex items-center justify-between">
              <div>
                <span className="block text-[9px] uppercase text-gray-500 font-mono tracking-wider font-bold">Tu Código Maestro de Sincronización:</span>
                <strong className="text-lg text-amber-400 font-mono tracking-widest">{syncId}</strong>
              </div>
              
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 hover:text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isCopying ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{isCopying ? '¡Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>

            <p className="text-[10px] text-gray-400 italic font-sans leading-relaxed">
              * Guarda este código. Puedes ingresarlo en cualquier otro dispositivo (computadora, celular, tablet) para sincronizar tu progreso y base de datos al instante.
            </p>
          </div>

          <div className="bg-black/20 p-4 rounded-lg border border-gray-850 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-300 uppercase font-mono tracking-wide mb-2">Conectar a un Código de Sincronización Existente</h4>
              <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                ¿Tienes tus datos en otro navegador o dispositivo? Introduce tu código de sincronización anterior <code className="text-amber-500 font-mono">CRAFT-XXXX</code> para descargar e importar tu base de datos en este dispositivo.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: CRAFT-W2B5"
                  value={syncInputCode}
                  onChange={(e) => setSyncInputCode(e.target.value)}
                  className="bg-black border border-gray-750 text-xs font-mono p-2 rounded text-center w-full focus:outline-none focus:border-amber-400 uppercase tracking-widest text-white"
                />
                
                <button
                  type="button"
                  onClick={handleLoadCloudDataDesc}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:opacity-90 rounded font-bold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer uppercase transition-all select-none"
                >
                  <CloudDownload size={14} />
                  Cargar
                </button>
              </div>
            </div>

            {syncAlert.status && (
              <div className={`p-2.5 text-xs rounded border font-semibold ${
                syncAlert.status === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {syncAlert.msg}
              </div>
            )}
            
            {cloudError && (
              <div className="p-2.5 text-xs rounded border border-red-500/20 bg-red-500/10 text-red-400 font-mono">
                ⚠️ Error Firestore: {cloudError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROW 5: SQLite/Full backup operations */}
      <div className={`p-5 rounded-xl border ${surfaceColor} ${borderColor}`}>
        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
          <Database className="text-teal-400" size={18} />
          <h3 className="font-semibold text-white">Importación y Exportación de Base de Datos</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs text-gray-400 leading-relaxed">
              Traspasa toda tu información a Firefox, Chrome o tu celular copiando y pegando el código maestro de la base de datos local.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleLoadExportData}
                className="px-3.5 py-2 hover:bg-white/5 border border-gray-750 hover:border-gray-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} />
                Exportar Información
              </button>
              
              <button
                type="button"
                onClick={handleImportData}
                className="px-3.5 py-2 bg-teal-800/20 hover:bg-teal-800/40 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Upload size={14} />
                Importar Información
              </button>
            </div>

            {backupAlert.status && (
              <div className={`p-3 text-xs rounded-lg border leading-relaxed font-semibold ${
                backupAlert.status === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {backupAlert.msg}
              </div>
            )}
          </div>

          <div>
            <textarea
              value={backupJsonText}
              onChange={(e) => setBackupJsonText(e.target.value)}
              placeholder="Pega tu base de datos aquí para importar, o pulsa 'Exportar Información' para generar el código maestro."
              className="w-full bg-black/40 border border-gray-750 text-xs font-mono p-3 h-28 text-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:text-white"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
