import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOrderStore } from '@/stores/useOrderStore';

const VolumeChart = () => {
  const [data, setData] = useState<{ time: number; volume: number }[]>([]);
  const orders = useOrderStore((state) => state.orders);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalVolume = orders.reduce((sum, order) => sum + order.quantity, 0);
      setData((prevData) => [...prevData, { time: Date.now(), volume: totalVolume }]);
    }, 5000); 

    return () => clearInterval(interval);
  }, [orders]);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="volume" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;
