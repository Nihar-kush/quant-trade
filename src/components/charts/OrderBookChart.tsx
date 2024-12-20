import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { useOrderStore } from '@/stores/useOrderStore';

const OrderBookChart = () => {
  const orders = useOrderStore((state) => state.orders);

  // Group orders by price for buy and sell
  const buyOrders = orders.filter(order => order.type === 'buy');
  const sellOrders = orders.filter(order => order.type === 'sell');

  const buyData = buyOrders.map((order) => ({
    price: order.price,
    quantity: order.quantity,
    type: 'buy',
  }));

  const sellData = sellOrders.map((order) => ({
    price: order.price,
    quantity: order.quantity,
    type: 'sell',
  }));

  const chartData = [...buyData, ...sellData];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#27FFBD" name="Buy Orders" barSize={15} />
          <Bar dataKey="quantity" fill="#ff2761" name="Sell Orders" barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderBookChart;
