export type Order = {
  id: string;
  type: "buy" | "sell";
  asset: string;
  quantity: number;
  price: number;
  expiration: Date;
  status: "active" | "filled" | "cancelled" | "expired";
}
