"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Info } from "lucide-react"
import type { BacktestConfig } from "@/types/backtest"

type ConfigurationModalProps = {
  config: BacktestConfig
  onClose: () => void
  onProceed: (config: BacktestConfig) => void
  isRunning: boolean
}

export function ConfigurationModal({ config: initialConfig, onClose, onProceed, isRunning }: ConfigurationModalProps) {
  const [config, setConfig] = useState(initialConfig)

  const updateConfig = (key: keyof BacktestConfig, value: any) => {
    setConfig({ ...config, [key]: value })
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto p-8 shadow-[0_0_50px_rgba(0,217,255,0.3)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Configure your strategy</h2>
            <p className="text-sm text-muted-foreground">Configure strategy primary settings!</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Asset Display */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg">{config.assets[0] || "TCS"}</span>
                <span className="text-muted-foreground">|</span>
                <span className="font-mono text-lg">AED</span>
              </div>
            </div>
            <Badge variant="secondary">BSE</Badge>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial-capital" className="flex items-center gap-1">
                Initial Capital (AED)
                <Info className="w-3 h-3 text-muted-foreground" />
              </Label>
              <Input
                id="initial-capital"
                type="number"
                value={config.initialCapital}
                onChange={(e) => updateConfig("initialCapital", Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="per-order" className="flex items-center gap-1">
                Per Order Quantity
                <Info className="w-3 h-3 text-muted-foreground" />
              </Label>
              <Input
                id="per-order"
                type="number"
                value={config.perOrderQuantity}
                onChange={(e) => updateConfig("perOrderQuantity", Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pyramiding" className="flex items-center gap-1">
                Pyramiding count
                <Info className="w-3 h-3 text-muted-foreground" />
              </Label>
              <Input
                id="pyramiding"
                type="number"
                value={config.pyramidingCount}
                onChange={(e) => updateConfig("pyramidingCount", Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission" className="flex items-center gap-1">
                Commission (%)
                <Info className="w-3 h-3 text-muted-foreground" />
              </Label>
              <Input
                id="commission"
                type="number"
                step="0.01"
                value={config.commission}
                onChange={(e) => updateConfig("commission", Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin" className="flex items-center gap-1">
                Short Margin (%)
                <Info className="w-3 h-3 text-muted-foreground" />
              </Label>
              <Input
                id="margin"
                type="number"
                value={config.margin}
                onChange={(e) => updateConfig("margin", Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval" className="flex items-center gap-1">
                Interval
                <Info className="w-3 h-3 text-muted-foreground" />
              </Label>
              <Select value={config.timeframe} onValueChange={(v) => updateConfig("timeframe", v)}>
                <SelectTrigger id="interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1m</SelectItem>
                  <SelectItem value="5m">5m</SelectItem>
                  <SelectItem value="15m">15m</SelectItem>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="4h">4h</SelectItem>
                  <SelectItem value="1d">1d</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Strategy Name */}
          <div className="space-y-2">
            <Label htmlFor="strategy-name">Give your strategy a name</Label>
            <Input
              id="strategy-name"
              value={config.strategyName}
              onChange={(e) => updateConfig("strategyName", e.target.value)}
            />
          </div>

          {/* Strategy Description */}
          <div className="space-y-2">
            <Label htmlFor="strategy-description">Strategy Description</Label>
            <Textarea
              id="strategy-description"
              placeholder="Describe this strategy a bit?"
              value={config.strategyDescription}
              onChange={(e) => updateConfig("strategyDescription", e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Go back
            </Button>
            <Button
              onClick={() => onProceed(config)}
              disabled={isRunning}
              className="flex-1 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              {isRunning ? "Running..." : "Proceed"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Badge({ children, variant = "default" }: any) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
        variant === "secondary" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
      }`}
    >
      {children}
    </span>
  )
}
