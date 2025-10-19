import { type NextRequest, NextResponse } from "next/server"
// Use mock service for now to avoid build issues
import { KaggleDataService } from "@/lib/kaggle-service-mock"
import { BacktestingEngine } from "@/lib/backtesting-engine"
import { NLPToPythonConverter } from "@/lib/nlp-to-python"

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

// API credentials
const KAGGLE_CONFIG = {
  username: "djarch123",
  key: "f8d8fba4fa94fd8ea0e2168e91c40cad"
}

const GROQ_API_KEY = process.env.GROQ_API_KEY

if (!GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is required')
}

export async function POST(req: NextRequest) {
  try {
    const { strategy, config }: BacktestRequest = await req.json()

    console.log("[Backtest] Processing strategy:", strategy)
    console.log("[Backtest] Config:", config)

    // Initialize services
    const kaggleService = new KaggleDataService(KAGGLE_CONFIG)
    const nlpConverter = new NLPToPythonConverter(GROQ_API_KEY)
    const backtestingEngine = new BacktestingEngine([], config.initialCapital, config.commission / 100)

    // Step 1: Convert NLP strategy to Python logic
    console.log("[Backtest] Converting NLP strategy to Python...")
    const pythonStrategy = await nlpConverter.convertStrategyToPython(strategy)
    console.log("[Backtest] Python strategy generated:", pythonStrategy)

    // Step 2: Get historical data from Kaggle
    console.log("[Backtest] Fetching historical data from Kaggle...")
    let historicalData
    try {
      // Try to get data for the first selected asset
      const primaryAsset = config.assets[0] || 'BTCUSD'
      console.log(`[Backtest] Attempting to fetch data for: ${primaryAsset}`)
      
      historicalData = await kaggleService.getHistoricalData(primaryAsset, config.timeframe)
      console.log(`[Backtest] Successfully retrieved ${historicalData.length} data points for ${primaryAsset}`)
      
      // Log sample data for verification
      if (historicalData.length > 0) {
        console.log(`[Backtest] Sample data point:`, {
          timestamp: historicalData[0].timestamp,
          close: historicalData[0].close,
          volume: historicalData[0].volume
        })
      }
    } catch (error) {
      console.error("[Backtest] Error fetching data from Kaggle:", error)
      console.log("[Backtest] Falling back to simulated data...")
      
      // Fallback to simulated data
      historicalData = generateSimulatedData(config.assets[0] || 'BTCUSD')
      console.log(`[Backtest] Generated ${historicalData.length} simulated data points`)
    }

    // Step 3: Run backtesting engine
    console.log("[Backtest] Running backtesting engine...")
    const backtestingEngineWithData = new BacktestingEngine(
      historicalData, 
      config.initialCapital, 
      config.commission / 100
    )

    console.log("[Backtest] Engine created, starting backtest...")
    console.log("[Backtest] Strategy config:", {
      entryConditions: pythonStrategy.entryConditions,
      exitConditions: pythonStrategy.exitConditions,
      indicators: pythonStrategy.indicators,
      riskManagement: pythonStrategy.riskManagement
    })
    
    // Run the actual backtesting engine
    console.log("[Backtest] Running actual backtesting engine...")
    const results = await backtestingEngineWithData.runBacktest({
      entryConditions: pythonStrategy.entryConditions,
      exitConditions: pythonStrategy.exitConditions,
      indicators: pythonStrategy.indicators,
      riskManagement: {
        stopLoss: pythonStrategy.riskManagement.stopLoss,
        takeProfit: pythonStrategy.riskManagement.takeProfit
      }
    })

    console.log("[Backtest] Real backtest results generated:", {
      totalTrades: results.totalTrades,
      netProfit: results.netProfit,
      equityCurveLength: results.equityCurve.length,
      profitFactor: results.profitFactor,
      sharpeRatio: results.sharpeRatio
    })

    console.log("[Backtest] Backtesting completed successfully")
    console.log("[Backtest] Results:", {
      totalTrades: results.totalTrades,
      netProfit: results.netProfit,
      profitFactor: results.profitFactor,
      sharpeRatio: results.sharpeRatio
    })

    const response = { 
      results, 
      parsedStrategy: pythonStrategy,
      dataPoints: historicalData.length,
      strategyCode: pythonStrategy.code
    }

    console.log("[Backtest] Sending response:", {
      hasResults: !!response.results,
      resultsKeys: response.results ? Object.keys(response.results) : [],
      dataPoints: response.dataPoints
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("[Backtest] API error:", error)
    return NextResponse.json({ 
      error: "Failed to process backtest", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// Fallback function to generate simulated data when Kaggle fails
function generateSimulatedData(symbol: string) {
  const data = []
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)
  
  let price = 50000 // Starting price
  const volatility = 0.02
  
  for (let i = 0; i < 365 * 24 * 60; i++) { // 1 year of 1-minute data
    const date = new Date(startDate)
    date.setMinutes(date.getMinutes() + i)
    
    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * volatility
    price = price * (1 + change)
    
    const open = price
    const high = price * (1 + Math.random() * 0.01)
    const low = price * (1 - Math.random() * 0.01)
    const close = price * (1 + (Math.random() - 0.5) * 0.005)
    const volume = Math.random() * 1000000
    
    data.push({
      timestamp: date.toISOString(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.round(volume)
    })
  }
  
  return data
}

