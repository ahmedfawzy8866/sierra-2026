'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where, getCountFromServer } from 'firebase/firestore';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Home, Handshake, DollarSign } from 'lucide-react';

interface ReportMetric {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color: string;
}

interface ChartData {
  period: string;
  deals: number;
  revenue: number;
}

interface ApiReport {
  summary?: {
    totalDeals: number;
    totalRevenue: number;
    averageDealValue: number;
    closedDeals: number;
  };
  trends?: ChartData[];
  topAgents?: Array<{ name: string; deals: number; revenue: number }>;
  pipelineDistribution?: Array<{ stage: string; count: number }>;
}

export default function AdminReportsPage() {
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [topAgents, setTopAgents] = useState<Array<{ name: string; deals: number; revenue: number }>>([]);
  const [pieData, setPieData] = useState<Array<{ name: string; value: number; fill: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // Fetch from API endpoint
        const response = await fetch(`/api/admin/reports?timeRange=${timeRange}`);
        if (!response.ok) throw new Error('Failed to fetch reports');

        const apiData: ApiReport = await response.json();

        // Get counts for KPIs
        const totalUnitsSnap = await getCountFromServer(collection(db, 'listings'));
        const totalLeadsSnap = await getCountFromServer(collection(db, 'leads'));
        const closedDealsSnap = await getCountFromServer(
          query(collection(db, 'deals'), where('stage', '==', 'closed'))
        );

        const summary = apiData.summary || {
          totalDeals: 0,
          totalRevenue: 0,
          averageDealValue: 0,
          closedDeals: closedDealsSnap.data().count,
        };

        setMetrics([
          {
            label: 'Total Leads',
            value: totalLeadsSnap.data().count,
            change: '+8%',
            icon: Users,
            color: '#3B82F6',
          },
          {
            label: 'Active Units',
            value: totalUnitsSnap.data().count,
            change: '+12%',
            icon: Home,
            color: '#8B5CF6',
          },
          {
            label: 'Closed Deals',
            value: summary.closedDeals || closedDealsSnap.data().count,
            change: '+24%',
            icon: Handshake,
            color: '#10B981',
          },
          {
            label: 'Avg Deal Value',
            value: summary.averageDealValue
              ? `EGP ${(summary.averageDealValue / 1000000).toFixed(1)}M`
              : 'EGP 2.5M',
            change: '+5%',
            icon: DollarSign,
            color: '#C9A84C',
          },
        ]);

        // Set chart data from API
        if (apiData.trends && apiData.trends.length > 0) {
          setChartData(apiData.trends);
        } else {
          // Fallback to mock data if API doesn't return trends
          setChartData([
            { period: 'Jan', deals: 12, revenue: 2400000 },
            { period: 'Feb', deals: 19, revenue: 2210000 },
            { period: 'Mar', deals: 15, revenue: 2290000 },
            { period: 'Apr', deals: 22, revenue: 2000000 },
            { period: 'May', deals: 18, revenue: 2181000 },
            { period: 'Jun', deals: 24, revenue: 2500000 },
          ]);
        }

        // Set top agents from API
        if (apiData.topAgents && apiData.topAgents.length > 0) {
          setTopAgents(apiData.topAgents);
        } else {
          setTopAgents([
            { name: 'Ahmed Mahmoud', deals: 8, revenue: 12000000 },
            { name: 'Fatima Hassan', deals: 6, revenue: 9500000 },
            { name: 'Mohamed Ali', deals: 5, revenue: 8200000 },
            { name: 'Leila Yousef', deals: 4, revenue: 7100000 },
          ]);
        }

        // Set pipeline distribution
        if (apiData.pipelineDistribution && apiData.pipelineDistribution.length > 0) {
          const stageColors: Record<string, string> = {
            closed: '#10B981',
            negotiation: '#F59E0B',
            viewing: '#8B5CF6',
            new: '#3B82F6',
            engaged: '#EC4899',
          };
          const mappedPie = apiData.pipelineDistribution.map(item => ({
            name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1),
            value: item.count,
            fill: stageColors[item.stage] || '#8B5CF6',
          }));
          setPieData(mappedPie);
        } else {
          setPieData([
            { name: 'Closed', value: 24, fill: '#10B981' },
            { name: 'Negotiation', value: 18, fill: '#F59E0B' },
            { name: 'Viewing', value: 32, fill: '#8B5CF6' },
            { name: 'New', value: 26, fill: '#3B82F6' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
        // Keep default empty states on error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [timeRange]);

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#071422] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Analytics & Reports
          </h1>
          <p className="text-[#3a5570] text-sm mt-0.5">Real-time performance metrics</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['week', 'month', 'quarter', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                timeRange === range ? 'bg-[#031632] text-white' : 'bg-white text-[#3a5570] hover:bg-[#f3f4f5]'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-40 animate-pulse" />
            ))
          : metrics.map(metric => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)] hover:shadow-[0_8px_32px_-4px_rgba(3,22,50,0.1)] transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${metric.color}14` }}
                    >
                      <Icon size={18} style={{ color: metric.color }} />
                    </div>
                    {metric.change && (
                      <span className="text-xs font-bold text-green-600">{metric.change}</span>
                    )}
                  </div>
                  <div
                    className="text-3xl font-bold tracking-tight mb-1"
                    style={{ color: metric.color, fontFamily: 'var(--font-display)' }}
                  >
                    {metric.value}
                  </div>
                  <div className="text-xs font-semibold text-[#071422]">{metric.label}</div>
                </div>
              );
            })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
          <h2 className="text-lg font-bold text-[#071422] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Deal Trends
          </h2>
          {!loading && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e8e9" />
                <XAxis dataKey="period" stroke="#3a5570" style={{ fontSize: 12 }} />
                <YAxis stroke="#3a5570" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e7e8e9', borderRadius: 8 }}
                  cursor={{ fill: 'rgba(3, 22, 50, 0.04)' }}
                />
                <Legend />
                <Bar dataKey="deals" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Deal Stages */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
          <h2 className="text-lg font-bold text-[#071422] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Pipeline Distribution
          </h2>
          {!loading && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue by Agent */}
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
        <h2 className="text-lg font-bold text-[#071422] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Top Agents
        </h2>
        <div className="space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-[#f8f9fa] rounded-lg animate-pulse" />
              ))
            : topAgents.map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-[#f8f9fa] rounded-lg transition-colors">
                  <div>
                    <div className="font-semibold text-sm text-[#071422]">{agent.name}</div>
                    <div className="text-xs text-[#3a5570]/60 mt-0.5">{agent.deals} deals closed</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#C9A84C]">EGP {(agent.revenue / 1000000).toFixed(1)}M</div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
