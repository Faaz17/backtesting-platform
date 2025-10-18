"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BacktestConfig } from "./strategy-builder"

type ConfigurationFormProps = {
  config: BacktestConfig
  onChange: (config: BacktestConfig) => void
}

export function ConfigurationForm({ config, onChange }: ConfigurationFormProps) {
  const updateConfig = (key: keyof BacktestConfig, value: any) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="initial-capital">Initial Capital ($)</Label>
        <Input
          id="initial-capital"
          type="number"
          value={config.initialCapital}
          onChange={(e) => updateConfig("initialCapital", Number.parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="margin">Margin (Leverage)</Label>
        <Input
          id="margin"
          type="number"
          value={config.margin}
          onChange={(e) => updateConfig("margin", Number.parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stop-loss">Stop Loss (%)</Label>
        <Input
          id="stop-loss"
          type="number"
          step="0.1"
          value={config.stopLoss}
          onChange={(e) => updateConfig("stopLoss", Number.parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="take-profit">Take Profit (%)</Label>
        <Input
          id="take-profit"
          type="number"
          step="0.1"
          value={config.takeProfit}
          onChange={(e) => updateConfig("takeProfit", Number.parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="commission">Commission (% per round trip)</Label>
        <Input
          id="commission"
          type="number"
          step="0.01"
          value={config.commission}
          onChange={(e) => updateConfig("commission", Number.parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeframe">Timeframe</Label>
        <Select value={config.timeframe} onValueChange={(v) => updateConfig("timeframe", v)}>
          <SelectTrigger id="timeframe">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 Minute</SelectItem>
            <SelectItem value="5m">5 Minutes</SelectItem>
            <SelectItem value="15m">15 Minutes</SelectItem>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="4h">4 Hours</SelectItem>
            <SelectItem value="1d">1 Day</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
