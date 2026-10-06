import { Account, Quote, Deal, CurvePoint, GridConfig } from '../types/trading';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'metaquotes-1',
    login: '#55941732',
    name: 'MetaQuotes Demo Desk',
    broker: 'Tickmill-Live',
    server: 'Tickmill-Live',
    leverage: '1:100',
    initialDeposit: 50000,
    balance: 51611.00,
    currency: 'USD',
    isLive: false,
  },
  {
    id: 'metaquotes-2',
    login: '#51049281',
    name: 'MetaQuotes Live Alpha',
    broker: 'Tickmill-Live',
    server: 'Tickmill-Live',
    leverage: '1:100',
    initialDeposit: 100000,
    balance: 104250.00,
    currency: 'USD',
    isLive: true,
  },
  {
    id: 'apex-1',
    login: '#50819422',
    name: 'Apex Prop Master',
    broker: 'Apex Trader Funding',
    server: 'Apex-Server-04',
    leverage: '1:100',
    initialDeposit: 25000,
    balance: 26840.00,
    currency: 'USD',
    isLive: true,
  },
  {
    id: 'krono-1',
    login: '#50934108',
    name: 'Krono Quant Capital',
    broker: 'Krono Prime',
    server: 'Krono-ECN-01',
    leverage: '1:200',
    initialDeposit: 50000,
    balance: 53120.00,
    currency: 'USD',
    isLive: true,
  },
];

export const INITIAL_QUOTES: Quote[] = [
  {
    symbol: 'EURUSD',
    spread: 0.6,
    changePercent: 0.24,
    bid: 1.08641,
    ask: 1.08647,
    digits: 5,
    pipMultiplier: 0.0001,
    contractSize: 100000,
  },
  {
    symbol: 'GBPUSD',
    spread: 0.9,
    changePercent: 0.95,
    bid: 1.29687,
    ask: 1.29696,
    digits: 5,
    pipMultiplier: 0.0001,
    contractSize: 100000,
  },
  {
    symbol: 'USDJPY',
    spread: 0.8,
    changePercent: 0.27,
    bid: 149.990,
    ask: 149.998,
    digits: 3,
    pipMultiplier: 0.01,
    contractSize: 100000,
  },
  {
    symbol: 'XAUUSD',
    spread: 2.2,
    changePercent: 1.39,
    bid: 2667.23,
    ask: 2667.45,
    digits: 2,
    pipMultiplier: 0.1,
    contractSize: 100,
  },
  {
    symbol: 'NAS100',
    spread: 0.8,
    changePercent: 0.66,
    bid: 20511.22,
    ask: 20512.02,
    digits: 2,
    pipMultiplier: 1.0,
    contractSize: 20,
  },
  {
    symbol: 'AUDUSD',
    spread: 0.7,
    changePercent: 0.13,
    bid: 0.67514,
    ask: 0.67521,
    digits: 5,
    pipMultiplier: 0.0001,
    contractSize: 100000,
  },
];

export const INITIAL_CURVE_POINTS: CurvePoint[] = [
  {
    date: 'Sep 01',
    timestamp: 1725148800000,
    equity: 50000.00,
    balance: 50000.00,
    drawdown: 0.00,
    deltaPl: 0.00,
    event: 'Baseline Deposit: $50,000.00 USD',
  },
  {
    date: 'Oct 04',
    timestamp: 1728000000000,
    equity: 50805.50,
    balance: 50805.50,
    drawdown: 0.00,
    deltaPl: 805.50,
    event: 'Deal #84710291 EURUSD BUY +$805.50',
  },
  {
    date: 'Oct 06',
    timestamp: 1728172800000,
    equity: 51611.00,
    balance: 51611.00,
    drawdown: 0.00,
    deltaPl: 805.50,
    event: 'Deal #84718442 GBPUSD BUY +$805.50 (Grid tier up-80-90 CLOSE executed)',
  },
  {
    date: 'LIVE',
    timestamp: 1728216000000,
    equity: 51611.00,
    balance: 51611.00,
    drawdown: 0.00,
    deltaPl: 0.00,
    event: 'WebSocket Real-Time Feed Active',
  },
];

export const INITIAL_DEALS: Deal[] = [
  {
    ticket: 84710291,
    orderTicket: 9140231,
    time: '2026-10-04 14:22:10',
    symbol: 'EURUSD',
    type: 'BUY',
    entry: 'OUT',
    lots: 1.00,
    price: 1.08210,
    closePrice: 1.08620,
    sl: 1.07800,
    tp: 1.08620,
    profit: 805.50,
    commission: -4.50,
    swap: 0.00,
    comment: 'Grid tier up-70-80 TP executed',
    balanceAfter: 50805.50,
  },
  {
    ticket: 84718442,
    orderTicket: 9144820,
    time: '2026-10-06 09:15:33',
    symbol: 'GBPUSD',
    type: 'BUY',
    entry: 'OUT',
    lots: 1.00,
    price: 1.29150,
    closePrice: 1.29560,
    sl: 1.28700,
    tp: 1.29560,
    profit: 805.50,
    commission: -4.50,
    swap: 0.00,
    comment: 'Grid tier up-80-90 CLOSE executed',
    balanceAfter: 51611.00,
  },
];

export const DEFAULT_GRID_CONFIG: GridConfig = {
  symbol: 'EURUSD',
  rsiTimeframe: 'M15',
  rsiPeriod: 14,
  rsiOversold: 30,
  rsiOverbought: 70,
  gridStepPips: 15,
  tierCount: 5,
  baseLots: 0.20,
  lotMultiplier: 1.2,
  tpPips: 25,
  slPips: 80,
};

export const MQL5_BRIDGE_CODE = `//+------------------------------------------------------------------+
//|                                            MetaPulse_Bridge.mq5   |
//|                   Copyright 2026, MetaPulse Algorithmic Systems  |
//|                                    https://metapulse-mt5.io       |
//+------------------------------------------------------------------+
#property copyright "MetaPulse Algorithmic Systems"
#property link      "https://metapulse-mt5.io"
#property version   "3.40"
#property strict

//--- Input parameters
input string   InpWsUrl         = "wss://feed.metapulse.io/ws/v1"; // WebSocket Server Endpoint
input string   InpApiKey        = "mp_live_9f81a7b8e281";           // MetaPulse Desk API Key
input int      InpHeartbeatMs   = 1000;                              // Telemetry Frequency (ms)
input bool     InpStreamTicks   = true;                              // Stream Real-Time ECN Ticks
input bool     InpAutoSyncDeals = true;                              // Auto-Sync Execution Deals

int socket_handle = INVALID_HANDLE;
datetime last_sync_time = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   PrintFormat("MetaPulse MT5 Bridge initialized for account #%I64d", AccountInfoInteger(ACCOUNT_LOGIN));
   EventSetMillisecondTimer(InpHeartbeatMs);
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   EventKillTimer();
   Print("MetaPulse MT5 Bridge disconnected.");
}

//+------------------------------------------------------------------+
//| Timer event: Emit Curve Telemetry and Account Equity             |
//+------------------------------------------------------------------+
void OnTimer()
{
   double equity   = AccountInfoDouble(ACCOUNT_EQUITY);
   double balance  = AccountInfoDouble(ACCOUNT_BALANCE);
   double margin   = AccountInfoDouble(ACCOUNT_MARGIN);
   double free_m   = AccountInfoDouble(ACCOUNT_MARGIN_FREE);
   int    positions= PositionsTotal();
   
   string payload = StringFormat(
      "{\\"type\\":\\"TELEMETRY\\",\\"login\\":%I64d,\\"equity\\":%.2f,\\"balance\\":%.2f,\\"free_margin\\":%.2f,\\"open_positions\\":%d}",
      AccountInfoInteger(ACCOUNT_LOGIN), equity, balance, free_m, positions
   );
   
   // Socket frame dispatch to MetaPulse Web Desk
}

//+------------------------------------------------------------------+
//| TradeTransaction event: Sync Real-Time Order & Deal Ledger       |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction& trans,
                        const MqlTradeRequest& request,
                        const MqlTradeResult& result)
{
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
   {
      PrintFormat("Deal added: #%I64d, Profit: %.2f", trans.deal, trans.profit);
   }
}
`;
