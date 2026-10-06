import React, { useState } from 'react';
import { MQL5_BRIDGE_CODE } from '../data/initialData';
import { Network, CheckCircle2, Copy, Terminal, Radio, ShieldCheck } from 'lucide-react';

interface Mql5BridgeProps {
  accountLogin: string;
  isWsActive: boolean;
}

export const Mql5Bridge: React.FC<Mql5BridgeProps> = ({ accountLogin, isWsActive }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MQL5_BRIDGE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const samplePackets = [
    `{"type":"TELEMETRY","login":${accountLogin.replace('#', '')},"equity":51611.00,"balance":51611.00,"free_margin":51611.00,"open_positions":0}`,
    `{"type":"TICK","symbol":"EURUSD","bid":1.08641,"ask":1.08647,"time":1728216001290}`,
    `{"type":"TICK","symbol":"GBPUSD","bid":1.29687,"ask":1.29696,"time":1728216001305}`,
    `{"type":"HEARTBEAT_ACK","latency_ms":4.2,"build":4450}`,
  ];

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#091120] border border-[#14233f] p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              MetaTrader 5 Native EA Bridge (MQL5)
            </h2>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono flex items-center gap-1.5 ${
                isWsActive
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isWsActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isWsActive ? 'Bridge Synchronized' : 'Bridge Paused'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero-latency bidirectional telemetry pipeline connecting MetaTrader 5 desktop client to MetaPulse Web Desk.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-[#060b14] px-3 py-1.5 rounded-lg border border-[#14233f]">
            <span className="text-slate-400">Endpoint: </span>
            <span className="text-cyan-300">wss://feed.metapulse.io/ws/v1</span>
          </div>
          <div className="bg-[#060b14] px-3 py-1.5 rounded-lg border border-[#14233f]">
            <span className="text-slate-400">Latency: </span>
            <span className="text-emerald-400 font-bold">4.2 ms</span>
          </div>
        </div>
      </div>

      {/* 2 Columns: Bridge Setup + MQL5 Source Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Connection Info & Live Packet Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#091120] border border-[#14233f] rounded-xl p-4 space-y-3 font-mono text-xs">
            <h3 className="text-sm font-bold text-white border-b border-[#14233f] pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Bridge Gateway Specifications
            </h3>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-[#14233f]/40">
                <span className="text-slate-400">Target Terminal:</span>
                <span className="text-white font-semibold">MetaTrader 5 Build 4450 x64</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#14233f]/40">
                <span className="text-slate-400">Account Verified:</span>
                <span className="text-cyan-300">{accountLogin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#14233f]/40">
                <span className="text-slate-400">Handshake Protocol:</span>
                <span className="text-white">WebSocket TLS / MT5 IPC</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#14233f]/40">
                <span className="text-slate-400">Tick Buffer Frequency:</span>
                <span className="text-white">1,000 ms Heartbeat</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#14233f]/40">
                <span className="text-slate-400">Order Routing:</span>
                <span className="text-emerald-400 font-bold">Enabled (Trade Allowed)</span>
              </div>
            </div>
          </div>

          {/* Packet Terminal Stream */}
          <div className="bg-[#091120] border border-[#14233f] rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#14233f] pb-2">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Raw Socket Packet Monitor
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" /> STREAMING
              </span>
            </div>

            <div className="mt-3 bg-[#050c18] border border-[#14233f] rounded-lg p-2.5 space-y-1.5 overflow-x-auto text-[11px] text-slate-300 max-h-48">
              {samplePackets.map((pkt, i) => (
                <div key={i} className="flex gap-2 text-slate-400">
                  <span className="text-slate-600 shrink-0">[{i + 1}]</span>
                  <span className="text-cyan-300 break-all">{pkt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Expert Advisor MQL5 Code (7 cols) */}
        <div className="lg:col-span-7 bg-[#091120] border border-[#14233f] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#14233f] pb-2">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">MetaPulse_Bridge.mq5</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Compile in MetaEditor 5 and attach to any chart on {accountLogin}.
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy MQL5 Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block */}
            <div className="mt-3 bg-[#050c18] border border-[#14233f] rounded-lg p-3 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto">
              <pre className="text-[11px] leading-relaxed select-text">{MQL5_BRIDGE_CODE}</pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#14233f] text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Requires: MT5 &quot;Allow WebRequest for URL: https://feed.metapulse.io&quot;</span>
            <span className="text-emerald-400 font-semibold">Status: Ready to Attach</span>
          </div>
        </div>
      </div>
    </div>
  );
};
