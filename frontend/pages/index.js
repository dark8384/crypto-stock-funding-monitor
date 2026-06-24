import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function ArbitrageMatrix() {
  const [rates, setRates] = useState(null);
  const [status, setStatus] = useState("Connecting to Stream...");

  useEffect(() => {
    const socket = io("https://funding-bot-backend-mgci.onrender.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setStatus(`Direct Local Stream Update: ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`);
    });

    socket.on("funding_update", (data) => {
      setRates(data);
    });

    return () => socket.disconnect();
  }, []);

  if (!rates) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111] text-white font-mono text-xs">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto mb-3"></div>
          <p>INITIALIZING MULTI-EXCHANGE DATA STREAM...</p>
        </div>
      </div>
    );
  }

  const assetKeys = Object.keys(rates);

  return (
    <div className="bg-[#111215] text-[#d1d4dc] min-h-screen p-4 font-mono text-xs selection:bg-emerald-500/30">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-lg md:text-xl font-bold text-white tracking-wider flex items-center justify-center gap-2 uppercase">
          🚀 MULTI-EXCHANGE FUNDING & SPREAD MONITOR MATRIX 🚀
        </h1>
        <p className="text-[10px] text-red-500 mt-1 flex items-center justify-center gap-1.5 font-bold">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          {status}
        </p>
      </div>

      {/* Dynamic Grid Table */}
      <div className="overflow-x-auto border border-gray-800 rounded bg-[#141519] shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="border-b border-gray-800 text-[11px] font-bold text-emerald-500 bg-[#17191e]">
              <th className="p-3 uppercase">Asset</th>
              <th className="p-3 text-gray-400">Binance / Spot</th>
              <th className="p-3 text-gray-400">Bybit / Futures</th>
              <th className="p-3 text-gray-400">Delta India</th>
              <th className="p-3 text-gray-400">Gate.io</th>
              <th className="p-3 text-gray-400">BingX</th>
              <th className="p-3 text-white">Gross Gap</th>
              <th className="p-3 text-red-400">Spread</th>
              <th className="p-3 text-emerald-400">Est Net Profit</th>
              <th className="p-3 text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {assetKeys.map((key) => {
              const item = rates[key];
              const isTradFi = item.spot !== undefined || item.futures !== undefined;
              
              const valA = isTradFi ? (item.spot || 0) : (item.binance || 0);
              const valB = isTradFi ? (item.futures || 0) : (item.bybit || 0);
              const delta = item.delta_india || 0;
              const gate = item.gate || 0;
              const bingx = item.bingx || 0;

              const gap = Math.abs(valA - valB);
              const spread = isTradFi ? 2.50 : gap * 0.12;
              const netProfit = gap - spread;
              const isHighSpread = !isTradFi && spread > 0.02;

              return (
                <tr key={key} className="hover:bg-[#1c1e24]/40 transition-colors">
                  <td className="p-3 font-bold text-white tracking-wide">{key}</td>
                  <td className="p-3 text-gray-300">
                    {isTradFi ? `$${valA.toFixed(2)}` : `${valA >= 0 ? '+' : ''}${valA.toFixed(4)}%`}
                  </td>
                  <td className="p-3 text-gray-300">
                    {isTradFi ? `$${valB.toFixed(2)}` : `${valB >= 0 ? '+' : ''}${valB.toFixed(4)}%`}
                  </td>
                  <td className="p-3 text-yellow-500 font-semibold">
                    {isTradFi ? "N/A" : `${delta >= 0 ? '+' : ''}${delta.toFixed(4)}%`}
                  </td>
                  <td className="p-3 text-gray-400">
                    {isTradFi ? "N/A" : `${gate >= 0 ? '+' : ''}${gate.toFixed(4)}%`}
                  </td>
                  <td className="p-3 text-gray-400">
                    {isTradFi ? "N/A" : `${bingx >= 0 ? '+' : ''}${bingx.toFixed(4)}%`}
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">
                    {isTradFi ? `$${gap.toFixed(2)}` : `${gap.toFixed(4)}%`}
                  </td>
                  <td className="p-3 text-red-500">
                    {isTradFi ? `$${spread.toFixed(2)}` : `${spread.toFixed(4)}%`}
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">
                    {isTradFi ? `+$${netProfit.toFixed(2)}` : `+${netProfit.toFixed(4)}%`}
                  </td>
                  <td className="p-3 text-[10px]">
                    {isHighSpread ? (
                      <span className="text-red-500 font-bold">❌ HIGH SPREAD</span>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> SAFE
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
