"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AssetSelector } from "@/components/asset-selector"
import { RuleBuilder } from "@/components/rule-builder"
import { ConfigurationModal } from "@/components/configuration-modal"
import { ResultsDashboard } from "@/components/results-dashboard"
import { ChevronLeft, Copy, Trash2, Brain } from "lucide-react"
import Link from "next/link"
import type { BacktestConfig, BacktestResults } from "@/types/backtest"

export function StrategyBuilder() {
  const [step, setStep] = useState<"build" | "config" | "results">("build")
  const [showConfig, setShowConfig] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [strategyDescription, setStrategyDescription] = useState("")
  const [config, setConfig] = useState<BacktestConfig>({
    assets: [],
    indicators: [],
    initialCapital: 10000,
    stopLoss: 2,
    takeProfit: 4,
    commission: 0,
    timeframe: "15m",
    margin: 100,
    perOrderQuantity: 1,
    pyramidingCount: 1,
    strategyName: "My Trading Strategy",
    strategyDescription: "",
  })
  const [results, setResults] = useState<BacktestResults | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const handleProceedToBacktest = () => {
    setConfig({ ...config, assets: selectedAssets })
    setShowConfig(true)
  }

  const handleRunBacktest = async (finalConfig: BacktestConfig) => {
    setIsRunning(true)
    setShowConfig(false)

    try {
      console.log("Starting backtest with:", { strategy: strategyDescription, config: finalConfig })
      
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const response = await fetch("/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          strategy: strategyDescription,
          config: finalConfig 
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      console.log("Backtest response status:", response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Backtest API error:", errorText)
        alert(`Backtest failed: ${response.status} - ${errorText}`)
        return
      }

      const data = await response.json()
      console.log("Backtest response data:", data)
      
      if (data.error) {
        console.error("Backtest error:", data.error)
        alert(`Backtest failed: ${data.error}`)
        return
      }
      
      if (!data.results) {
        console.error("No results in response:", data)
        alert("Backtest completed but no results received")
        return
      }
      
      console.log("Setting results and switching to results view")
      setResults(data.results)
      setStep("results")
    } catch (error) {
      console.error("Backtest error:", error)
      if (error instanceof Error && error.name === 'AbortError') {
        alert("Backtest timed out after 30 seconds. Please try again.")
      } else {
        alert(`Failed to run backtest: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } finally {
      setIsRunning(false)
    }
  }

  // Debug logging
  console.log("StrategyBuilder render - step:", step, "results:", !!results, "results data:", results)
  
  if (step === "results" && results) {
    console.log("Rendering ResultsDashboard with results:", results)
    return <ResultsDashboard results={results} onBack={() => setStep("build")} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Trading Strategy</h1>
            <p className="text-sm text-muted-foreground">Create your custom, no-code, rule-based strategy!</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleProceedToBacktest}
            disabled={selectedAssets.length === 0 || !strategyDescription.trim() || isRunning}
            size="lg"
            className="gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
          >
            {isRunning ? "Running Backtest..." : "Proceed to Backtest"}
            <span className="px-2 py-0.5 bg-background/20 rounded text-xs">Lv 1</span>
          </Button>
          
          {/* Temporary test button - More prominent */}
          <Button
            onClick={() => {
              console.log("Test button clicked - forcing results view")
              setStep("results")
              setResults({
                netProfit: 1250.50,
                profitFactor: 1.85,
                sharpeRatio: 1.42,
                zScore: 0.75,
                lrCorrelation: 0.68,
                balanceDrawdownAbsolute: 150.25,
                balanceDrawdownRelative: 12.5,
                totalTrades: 45,
                tradesWon: 28,
                tradesLost: 17,
                winRate: 62.2,
                avgWin: 85.30,
                avgLoss: 45.20,
                maxDrawdown: 200.00,
                maxDrawdownDuration: 5,
                volatility: 0.15,
                sortinoRatio: 1.85,
                calmarRatio: 1.25,
                equityCurve: Array.from({ length: 100 }, (_, i) => ({
                  timestamp: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString(),
                  balance: 1000 + (i * 12.5) + Math.random() * 50
                }))
              })
            }}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            🧪 TEST RESULTS
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded">
        <strong>Debug:</strong> StrategyBuilder loaded. Step: {step}, Results: {results ? 'Yes' : 'No'}
      </div>

      {/* Main Content */}
      <Card className="p-8 border-dashed border-2 border-border/50 bg-card/50">
        {/* Strategy Description */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Describe Your Strategy</h2>
          </div>
          <div className="space-y-2">
            <Label htmlFor="strategy">Natural Language Strategy Description</Label>
            <Textarea
              id="strategy"
              placeholder="Describe your trading strategy in natural language. For example: 'Buy when the 20-day moving average crosses above the 50-day moving average, and sell when it crosses below. Use a 2% stop loss and 4% take profit.'"
              value={strategyDescription}
              onChange={(e) => setStrategyDescription(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-sm text-muted-foreground">
              Our AI will convert your strategy description into executable trading logic.
            </p>
          </div>
        </div>

        {/* Asset Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Select Assets</h2>
          <AssetSelector selectedAssets={selectedAssets} onChange={setSelectedAssets} />
        </div>

        {/* Position Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-sm font-mono">⚙️</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Position #1</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                Take Position
                <span className="px-2 py-0.5 bg-success/20 text-success rounded text-xs">Long</span>
              </Badge>
              <Button variant="ghost" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <RuleBuilder />
        </div>
      </Card>

      {/* Configuration Modal */}
      {showConfig && (
        <ConfigurationModal
          config={config}
          onClose={() => setShowConfig(false)}
          onProceed={handleRunBacktest}
          isRunning={isRunning}
        />
      )}
    </div>
  )
}
