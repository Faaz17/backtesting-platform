import { DashboardLayout } from "@/components/dashboard-layout"
import { StrategyList } from "@/components/strategy-list"

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Trading Strategies</h1>
          <p className="text-muted-foreground">Create, backtest, and deploy your custom trading strategies</p>
        </div>
        <StrategyList />
      </div>
    </DashboardLayout>
  )
}
