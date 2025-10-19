import { OHLCVData } from './kaggle-service';

export interface Trade {
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  side: 'long' | 'short';
  pnl: number;
  commission: number;
}

export interface BacktestMetrics {
  profitFactor: number;
  equityCurve: { date: string; value: number }[];
  sharpeRatio: number;
  zScore: number;
  lrCorrelation: number;
  netProfit: number;
  balanceDrawdownAbsolute: number;
  balanceDrawdownRelative: number;
  totalTrades: number;
  tradesWon: number;
  tradesLost: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  maxDrawdown: number;
  maxDrawdownDuration: number;
  volatility: number;
  sortinoRatio: number;
  calmarRatio: number;
}

export interface StrategyLogic {
  entryConditions: string[];
  exitConditions: string[];
  indicators: string[];
  riskManagement: {
    stopLoss: number;
    takeProfit: number;
  };
}

export class BacktestingEngine {
  private data: OHLCVData[];
  private initialCapital: number;
  private commission: number;
  private trades: Trade[] = [];
  private equity: number;
  private equityCurve: { date: string; value: number }[] = [];

  constructor(data: OHLCVData[], initialCapital: number, commission: number = 0.001) {
    this.data = data;
    this.initialCapital = initialCapital;
    this.commission = commission;
    this.equity = initialCapital;
  }

  async runBacktest(strategy: StrategyLogic): Promise<BacktestMetrics> {
    this.trades = [];
    this.equity = this.initialCapital;
    this.equityCurve = [];

    // Process each data point
    console.log(`[BacktestingEngine] Processing ${this.data.length} data points...`)
    for (let i = 1; i < this.data.length; i++) {
      const currentData = this.data[i];
      const previousData = this.data[i - 1];

      // Log progress every 10% of data
      if (i % Math.floor(this.data.length / 10) === 0) {
        console.log(`[BacktestingEngine] Progress: ${Math.floor((i / this.data.length) * 100)}%`)
      }

      // Check for entry conditions
      if (this.shouldEnter(strategy, currentData, previousData)) {
        const trade = this.enterTrade(currentData, strategy);
        if (trade) {
          this.trades.push(trade);
        }
      }

      // Check for exit conditions on existing trades
      this.checkExitConditions(strategy, currentData);

      // Update equity curve
      this.updateEquity(currentData.timestamp);
    }
    
    console.log(`[BacktestingEngine] Completed processing. Total trades: ${this.trades.length}`)

    // Close any remaining open trades
    this.closeAllTrades();

    return this.calculateMetrics();
  }

  private shouldEnter(strategy: StrategyLogic, current: OHLCVData, previous: OHLCVData): boolean {
    // Simplified entry logic - in a real implementation, this would parse the strategy conditions
    // For now, we'll use a simple moving average crossover strategy
    const sma20 = this.calculateSMA(20);
    const sma50 = this.calculateSMA(50);
    
    if (sma20.length < 2 || sma50.length < 2) return false;
    
    const currentSMA20 = sma20[sma20.length - 1];
    const currentSMA50 = sma50[sma50.length - 1];
    const prevSMA20 = sma20[sma20.length - 2];
    const prevSMA50 = sma50[sma50.length - 2];

    // Golden cross: SMA20 crosses above SMA50
    return prevSMA20 <= prevSMA50 && currentSMA20 > currentSMA50;
  }

  private enterTrade(data: OHLCVData, strategy: StrategyLogic): Trade | null {
    const quantity = this.calculatePositionSize(data.close);
    if (quantity <= 0) return null;

    return {
      entryTime: data.timestamp,
      exitTime: '',
      entryPrice: data.close,
      exitPrice: 0,
      quantity,
      side: 'long',
      pnl: 0,
      commission: quantity * data.close * this.commission
    };
  }

  private checkExitConditions(strategy: StrategyLogic, current: OHLCVData): void {
    for (const trade of this.trades) {
      if (trade.exitTime) continue; // Already closed

      const currentPrice = current.close;
      const entryPrice = trade.entryPrice;
      const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;

      // Check stop loss
      if (pnlPercent <= -strategy.riskManagement.stopLoss) {
        this.exitTrade(trade, current, 'stop_loss');
        continue;
      }

      // Check take profit
      if (pnlPercent >= strategy.riskManagement.takeProfit) {
        this.exitTrade(trade, current, 'take_profit');
        continue;
      }

      // Check exit conditions (simplified)
      const sma20 = this.calculateSMA(20);
      const sma50 = this.calculateSMA(50);
      
      if (sma20.length >= 2 && sma50.length >= 2) {
        const currentSMA20 = sma20[sma20.length - 1];
        const currentSMA50 = sma50[sma50.length - 1];
        const prevSMA20 = sma20[sma20.length - 2];
        const prevSMA50 = sma50[sma50.length - 2];

        // Death cross: SMA20 crosses below SMA50
        if (prevSMA20 >= prevSMA50 && currentSMA20 < currentSMA50) {
          this.exitTrade(trade, current, 'signal');
        }
      }
    }
  }

  private exitTrade(trade: Trade, data: OHLCVData, reason: string): void {
    trade.exitTime = data.timestamp;
    trade.exitPrice = data.close;
    trade.pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity;
    trade.commission += trade.quantity * trade.exitPrice * this.commission;
  }

  private closeAllTrades(): void {
    const lastData = this.data[this.data.length - 1];
    for (const trade of this.trades) {
      if (!trade.exitTime) {
        this.exitTrade(trade, lastData, 'end_of_data');
      }
    }
  }

  private calculatePositionSize(price: number): number {
    // Simple position sizing: use 10% of equity
    const riskAmount = this.equity * 0.1;
    return Math.floor(riskAmount / price);
  }

  private calculateSMA(period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < this.data.length; i++) {
      const sum = this.data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  private updateEquity(timestamp: string): void {
    // Calculate current equity based on open trades
    let currentEquity = this.initialCapital;
    
    for (const trade of this.trades) {
      if (trade.exitTime) {
        // Closed trade - add P&L
        currentEquity += trade.pnl - trade.commission;
      } else {
        // Open trade - calculate unrealized P&L
        const currentPrice = this.getCurrentPrice(timestamp);
        if (currentPrice) {
          const unrealizedPnl = (currentPrice - trade.entryPrice) * trade.quantity;
          currentEquity += unrealizedPnl;
        }
      }
    }

    this.equity = currentEquity;
    this.equityCurve.push({
      date: timestamp,
      value: currentEquity
    });
  }

  private getCurrentPrice(timestamp: string): number | null {
    const dataPoint = this.data.find(d => d.timestamp === timestamp);
    return dataPoint ? dataPoint.close : null;
  }

  private calculateMetrics(): BacktestMetrics {
    const closedTrades = this.trades.filter(t => t.exitTime);
    const totalTrades = closedTrades.length;
    
    if (totalTrades === 0) {
      return this.getEmptyMetrics();
    }

    const winningTrades = closedTrades.filter(t => t.pnl > 0);
    const losingTrades = closedTrades.filter(t => t.pnl <= 0);
    
    const tradesWon = winningTrades.length;
    const tradesLost = losingTrades.length;
    const winRate = tradesWon / totalTrades;

    const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    const totalCommission = closedTrades.reduce((sum, t) => sum + t.commission, 0);
    
    const netProfit = grossProfit - grossLoss - totalCommission;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit;

    const avgWin = tradesWon > 0 ? grossProfit / tradesWon : 0;
    const avgLoss = tradesLost > 0 ? grossLoss / tradesLost : 0;

    // Calculate equity curve metrics
    const returns = this.calculateReturns();
    const sharpeRatio = this.calculateSharpeRatio(returns);
    const sortinoRatio = this.calculateSortinoRatio(returns);
    const volatility = this.calculateVolatility(returns);
    
    const { maxDrawdown, maxDrawdownDuration } = this.calculateDrawdown();
    const balanceDrawdownAbsolute = maxDrawdown;
    const balanceDrawdownRelative = (maxDrawdown / this.initialCapital) * 100;
    
    const calmarRatio = maxDrawdown > 0 ? (netProfit / this.initialCapital) / (maxDrawdown / this.initialCapital) : 0;
    
    const zScore = this.calculateZScore(returns);
    const lrCorrelation = this.calculateLinearRegressionCorrelation();

    return {
      profitFactor: Math.round(profitFactor * 100) / 100,
      equityCurve: this.equityCurve,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      zScore: Math.round(zScore * 100) / 100,
      lrCorrelation: Math.round(lrCorrelation * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      balanceDrawdownAbsolute: Math.round(balanceDrawdownAbsolute * 100) / 100,
      balanceDrawdownRelative: Math.round(balanceDrawdownRelative * 100) / 100,
      totalTrades,
      tradesWon,
      tradesLost,
      winRate: Math.round(winRate * 100) / 100,
      avgWin: Math.round(avgWin * 100) / 100,
      avgLoss: Math.round(avgLoss * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      maxDrawdownDuration,
      volatility: Math.round(volatility * 100) / 100,
      sortinoRatio: Math.round(sortinoRatio * 100) / 100,
      calmarRatio: Math.round(calmarRatio * 100) / 100
    };
  }

  private calculateReturns(): number[] {
    const returns: number[] = [];
    for (let i = 1; i < this.equityCurve.length; i++) {
      const prevEquity = this.equityCurve[i - 1].value;
      const currentEquity = this.equityCurve[i].value;
      const ret = (currentEquity - prevEquity) / prevEquity;
      returns.push(ret);
    }
    return returns;
  }

  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return 0;
    
    // Annualized Sharpe ratio (assuming daily returns)
    return (avgReturn / stdDev) * Math.sqrt(252);
  }

  private calculateSortinoRatio(returns: number[]): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const negativeReturns = returns.filter(ret => ret < 0);
    
    if (negativeReturns.length === 0) return avgReturn > 0 ? 100 : 0;
    
    const downsideVariance = negativeReturns.reduce((sum, ret) => sum + ret * ret, 0) / negativeReturns.length;
    const downsideDeviation = Math.sqrt(downsideVariance);
    
    if (downsideDeviation === 0) return avgReturn > 0 ? 100 : 0;
    
    return (avgReturn / downsideDeviation) * Math.sqrt(252);
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
  }

  private calculateDrawdown(): { maxDrawdown: number; maxDrawdownDuration: number } {
    let maxEquity = this.initialCapital;
    let maxDrawdown = 0;
    let currentDrawdownDuration = 0;
    let maxDrawdownDuration = 0;

    for (const point of this.equityCurve) {
      if (point.value > maxEquity) {
        maxEquity = point.value;
        currentDrawdownDuration = 0;
      } else {
        const drawdown = maxEquity - point.value;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
        currentDrawdownDuration++;
        maxDrawdownDuration = Math.max(maxDrawdownDuration, currentDrawdownDuration);
      }
    }

    return { maxDrawdown, maxDrawdownDuration };
  }

  private calculateZScore(returns: number[]): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return 0;
    
    // Z-score of the final return
    const finalReturn = returns[returns.length - 1];
    return (finalReturn - avgReturn) / stdDev;
  }

  private calculateLinearRegressionCorrelation(): number {
    if (this.equityCurve.length < 2) return 0;
    
    const n = this.equityCurve.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = this.equityCurve.map(point => point.value);
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    if (denominator === 0) return 0;
    
    return numerator / denominator;
  }

  private getEmptyMetrics(): BacktestMetrics {
    return {
      profitFactor: 0,
      equityCurve: this.equityCurve,
      sharpeRatio: 0,
      zScore: 0,
      lrCorrelation: 0,
      netProfit: 0,
      balanceDrawdownAbsolute: 0,
      balanceDrawdownRelative: 0,
      totalTrades: 0,
      tradesWon: 0,
      tradesLost: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      maxDrawdown: 0,
      maxDrawdownDuration: 0,
      volatility: 0,
      sortinoRatio: 0,
      calmarRatio: 0
    };
  }
}
