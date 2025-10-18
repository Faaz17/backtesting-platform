"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, ChevronUp, Sparkles } from "lucide-react"

export function RuleBuilder() {
  const [entryText, setEntryText] = useState(
    "Use BackTestPro AI to create filters auto-magically. Ex: Ichimoku span A and Span B greater than close price",
  )
  const [stopLoss, setStopLoss] = useState(true)
  const [takeProfit, setTakeProfit] = useState(true)

  return (
    <div className="space-y-6">
      {/* Entry Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            Entry
          </Badge>
          <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
            <X className="w-3 h-3" />
            Clear all condition
          </Button>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-3">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <Input
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            className="pl-12 min-h-[80px] bg-success/5 border-success/30 text-sm"
          />
        </div>

        {/* Conditions */}
        <Card className="p-4 bg-muted/30 border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">≡ Condition 1</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                <Plus className="w-3 h-3" />
                Create Nest
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronUp className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-primary border-dashed bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Add expression
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-primary border-dashed bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Add operator
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-primary border-dashed bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Add expression
            </Button>
          </div>
        </Card>

        <Button variant="outline" size="sm" className="w-full gap-2 border-dashed bg-transparent">
          <Plus className="w-4 h-4" />
          New Condition
        </Button>
      </div>

      {/* Exit Section */}
      <div className="space-y-4">
        <Badge variant="secondary" className="text-xs">
          Exit
        </Badge>

        <p className="text-sm text-muted-foreground">
          Set rules for when and how a trade should close to secure profits or limit losses.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Stop Loss */}
          <Card className="p-4 bg-muted/30 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="stop-loss" className="text-sm font-medium">
                Stop Loss
              </Label>
              <Switch id="stop-loss" checked={stopLoss} onCheckedChange={setStopLoss} />
            </div>
            {stopLoss && (
              <div className="space-y-3">
                <Select defaultValue="specific">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="specific">Specific value</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" defaultValue="2" />
                <Select defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </Card>

          {/* Take Profit */}
          <Card className="p-4 bg-muted/30 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="take-profit" className="text-sm font-medium">
                Take Profit
              </Label>
              <Switch id="take-profit" checked={takeProfit} onCheckedChange={setTakeProfit} />
            </div>
            {takeProfit && (
              <div className="space-y-3">
                <Select defaultValue="specific">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="specific">Specific value</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" defaultValue="4" />
                <Select defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </Card>
        </div>

        {/* Exit Conditions */}
        <Card className="p-4 bg-muted/30 border-border/50">
          <div className="flex items-center justify-between">
            <Label htmlFor="exit-conditions" className="text-sm font-medium">
              Exit conditions
            </Label>
            <Switch id="exit-conditions" />
          </div>
        </Card>
      </div>
    </div>
  )
}

function Badge({ children, variant = "default", className = "" }: any) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
        variant === "secondary" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
      } ${className}`}
    >
      {children}
    </span>
  )
}

function Copy({ className }: any) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}

function Trash2({ className }: any) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}
