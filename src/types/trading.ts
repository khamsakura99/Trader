export type NavTab = 
  | 'overview' 
  | 'rsi-grid' 
  | 'analytics' 
  | 'positions' 
  | 'deal-ledger' 
  | 'mql5-bridge';

export type ChartTab = 'equity-balance' | 'drawdown' | 'impulse';

export interface Account {
  id: string;
  login: string;
  name: string;
  broker: string;
  server: string;
  leverage: string;
  initialDeposit: number;
  balance: number;
  currency: string;
  isLive: boolean;
}

export interface Quote {
  symbol: string;
  spread: number; // in pips (e.g. 0.6)
  changePercent: number; // e.g. +0.24
  bid: number;
  ask: number;
  digits: number;
  pipMultiplier: number;
  contractSize: number;
  lastDirection?: 'up' | 'down' | null;
}

export interface Position {
  ticket: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  currentPrice: number;
  sl: number;
  tp: number;
  swap: number;
  profit: number;
  openTime: string;
  comment?: string;
}

export interface Deal {
  ticket: number;
  orderTicket: number;
  time: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entry: 'IN' | 'OUT';
  lots: number;
  price: number;
  closePrice?: number;
  sl: number;
  tp: number;
  profit: number;
  commission: number;
  swap: number;
  comment: string;
  balanceAfter: number;
}

export interface CurvePoint {
  date: string;
  timestamp: number;
  equity: number;
  balance: number;
  drawdown: number;
  deltaPl: number;
  event?: string;
}

export interface GridTier {
  tier: number;
  type: 'BUY' | 'SELL';
  price: number;
  lots: number;
  tpPrice: number;
  slPrice: number;
  estProfit: number;
  estRisk: number;
  status: 'pending' | 'triggered' | 'closed';
}

export interface GridConfig {
  symbol: string;
  rsiTimeframe: string;
  rsiPeriod: number;
  rsiOversold: number;
  rsiOverbought: number;
  gridStepPips: number;
  tierCount: number;
  baseLots: number;
  lotMultiplier: number;
  tpPips: number;
  slPips: number;
}
