import React, { useState } from 'react';
import { Account } from '../types/trading';
import { X, KeyRound, ShieldAlert, Check } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (account: Account) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [server, setServer] = useState('Tickmill-Live');
  const [loginId, setLoginId] = useState('55941732');
  const [password, setPassword] = useState('••••••••••••');
  const [isInvestor, setIsInvestor] = useState(false);
  const [leverage, setLeverage] = useState('1:100');
  const [balance, setBalance] = useState(50000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      login: `#${loginId.replace('#', '')}`,
      name: `${server.split('-')[0]} ${server.includes('Live') ? 'Live' : 'Demo'} Desk`,
      broker: server,
      server: server,
      leverage: leverage,
      initialDeposit: balance,
      balance: balance + 1611.00,
      currency: 'USD',
      isLive: server.includes('Live'),
    };
    onLogin(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#091120] border border-[#14233f] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-[#070d19] border-b border-[#14233f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Login MetaTrader 5 Account</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#131f37] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-mono text-xs">
          <div>
            <label className="text-slate-400 block mb-1">MT5 Trade Server</label>
            <select
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Tickmill-Live">Tickmill-Live (ECN Institutional)</option>
              <option value="MetaQuotes-Demo">MetaQuotes-Demo</option>
              <option value="FTMO-Server">FTMO-Server (Prop Firm)</option>
              <option value="Apex-Server-04">Apex-Server-04 (Futures/FX)</option>
              <option value="Krono-ECN-01">Krono-ECN-01 (Prime Liquidity)</option>
              <option value="ICMarkets-SC-Live">ICMarkets-SC-Live</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Login Number</label>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Account Leverage</label>
              <select
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="1:30">1:30 (ESMA)</option>
                <option value="1:50">1:50 (US Reg)</option>
                <option value="1:100">1:100 (Standard)</option>
                <option value="1:200">1:200 (ECN)</option>
                <option value="1:500">1:500 (Offshore)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Initial Deposit Baseline ($)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full bg-[#050c18] border border-[#182744] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="investorCheck"
              checked={isInvestor}
              onChange={(e) => setIsInvestor(e.target.checked)}
              className="rounded bg-[#050c18] border-[#182744] text-cyan-500 focus:ring-0"
            />
            <label htmlFor="investorCheck" className="text-slate-300 text-xs cursor-pointer select-none">
              Investor Password (Read-Only Mode)
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Connect to MetaTrader 5 Terminal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
