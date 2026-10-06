import { Deal } from '../types/trading';

export function exportDealsToCsv(deals: Deal[], accountLogin: string, balance: number, equity: number) {
  const headers = [
    'Deal Ticket',
    'Order Ticket',
    'Time (UTC)',
    'Symbol',
    'Type',
    'Direction',
    'Volume (Lots)',
    'Open Price',
    'Close Price',
    'Stop Loss',
    'Take Profit',
    'Commission ($)',
    'Swap ($)',
    'Net Profit ($)',
    'Balance After ($)',
    'Comment',
  ];

  const rows = deals.map(deal => [
    deal.ticket,
    deal.orderTicket,
    `"${deal.time}"`,
    deal.symbol,
    deal.type,
    deal.entry,
    deal.lots.toFixed(2),
    deal.price.toFixed(5),
    (deal.closePrice ?? deal.price).toFixed(5),
    deal.sl ? deal.sl.toFixed(5) : '0.00000',
    deal.tp ? deal.tp.toFixed(5) : '0.00000',
    deal.commission.toFixed(2),
    deal.swap.toFixed(2),
    deal.profit.toFixed(2),
    deal.balanceAfter.toFixed(2),
    `"${deal.comment}"`,
  ]);

  const csvContent = [
    `# MetaPulse MT5 Deal Ledger Statement - Account ${accountLogin}`,
    `# Generated at ${new Date().toISOString()} | Equity: $${equity.toFixed(2)} | Balance: $${balance.toFixed(2)}`,
    headers.join(','),
    ...rows.map(r => r.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `MT5_Deals_${accountLogin.replace(/[^a-zA-Z0-9]/g, '')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
