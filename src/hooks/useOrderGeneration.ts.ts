import { useOrderStore } from "@/stores/useOrderStore";
import { Order } from "@/types/order";
import { nanoid } from "nanoid";
import { useEffect } from "react";

export function useOrderGeneration() {
  const store = useOrderStore();

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulating half buy-side orders and half sell-side orders
      const isBuyOrder = Math.random() > 0.5;

      const newOrder: Order = {
        id: nanoid(6),
        type: isBuyOrder ? "buy" : "sell",
        asset: "BTC-USDT",
        quantity: parseFloat((Math.random() * 2).toFixed(8)),
        price: parseFloat((Math.random() * 2000 + 29000).toFixed(2)),
        expiration: new Date(Date.now() + Math.random() * 86400000),
        status: "active",
      };

      store.addOrder(newOrder);

      // Simulate status changes for existing orders (fill/cancel)
      store.orders.forEach((order) => {
        if (Math.random() > 0.8) {
          const newStatus = Math.random() > 0.5 ? "filled" : "cancelled";
          store.updateOrder(order.id, { status: newStatus });
        }
      });

      // Remove expired orders
      const now = new Date();
      store.orders.forEach((order) => {
        console.log(order.expiration);
        if (order.expiration < now) {
          store.updateOrder(order.id, { status: "expired" });
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return store;
}
