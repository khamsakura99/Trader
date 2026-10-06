import React from 'react';
import { Account } from '../types/trading';
import { KeyRound, Download } from 'lucide-react';

interface AccountBarProps {
  accounts: Account[];
  selectedAccountId: string;
  onSelectAccount: (accountId: string) => void;
  onOpenLoginModal: () => void;
  onExportCsv: () => void;
  lastSyncEvent: string;
  isWsActive: boolean;
}

export const AccountBar: React.FC<AccountBarProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onOpenLoginModal,
  onExportCsv,
  lastSyncEvent,
  isWsActive,
}) => {
  const currentAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  return (
    <div className="w-full bg-[#070d19] px-5 pt-3 pb-4 border-b border-[#131f37]/70">
      {/* Top Metadata / Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tracking-tight flex-wrap">
        <span>MT5 Prime Liquidity</span>
        <span className="text-slate-600">·</span>
        <span>{currentAccount.broker}</span>
        <span className="text-slate-600">·</span>
        <span>ECN Institutional</span>
        <span className="text-slate-600">·</span>
        <span>{currentAccount.leverage}</span>
        <span className="text-slate-600">·</span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              isWsActive
                ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400'
                : 'bg-amber-400'
            }`}
          />
          <span className={isWsActive ? 'text-emerald-400' : 'text-amber-400'}>
            {isWsActive ? 'WebSocket Live Sync Active' : 'WebSocket Feed Paused'}
          </span>
        </span>
      </div>

      {/* Account Title */}
      <div className="mt-2 flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {currentAccount.name} — Login {currentAccount.login}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-400 font-mono mt-0.5 font-medium">
            Last Sync Event: {lastSyncEvent}
          </p>
        </div>
      </div>

      {/* Account switcher pills & action buttons */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {accounts.map((acc) => {
          const isSelected = acc.id === selectedAccountId;
          return (
            <button
              key={acc.id}
              onClick={() => onSelectAccount(acc.id)}
              className={`px-3 py-1.5 rounded-lg border font-mono transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#0f1d38] border-cyan-500/80 text-cyan-200 font-semibold shadow-sm shadow-cyan-950'
                  : 'bg-[#0a1222] border-[#182744] text-slate-400 hover:text-slate-200 hover:border-[#243a63]'
              }`}
            >
              {acc.login} ({acc.broker.includes('Apex') ? 'Apex' : acc.broker.includes('Krono') ? 'Krono' : 'MetaQuotes'})
            </button>
          );
        })}

        <button
          onClick={onOpenLoginModal}
          className="px-3 py-1.5 rounded-lg border border-emerald-600/60 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-500 font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
          <span>Login MT5 Account</span>
        </button>

        <button
          onClick={onExportCsv}
          className="px-3 py-1.5 rounded-lg border border-[#1e2f4f] bg-[#0c162b] text-slate-300 hover:bg-[#12203d] hover:text-white font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export MT5 CSV</span>
        </button>
      </div>
    </div>
  );
};
