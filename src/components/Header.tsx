import React from 'react';
import { NavTab } from '../types/trading';
import { Play, Pause, Plus, Activity } from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  openPositionsCount: number;
  dealLedgerCount: number;
  isWsActive: boolean;
  onToggleWs: () => void;
  onOpenOrderModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  openPositionsCount,
  dealLedgerCount,
  isWsActive,
  onToggleWs,
  onOpenOrderModal,
}) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'rsi-grid', label: 'RSI Grid Order' },
    { id: 'analytics', label: 'Analytics Matrix' },
    { id: 'positions', label: `Open Positions (${openPositionsCount})` },
    { id: 'deal-ledger', label: `Deal Ledger (${dealLedgerCount})` },
    { id: 'mql5-bridge', label: 'MQL5 Bridge' },
  ];

  return (
    <header className="w-full bg-[#070d19] border-b border-[#131f37] px-5 py-3 flex items-center justify-between text-sm select-none sticky top-0 z-40">
      {/* Brand Zone */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onTabChange('overview')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-7 h-7 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm shadow-cyan-500/20">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
            MetaPulse MT5
          </span>
        </button>
      </div>

      {/* Nav Links Center */}
      <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1.5 rounded text-xs xl:text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d182e]'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-[-13px] left-2 right-2 h-[2px] bg-cyan-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Zone Right */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onToggleWs}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
            isWsActive
              ? 'bg-[#0b162c] border-[#1d3056] text-amber-300 hover:bg-[#102040]'
              : 'bg-[#1b1e2b] border-[#363b52] text-slate-300 hover:bg-[#252a3d]'
          }`}
          title={isWsActive ? 'Pause live WebSocket price stream' : 'Resume live WebSocket price stream'}
        >
          {isWsActive ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>Pause WS Feed</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Resume WS Feed</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenOrderModal}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs xl:text-sm px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New MT5 Order</span>
        </button>
      </div>
    </header>
  );
};
