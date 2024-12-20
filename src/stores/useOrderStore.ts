import { Order } from "@/types/order";
import { create } from "zustand";

type OrderStore = {
  orders: Order[];
  livePrice?: number;
  seyLivePrice: (price: number) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
};

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  livePrice: undefined,
  seyLivePrice: (price) => set((state) => ({ livePrice: price })),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      ),
    })),
  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    })),
}));
