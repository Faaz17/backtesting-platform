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
      const response = await fetch("/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          strategy: strategyDescription,
          config: finalConfig 
        }),
      })

      const data = await response.json()
      if (data.error) {
        console.error("Backtest error:", data.error)
        alert(`Backtest failed: ${data.error}`)
        return
      }
      
      setResults(data.results)
      setStep("results")
    } catch (error) {
      console.error("[v0] Backtest error:", error)
      alert("Failed to run backtest. Please try again.")
    } finally {
      setIsRunning(false)
    }
  }

  if (step === "results" && results) {
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
        <Button
          onClick={handleProceedToBacktest}
          disabled={selectedAssets.length === 0 || !strategyDescription.trim() || isRunning}
          size="lg"
          className="gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
        >
          {isRunning ? "Running Backtest..." : "Proceed to Backtest"}
          <span className="px-2 py-0.5 bg-background/20 rounded text-xs">Lv 1</span>
        </Button>
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
