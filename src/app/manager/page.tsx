"use client";

import OrderBookChart from "@/components/charts/OrderBookChart";
import VolumeChart from "@/components/charts/VolumeChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderGeneration } from "@/hooks/useOrderGeneration.ts";
import { Order } from "@/types/order";
import Link from "next/link";

export default function ManagerPage() {
  const { orders, updateOrder } = useOrderGeneration();

  const handleFillOrder = (order: Order) => {
    updateOrder(order.id, { status: "filled" });
  };

  const handleCancelOrder = (order: Order) => {
    updateOrder(order.id, { status: "cancelled" });
  };

  const activeOrders = orders.filter((order) => order.status === "active");

  const potentialMatches = activeOrders.filter((order) => {
    const counterpartOrders = activeOrders.filter(
      (o) =>
        o.asset === order.asset &&
        o.type !== order.type &&
        ((order.type === "buy" && o.price <= order.price) ||
          (order.type === "sell" && o.price >= order.price))
    );
    return counterpartOrders.length > 0;
  });

  return (
    <div className="space-y-8 p-8 bg-[#0D0D0D] text-white">
       <Link href="/">
        <Button className="text-sm flex items-center border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
          <span className="mr-2">←</span> Back to Home
        </Button>
      </Link>

      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold">
          <span className="text-[#27FFBD]">Manager</span> Dashboard
        </h1>
        <p className=" text-gray-400 w-[50%] text-center">
          Manage and track orders, trade match opportunities, and order history
          for better decision-making. Monitor active orders, view potential
          matches, and update the status of orders directly from this dashboard.
        </p>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Order Book</h2>
            <OrderBookChart />
          </div>
          <div className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Volume Over Time</h2>
            <VolumeChart />
          </div>
        </div>
      </div>

      {/* Potential Matches */}
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Trade Match Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          {potentialMatches.length === 0 ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Order Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {potentialMatches.map((order) => (
                  <TableRow key={order.id} className="bg-[#27FFBD]">
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{order.asset}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${order.price.toFixed(2)}</TableCell>
                    <TableCell>{order.expiration.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleFillOrder(order)}
                        className="mr-2"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleCancelOrder(order)}
                        variant="destructive"
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Active Orders */}
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Current Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {activeOrders.length === 0 ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Order Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{order.asset}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${order.price.toFixed(2)}</TableCell>
                    <TableCell>{order.expiration.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleFillOrder(order)}
                        className="mr-2"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleCancelOrder(order)}
                        variant="destructive"
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order History */}
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.filter((order) => order.status !== "active").length === 0 ? (
            <p className="text-center text-gray-500">
              No order history available
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders
                  .filter((order) => order.status !== "active")
                  .map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>{order.asset}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>${order.price.toFixed(2)}</TableCell>
                      <TableCell>{order.expiration.toLocaleString()}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
