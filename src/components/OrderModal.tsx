import React, { useState } from 'react';
import { Quote, Position } from '../types/trading';
import { X, ShieldCheck, Zap } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: Quote[];
  initialSymbol?: string;
  onExecuteOrder: (order: {
    symbol: string;
    type: 'BUY' | 'SELL';
    lots: number;
    sl: number;
    tp: number;
    comment: string;
  }) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  quotes,
  initialSymbol = 'EURUSD',
  onExecuteOrder,
}) => {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [lots, setLots] = useState(1.0);
  const [slPips, setSlPips] = useState(30);
  const [tpPips, setTpPips] = useState(45);
  const [comment, setComment] = useState('MetaPulse Order');

  if (!isOpen) return null;

  const quote = quotes.find((q) => q.symbol === symbol) || quotes[0];
  const pipMult = quote.pipMultiplier;

  // Real-time calculations
  const buyPrice = quote.ask;
  const sellPrice = quote.bid;

  const buySl = slPips > 0 ? Number((buyPrice - slPips * pipMult).toFixed(quote.digits)) : 0;
  const buyTp = tpPips > 0 ? Number((buyPrice + tpPips * pipMult).toFixed(quote.digits)) : 0;

  const sellSl = slPips > 0 ? Number((sellPrice + slPips * pipMult).toFixed(quote.digits)) : 0;
  const sellTp = tpPips > 0 ? Number((sellPrice - tpPips * pipMult).toFixed(quote.digits)) : 0;

  // Margin calculation: lots * contractSize / 100 leverage
  const requiredMargin = (lots * quote.contractSize) / 100;
  const pipValue = lots * quote.contractSize * pipMult;

  const handleBuy = () => {
    onExecuteOrder({
      symbol,
      type: 'BUY',
      lots,
      sl: buySl,
      tp: buyTp,
      comment: comment || 'Market Buy Execution',
    });
    onClose();
  };

  const handleSell = () => {
    onExecuteOrder({
      symbol,
      type: 'SELL',
      lots,
      sl: sellSl,
      tp: sellTp,
      comment: comment || 'Market Sell Execution',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#091120] border border-[#14233f] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 bg-[#070d19] border-b border-[#14233f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">New MetaTrader 5 Order</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#131f37] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 font-mono text-xs">
          {/* Symbol Selector */}
          <div>
            <label className="text-slate-400 block mb-1">Symbol Instrument</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
            >
              {quotes.map((q) => (
                <option key={q.symbol} value={q.symbol}>
                  {q.symbol} — Spread: {q.spread.toFixed(1)}p | Bid: {q.bid.toFixed(q.digits)}
                </option>
              ))}
            </select>
          </div>

          {/* Volume Lots & Quick buttons */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-400">Volume (Lots)</label>
              <div className="flex gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setLots(Number((lots + 0.1).toFixed(2)))}
                  className="px-1.5 py-0.5 rounded bg-[#0e1930] hover:bg-[#16274a] text-slate-300 border border-[#1b2b48] cursor-pointer"
                >
                  +0.1
                </button>
                <button
                  type="button"
                  onClick={() => setLots(Number((lots + 1.0).toFixed(2)))}
                  className="px-1.5 py-0.5 rounded bg-[#0e1930] hover:bg-[#16274a] text-slate-300 border border-[#1b2b48] cursor-pointer"
                >
                  +1.0
                </button>
                <button
                  type="button"
                  onClick={() => setLots(0.5)}
                  className="px-1.5 py-0.5 rounded bg-[#0e1930] hover:bg-[#16274a] text-slate-300 border border-[#1b2b48] cursor-pointer"
                >
                  0.5
                </button>
                <button
                  type="button"
                  onClick={() => setLots(1.0)}
                  className="px-1.5 py-0.5 rounded bg-[#0e1930] hover:bg-[#16274a] text-cyan-300 border border-cyan-800 cursor-pointer"
                >
                  1.0
                </button>
              </div>
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={lots}
              onChange={(e) => setLots(Math.max(0.01, Number(e.target.value)))}
              className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2.5 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* SL & TP Pips */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Stop Loss (Pips)</label>
              <input
                type="number"
                value={slPips}
                onChange={(e) => setSlPips(Number(e.target.value))}
                className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Take Profit (Pips)</label>
              <input
                type="number"
                value={tpPips}
                onChange={(e) => setTpPips(Number(e.target.value))}
                className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-slate-400 block mb-1">Order Comment</label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. MetaPulse Grid / Scalp"
            />
          </div>

          {/* Execution Telemetry Box */}
          <div className="bg-[#050c18] border border-[#14233f] rounded-lg p-2.5 space-y-1 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Required Margin (1:100):</span>
              <span className="text-white font-bold">${requiredMargin.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pip Value:</span>
              <span className="text-cyan-300 font-bold">${pipValue.toFixed(2)} / pip</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Risk at SL:</span>
              <span className="text-rose-400">-${(pipValue * slPips).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Reward at TP:</span>
              <span className="text-emerald-400 font-semibold">+${(pipValue * tpPips).toFixed(2)}</span>
            </div>
          </div>

          {/* Big Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleSell}
              className="bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold py-3 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg shadow-rose-950"
            >
              <span className="text-xs">SELL</span>
              <span className="text-sm">{sellPrice.toFixed(quote.digits)}</span>
            </button>

            <button
              onClick={handleBuy}
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-3 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg shadow-blue-950"
            >
              <span className="text-xs">BUY</span>
              <span className="text-sm">{buyPrice.toFixed(quote.digits)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
