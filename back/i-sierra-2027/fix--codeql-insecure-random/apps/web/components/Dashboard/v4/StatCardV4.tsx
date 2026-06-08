import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  delay?: string;
}

export const StatCardV4: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  trend, 
  trendUp, 
  icon: Icon,
  delay = '0s'
}) => {
  return (
    <div 
      className="neural-surface neural-card-glow animate-fade-in-up p-6 rounded-3xl relative overflow-hidden group"
      style={{ animationDelay: delay }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={80} strokeWidth={1} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
            <Icon size={20} />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-silver/60">
            {label}
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="text-3xl font-bold cinematic-gold-text">
            {value}
          </h3>
          
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-success' : 'text-error'}`}>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-current/10">
                {trendUp ? '↑' : '↓'}
              </span>
              <span>{trend} vs last month</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative background flare */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold/5 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
};
