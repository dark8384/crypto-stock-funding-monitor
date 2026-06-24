import asyncio
import ccxt.pro as ccxtpro
import requests
from fastapi import FastAPI
import socketio

app = FastAPI()
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
asgi_app = socketio.ASGIApp(sio, app)

live_funding_rates = {
    "BTC": {"binance": 0.01, "bybit": 0.012, "delta_india": 0.052, "gate": 0.01, "bingx": 0.011},
    "ETH": {"binance": 0.015, "bybit": 0.018, "delta_india": 0.061, "gate": 0.014, "bingx": 0.016},
    "SPY500": {"spot": 4500, "futures": 4515}
}

async def fetch_delta_india():
    while True:
        try:
            # Placeholder for Delta Exchange India API
            await asyncio.sleep(5)
        except Exception as e:
            await asyncio.sleep(10)

async def broadcast_data():
    while True:
        try:
            await sio.emit('funding_update', live_funding_rates)
            await asyncio.sleep(2)
        except Exception:
            await asyncio.sleep(2)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(fetch_delta_india())
    asyncio.create_task(broadcast_data())
