import React from 'react';

interface KpiMetricsProps {
  equity: number;
  balance: number;
  initialDeposit: number;
  floatingPl: number;
  openPositionsCount: number;
  profitFactor: number;
  winRatePercent: number;
  winningDeals: number;
  totalDeals: number;
  maximalDrawdownPercent: number;
  peakToValley: number;
  freeMargin: number;
  marginLevel: number | null;
}

export const KpiMetricsRow: React.FC<KpiMetricsProps> = ({
  equity,
  balance,
  initialDeposit,
  floatingPl,
  openPositionsCount,
  profitFactor,
  winRatePercent,
  winningDeals,
  totalDeals,
  maximalDrawdownPercent,
  peakToValley,
  freeMargin,
  marginLevel,
}) => {
  const equityGrowthPercent = ((equity - initialDeposit) / initialDeposit) * 100;
  const netClosedProfit = balance - initialDeposit;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 p-5 pb-3">
      {/* 1. Account Equity */}
      <div className="bg-[#091120] border border-[#14233f] rounded-xl p-3.5 flex flex-col justify-between">
        <span className="text-xs text-slate-400 font-medium">Account Equity</span>
        <div className="mt-1">
          <span className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            ${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p className="text-xs text-emerald-400 font-mono mt-0.5 font-medium">
            {equityGrowthPercent >= 0 ? '+' : ''}
            {equityGrowthPercent.toFixed(2)}% vs Initial Deposit
          </p>
        </div>
      </div>

      {/* 2. Closed Balance */}
      <div className="bg-[#091120] border border-[#14233f] rounded-xl p-3.5 flex flex-col justify-between">
        <span className="text-xs text-slate-400 font-medium">Closed Balance</span>
        <div className="mt-1">
          <span className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Net Profit: {netClosedProfit >= 0 ? '+' : ''}${netClosedProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* 3. Floating Open P/L */}
      <div className="bg-[#091120] border border-[#14233f] rounded-xl p-3.5 flex flex-col justify-between">
        <span className="text-xs text-slate-400 font-medium">Floating Open P/L</span>
        <div className="mt-1">
          <span
            className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${
              floatingPl > 0
                ? 'text-emerald-400'
                : floatingPl < 0
                ? 'text-rose-400'
                : 'text-cyan-300'
            }`}
          >
            {floatingPl >= 0 ? '+' : '-'}$
            {Math.abs(floatingPl).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {openPositionsCount} Open Position(s)
          </p>
        </div>
      </div>

      {/* 4. Profit Factor & Win Rate */}
      <div className="bg-[#091120] border border-[#14233f] rounded-xl p-3.5 flex flex-col justify-between">
        <span className="text-xs text-slate-400 font-medium">Profit Factor & Win Rate</span>
        <div className="mt-1">
          <span className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            {profitFactor.toFixed(2)}
          </span>
          <p className="text-xs text-emerald-400 font-mono mt-0.5 font-medium">
            Win Rate {winRatePercent.toFixed(1)}% ({winningDeals}/{totalDeals})
          </p>
        </div>
      </div>

      {/* 5. Maximal Drawdown */}
      <div className="bg-[#091120] border border-[#14233f] rounded-xl p-3.5 flex flex-col justify-between">
        <span className="text-xs text-slate-400 font-medium">Maximal Drawdown</span>
        <div className="mt-1">
          <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono tracking-tight">
            -{Math.abs(maximalDrawdownPercent).toFixed(2)}%
          </span>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Peak-to-Valley ${peakToValley.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 6. Free Margin / Level */}
      <div className="bg-[#091120] border border-[#14233f] rounded-xl p-3.5 flex flex-col justify-between">
        <span className="text-xs text-slate-400 font-medium">Free Margin / Level</span>
        <div className="mt-1">
          <span className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            ${freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {marginLevel !== null && marginLevel > 0
              ? `Margin Level ${marginLevel.toFixed(1)}%`
              : 'Margin Level N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};
