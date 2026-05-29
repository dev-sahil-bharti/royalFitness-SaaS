import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Basic Plan', value: 32 },
  { name: 'Standard Plan', value: 28 },
  { name: 'Premium Plan', value: 25 },
  { name: 'Gold Plan', value: 15 },
];

const COLORS = ['#eab308', '#3b82f6', '#10b981', '#8b5cf6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-dark border border-slate-600 p-2 rounded-lg shadow-xl">
        <p className="text-white text-xs font-semibold">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const MembershipChart = () => {
  return (
    <div className="bg-[#131b2c] p-6 rounded-2xl border border-card-dark flex flex-col h-full">
      <h3 className="text-sm font-semibold text-slate-200 mb-6">Membership Plan Distribution</h3>
      
      <div className="flex-1 flex items-center justify-between">
        <div className="w-1/2 h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400">Total</span>
            <span className="text-lg font-bold text-white">1,248</span>
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-4 pl-4">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-slate-300">{entry.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-200">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipChart;
