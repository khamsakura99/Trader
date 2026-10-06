import React, { useState } from 'react';
import { Quote, GridConfig, GridTier, Position } from '../types/trading';
import { Sliders, Play, RotateCcw, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface RsiGridOrderProps {
  quotes: Quote[];
  onDeployGrid: (tiers: GridTier[], symbol: string, note: string) => void;
}

export const RsiGridOrder: React.FC<RsiGridOrderProps> = ({ quotes, onDeployGrid }) => {
  const [symbol, setSymbol] = useState('EURUSD');
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [rsiTimeframe, setRsiTimeframe] = useState('M15');
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [rsiTrigger, setRsiTrigger] = useState(28.4);
  const [currentRsi, setCurrentRsi] = useState(32.8);
  const [gridStepPips, setGridStepPips] = useState(15);
  const [tierCount, setTierCount] = useState(5);
  const [baseLots, setBaseLots] = useState(0.20);
  const [lotMultiplier, setLotMultiplier] = useState(1.2);
  const [tpPips, setTpPips] = useState(25);
  const [slPips, setSlPips] = useState(80);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedQuote = quotes.find((q) => q.symbol === symbol) || quotes[0];
  const pipMult = selectedQuote.pipMultiplier;
  const currentPrice = direction === 'BUY' ? selectedQuote.ask : selectedQuote.bid;

  // Calculate Grid Tiers dynamically
  const tiers: GridTier[] = [];
  let cumulativeLots = 0;
  let totalMargin = 0;

  for (let i = 1; i <= tierCount; i++) {
    const tierLots = Number((baseLots * Math.pow(lotMultiplier, i - 1)).toFixed(2));
    cumulativeLots += tierLots;

    // Price step: buy grid steps down from current price, sell grid steps up
    const priceOffset = (i - 1) * gridStepPips * pipMult;
    const tierPrice = direction === 'BUY' ? currentPrice - priceOffset : currentPrice + priceOffset;
    const tierTp = direction === 'BUY' ? tierPrice + tpPips * pipMult : tierPrice - tpPips * pipMult;
    const tierSl = direction === 'BUY' ? tierPrice - slPips * pipMult : tierPrice + slPips * pipMult;

    // Est profit in USD = Lots * ContractSize * (tpPips * pipMult)
    const estProfit = tierLots * selectedQuote.contractSize * (tpPips * pipMult);
    const estRisk = tierLots * selectedQuote.contractSize * (slPips * pipMult);

    tiers.push({
      tier: i,
      type: direction,
      price: Number(tierPrice.toFixed(selectedQuote.digits)),
      lots: tierLots,
      tpPrice: Number(tierTp.toFixed(selectedQuote.digits)),
      slPrice: Number(tierSl.toFixed(selectedQuote.digits)),
      estProfit: Number(estProfit.toFixed(2)),
      estRisk: Number(estRisk.toFixed(2)),
      status: i === 1 ? 'triggered' : 'pending',
    });
  }

  const handleDeploy = () => {
    onDeployGrid(
      tiers,
      symbol,
      `Grid tier up-${gridStepPips}-${tierCount * gridStepPips} ${direction} deployed`
    );
    setStatusMessage(`Grid strategy deployed! ${tierCount} tiers active for ${symbol}.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const applyPreset = (preset: 'conservative' | 'aggressive' | 'scalper') => {
    if (preset === 'conservative') {
      setBaseLots(0.10);
      setLotMultiplier(1.0);
      setGridStepPips(20);
      setTierCount(4);
      setTpPips(30);
      setSlPips(100);
    } else if (preset === 'aggressive') {
      setBaseLots(0.25);
      setLotMultiplier(1.3);
      setGridStepPips(12);
      setTierCount(6);
      setTpPips(20);
      setSlPips(70);
    } else {
      setBaseLots(0.15);
      setLotMultiplier(1.1);
      setGridStepPips(8);
      setTierCount(4);
      setTpPips(15);
      setSlPips(50);
    }
  };

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#091120] border border-[#14233f] p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              RSI Algorithmic Grid Order Desk
            </h2>
            <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
              MT5 Strategy Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated multi-tier limit ladder triggered when RSI ({rsiPeriod}) reaches extreme levels.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-400 mr-1">Presets:</span>
          <button
            onClick={() => applyPreset('conservative')}
            className="px-2.5 py-1 rounded bg-[#0e1930] hover:bg-[#152549] text-slate-300 border border-[#1e2f4f] transition-colors cursor-pointer"
          >
            Conservative
          </button>
          <button
            onClick={() => applyPreset('scalper')}
            className="px-2.5 py-1 rounded bg-[#0e1930] hover:bg-[#152549] text-cyan-300 border border-cyan-800/60 transition-colors cursor-pointer"
          >
            Scalper M15
          </button>
          <button
            onClick={() => applyPreset('aggressive')}
            className="px-2.5 py-1 rounded bg-[#0e1930] hover:bg-[#152549] text-amber-300 border border-amber-800/60 transition-colors cursor-pointer"
          >
            Aggressive Martingale
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-lg flex items-center gap-2 text-emerald-300 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Grid: Parameters Left, Ladder Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Config Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-[#091120] border border-[#14233f] rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-[#14233f] pb-2 font-mono">
            Strategy Parameters
          </h3>

          {/* Symbol & Direction */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Symbol</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-[#050c18] border border-[#1b2a47] rounded-lg p-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
              >
                {quotes.map((q) => (
                  <option key={q.symbol} value={q.symbol}>
                    {q.symbol} ({q.spread.toFixed(1)}p)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Execution Side</label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setDirection('BUY')}
                  className={`py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                    direction === 'BUY'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0a1222] text-slate-400 hover:text-white border border-[#182744]'
                  }`}
                >
                  BUY Grid
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SELL')}
                  className={`py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                    direction === 'SELL'
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#0a1222] text-slate-400 hover:text-white border border-[#182744]'
                  }`}
                >
                  SELL Grid
                </button>
              </div>
            </div>
          </div>

          {/* RSI Settings */}
          <div className="bg-[#060b14] border border-[#14233f] p-3 rounded-lg space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold text-white">RSI Signal Condition</span>
              <span className="text-cyan-400">Current RSI: {currentRsi.toFixed(1)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-400 block text-[10px]">Timeframe</label>
                <select
                  value={rsiTimeframe}
                  onChange={(e) => setRsiTimeframe(e.target.value)}
                  className="w-full bg-[#091120] border border-[#1b2a47] rounded p-1.5 text-white"
                >
                  <option value="M5">M5</option>
                  <option value="M15">M15</option>
                  <option value="H1">H1</option>
                  <option value="H4">H4</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block text-[10px]">Period</label>
                <input
                  type="number"
                  value={rsiPeriod}
                  onChange={(e) => setRsiPeriod(Number(e.target.value))}
                  className="w-full bg-[#091120] border border-[#1b2a47] rounded p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block text-[10px]">Trigger Level</label>
                <input
                  type="number"
                  value={rsiTrigger}
                  onChange={(e) => setRsiTrigger(Number(e.target.value))}
                  className="w-full bg-[#091120] border border-[#1b2a47] rounded p-1.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Grid Ladder Configuration */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Grid Step (Pips)</label>
              <input
                type="number"
                value={gridStepPips}
                onChange={(e) => setGridStepPips(Number(e.target.value))}
                className="w-full bg-[#050c18] border border-[#1b2a47] rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Tier Count</label>
              <input
                type="number"
                min={2}
                max={10}
                value={tierCount}
                onChange={(e) => setTierCount(Number(e.target.value))}
                className="w-full bg-[#050c18] border border-[#1b2a47] rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Base Lot Size</label>
              <input
                type="number"
                step="0.01"
                value={baseLots}
                onChange={(e) => setBaseLots(Number(e.target.value))}
                className="w-full bg-[#050c18] border border-[#1b2a47] rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Lot Multiplier</label>
              <input
                type="number"
                step="0.1"
                value={lotMultiplier}
                onChange={(e) => setLotMultiplier(Number(e.target.value))}
                className="w-full bg-[#050c18] border border-[#1b2a47] rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Take Profit (Pips)</label>
              <input
                type="number"
                value={tpPips}
                onChange={(e) => setTpPips(Number(e.target.value))}
                className="w-full bg-[#050c18] border border-[#1b2a47] rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Basket Stop Loss (Pips)</label>
              <input
                type="number"
                value={slPips}
                onChange={(e) => setSlPips(Number(e.target.value))}
                className="w-full bg-[#050c18] border border-[#1b2a47] rounded-lg p-2 text-white"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleDeploy}
            className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Deploy RSI Grid into MT5 Terminal</span>
          </button>
        </div>

        {/* Right Column: Visual Ladder & Payoff Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-[#091120] border border-[#14233f] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#14233f] pb-2">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Grid Order Ladder Preview
              </h3>
              <div className="text-xs font-mono text-slate-400">
                Total Lots: <span className="text-white font-bold">{cumulativeLots.toFixed(2)}</span> ·
                Spread: <span className="text-cyan-300">{selectedQuote.spread.toFixed(1)}p</span>
              </div>
            </div>

            {/* Ladder Table */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-[#14233f] text-[11px]">
                    <th className="py-2 px-2">Tier</th>
                    <th className="py-2 px-2">Type</th>
                    <th className="py-2 px-2">Entry Price</th>
                    <th className="py-2 px-2">Lots</th>
                    <th className="py-2 px-2">Target T/P</th>
                    <th className="py-2 px-2 text-right">Est Profit</th>
                    <th className="py-2 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14233f]/60">
                  {tiers.map((t) => (
                    <tr key={t.tier} className="hover:bg-[#0c162b] transition-colors">
                      <td className="py-2 px-2 font-bold text-white">Tier #{t.tier}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            t.type === 'BUY'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-white font-medium">{t.price.toFixed(selectedQuote.digits)}</td>
                      <td className="py-2 px-2 text-cyan-300 font-bold">{t.lots.toFixed(2)}</td>
                      <td className="py-2 px-2 text-slate-300">{t.tpPrice.toFixed(selectedQuote.digits)}</td>
                      <td className="py-2 px-2 text-right text-emerald-400 font-bold">
                        +${t.estProfit.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            t.status === 'triggered'
                              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                              : 'bg-[#0c162b] text-slate-400'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Note */}
          <div className="mt-4 pt-3 border-t border-[#14233f] flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Basket Equity Protection active at -${(cumulativeLots * 100 * slPips * 0.1).toFixed(0)}</span>
            </div>
            <div>
              <span>Est Basket Payoff: </span>
              <span className="text-emerald-400 font-bold">
                +${tiers.reduce((acc, t) => acc + t.estProfit, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
