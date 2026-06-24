"use client"; // Next.js mein real-time websockets chalane ke liye zaroori hai

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Dashboard() {
  const [rates, setRates] = useState(null);
  const [status, setStatus] = useState("Connecting to Live Backend...");

  useEffect(() => {
    // 🟢 Tumhara Render ka live backend URL yahan daal diya hai
    const socket = io("https://funding-bot-backend-mgci.onrender.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setStatus("Connected! Fetching Live Rates...");
    });

    // 🟢 Backend se 'funding_update' event ka live data sunna
    socket.on("funding_update", (data) => {
      console.log("Real-time data received:", data);
      setRates(data);
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected from backend. Retrying...");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Jab tak data nahi aata, tab tak loading status dikhayega
  if (!rates) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono text-sm">{status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-950 text-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Multi-Exchange Funding Monitor
          </h1>
          <p className="text-xs text-gray-400 mt-1">Real-time spreads & rates</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          LIVE
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* BTC Card */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-yellow-400">⚡ BTC Rates</h2>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">Crypto</span>
          </div>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Binance:</span>
              <span className="text-green-400">{rates.BTC?.binance}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Bybit:</span>
              <span className="text-green-400">{rates.BTC?.bybit}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Delta India:</span>
              <span className="text-yellow-400 font-bold">{rates.BTC?.delta_india}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Gate.io:</span>
              <span className="text-green-400">{rates.BTC?.gate}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">BingX:</span>
              <span className="text-green-400">{rates.BTC?.bingx}%</span>
            </div>
          </div>
        </div>

        {/* ETH Card */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-400">🔷 ETH Rates</h2>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">Crypto</span>
          </div>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Binance:</span>
              <span className="text-green-400">{rates.ETH?.binance}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Bybit:</span>
              <span className="text-green-400">{rates.ETH?.bybit}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Delta India:</span>
              <span className="text-yellow-400 font-bold">{rates.ETH?.delta_india}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Gate.io:</span>
              <span className="text-green-400">{rates.ETH?.gate}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">BingX:</span>
              <span className="text-green-400">{rates.ETH?.bingx}%</span>
            </div>
          </div>
        </div>

        {/* TradFi Indexes Card */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-lg col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-purple-400">📈 SPY 500 Spread</h2>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">Stocks</span>
          </div>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Spot Price:</span>
              <span className="text-white">${rates.SPY500?.spot}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 py-1">
              <span className="text-gray-400">Futures Price:</span>
              <span className="text-white">${rates.SPY500?.futures}</span>
            </div>
            <div className="flex justify-between bg-purple-500/10 p-2 rounded mt-2">
              <span className="text-purple-300 font-semibold">Spread:</span>
              <span className="text-purple-400 font-bold">
                +${(rates.SPY500?.futures - rates.SPY500?.spot).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
