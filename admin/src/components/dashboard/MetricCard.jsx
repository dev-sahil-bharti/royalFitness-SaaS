import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon: Icon, 
  colorClass, 
  bgClass,
  isPositive = true 
}) => {
  return (
    <div className={`p-6 rounded-2xl border border-card-dark flex flex-col gap-4 relative overflow-hidden group ${bgClass || 'bg-[#131b2c]'} hover:border-slate-600 transition-colors`}>
      {/* Background glow effect (optional depending on design preference, can be omitted) */}
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white">{value}</div>
          </div>
        </div>
      </div>

      <div className="mt-2 relative z-10 flex flex-col gap-1">
        <div className="flex items-center gap-1 text-sm font-medium">
          {isPositive ? (
            <span className="text-emerald-500 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> {trendValue}%
            </span>
          ) : (
            <span className="text-rose-500 flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4" /> {trendValue}%
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">vs last month</p>
      </div>
    </div>
  );
};

export default MetricCard;
