import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

type BacktestConfig = {
  assets: string[]
  indicators: string[]
  initialCapital: number
  stopLoss: number
  takeProfit: number
  commission: number
  timeframe: string
  margin: number
}

type BacktestRequest = {
  strategy: string
  config: BacktestConfig
}

export async function POST(req: NextRequest) {
  try {
    const { strategy, config }: BacktestRequest = await req.json()

    console.log("[v0] Processing strategy:", strategy)
    console.log("[v0] Config:", config)

    // Use AI to parse the natural language strategy into structured rules
    const { text: parsedStrategy } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a trading strategy parser. Convert the following natural language trading strategy into a structured JSON format with entry and exit rules.

Strategy: ${strategy}

Return a JSON object with this structure:
{
  "entryConditions": ["condition1", "condition2"],
  "exitConditions": ["condition1", "condition2"],
  "indicators": ["indicator1", "indicator2"],
  "riskManagement": {
    "stopLoss": number,
    "takeProfit": number
  }
}

Only return valid JSON, no additional text.`,
    })

    console.log("[v0] Parsed strategy:", parsedStrategy)

    // Parse the AI response
    let structuredStrategy
    try {
      structuredStrategy = JSON.parse(parsedStrategy)
    } catch (e) {
      console.error("[v0] Failed to parse AI response:", e)
      structuredStrategy = {
        entryConditions: ["Buy when conditions are met"],
        exitConditions: ["Sell when conditions are met"],
        indicators: config.indicators,
        riskManagement: {
          stopLoss: config.stopLoss,
          takeProfit: config.takeProfit,
        },
      }
    }

    // Run the backtest simulation
    const results = await runBacktest(structuredStrategy, config)

    return NextResponse.json({ results, parsedStrategy: structuredStrategy })
  } catch (error) {
    console.error("[v0] Backtest API error:", error)
    return NextResponse.json({ error: "Failed to process backtest" }, { status: 500 })
  }
}

async function runBacktest(strategy: any, config: BacktestConfig) {
  // Simulate backtesting logic
  // In a real implementation, this would fetch historical data and run the strategy

  const numTrades = Math.floor(Math.random() * 100) + 50
  const winRate = 0.55 + Math.random() * 0.15 // 55-70% win rate
  const tradesWon = Math.floor(numTrades * winRate)
  const tradesLost = numTrades - tradesWon

  const avgWin = config.takeProfit * config.initialCapital * 0.01
  const avgLoss = config.stopLoss * config.initialCapital * 0.01

  const grossProfit = tradesWon * avgWin
  const grossLoss = tradesLost * avgLoss
  const commissionCost = numTrades * (config.commission / 100) * config.initialCapital
  const netProfit = grossProfit - grossLoss - commissionCost

  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit

  // Generate equity curve
  const equityCurve = []
  let currentEquity = config.initialCapital
  const startDate = new Date("2024-01-01")

  for (let i = 0; i < 100; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i * 3)

    // Simulate equity growth with some volatility
    const progress = i / 100
    const trend = (netProfit / config.initialCapital) * progress
    const volatility = (Math.random() - 0.5) * 0.1
    currentEquity = config.initialCapital * (1 + trend + volatility)

    equityCurve.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(currentEquity * 100) / 100,
    })
  }

  // Calculate drawdown
  let maxEquity = config.initialCapital
  let maxDrawdown = 0

  for (const point of equityCurve) {
    if (point.value > maxEquity) {
      maxEquity = point.value
    }
    const drawdown = maxEquity - point.value
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }

  const balanceDrawdownAbsolute = maxDrawdown
  const balanceDrawdownRelative = (maxDrawdown / maxEquity) * 100

  // Calculate Sharpe Ratio (simplified)
  const returns = []
  for (let i = 1; i < equityCurve.length; i++) {
    const ret = (equityCurve[i].value - equityCurve[i - 1].value) / equityCurve[i - 1].value
    returns.push(ret)
  }

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const stdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length)
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0

  // Z-Score (simplified - measures consistency)
  const zScore = winRate > 0.5 ? 1.5 + Math.random() * 1.5 : -1.5 + Math.random() * 1.5

  // Linear Regression Correlation
  const lrCorrelation = 0.7 + Math.random() * 0.25

  return {
    profitFactor: Math.round(profitFactor * 100) / 100,
    equityCurve,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    zScore: Math.round(zScore * 100) / 100,
    lrCorrelation: Math.round(lrCorrelation * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    balanceDrawdownAbsolute: Math.round(balanceDrawdownAbsolute * 100) / 100,
    balanceDrawdownRelative: Math.round(balanceDrawdownRelative * 100) / 100,
    totalTrades: numTrades,
    tradesWon,
    tradesLost,
  }
}
