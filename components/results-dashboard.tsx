"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BacktestResults } from "@/types/backtest"
import { TrendingUp, TrendingDown, Activity, Target, BarChart3, DollarSign, ChevronLeft } from "lucide-react"
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
    <div className="flex-1 container mx-auto px-4 py-8">
      {onBack && (
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Backtest Results</h1>
            <p className="text-sm text-muted-foreground">Analysis of your trading strategy performance</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className={`text-2xl font-bold ${results.netProfit >= 0 ? "text-success" : "text-destructive"}`}>
              ${results.netProfit.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {results.netProfit >= 0 ? "+" : ""}
              {((results.netProfit / 10000) * 100).toFixed(2)}% ROI
            </p>
          </Card>

          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Profit Factor</p>
              <Target className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{results.profitFactor.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {results.profitFactor > 1.5 ? "Excellent" : results.profitFactor > 1 ? "Good" : "Poor"}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{results.sharpeRatio.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Risk-adjusted return</p>
          </Card>

          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{winRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {results.tradesWon} / {results.totalTrades} trades
            </p>
          </Card>
        </div>

        {/* Equity Curve */}
        <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Equity Curve</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.equityCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <p className="text-sm text-muted-foreground mb-1">Z-Score</p>
            <p className="text-xl font-semibold text-foreground">{results.zScore.toFixed(2)}</p>
          </Card>

          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <p className="text-sm text-muted-foreground mb-1">LR Correlation</p>
            <p className="text-xl font-semibold text-foreground">{results.lrCorrelation.toFixed(4)}</p>
          </Card>

          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <p className="text-sm text-muted-foreground mb-1">Max Drawdown (Absolute)</p>
            <p className="text-xl font-semibold text-destructive">${results.balanceDrawdownAbsolute.toFixed(2)}</p>
          </Card>

          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <p className="text-sm text-muted-foreground mb-1">Max Drawdown (Relative)</p>
            <p className="text-xl font-semibold text-destructive">{results.balanceDrawdownRelative.toFixed(2)}%</p>
          </Card>

          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
            <p className="text-xl font-semibold text-foreground">{results.totalTrades}</p>
          </Card>

          <Card className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all">
            <p className="text-sm text-muted-foreground mb-1">Trades Won / Lost</p>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                {results.tradesWon}
              </Badge>
              <Badge variant="destructive">
                <TrendingDown className="w-3 h-3 mr-1" />
                {results.tradesLost}
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
