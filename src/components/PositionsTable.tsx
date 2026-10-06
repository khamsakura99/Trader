import React from 'react';
import { Position } from '../types/trading';
import { Plus, XCircle, ShieldCheck } from 'lucide-react';

interface PositionsTableProps {
  positions: Position[];
  onClosePosition: (ticket: number) => void;
  onCloseAllPositions: () => void;
  onBreakEvenAll: () => void;
  onOpenOrderModal: () => void;
}

export const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  onClosePosition,
  onCloseAllPositions,
  onBreakEvenAll,
  onOpenOrderModal,
}) => {
  return (
    <div className="bg-[#091120] border border-[#14233f] rounded-xl p-4 mt-3">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#14233f]">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white tracking-tight">
            Active Open Positions ({positions.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            · Real-time tick evaluation with dynamic mark-to-market P/L
          </span>
        </div>

        <div className="flex items-center gap-2">
          {positions.length > 0 && (
            <>
              <button
                onClick={onBreakEvenAll}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-cyan-800 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                title="Move Stop Loss to Entry price on all winning positions"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Break-Even All</span>
              </button>
              <button
                onClick={onCloseAllPositions}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-rose-900 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Close All</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenOrderModal}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open Order</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      {positions.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#0c172d] border border-[#1a2d52] flex items-center justify-center text-slate-500 mb-2 font-mono text-sm">
            0
          </div>
          <p className="text-sm font-medium text-slate-300">No Open Positions</p>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            All grid and manual orders are currently flat. Open a new order or launch an RSI Grid tier to simulate live mark-to-market equity.
          </p>
          <button
            onClick={onOpenOrderModal}
            className="mt-3.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0e1c38] hover:bg-[#152a54] text-cyan-300 border border-cyan-800/60 transition-colors cursor-pointer"
          >
            + Create New Order
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-[#14233f] text-[11px]">
                <th className="py-2.5 px-2">Ticket #</th>
                <th className="py-2.5 px-2">Time (UTC)</th>
                <th className="py-2.5 px-2">Type</th>
                <th className="py-2.5 px-2">Lots</th>
                <th className="py-2.5 px-2">Symbol</th>
                <th className="py-2.5 px-2">Open Price</th>
                <th className="py-2.5 px-2">Current</th>
                <th className="py-2.5 px-2">S / L</th>
                <th className="py-2.5 px-2">T / P</th>
                <th className="py-2.5 px-2 text-right">Swap</th>
                <th className="py-2.5 px-2 text-right">Profit ($)</th>
                <th className="py-2.5 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14233f]/60">
              {positions.map((pos) => {
                const isProfitPos = pos.profit >= 0;
                return (
                  <tr key={pos.ticket} className="hover:bg-[#0c162b] transition-colors">
                    <td className="py-2.5 px-2 text-slate-300 font-semibold">#{pos.ticket}</td>
                    <td className="py-2.5 px-2 text-slate-400">{pos.openTime}</td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          pos.type === 'BUY'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {pos.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-white font-medium">{pos.lots.toFixed(2)}</td>
                    <td className="py-2.5 px-2 text-cyan-300 font-bold">{pos.symbol}</td>
                    <td className="py-2.5 px-2 text-slate-300">{pos.openPrice.toFixed(5)}</td>
                    <td className="py-2.5 px-2 text-white font-semibold">{pos.currentPrice.toFixed(5)}</td>
                    <td className="py-2.5 px-2 text-slate-400">{pos.sl > 0 ? pos.sl.toFixed(5) : '-'}</td>
                    <td className="py-2.5 px-2 text-slate-400">{pos.tp > 0 ? pos.tp.toFixed(5) : '-'}</td>
                    <td className="py-2.5 px-2 text-right text-slate-400">${pos.swap.toFixed(2)}</td>
                    <td
                      className={`py-2.5 px-2 text-right font-bold ${
                        isProfitPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isProfitPos ? '+' : ''}${pos.profit.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => onClosePosition(pos.ticket)}
                        className="px-2 py-0.5 text-[11px] font-medium rounded border border-rose-900 bg-rose-950/50 text-rose-300 hover:bg-rose-900/60 transition-colors cursor-pointer"
                        title="Close position at current market price"
                      >
                        Close
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
