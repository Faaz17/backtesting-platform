"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, User, Calendar } from "lucide-react"

const MOCK_STRATEGIES = [
  {
    id: "1",
    name: "My Trading Strategy",
    status: "In Dev",
    type: "Rule Logic Strategy | v1",
    lastUpdated: "18 Oct",
  },
  {
    id: "2",
    name: "My Trading Strategy",
    status: "In Dev",
    type: "Rule Logic Strategy | v1",
    lastUpdated: "18 Oct",
  },
  {
    id: "3",
    name: "My Trading Strategy",
    status: "In Dev",
    type: "Rule Logic Strategy | v1",
    lastUpdated: "18 Oct",
  },
]

const TABS = ["All Strategies", "Published", "Backtest", "In Development", "Stopped"]

export function StrategyList() {
  const [activeTab, setActiveTab] = useState("All Strategies")

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === tab
                ? "bg-primary/10 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {tab}
          </button>
        ))}
        <div className="flex-1" />
        <Button asChild className="gap-2 shadow-[0_0_15px_rgba(0,217,255,0.3)]">
          <Link href="/builder">
            <Plus className="w-4 h-4" />
            Create new strategy
          </Link>
        </Button>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_STRATEGIES.map((strategy) => (
          <Card
            key={strategy.id}
            className="p-6 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all duration-300 border-border/50 hover:border-primary/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="font-semibold text-foreground">{strategy.name}</h3>
              </div>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {strategy.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span>{strategy.type}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Last updated: {strategy.lastUpdated}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
