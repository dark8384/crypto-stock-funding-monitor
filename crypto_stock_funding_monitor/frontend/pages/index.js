import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000');
    socket.on('funding_update', (newData) => {
      setData(newData);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ background: '#111827', color: '#fff', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1f2937', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>🌐 Multi-Exchange Funding & Spread Monitor</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Live: Binance, Bybit, BingX, Gate, Delta India, TradFi Indexes</p>
      </header>

      <div style={{ background: '#1f2937', borderRadius: '8px', padding: '16px', overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlignment: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #374151', color: '#9ca3af' }}>
              <th style={{ padding: '12px' }}>Asset</th>
              <th style={{ padding: '12px' }}>Binance</th>
              <th style={{ padding: '12px' }}>Bybit</th>
              <th style={{ padding: '12px' }}>Delta India (Net)</th>
              <th style={{ padding: '12px' }}>Max Spread Yield</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #374151' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#f59e0b' }}>BTC</td>
              <td style={{ padding: '12px', color: '#34d399' }}>+0.0100%</td>
              <td style={{ padding: '12px', color: '#34d399' }}>+0.0120%</td>
              <td style={{ padding: '12px', color: '#f87171' }}>+0.0520%</td>
              <td style={{ padding: '12px', color: '#fbbf24', fontWeight: 'bold' }}>⚡ 43.8% APY</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
