import React, { useState, useEffect, useMemo } from 'react';
import {
  NavTab,
  Account,
  Quote,
  Position,
  Deal,
  CurvePoint,
  GridTier,
} from './types/trading';
import {
  INITIAL_ACCOUNTS,
  INITIAL_QUOTES,
  INITIAL_CURVE_POINTS,
  INITIAL_DEALS,
} from './data/initialData';
import { Header } from './components/Header';
import { AccountBar } from './components/AccountBar';
import { KpiMetricsRow } from './components/KpiMetricsRow';
import { TelemetryChart } from './components/TelemetryChart';
import { MarketWatch } from './components/MarketWatch';
import { PositionsTable } from './components/PositionsTable';
import { RsiGridOrder } from './components/RsiGridOrder';
import { AnalyticsMatrix } from './components/AnalyticsMatrix';
import { DealLedger } from './components/DealLedger';
import { Mql5Bridge } from './components/Mql5Bridge';
import { OrderModal } from './components/OrderModal';
import { LoginModal } from './components/LoginModal';
import { exportDealsToCsv } from './utils/exportCsv';

export default function App() {
  // Navigation & View
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');

  // Accounts
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('metaquotes-1');

  // Live ECN Quotes
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [isWsActive, setIsWsActive] = useState<boolean>(true);

  // Positions & Deals
  const [positions, setPositions] = useState<Position[]>([]);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);

  // Curve Telemetry
  const [curvePoints, setCurvePoints] = useState<CurvePoint[]>(INITIAL_CURVE_POINTS);
  const [lastSyncEvent, setLastSyncEvent] = useState<string>(
    'Grid tier up-80-90 CLOSE executed'
  );

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedSymbolForTrade, setSelectedSymbolForTrade] = useState('EURUSD');

  // Current active account
  const currentAccount = useMemo(() => {
    return accounts.find((a) => a.id === selectedAccountId) || accounts[0];
  }, [accounts, selectedAccountId]);

  // Recalculate floating P/L for open positions against current quotes
  const floatingPl = useMemo(() => {
    return positions.reduce((acc, pos) => acc + pos.profit, 0);
  }, [positions]);

  const equity = useMemo(() => {
    return currentAccount.balance + floatingPl;
  }, [currentAccount.balance, floatingPl]);

  // Margin calculation
  const totalMargin = useMemo(() => {
    return positions.reduce((acc, pos) => {
      const q = quotes.find((quote) => quote.symbol === pos.symbol);
      const contractSize = q ? q.contractSize : 100000;
      return acc + (pos.lots * contractSize) / 100;
    }, 0);
  }, [positions, quotes]);

  const freeMargin = useMemo(() => {
    return equity - totalMargin;
  }, [equity, totalMargin]);

  const marginLevel = useMemo(() => {
    return totalMargin > 0 ? (equity / totalMargin) * 100 : null;
  }, [equity, totalMargin]);

  // Performance calculations
  const totalWinningDeals = useMemo(() => {
    return deals.filter((d) => d.profit > 0).length;
  }, [deals]);

  const winRatePercent = useMemo(() => {
    return deals.length > 0 ? (totalWinningDeals / deals.length) * 100 : 100;
  }, [deals, totalWinningDeals]);

  const profitFactor = useMemo(() => {
    const grossProfit = deals.reduce((acc, d) => acc + (d.profit > 0 ? d.profit : 0), 0);
    const grossLoss = deals.reduce((acc, d) => acc + (d.profit < 0 ? Math.abs(d.profit) : 0), 0);
    return grossLoss > 0 ? grossProfit / grossLoss : 9.99;
  }, [deals]);

  const expectedPayoff = useMemo(() => {
    const net = deals.reduce((acc, d) => acc + d.profit, 0);
    return deals.length > 0 ? net / deals.length : 805.50;
  }, [deals]);

  // WebSocket Live Price Streaming Simulator
  useEffect(() => {
    if (!isWsActive) return;

    const interval = setInterval(() => {
      setQuotes((prevQuotes) => {
        // Pick 1-2 random symbols to tick
        const randomIndex = Math.floor(Math.random() * prevQuotes.length);
        return prevQuotes.map((q, idx) => {
          if (idx !== randomIndex) {
            return { ...q, lastDirection: null };
          }
          const deltaDirection = Math.random() > 0.48 ? 1 : -1;
          const deltaPip = deltaDirection * (0.1 + Math.random() * 0.2);
          const priceChange = deltaPip * q.pipMultiplier;

          const newBid = Number((q.bid + priceChange).toFixed(q.digits));
          const newAsk = Number((newBid + q.spread * q.pipMultiplier).toFixed(q.digits));

          return {
            ...q,
            bid: newBid,
            ask: newAsk,
            lastDirection: deltaDirection > 0 ? 'up' : 'down',
          };
        });
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isWsActive]);

  // Recalculate open position profits when quotes tick
  useEffect(() => {
    if (positions.length === 0) return;

    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        const q = quotes.find((item) => item.symbol === pos.symbol);
        if (!q) return pos;

        const currentPrice = pos.type === 'BUY' ? q.bid : q.ask;
        const priceDiff =
          pos.type === 'BUY'
            ? currentPrice - pos.openPrice
            : pos.openPrice - currentPrice;

        const profit = priceDiff * pos.lots * q.contractSize + pos.swap;

        return {
          ...pos,
          currentPrice,
          profit: Number(profit.toFixed(2)),
        };
      })
    );
  }, [quotes]);

  // Update LIVE curve telemetry point when equity shifts
  useEffect(() => {
    setCurvePoints((prev) => {
      const copy = [...prev];
      const liveIndex = copy.findIndex((p) => p.date === 'LIVE');
      if (liveIndex >= 0) {
        copy[liveIndex] = {
          ...copy[liveIndex],
          equity: equity,
          deltaPl: floatingPl,
        };
      }
      return copy;
    });
  }, [equity, floatingPl]);

  // Stress-Test Pip Adjustments
  const handleAdjustPips = (symbol: string, pips: number) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.symbol !== symbol) return q;
        const change = pips * q.pipMultiplier;
        const newBid = Number((q.bid + change).toFixed(q.digits));
        const newAsk = Number((newBid + q.spread * q.pipMultiplier).toFixed(q.digits));
        return {
          ...q,
          bid: newBid,
          ask: newAsk,
          lastDirection: pips > 0 ? 'up' : 'down',
        };
      })
    );

    setLastSyncEvent(`Stress-test ${symbol} ${pips > 0 ? '+' : ''}${pips} pips shift applied`);
  };

  // Open New Order
  const handleExecuteOrder = (order: {
    symbol: string;
    type: 'BUY' | 'SELL';
    lots: number;
    sl: number;
    tp: number;
    comment: string;
  }) => {
    const q = quotes.find((quote) => quote.symbol === order.symbol) || quotes[0];
    const openPrice = order.type === 'BUY' ? q.ask : q.bid;
    const ticket = Math.floor(84720000 + Math.random() * 99999);

    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;

    const newPosition: Position = {
      ticket,
      symbol: order.symbol,
      type: order.type,
      lots: order.lots,
      openPrice,
      currentPrice: openPrice,
      sl: order.sl,
      tp: order.tp,
      swap: 0,
      profit: -Number((q.spread * q.pipMultiplier * order.lots * q.contractSize).toFixed(2)), // Initial spread cost
      openTime: timeStr,
      comment: order.comment,
    };

    setPositions((prev) => [newPosition, ...prev]);
    setLastSyncEvent(`Order #${ticket} ${order.type} ${order.lots} ${order.symbol} placed @ ${openPrice}`);
  };

  // Close single position
  const handleClosePosition = (ticket: number) => {
    const pos = positions.find((p) => p.ticket === ticket);
    if (!pos) return;

    const newBalance = currentAccount.balance + pos.profit;

    // Update account balance
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === selectedAccountId ? { ...acc, balance: newBalance } : acc))
    );

    // Record deal
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
    const newDeal: Deal = {
      ticket: Math.floor(94800000 + Math.random() * 99999),
      orderTicket: pos.ticket,
      time: timeStr,
      symbol: pos.symbol,
      type: pos.type,
      entry: 'OUT',
      lots: pos.lots,
      price: pos.openPrice,
      closePrice: pos.currentPrice,
      sl: pos.sl,
      tp: pos.tp,
      profit: pos.profit,
      commission: -4.50 * pos.lots,
      swap: pos.swap,
      comment: `Close #${pos.ticket} ${pos.profit >= 0 ? 'PROFIT' : 'LOSS'}`,
      balanceAfter: newBalance,
    };

    setDeals((prev) => [newDeal, ...prev]);
    setPositions((prev) => prev.filter((p) => p.ticket !== ticket));
    setLastSyncEvent(`Position #${ticket} closed: P/L ${pos.profit >= 0 ? '+' : ''}$${pos.profit.toFixed(2)}`);
  };

  // Close all positions
  const handleCloseAllPositions = () => {
    let runningBalance = currentAccount.balance;
    const newDeals: Deal[] = [];
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;

    positions.forEach((pos) => {
      runningBalance += pos.profit;
      newDeals.push({
        ticket: Math.floor(94800000 + Math.random() * 99999),
        orderTicket: pos.ticket,
        time: timeStr,
        symbol: pos.symbol,
        type: pos.type,
        entry: 'OUT',
        lots: pos.lots,
        price: pos.openPrice,
        closePrice: pos.currentPrice,
        sl: pos.sl,
        tp: pos.tp,
        profit: pos.profit,
        commission: -4.50 * pos.lots,
        swap: pos.swap,
        comment: `CloseAll #${pos.ticket}`,
        balanceAfter: runningBalance,
      });
    });

    setAccounts((prev) =>
      prev.map((acc) => (acc.id === selectedAccountId ? { ...acc, balance: runningBalance } : acc))
    );
    setDeals((prev) => [...newDeals, ...prev]);
    setPositions([]);
    setLastSyncEvent(`All ${positions.length} open positions liquidated`);
  };

  // Break-even all positions
  const handleBreakEvenAll = () => {
    setPositions((prev) =>
      prev.map((pos) => ({
        ...pos,
        sl: pos.openPrice,
      }))
    );
    setLastSyncEvent('All Stop Loss orders adjusted to entry Break-Even');
  };

  // Deploy RSI Grid Strategy
  const handleDeployGrid = (tiers: GridTier[], symbol: string, note: string) => {
    const q = quotes.find((quote) => quote.symbol === symbol) || quotes[0];
    const firstTier = tiers[0];
    const ticket = Math.floor(84730000 + Math.random() * 99999);
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;

    // Open first tier immediately as active market order
    const initialPos: Position = {
      ticket,
      symbol,
      type: firstTier.type,
      lots: firstTier.lots,
      openPrice: firstTier.price,
      currentPrice: firstTier.price,
      sl: firstTier.slPrice,
      tp: firstTier.tpPrice,
      swap: 0,
      profit: 0,
      openTime: timeStr,
      comment: `Grid Tier 1/${tiers.length}`,
    };

    setPositions((prev) => [initialPos, ...prev]);
    setLastSyncEvent(note);
    setCurrentTab('overview');
  };

  // Export CSV
  const handleExportCsv = () => {
    exportDealsToCsv(deals, currentAccount.login, currentAccount.balance, equity);
    setLastSyncEvent(`MT5 CSV Statement exported for ${currentAccount.login}`);
  };

  // Login / Switch account
  const handleLoginAccount = (newAcc: Account) => {
    setAccounts((prev) => {
      const exists = prev.find((a) => a.login === newAcc.login);
      if (exists) return prev;
      return [...prev, newAcc];
    });
    setSelectedAccountId(newAcc.id);
    setLastSyncEvent(`Logged in to MT5 terminal: ${newAcc.name} (${newAcc.server})`);
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Header Zone */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        openPositionsCount={positions.length}
        dealLedgerCount={deals.length}
        isWsActive={isWsActive}
        onToggleWs={() => setIsWsActive((prev) => !prev)}
        onOpenOrderModal={() => {
          setSelectedSymbolForTrade('EURUSD');
          setIsOrderModalOpen(true);
        }}
      />

      {/* 2. Account Bar & Breadcrumb Strip */}
      <AccountBar
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onExportCsv={handleExportCsv}
        lastSyncEvent={lastSyncEvent}
        isWsActive={isWsActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto pb-10">
        {currentTab === 'overview' && (
          <div className="space-y-1">
            {/* 3. 6 KPI Metric Cards Row */}
            <KpiMetricsRow
              equity={equity}
              balance={currentAccount.balance}
              initialDeposit={currentAccount.initialDeposit}
              floatingPl={floatingPl}
              openPositionsCount={positions.length}
              profitFactor={profitFactor}
              winRatePercent={winRatePercent}
              winningDeals={totalWinningDeals}
              totalDeals={deals.length}
              maximalDrawdownPercent={0.00}
              peakToValley={0.00}
              freeMargin={freeMargin}
              marginLevel={marginLevel}
            />

            {/* 4. Central Telemetry Area: Left Chart (65%) + Right Market Watch (35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-5">
              <div className="lg:col-span-8">
                <TelemetryChart
                  curvePoints={curvePoints}
                  deals={deals}
                  equity={equity}
                  balance={currentAccount.balance}
                  initialDeposit={currentAccount.initialDeposit}
                  floatingPl={floatingPl}
                  maximalDrawdown={0.00}
                />
              </div>

              <div className="lg:col-span-4">
                <MarketWatch
                  quotes={quotes}
                  onAdjustPips={handleAdjustPips}
                  onSelectSymbolForTrade={(sym) => {
                    setSelectedSymbolForTrade(sym);
                    setIsOrderModalOpen(true);
                  }}
                  expectedPayoff={expectedPayoff}
                  sharpeRatio={8.58}
                />
              </div>
            </div>

            {/* 5. Bottom Section: Active Open Positions */}
            <div className="px-5">
              <PositionsTable
                positions={positions}
                onClosePosition={handleClosePosition}
                onCloseAllPositions={handleCloseAllPositions}
                onBreakEvenAll={handleBreakEvenAll}
                onOpenOrderModal={() => setIsOrderModalOpen(true)}
              />
            </div>
          </div>
        )}

        {currentTab === 'rsi-grid' && (
          <RsiGridOrder quotes={quotes} onDeployGrid={handleDeployGrid} />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsMatrix
            deals={deals}
            equity={equity}
            balance={currentAccount.balance}
            initialDeposit={currentAccount.initialDeposit}
            sharpeRatio={8.58}
            profitFactor={profitFactor}
          />
        )}

        {currentTab === 'positions' && (
          <div className="p-5 max-w-7xl mx-auto space-y-4">
            <PositionsTable
              positions={positions}
              onClosePosition={handleClosePosition}
              onCloseAllPositions={handleCloseAllPositions}
              onBreakEvenAll={handleBreakEvenAll}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
            />
          </div>
        )}

        {currentTab === 'deal-ledger' && (
          <DealLedger
            deals={deals}
            accountLogin={currentAccount.login}
            onExportCsv={handleExportCsv}
          />
        )}

        {currentTab === 'mql5-bridge' && (
          <Mql5Bridge accountLogin={currentAccount.login} isWsActive={isWsActive} />
        )}
      </main>

      {/* Order Execution Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        quotes={quotes}
        initialSymbol={selectedSymbolForTrade}
        onExecuteOrder={handleExecuteOrder}
      />

      {/* Account Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginAccount}
      />
    </div>
  );
}
