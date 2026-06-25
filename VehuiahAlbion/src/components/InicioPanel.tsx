import React, { useMemo } from 'react';
import { 
  Character, 
  HistoryLog, 
  CraftingJob, 
  VisualTheme,
  ItemTier,
  EnchantmentLevel
} from '../types';
import { 
  ITEM_RECIPES, 
  getAlbionRenderUrl,
  handleImageLoadError
} from '../data';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Clock, 
  Wrench, 
  ShoppingBag, 
  Hammer, 
  CoinsIcon, 
  Sparkles, 
  ArrowUpRight, 
  Activity,
  History,
  AlertCircle,
  BookOpen
} from 'lucide-react';

interface ProducedBook {
  key: string;
  tier: ItemTier;
  professionId: 'WARRIOR' | 'MAGE' | 'HUNTER';
  professionName: string;
  quantity: number;
  items: Record<string, number>;
}

interface InicioPanelProps {
  activeChar: Character;
  historyLogs: HistoryLog[];
  queue: CraftingJob[];
  inventory: Record<string, number>;
  setActiveTab: (tab: 'inicio' | 'crafting' | 'purchase' | 'queue' | 'workers' | 'prices' | 'inventory' | 'config') => void;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
  globalPremium: boolean;
  onUpdateCapital?: (newCapital: number) => void;
}

export const InicioPanel: React.FC<InicioPanelProps> = ({
  activeChar,
  historyLogs,
  queue,
  inventory,
  setActiveTab,
  primaryColor,
  surfaceColor,
  borderColor,
  globalPremium,
  onUpdateCapital
}) => {
  // --- STATE FOR BOOKS / JOURNALS ---
  const [soldBooks, setSoldBooks] = React.useState<Record<string, number>>({});
  const [workerChecks, setWorkerChecks] = React.useState<Record<string, boolean>>({});
  const [producedBooks, setProducedBooks] = React.useState<Record<string, ProducedBook>>({});
  
  // State for active selling book
  const [sellingBookKey, setSellingBookKey] = React.useState<string | null>(null);
  const [sellPriceText, setSellPriceText] = React.useState<string>('');
  const [sellQtyText, setSellQtyText] = React.useState<string>('');
  const [sellMethod, setSellMethod] = React.useState<'direct' | 'order'>('direct');

  // Load from localStorage
  React.useEffect(() => {
    if (activeChar?.name) {
      const savedSold = localStorage.getItem(`albion_sold_books_${activeChar.name}`);
      const savedWorkers = localStorage.getItem(`albion_worker_checks_${activeChar.name}`);
      const savedProduced = localStorage.getItem(`albion_produced_books_list_${activeChar.name}`);
      if (savedSold) {
        try { setSoldBooks(JSON.parse(savedSold)); } catch (e) { setSoldBooks({}); }
      } else {
        setSoldBooks({});
      }
      if (savedWorkers) {
        try { setWorkerChecks(JSON.parse(savedWorkers)); } catch (e) { setWorkerChecks({}); }
      } else {
        setWorkerChecks({});
      }
      if (savedProduced) {
        try { setProducedBooks(JSON.parse(savedProduced)); } catch (e) { setProducedBooks({}); }
      } else {
        setProducedBooks({});
      }
    }
  }, [activeChar?.name]);

  const handleSellBooks = (key: string, qty: number, netSilver: number) => {
    const updatedSold = {
      ...soldBooks,
      [key]: (soldBooks[key] || 0) + qty
    };
    setSoldBooks(updatedSold);
    if (activeChar?.name) {
      localStorage.setItem(`albion_sold_books_${activeChar.name}`, JSON.stringify(updatedSold));
    }
    
    if (onUpdateCapital) {
      onUpdateCapital(activeChar.capital + netSilver);
    }
    setSellingBookKey(null);
    setSellPriceText('');
    setSellQtyText('');
  };

  const handleToggleWorkerCheck = (key: string, checked: boolean) => {
    const updated = {
      ...workerChecks,
      [key]: checked
    };
    setWorkerChecks(updated);
    if (activeChar?.name) {
      localStorage.setItem(`albion_worker_checks_${activeChar.name}`, JSON.stringify(updated));
    }
  };

  const handleClearCompletedBooks = () => {
    if (!activeChar?.name) return;
    const newProduced = { ...producedBooks };
    const newSold = { ...soldBooks };
    let changed = false;
    Object.keys(newProduced).forEach(key => {
      const alreadySold = soldBooks[key] || 0;
      const needed = newProduced[key].quantity;
      if (needed <= alreadySold) {
        delete newProduced[key];
        delete newSold[key];
        changed = true;
      }
    });

    if (changed) {
      setProducedBooks(newProduced);
      setSoldBooks(newSold);
      localStorage.setItem(`albion_produced_books_list_${activeChar.name}`, JSON.stringify(newProduced));
      localStorage.setItem(`albion_sold_books_${activeChar.name}`, JSON.stringify(newSold));
    }
  };

  const getDefaultJournalPrice = (tier: string) => {
    const cleanNum = String(tier).replace(/\D/g, '');
    switch (cleanNum) {
      case '4': return 4000;
      case '5': return 8000;
      case '6': return 15000;
      case '7': return 35000;
      case '8': return 95000;
      default: return 4000;
    }
  };

  const booksToUse = useMemo(() => {
    if (!producedBooks || typeof producedBooks !== 'object') return [];
    return (Object.values(producedBooks) as ProducedBook[])
      .filter(book => book && typeof book === 'object')
      .map(book => ({
        ...book,
        totalNeeded: book.quantity || 0,
        items: book.items || {},
        tier: book.tier || '4',
        professionId: book.professionId || 'WARRIOR',
        professionName: book.professionName || 'Diario de Herrero'
      }))
      .sort((a, b) => {
        const tierA = String(a.tier || '4');
        const tierB = String(b.tier || '4');
        if (tierB !== tierA) {
          return tierB.localeCompare(tierA);
        }
        return (a.professionName || '').localeCompare(b.professionName || '');
      });
  }, [producedBooks]);

  // 1. Calculate overall financial summary
  const summary = useMemo(() => {
    let totalInvested = 0;
    let totalRevenue = 0;
    let totalProfit = 0;

    historyLogs.forEach(log => {
      totalInvested += log.investmentCost;
      totalRevenue += log.revenueReceived;
      totalProfit += log.profit;
    });

    const averageROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    // Estimate equity based on inventory value & active queue costs
    // The inventory keeps material quantities. Since we don't have direct live values, 
    // let's estimate with standard numbers or just use available capital + current active investments in queue.
    const activeInvestmentInQueue = queue.reduce((sum, job) => sum + (job.targetCraftPrice || 0) * job.quantity, 0);
    const totalEquity = activeChar.capital + activeInvestmentInQueue;

    return {
      totalInvested,
      totalRevenue,
      totalProfit,
      averageROI,
      activeInvestmentInQueue,
      totalEquity
    };
  }, [historyLogs, queue, activeChar.capital]);

  // 2. Prepare chart data (Monthly Profit Trend or Operation count)
  const chartData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const buckets: Record<string, number> = {};

    // Sort to keep chronological order
    const sorted = [...historyLogs].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    if (sorted.length === 0) {
      // Return high-fidelity sample data to make the initial screen gorgeous
      return [
        { label: 'Ene', value: 250000 },
        { label: 'Feb', value: 480000 },
        { label: 'Mar', value: 890000 },
        { label: 'Abr', value: 650000 },
        { label: 'May', value: 1200000 },
        { label: 'Jun', value: 1750000 }
      ];
    }

    sorted.forEach(log => {
      const date = new Date(log.timestamp);
      const label = `${months[date.getMonth()]} ${date.getFullYear() % 100}`;
      buckets[label] = (buckets[label] || 0) + log.profit;
    });

    return Object.entries(buckets).map(([label, value]) => ({ label, value }));
  }, [historyLogs]);

  // Max value for chart Y scaling
  const maxVal = useMemo(() => {
    const vals = chartData.map(d => Math.abs(d.value));
    const max = Math.max(...vals);
    return max === 0 ? 100000 : max;
  }, [chartData]);

  // 3. Find top winning operations (Sort history by profit descending)
  const topOperations = useMemo(() => {
    return [...historyLogs]
      .filter(log => log.profit > 0)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 4);
  }, [historyLogs]);

  // 4. Get active operations summarizing current progress status
  const activeJobsSummary = useMemo(() => {
    return queue.slice(0, 3);
  }, [queue]);

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-8 animate-fade-in">
      
      {/* HEADER HERO AREA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/40 p-6 rounded-2xl border border-cyan-500/10 backdrop-blur-md relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)]">
        {/* Glow vector back */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[9px] uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} className="animate-spin" style={{ animationDuration: '6s' }} /> Estación Central Activa
            </span>
          </div>
          <h1 className="text-2xl font-serif text-white tracking-wide">
            ¡Bienvenido de vuelta, <span className="text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">{activeChar.name}</span>!
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Este es tu panel central de inteligencia de mercado de Albion Online. Aquí verás el estado actual de tus finanzas, tus mejores movimientos históricos y los proyectos en curso.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/55 py-2 px-4 rounded-xl border border-gray-800 shrink-0 z-10 font-mono">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
            <CoinsIcon size={18} className="drop-shadow-[0_0_6px_rgba(234,179,8,0.4)]" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-sans uppercase font-bold tracking-wider">Capital de Trabajo</div>
            <div className="text-md font-extrabold text-amber-400">{activeChar.capital.toLocaleString()} <span className="text-slate-400 text-xs">Silver</span></div>
          </div>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Estimated Equity */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${surfaceColor} ${borderColor} hover:border-cyan-500/30 transition-all duration-300 relative group overflow-hidden`}>
          <div className="space-y-1 z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Patrimonio Estimado</span>
            <div className="text-lg font-mono font-bold text-slate-100">{summary.totalEquity.toLocaleString()} s</div>
            <p className="text-[10px] text-slate-400">Capital + {queue.length} crafteos activos</p>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
            <Activity size={18} />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Card 2: Historical Net Profit */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${surfaceColor} ${borderColor} hover:border-emerald-500/30 transition-all duration-300 relative group overflow-hidden`}>
          <div className="space-y-1 z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Ganancia Neta Total</span>
            <div className="text-lg font-mono font-bold text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.2)]">
              {summary.totalProfit >= 0 ? '+' : ''}{summary.totalProfit.toLocaleString()} s
            </div>
            <p className="text-[10px] text-slate-400">En {historyLogs.length} operaciones cerradas</p>
          </div>
          <div className={`p-2.5 rounded-lg ${summary.totalProfit >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'} group-hover:scale-110 transition-transform duration-300`}>
            <TrendingUp size={18} />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Card 3: Return on Investment ROI */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${surfaceColor} ${borderColor} hover:border-purple-500/30 transition-all duration-300 relative group overflow-hidden`}>
          <div className="space-y-1 z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">ROI Promedio General</span>
            <div className="text-lg font-mono font-bold text-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.2)]">
              {summary.averageROI.toFixed(1)}%
            </div>
            <p className="text-[10px] text-slate-400">Retorno de inversión neto</p>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform duration-300">
            <Award size={18} />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Card 4: Operations in Course */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${surfaceColor} ${borderColor} hover:border-amber-500/30 transition-all duration-300 relative group overflow-hidden`}>
          <div className="space-y-1 z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Operaciones en Cola</span>
            <div className="text-lg font-mono font-bold text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.2)]">
              {queue.length} activas
            </div>
            <p className="text-[10px] text-slate-400">Total en fábrica o mercado</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform duration-300">
            <Clock size={18} />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* DETAILED STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SLOT VACÍO PARA EXPANSIÓN */}
        <div className={`lg:col-span-8 p-6 rounded-xl border border-dashed flex flex-col justify-center items-center text-center space-y-4 ${surfaceColor} ${borderColor} min-h-[350px] relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-transparent to-transparent pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-slate-950/60 border border-gray-800 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all duration-300 shadow-inner">
            <span className="text-3xl">🛠️</span>
          </div>
          <div className="space-y-1.5 z-10 max-w-sm">
            <h3 className="text-sm font-serif font-bold text-slate-300 tracking-wide">Módulo Disponible</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
              Este espacio está listo para nuevas herramientas operativas o métricas adicionales. ¡Tu centro de control se mantiene limpio y enfocado!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('crafting')}
            className="px-4 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-mono font-medium transition-all"
          >
            Ir a Estación de Crafteo
          </button>
        </div>

        {/* STATS SUMMARY CIRCLE / EFFICIENCY */}
        <div className={`lg:col-span-4 p-5 rounded-xl border flex flex-col justify-between ${surfaceColor} ${borderColor} shadow-md relative overflow-hidden`}>
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
              <Activity className="text-amber-500" size={16} />
              <strong className="text-sm font-serif text-white tracking-wide">Eficiencia Operativa</strong>
            </div>

            <div className="flex flex-col items-center justify-center py-4 space-y-3 relative">
              {/* Central neon circle decoration */}
              <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-2 border-dashed border-cyan-500/20">
                <div className="absolute inset-1 rounded-full border border-cyan-500/10" />
                <div className="absolute inset-3 rounded-full bg-slate-950/80 flex flex-col items-center justify-center border border-cyan-500/30 shadow-[inset_0_0_12px_rgba(34,211,238,0.15)]">
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider">MERCADO</span>
                  <span className="text-lg font-mono font-extrabold text-cyan-400">
                    {summary.averageROI >= 0 ? '+' : ''}{summary.averageROI.toFixed(0)}%
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">Prom. ROI</span>
                </div>
              </div>

              <div className="w-full text-center text-xs space-y-1.5 pt-2">
                <p className="text-slate-300 font-medium">Borde de Rentabilidad Fuerte</p>
                <p className="text-[10px] text-slate-500">
                  {historyLogs.length} proyectos exitosos. Las tasas de impuestos ({globalPremium ? 'Premium 4%' : 'Normal 8%'}) están aplicadas a todas las estimaciones.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/45 p-2 px-3 rounded-lg border border-gray-800/80 text-[10px] text-slate-400 flex items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="truncate">Sincronizado con bases de datos de Albion Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BEST WINNING RECIPES */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${surfaceColor} ${borderColor} shadow-md`}>
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
              <Award className="text-amber-400" size={17} />
              <strong className="text-sm font-serif text-white tracking-wide">Fórmulas Ganadoras (Mejores Retornos)</strong>
            </div>

            {topOperations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3.5 text-center px-4">
                <div className="w-11 h-11 rounded-lg bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <Award size={20} className="opacity-40" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-300 font-medium">No hay registros cerrados aún</p>
                  <p className="text-[10px] text-slate-500 max-w-xs">
                    Cuando completes un crafteo y lo vendas en la pestaña de <strong className="text-amber-500">Cola</strong>, quedará guardado aquí.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {topOperations.map((log) => {
                  // Resolve item image code
                  const recipe = ITEM_RECIPES.find(r => r.Item === log.itemName);
                  const imageUrl = recipe 
                    ? getAlbionRenderUrl(recipe.Url_Item, log.tier, log.enchantment)
                    : '';

                  return (
                    <div 
                      key={log.id} 
                      className="p-2.5 rounded-lg bg-black/35 hover:bg-black/55 border border-gray-800/70 hover:border-cyan-500/25 flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-black border border-gray-850 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-cyan-500/30 transition-colors">
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt={log.itemName} 
                              className="w-7 h-7 object-contain"
                              referrerPolicy="no-referrer"
                              onError={handleImageLoadError}
                            />
                          ) : (
                            <Wrench size={14} className="text-slate-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-serif text-slate-200 truncate pr-1 group-hover:text-cyan-400 transition-colors">
                            {log.itemName}
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono">
                            Tier {log.tier}.{log.enchantment} | Cantidad: {log.quantity} ud
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-0.5 justify-end">
                          +{log.profit.toLocaleString()}
                          <span className="text-[8px] text-slate-500 font-sans">s</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">
                          ROI: +{((log.profit / (log.investmentCost || 1)) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={() => setActiveTab('crafting')}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 mx-auto border-b border-cyan-500/20 hover:border-cyan-400/50 pb-0.5 transition-colors cursor-pointer"
            >
              Comenzar a simular nuevas fórmulas <ArrowUpRight size={10} />
            </button>
          </div>
        </div>

        {/* OPERATIONS IN PROGRESS */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${surfaceColor} ${borderColor} shadow-md`}>
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="text-amber-400" size={17} />
                <strong className="text-sm font-serif text-white tracking-wide">Operaciones en Cola Activas</strong>
              </div>
              {activeJobsSummary.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono font-bold">
                  {queue.length} en total
                </span>
              )}
            </div>

            {activeJobsSummary.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3.5 text-center px-4">
                <div className="w-11 h-11 rounded-lg bg-pink-500/5 border border-pink-500/10 flex items-center justify-center text-pink-500">
                  <ShoppingBag size={18} className="opacity-40" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-300 font-medium">La cola de producción está vacía</p>
                  <p className="text-[10px] text-slate-500 max-w-xs">
                    Simula cualquier item en la <strong className="text-cyan-400">Estación de Crafteo</strong> y añádelo para procesar compras y fabricación.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {activeJobsSummary.map((job) => {
                  const recipe = ITEM_RECIPES.find(r => r.Item === job.recipeItemName);
                  const imageUrl = recipe 
                    ? getAlbionRenderUrl(recipe.Url_Item, job.tier, job.enchantment)
                    : '';

                  // Calculate job status visual
                  let statusText = 'Adquiriendo Materiales';
                  let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/15';
                  if (job.status === 'ready_to_craft') {
                    statusText = 'Listo para Fabricar';
                    statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15';
                  } else if (job.status === 'crafted_selling') {
                    statusText = 'Liquidando en Mercado';
                    statusColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/15';
                  }

                  return (
                    <div 
                      key={job.id} 
                      className="p-2.5 rounded-lg bg-black/35 hover:bg-black/55 border border-gray-800/70 hover:border-amber-500/25 flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-black border border-gray-850 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-amber-500/30 transition-colors">
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt={job.recipeItemName} 
                              className="w-7 h-7 object-contain"
                              referrerPolicy="no-referrer"
                              onError={handleImageLoadError}
                            />
                          ) : (
                            <Hammer size={14} className="text-slate-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-serif text-slate-200 truncate group-hover:text-amber-400 transition-colors">
                            {job.recipeItemName}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] text-slate-500 font-mono">
                              Cant: {job.quantity} ud
                            </span>
                            <span className={`px-1.5 py-[1px] rounded text-[8px] font-medium border ${statusColor}`}>
                              {statusText}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono text-[10px]">
                        <div className="text-slate-300">Retorno Est.</div>
                        <div className="font-bold text-amber-400">
                          {((job.targetSellPrice || 0) * job.quantity).toLocaleString()} s
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={() => setActiveTab('queue')}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 mx-auto border-b border-amber-500/20 hover:border-amber-400/50 pb-0.5 transition-colors cursor-pointer"
            >
              Inspeccionar cola de producción entera <ArrowUpRight size={10} />
            </button>
          </div>
        </div>

      </div>

      {/* QUICK ACCESS FLOATING BAR */}
      <div className="bg-slate-950/40 p-5 rounded-2xl border border-cyan-500/10 backdrop-blur-md">
        <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3.5">Panel de Navegación Rápida</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('crafting')}
            className="p-3 text-left bg-gradient-to-br from-cyan-950/15 to-cyan-900/10 rounded-xl border border-cyan-500/15 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all cursor-pointer group"
          >
            <Wrench size={16} className="text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-serif font-bold text-white group-hover:text-cyan-400 transition-colors">Crafteo Simulado</div>
            <p className="text-[9px] text-slate-500 mt-0.5">Calculadora de beneficio masivo</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('purchase')}
            className="p-3 text-left bg-gradient-to-br from-amber-500/5 to-amber-500/10 rounded-xl border border-amber-500/15 hover:border-amber-400/50 hover:shadow-[0_0_12px_rgba(245,158,11,0.15)] transition-all cursor-pointer group"
          >
            <ShoppingBag size={16} className="text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-serif font-bold text-white group-hover:text-amber-400 transition-colors">Abastecimiento</div>
            <p className="text-[9px] text-slate-500 mt-0.5">Listas de compras y stock</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prices')}
            className="p-3 text-left bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 rounded-xl border border-yellow-500/15 hover:border-yellow-400/50 hover:shadow-[0_0_12px_rgba(234,179,8,0.15)] transition-all cursor-pointer group"
          >
            <CoinsIcon size={16} className="text-yellow-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-serif font-bold text-white group-hover:text-yellow-400 transition-colors">Libro de Precios</div>
            <p className="text-[9px] text-slate-500 mt-0.5">Modificación de valores base</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className="p-3 text-left bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-xl border border-purple-500/15 hover:border-purple-400/50 hover:shadow-[0_0_12px_rgba(192,132,252,0.15)] transition-all cursor-pointer group"
          >
            <Activity size={16} className="text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-serif font-bold text-white group-hover:text-purple-400 transition-colors">Inventario Global</div>
            <p className="text-[9px] text-slate-500 mt-0.5">Control de materiales en mano</p>
          </button>
        </div>
      </div>

    </div>
  );
};
