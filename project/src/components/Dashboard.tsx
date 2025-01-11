import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Stock, PortfolioMetrics } from '../types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DashboardProps {
  stocks: Stock[];
  metrics: PortfolioMetrics;
}

export function Dashboard({ stocks, metrics }: DashboardProps) {
  const chartData = stocks.map(stock => ({
    name: stock.symbol,
    value: stock.current_price * stock.quantity,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="col-span-1 md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="text-blue-500" />
                <h3 className="text-lg font-semibold">Total Value</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ₹{metrics.totalValue.toFixed(2)}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${metrics.totalGainLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2">
                {metrics.totalGainLoss >= 0 ? (
                  <TrendingUp className="text-green-500" />
                ) : (
                  <TrendingDown className="text-red-500" />
                )}
                <h3 className="text-lg font-semibold">Total Gain/Loss</h3>
              </div>
              <p className={`text-2xl font-bold ${metrics.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{Math.abs(metrics.totalGainLoss).toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Top Performer</h3>
              {metrics.topPerformer && (
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.topPerformer.symbol}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Portfolio Distribution</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}