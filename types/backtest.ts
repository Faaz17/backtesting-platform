export type BacktestConfig = {
  assets: string[]
  indicators: string[]
  initialCapital: number
  stopLoss: number
  takeProfit: number
  commission: number
  timeframe: string
  margin: number
  perOrderQuantity: number
  pyramidingCount: number
  strategyName: string
  strategyDescription: string
}

export type BacktestResults = {
  profitFactor: number
  equityCurve: { date: string; value: number }[]
  sharpeRatio: number
  zScore: number
  lrCorrelation: number
  netProfit: number
  balanceDrawdownAbsolute: number
  balanceDrawdownRelative: number
  totalTrades: number
  tradesWon: number
  tradesLost: number
  winRate: number
  avgWin: number
  avgLoss: number
  maxDrawdown: number
  maxDrawdownDuration: number
  volatility: number
  sortinoRatio: number
  calmarRatio: number
}
