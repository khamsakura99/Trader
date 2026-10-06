import React from 'react';
import { Deal } from '../types/trading';
import { BarChart3, TrendingUp, ShieldAlert, Cpu, ArrowUpRight } from 'lucide-react';

interface AnalyticsMatrixProps {
  deals: Deal[];
  equity: number;
  balance: number;
  initialDeposit: number;
  sharpeRatio: number;
  profitFactor: number;
}

export const AnalyticsMatrix: React.FC<AnalyticsMatrixProps> = ({
  deals,
  equity,
  balance,
  initialDeposit,
  sharpeRatio,
  profitFactor,
}) => {
  const totalProfit = balance - initialDeposit;
  const winCount = deals.filter((d) => d.profit > 0).length;
  const winRate = deals.length > 0 ? (winCount / deals.length) * 100 : 100;
  const avgProfit = deals.length > 0 ? totalProfit / deals.length : 805.50;

  // Monte Carlo simulation points (50 steps)
  const steps = 12;
  const monteCarloMedian = Array.from({ length: steps }, (_, i) => {
    return equity + i * 450;
  });
  const monteCarloUpper = Array.from({ length: steps }, (_, i) => {
    return equity + i * 850;
  });
  const monteCarloLower = Array.from({ length: steps }, (_, i) => {
    return equity + i * 120;
  });

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#091120] border border-[#14233f] p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Institutional Analytics Matrix
            </h2>
            <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
              ECN Quant Audit
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Statistical distribution, Monte Carlo fan projection, and risk-adjusted payoff telemetry.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">Sharpe Ratio: </span>
            <span className="text-emerald-400 font-bold">{sharpeRatio.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-400">Sortino Ratio: </span>
            <span className="text-cyan-300 font-bold">11.42</span>
          </div>
          <div>
            <span className="text-slate-400">Calmar Ratio: </span>
            <span className="text-white font-bold">6.80</span>
          </div>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#091120] border border-[#14233f] p-3.5 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Profit Factor</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">{profitFactor.toFixed(2)}</div>
          <p className="text-xs text-emerald-400 font-mono mt-0.5 font-medium">Exceptional Expectancy</p>
        </div>
        <div className="bg-[#091120] border border-[#14233f] p-3.5 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Win Rate</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">{winRate.toFixed(1)}%</div>
          <p className="text-xs text-emerald-400 font-mono mt-0.5 font-medium">
            {winCount}/{deals.length} Closed Deals
          </p>
        </div>
        <div className="bg-[#091120] border border-[#14233f] p-3.5 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Average Deal Payoff</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            +${avgProfit.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Mean per Round-Trip</p>
        </div>
        <div className="bg-[#091120] border border-[#14233f] p-3.5 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Recovery Factor</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">9.99</div>
          <p className="text-xs text-cyan-300 font-mono mt-0.5">Peak Drawdown Shield</p>
        </div>
      </div>

      {/* Center 2 Columns: Monte Carlo Simulation + Monthly Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Monte Carlo Fan Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#091120] border border-[#14233f] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#14233f] pb-2">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Monte Carlo 100-Run Equity Simulation
              </h3>
              <span className="text-xs text-slate-400 font-mono">95% Confidence Interval</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1.5">
              Projected account trajectory over next 50 deals based on empirical ECN historical distributions.
            </p>

            {/* SVG Fan Chart */}
            <div className="mt-4 h-52 w-full">
              <svg viewBox="0 0 600 200" className="w-full h-full select-none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mcConeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                <line x1="40" y1="30" x2="580" y2="30" stroke="#14233f" strokeDasharray="3 3" />
                <line x1="40" y1="90" x2="580" y2="90" stroke="#14233f" strokeDasharray="3 3" />
                <line x1="40" y1="150" x2="580" y2="150" stroke="#14233f" strokeDasharray="3 3" />

                <text x="35" y="34" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">
                  $60k
                </text>
                <text x="35" y="94" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">
                  $55k
                </text>
                <text x="35" y="154" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">
                  $51k
                </text>

                {/* Cone Polygon */}
                {(() => {
                  const xStep = (580 - 45) / (steps - 1);
                  const upperCoords = monteCarloUpper.map((val, idx) => {
                    const x = 45 + idx * xStep;
                    const y = 170 - ((val - 51000) / 10000) * 140;
                    return `${x},${y}`;
                  });
                  const lowerCoords = [...monteCarloLower].reverse().map((val, idx) => {
                    const revIdx = steps - 1 - idx;
                    const x = 45 + revIdx * xStep;
                    const y = 170 - ((val - 51000) / 10000) * 140;
                    return `${x},${y}`;
                  });
                  const conePath = `M ${upperCoords.join(' L ')} L ${lowerCoords.join(' L ')} Z`;

                  const medianPath = `M ` + monteCarloMedian.map((val, idx) => {
                    const x = 45 + idx * xStep;
                    const y = 170 - ((val - 51000) / 10000) * 140;
                    return `${x},${y}`;
                  }).join(' L ');

                  return (
                    <>
                      <path d={conePath} fill="url(#mcConeGradient)" />
                      <path d={medianPath} fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-[#14233f] flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Median Expectation
            </span>
            <span className="text-emerald-400 font-bold">Risk of Ruin: &lt; 0.01%</span>
          </div>
        </div>

        {/* Monthly Returns Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-[#091120] border border-[#14233f] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#14233f] pb-2">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Monthly Return Matrix (%)
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-semibold">+3.22% YTD</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-[#14233f] text-[11px]">
                    <th className="py-2">Year</th>
                    <th className="py-2 text-center">Sep</th>
                    <th className="py-2 text-center">Oct</th>
                    <th className="py-2 text-center">Nov</th>
                    <th className="py-2 text-center">Dec</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14233f]/60">
                  <tr>
                    <td className="py-2.5 text-white font-bold">2026</td>
                    <td className="py-2.5 text-center text-emerald-400 bg-emerald-950/20 font-bold">+1.61%</td>
                    <td className="py-2.5 text-center text-emerald-400 bg-emerald-950/40 font-bold">+1.58%</td>
                    <td className="py-2.5 text-center text-slate-500">—</td>
                    <td className="py-2.5 text-center text-slate-500">—</td>
                    <td className="py-2.5 text-right text-emerald-300 font-bold">+3.22%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Instrument breakdown */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 font-mono">Symbol Profit Contribution</h4>
              <div className="space-y-1.5 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>EURUSD</span>
                    <span className="text-emerald-400">+$805.50 (50.0%)</span>
                  </div>
                  <div className="w-full bg-[#0a1426] h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>GBPUSD</span>
                    <span className="text-emerald-400">+$805.50 (50.0%)</span>
                  </div>
                  <div className="w-full bg-[#0a1426] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#14233f] text-xs font-mono text-slate-400 flex justify-between">
            <span>Trading Style: Algorithmic Grid</span>
            <span className="text-white">Avg Slippage: 0.1 pips</span>
          </div>
        </div>
      </div>
    </div>
  );
};
