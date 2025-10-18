"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const POPULAR_CRYPTO = ["BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "XRP/USDT"]
const POPULAR_FOREX = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD"]

type AssetSelectorProps = {
  selectedAssets: string[]
  onChange: (assets: string[]) => void
}

export function AssetSelector({ selectedAssets, onChange }: AssetSelectorProps) {
  const [assetType, setAssetType] = useState<"crypto" | "forex">("crypto")
  const [customAsset, setCustomAsset] = useState("")
  const [duration, setDuration] = useState("30")

  const popularAssets = assetType === "crypto" ? POPULAR_CRYPTO : POPULAR_FOREX

  const addAsset = (asset: string) => {
    if (!selectedAssets.includes(asset)) {
      onChange([...selectedAssets, asset])
    }
  }

  const removeAsset = (asset: string) => {
    onChange(selectedAssets.filter((a) => a !== asset))
  }

  const handleAddCustom = () => {
    if (customAsset && !selectedAssets.includes(customAsset)) {
      onChange([...selectedAssets, customAsset])
      setCustomAsset("")
    }
  }

  return (
    <div className="space-y-4">
      <Select value={assetType} onValueChange={(v) => setAssetType(v as "crypto" | "forex")}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="crypto">Cryptocurrency</SelectItem>
          <SelectItem value="forex">Forex</SelectItem>
        </SelectContent>
      </Select>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Popular Assets</p>
        <div className="flex flex-wrap gap-2">
          {popularAssets.map((asset) => (
            <Button
              key={asset}
              variant={selectedAssets.includes(asset) ? "default" : "outline"}
              size="sm"
              onClick={() => addAsset(asset)}
              className={selectedAssets.includes(asset) ? "shadow-[0_0_15px_rgba(0,255,150,0.3)]" : ""}
            >
              {asset}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-muted-foreground mb-2">Custom Asset</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="e.g., DOGE/USDT"
              value={customAsset}
              onChange={(e) => setCustomAsset(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
              className="flex-1"
            />
            <Button onClick={handleAddCustom} size="icon" className="shadow-[0_0_15px_rgba(0,255,150,0.3)]">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm text-muted-foreground mb-2">Data Duration (Days)</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedAssets.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Selected Assets</p>
          <div className="flex flex-wrap gap-2">
            {selectedAssets.map((asset) => (
              <Badge key={asset} variant="secondary" className="gap-1">
                {asset}
                <button onClick={() => removeAsset(asset)} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
