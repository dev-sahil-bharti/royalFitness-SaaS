import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: '01 May', revenue: 20000 },
  { name: '05 May', revenue: 32000 },
  { name: '10 May', revenue: 35000 },
  { name: '15 May', revenue: 45230 },
  { name: '20 May', revenue: 48000 },
  { name: '25 May', revenue: 65000 },
  { name: '30 May', revenue: 85000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-dark border border-slate-600 p-3 rounded-xl shadow-xl">
        <p className="text-white font-bold">₹{payload[0].value.toLocaleString()}</p>
        <p className="text-slate-400 text-xs">{label}</p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  return (
    <div className="bg-[#131b2c] p-6 rounded-2xl border border-card-dark flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-200">Revenue Overview</h3>
        <select className="bg-bg-dark border border-card-dark text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#131b2c', stroke: '#f59e0b', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
