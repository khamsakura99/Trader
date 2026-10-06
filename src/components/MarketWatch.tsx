import React from 'react';
import { Quote } from '../types/trading';

interface MarketWatchProps {
  quotes: Quote[];
  onAdjustPips: (symbol: string, pips: number) => void;
  onSelectSymbolForTrade?: (symbol: string) => void;
  expectedPayoff: number;
  sharpeRatio: number;
}

export const MarketWatch: React.FC<MarketWatchProps> = ({
  quotes,
  onAdjustPips,
  onSelectSymbolForTrade,
  expectedPayoff,
  sharpeRatio,
}) => {
  return (
    <div className="bg-[#091120] border border-[#14233f] rounded-xl p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">MT5 Market Watch</h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Live ECN quotes · Click +/- pip buttons to stress-test floating equity
        </p>

        {/* Quotes List */}
        <div className="mt-3 divide-y divide-[#131f37]/60">
          {quotes.map((quote) => {
            const isChangePositive = quote.changePercent >= 0;

            return (
              <div
                key={quote.symbol}
                className={`py-2.5 flex items-center justify-between gap-2 text-xs transition-colors rounded px-1.5 ${
                  quote.lastDirection === 'up'
                    ? 'tick-flash-up'
                    : quote.lastDirection === 'down'
                    ? 'tick-flash-down'
                    : ''
                }`}
              >
                {/* Symbol & Spread & Change */}
                <div
                  className="cursor-pointer group flex-1 min-w-[120px]"
                  onClick={() => onSelectSymbolForTrade && onSelectSymbolForTrade(quote.symbol)}
                  title={`Click to open ${quote.symbol} Order`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-cyan-300 font-mono transition-colors">
                      {quote.symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5">
                    <span>Spread {quote.spread.toFixed(1)}p</span>
                    <span className="text-slate-600">·</span>
                    <span className={isChangePositive ? 'text-emerald-400' : 'text-rose-400'}>
                      {isChangePositive ? '+' : ''}
                      {quote.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Bid / Ask with red / green colors */}
                <div className="text-right font-mono flex items-center gap-1.5 shrink-0">
                  <span className="text-rose-400 font-semibold tracking-tight text-[12px] sm:text-[13px]">
                    {quote.bid.toFixed(quote.digits)}
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="text-emerald-400 font-semibold tracking-tight text-[12px] sm:text-[13px]">
                    {quote.ask.toFixed(quote.digits)}
                  </span>
                </div>

                {/* Pip Stress Test Buttons */}
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <button
                    onClick={() => onAdjustPips(quote.symbol, -5)}
                    className="bg-[#0b1528] hover:bg-[#122240] active:scale-95 text-slate-300 hover:text-white border border-[#182a4d] px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer"
                    title={`Subtract 5 pips from ${quote.symbol}`}
                  >
                    -5p
                  </button>
                  <button
                    onClick={() => onAdjustPips(quote.symbol, 5)}
                    className="bg-[#0b1528] hover:bg-[#122240] active:scale-95 text-slate-300 hover:text-white border border-[#182a4d] px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer"
                    title={`Add 5 pips to ${quote.symbol}`}
                  >
                    +5p
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-3 border-t border-[#14233f] flex items-center justify-between text-xs font-mono text-slate-400">
        <div>
          <span>Expected Payoff: </span>
          <span className="text-white font-medium">
            +${expectedPayoff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/deal
          </span>
        </div>
        <div>
          <span>Sharpe: </span>
          <span className="text-white font-bold">{sharpeRatio.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
