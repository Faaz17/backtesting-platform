"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BacktestResults } from "@/types/backtest"
import { TrendingUp, TrendingDown, Activity, Target, BarChart3, DollarSign, ChevronLeft, Settings } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type ResultsDashboardProps = {
  results: BacktestResults | null
  onBack?: () => void
}

export function ResultsDashboard({ results, onBack }: ResultsDashboardProps) {
  if (!results) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No results available</p>
      </div>
    )
  }

  const winRate = (results.tradesWon / results.totalTrades) * 100

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-green-400">Strategy Performance Report</h1>
        <Button variant="ghost" size="icon" className="text-green-400 hover:bg-gray-800">
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        
        {/* Left Column - Key Metrics */}
        <div className="w-1/3 p-6 border-r border-gray-800 overflow-y-auto">
          <div className="space-y-6">
            {/* Key Metrics Section */}
            <div className="bg-gray-900 rounded-lg p-4 border border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-400">Key Metrics</h2>
                <ChevronLeft className="w-5 h-5 text-green-400" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Profit Factor</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{results.profitFactor.toFixed(2)}</div>
                    <div className="text-sm text-green-400">{results.profitFactor > 1 ? "Good" : "Poor"}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Sharpe Ratio</span>
                  <div className="text-2xl font-bold text-green-400">{results.sharpeRatio.toFixed(2)}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Z-Score</span>
                  <div className="text-2xl font-bold text-green-400">{results.zScore.toFixed(2)}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">LR Correlation</span>
                  <div className="text-2xl font-bold text-green-400">{results.lrCorrelation.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Net Profit Section */}
            <div className="bg-gray-900 rounded-lg p-4 border border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-400">Net Profit</h2>
                <ChevronLeft className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-400">${results.netProfit.toLocaleString()}</div>
            </div>

            {/* Balance Drawdown Section */}
            <div className="bg-gray-900 rounded-lg p-4 border border-green-500">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Balance Drawdown (Absolute)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Balance Drawdown (Relative)</span>
                    <span className="text-lg font-bold text-green-400">{results.balanceDrawdownRelative.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: `${Math.min(results.balanceDrawdownRelative, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Equity Curve */}
        <div className="w-1/3 p-6 border-r border-gray-800">
          <div className="bg-gray-900 rounded-lg p-4 border border-green-500 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-green-400">Equity Curve</h2>
              <ChevronLeft className="w-5 h-5 text-green-400" />
            </div>
            
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #10B981",
                      borderRadius: "8px",
                      color: "#10B981"
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Balance']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Peak Value Annotation */}
            <div className="mt-2 text-center">
              <span className="text-sm text-green-400">Peak: ${Math.max(...results.equityCurve.map(point => point.value)).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Trade Statistics */}
        <div className="w-1/3 p-6 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg p-4 border border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-green-400">Trade Statistics</h2>
              <ChevronLeft className="w-5 h-5 text-green-400" />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Total Trades</span>
                </div>
                <div className="text-3xl font-bold text-white">{results.totalTrades}</div>
                <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                  <div className="bg-green-400 h-1 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Total Trades Won</span>
                </div>
                <div className="text-3xl font-bold text-green-400">{results.tradesWon}</div>
                <div className="text-lg text-green-400">({winRate.toFixed(1)}%)</div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Total Trades Lost</span>
                </div>
                <div className="text-3xl font-bold text-white">{results.tradesLost}</div>
                <div className="text-lg text-white">({(100 - winRate).toFixed(1)}%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
