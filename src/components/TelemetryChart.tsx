import React, { useState } from 'react';
import { ChartTab, CurvePoint, Deal } from '../types/trading';

interface TelemetryChartProps {
  curvePoints: CurvePoint[];
  deals: Deal[];
  equity: number;
  balance: number;
  initialDeposit: number;
  floatingPl: number;
  maximalDrawdown: number;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  curvePoints,
  deals,
  equity,
  balance,
  initialDeposit,
  floatingPl,
  maximalDrawdown,
}) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('equity-balance');
  const [hoveredPoint, setHoveredPoint] = useState<CurvePoint | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // SVG Chart Dimensions
  const svgWidth = 720;
  const svgHeight = 270;
  const padding = { top: 25, right: 35, bottom: 35, left: 65 };

  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  // Min / Max calculations
  const minY = 49800;
  const maxY = 51900;
  const yLabels = [51900, 51400, 50900, 50300, 49800];

  // Coordinate mapping
  const getX = (index: number, total: number) => {
    if (total <= 1) return padding.left + innerWidth / 2;
    return padding.left + (index / (total - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    const ratio = (clamped - minY) / (maxY - minY);
    return padding.top + (1 - ratio) * innerHeight;
  };

  // Generate SVG path strings
  const equityPointsStr = curvePoints
    .map((pt, i) => `${getX(i, curvePoints.length)},${getY(pt.equity)}`)
    .join(' L ');
  const equityPath = `M ${equityPointsStr}`;

  // Area path for gradient fill
  const equityAreaPath = `${equityPath} L ${getX(
    curvePoints.length - 1,
    curvePoints.length
  )},${padding.top + innerHeight} L ${padding.left},${padding.top + innerHeight} Z`;

  // Balance stepped / dotted path
  const balancePointsStr = curvePoints
    .map((pt, i) => `${getX(i, curvePoints.length)},${getY(pt.balance)}`)
    .join(' L ');
  const balancePath = `M ${balancePointsStr}`;

  // Underwater Drawdown calculations
  const ddPointsStr = curvePoints
    .map((pt, i) => {
      const x = getX(i, curvePoints.length);
      const ddPercent = pt.drawdown || 0;
      // map 0% to 0, -5% to innerHeight
      const y = padding.top + (Math.abs(ddPercent) / 5) * innerHeight;
      return `${x},${Math.min(padding.top + innerHeight, y)}`;
    })
    .join(' L ');
  const ddPath = `M ${ddPointsStr}`;
  const ddAreaPath = `${ddPath} L ${getX(
    curvePoints.length - 1,
    curvePoints.length
  )},${padding.top} L ${padding.left},${padding.top} Z`;

  return (
    <div className="bg-[#091120] border border-[#14233f] rounded-xl p-4 flex flex-col justify-between h-full">
      {/* Top Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#14233f] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="font-semibold text-white">Real-Time Curve Telemetry</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Baseline Deposit ${initialDeposit.toLocaleString()}</span>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-[#060b14] p-1 rounded-lg border border-[#14233f] shrink-0 text-xs">
            <button
              onClick={() => setActiveTab('equity-balance')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeTab === 'equity-balance'
                  ? 'bg-[#122345] text-cyan-200 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Equity & Balance
            </button>
            <button
              onClick={() => setActiveTab('drawdown')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeTab === 'drawdown'
                  ? 'bg-[#122345] text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Underwater Drawdown
            </button>
            <button
              onClick={() => setActiveTab('impulse')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeTab === 'impulse'
                  ? 'bg-[#122345] text-emerald-200 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Deal P/L Impulse
            </button>
          </div>
        </div>

        {/* Metric inline readout row */}
        <div className="flex items-center gap-5 sm:gap-7 mt-3 text-xs font-mono tracking-tight flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Equity</span>
            <span className="text-white font-bold text-sm">
              ${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Balance</span>
            <span className="text-cyan-400 font-bold text-sm">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Drawdown</span>
            <span className="text-amber-400 font-bold text-sm">
              -{Math.abs(maximalDrawdown).toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Delta P/L</span>
            <span
              className={`font-bold text-sm ${
                floatingPl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {floatingPl >= 0 ? '+' : '-'}$
              {Math.abs(floatingPl).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Chart Canvas */}
      <div className="relative mt-2 w-full flex-1 min-h-[220px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Linear gradient for Equity area */}
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#082f49" stopOpacity="0.0" />
            </linearGradient>

            {/* Gradient for underwater drawdown */}
            <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis labels */}
          {yLabels.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#122039"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#546583"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ${(val / 1000).toFixed(1)}k
                </text>
              </g>
            );
          })}

          {/* Active Tab View: Equity & Balance */}
          {activeTab === 'equity-balance' && (
            <>
              {/* Equity Gradient Area */}
              <path d={equityAreaPath} fill="url(#equityGradient)" />

              {/* Balance Stepped Line (Dotted Blue/Cyan) */}
              <path
                d={balancePath}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />

              {/* Equity Main Line (Solid Neon Teal/Cyan) */}
              <path
                d={equityPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {curvePoints.map((pt, i) => {
                const cx = getX(i, curvePoints.length);
                const cy = getY(pt.equity);
                const isLive = pt.date === 'LIVE';

                return (
                  <g
                    key={pt.date}
                    className="cursor-pointer group"
                    onMouseEnter={(e) => {
                      setHoveredPoint(pt);
                      setMousePos({ x: cx, y: cy });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {isLive && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="8"
                        fill="#10b981"
                        opacity="0.3"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isLive ? 4.5 : 3.5}
                      fill={isLive ? '#10b981' : '#06b6d4'}
                      stroke="#091120"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </>
          )}

          {/* Underwater Drawdown View */}
          {activeTab === 'drawdown' && (
            <>
              <path d={ddAreaPath} fill="url(#drawdownGradient)" />
              <path
                d={ddPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1={padding.left}
                y1={padding.top}
                x2={svgWidth - padding.right}
                y2={padding.top}
                stroke="#10b981"
                strokeWidth="1.5"
              />
            </>
          )}

          {/* Deal P/L Impulse View */}
          {activeTab === 'impulse' && (
            <g>
              {deals.map((deal, idx) => {
                const x = padding.left + ((idx + 1) / (deals.length + 1)) * innerWidth;
                const barHeight = (deal.profit / 1200) * innerHeight;
                const y = padding.top + innerHeight - barHeight;

                return (
                  <g key={deal.ticket}>
                    <rect
                      x={x - 12}
                      y={y}
                      width={24}
                      height={barHeight}
                      rx="3"
                      fill="#10b981"
                      opacity="0.8"
                    />
                    <text
                      x={x}
                      y={y - 6}
                      fill="#10b981"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      +${deal.profit.toFixed(0)}
                    </text>
                    <text
                      x={x}
                      y={padding.top + innerHeight + 16}
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {deal.symbol}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* X-axis labels */}
          {curvePoints.map((pt, i) => {
            const x = getX(i, curvePoints.length);
            const isLive = pt.date === 'LIVE';

            return (
              <text
                key={pt.date}
                x={x}
                y={svgHeight - 10}
                textAnchor={i === 0 ? 'start' : i === curvePoints.length - 1 ? 'end' : 'middle'}
                fill={isLive ? '#10b981' : '#64748b'}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fontWeight={isLive ? 'bold' : 'normal'}
              >
                {pt.date}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredPoint && mousePos && (
          <div
            className="absolute z-30 pointer-events-none bg-[#050c18]/95 border border-cyan-500/40 rounded-lg p-2.5 shadow-xl text-xs font-mono backdrop-blur-md"
            style={{
              left: `${Math.min(mousePos.x / (svgWidth / 100), 75)}%`,
              top: `${Math.max(10, (mousePos.y / svgHeight) * 100 - 25)}%`,
            }}
          >
            <div className="flex items-center justify-between gap-3 text-slate-400 pb-1 border-b border-[#14233f]">
              <span className="font-semibold text-white">{hoveredPoint.date}</span>
              <span className="text-emerald-400">Equity Point</span>
            </div>
            <div className="mt-1 space-y-0.5">
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Equity:</span>
                <span className="text-white font-bold">${hoveredPoint.equity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Balance:</span>
                <span className="text-cyan-400">${hoveredPoint.balance.toLocaleString()}</span>
              </div>
              {hoveredPoint.event && (
                <div className="pt-1 text-[10px] text-slate-300 border-t border-[#14233f]/60 max-w-[200px]">
                  {hoveredPoint.event}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
