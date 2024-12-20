import { useOrderStore } from "@/stores/useOrderStore";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

type WebSocketMessage = {
  p: string; // Price field in the message
};

export function useWebSocketConnection() {
  const store = useOrderStore();

  const socketUrl = "wss://stream.binance.com:9443/ws/btcusdt@trade";
  const { lastJsonMessage } = useWebSocket(socketUrl, {
    onError: (event) => console.error("WebSocket error:", event),
    shouldReconnect: (closeEvent) => true, // Auto-reconnect on disconnect
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      const { p: price } = lastJsonMessage as WebSocketMessage;
      store.seyLivePrice(parseFloat(price));
    }
  }, [lastJsonMessage]);

  return null;
}
