"use client"

import { Textarea } from "@/components/ui/textarea"

type StrategyCanvasProps = {
  value: string
  onChange: (value: string) => void
}

export function StrategyCanvas({ value, onChange }: StrategyCanvasProps) {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2">
          Describe your trading strategy in plain English. For example:
        </p>
        <p className="text-sm font-mono text-foreground italic">
          {
            '"Buy when RSI is below 30 and MACD crosses above signal line. Sell when RSI is above 70 or price drops 2% below entry."'
          }
        </p>
      </div>

      <Textarea
        placeholder="Enter your trading strategy here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-h-[400px] font-mono text-sm resize-none"
      />

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-chart-1" />
          <span>Entry Conditions</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-chart-2" />
          <span>Exit Conditions</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-chart-3" />
          <span>Risk Management</span>
        </div>
      </div>
    </div>
  )
}
