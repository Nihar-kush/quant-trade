"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Label } from "@/components/ui/label";
import { OrderValidation } from "@/lib/validations/order";
import { Order } from "@/types/order";
import { useWebSocketConnection } from "@/hooks/useWebSocketConnection";
import { useOrderGeneration } from "@/hooks/useOrderGeneration.ts";
import { nanoid } from "nanoid";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type FormData = z.infer<typeof OrderValidation>;

export default function ClientPage() {
  const { orders, livePrice, addOrder } = useOrderGeneration();
  const { toast } = useToast();
  useWebSocketConnection();

  const [orderType, setOrderType] = useState<Order["type"]>("buy");

  const activeOrders = orders.filter((order) => order.status === "active");

  const form = useForm<FormData>({
    resolver: zodResolver(OrderValidation),
    defaultValues: {
      asset: "BTC-USDT",
      quantity: 0,
      price: 0,
      expirationType: "duration",
      expirationValue: "",
    },
  });

  const updatePrice = (quantity: number) => {
    if (!livePrice) {
      toast({
        title: "Error",
        description: "Live price is unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    const calculatedPrice = quantity * livePrice;
    form.setValue("price", calculatedPrice);
  };

  const onSubmit = (data: FormData) => {
    const newOrder: Order = {
      id: nanoid(6),
      type: orderType,
      asset: data.asset,
      quantity: data.quantity,
      price: data.price,
      expiration:
        data.expirationType === "duration"
          ? new Date(Date.now() + parseInt(data.expirationValue) * 1000)
          : new Date(data.expirationValue),
      status: "active",
    };

    addOrder(newOrder);
    form.reset();

    toast({
      title: "Order Placed",
      description: `Your ${newOrder.type} order for ${newOrder.asset} has been placed successfully.`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8 p-8 bg-[#0D0D0D] text-white">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button className="text-sm flex items-center border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
            <span className="mr-2">←</span> Back to Home
          </Button>
        </Link>

        <Button className="text-sm border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight cursor-default">
          Live BTC-USDT Price:{" "}
          <span>{livePrice ? `$${livePrice.toFixed(2)}` : "Loading..."}</span>
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-300 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
        </Button>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-3xl font-bold">
          <span className="text-[#27FFBD]">Client</span> Dashboard
        </h1>
        <p className="text-gray-400 text-center">
          Easily place, manage, and track your trading orders with real-time
          updates.
        </p>
      </div>

      {/* New Order Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-[#27FFBD]">
          <CardTitle>Enter Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex space-x-6 mt-4 justify-start">
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={orderType}
                      onValueChange={(val) => {
                        setOrderType(val as Order["type"]);
                      }}
                    >
                      <div className="flex space-x-6">
                        <Label htmlFor="buy">Buy</Label>
                        <RadioGroupItem value="buy" id="buy" />

                        <Label htmlFor="sell">Sell</Label>
                        <RadioGroupItem value="sell" id="sell" />
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>

              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an asset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BTC-USDT">BTC-USDT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.00000001"
                          {...field}
                          onChange={(e) => {
                            const newQuantity = parseFloat(e.target.value);
                            field.onChange(newQuantity);
                            newQuantity > 0 && updatePrice(newQuantity);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="expirationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select expiration type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="duration">Duration</SelectItem>
                          <SelectItem value="datetime">
                            Date and Time
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expirationValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration</FormLabel>
                      <FormControl>
                        {form.watch("expirationType") === "duration" ? (
                          <Input
                            type="number"
                            placeholder="Duration in seconds"
                            {...field}
                          />
                        ) : (
                          <Input type="datetime-local" {...field} />
                        )}
                      </FormControl>
                      <FormDescription>
                        {form.watch("expirationType") === "duration"
                          ? "Enter duration in seconds"
                          : "Select expiration date and time"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="bg-[#27FFBD] text-gray-900 hover:bg-[#31b990]"
                type="submit"
              >
                Confirm Order
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Active Orders Card */}
      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {activeOrders.length === 0 ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
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
                {activeOrders.map((order) => (
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

      {/* Order History Card */}
      <Card>
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
      <Toaster />
    </div>
  );
}
