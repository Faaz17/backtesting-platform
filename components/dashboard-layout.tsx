"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Code2, ChevronLeft, TrendingUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Builder", href: "/builder", icon: Code2 },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary shadow-[0_0_20px_rgba(0,217,255,0.3)]">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-foreground">BacktestPro</h1>
              <p className="text-xs text-muted-foreground">Trading Platform</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary text-primary shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent hover:shadow-[0_0_10px_rgba(0,217,255,0.1)]",
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center hover:bg-sidebar-accent"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 border border-primary/50">
              <AvatarFallback className="bg-primary/20 text-primary">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Trader</p>
                <p className="text-xs text-muted-foreground truncate">Pro Account</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}
