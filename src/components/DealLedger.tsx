import React, { useState } from 'react';
import { Deal } from '../types/trading';
import { History, Download, Search, Filter, CheckCircle2 } from 'lucide-react';

interface DealLedgerProps {
  deals: Deal[];
  accountLogin: string;
  onExportCsv: () => void;
}

export const DealLedger: React.FC<DealLedgerProps> = ({ deals, accountLogin, onExportCsv }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSymbol, setFilterSymbol] = useState('ALL');

  const symbols = ['ALL', ...Array.from(new Set(deals.map((d) => d.symbol)))];

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.ticket.toString().includes(searchTerm) ||
      deal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSymbol = filterSymbol === 'ALL' || deal.symbol === filterSymbol;
    return matchesSearch && matchesSymbol;
  });

  const totalGrossProfit = deals.reduce((acc, d) => acc + (d.profit > 0 ? d.profit : 0), 0);
  const totalGrossLoss = deals.reduce((acc, d) => acc + (d.profit < 0 ? Math.abs(d.profit) : 0), 0);
  const totalCommission = deals.reduce((acc, d) => acc + d.commission, 0);
  const totalSwap = deals.reduce((acc, d) => acc + d.swap, 0);
  const totalNetProfit = deals.reduce((acc, d) => acc + d.profit, 0);

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#091120] border border-[#14233f] p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              MetaTrader 5 Deal Ledger & Statement
            </h2>
            <span className="text-xs bg-[#0b1b36] text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded font-mono">
              Account {accountLogin}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Complete institutional execution ledger with ticket verification, commissions, and post-trade balance state.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="px-3.5 py-2 rounded-lg bg-[#0e1d38] hover:bg-[#152a52] text-cyan-200 border border-cyan-800/80 font-mono text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export MT5 CSV Statement</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-[#091120] border border-[#14233f] p-3 rounded-lg">
          <span className="text-slate-400 block">Total Deals</span>
          <span className="text-white text-base font-bold">{deals.length}</span>
        </div>
        <div className="bg-[#091120] border border-[#14233f] p-3 rounded-lg">
          <span className="text-slate-400 block">Gross Profit</span>
          <span className="text-emerald-400 text-base font-bold">+${totalGrossProfit.toFixed(2)}</span>
        </div>
        <div className="bg-[#091120] border border-[#14233f] p-3 rounded-lg">
          <span className="text-slate-400 block">Total Commissions</span>
          <span className="text-slate-300 text-base font-bold">${totalCommission.toFixed(2)}</span>
        </div>
        <div className="bg-[#091120] border border-[#14233f] p-3 rounded-lg">
          <span className="text-slate-400 block">Net Closed P/L</span>
          <span className="text-emerald-400 text-base font-bold">+${totalNetProfit.toFixed(2)}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#091120] border border-[#14233f] p-3 rounded-xl text-xs font-mono">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ticket, symbol, comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050c18] border border-[#182744] rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Filter Symbol:</span>
          <select
            value={filterSymbol}
            onChange={(e) => setFilterSymbol(e.target.value)}
            className="bg-[#050c18] border border-[#182744] rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-cyan-500"
          >
            {symbols.map((sym) => (
              <option key={sym} value={sym}>
                {sym}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-[#091120] border border-[#14233f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 bg-[#060b14] border-b border-[#14233f] text-[11px]">
                <th className="py-2.5 px-3">Deal #</th>
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Time (UTC)</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Direction</th>
                <th className="py-2.5 px-3">Lots</th>
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Exit Price</th>
                <th className="py-2.5 px-3 text-right">Comm</th>
                <th className="py-2.5 px-3 text-right">Profit ($)</th>
                <th className="py-2.5 px-3 text-right">Balance</th>
                <th className="py-2.5 px-3">Execution Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14233f]/60">
              {filteredDeals.map((deal) => {
                const isProfit = deal.profit >= 0;
                return (
                  <tr key={deal.ticket} className="hover:bg-[#0c162b] transition-colors">
                    <td className="py-2.5 px-3 text-slate-300 font-bold">#{deal.ticket}</td>
                    <td className="py-2.5 px-3 text-slate-500">#{deal.orderTicket}</td>
                    <td className="py-2.5 px-3 text-slate-400">{deal.time}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          deal.type === 'BUY'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {deal.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-semibold">{deal.entry}</td>
                    <td className="py-2.5 px-3 text-white font-medium">{deal.lots.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">{deal.symbol}</td>
                    <td className="py-2.5 px-3 text-slate-300">{deal.price.toFixed(5)}</td>
                    <td className="py-2.5 px-3 text-slate-200">
                      {deal.closePrice ? deal.closePrice.toFixed(5) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">${deal.commission.toFixed(2)}</td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold ${
                        isProfit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isProfit ? '+' : ''}${deal.profit.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-cyan-200 font-semibold">
                      ${deal.balanceAfter.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-xs">
                      {deal.comment}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
