"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AiAssistant } from "@/components/ai-assistant"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <AiAssistant />
    </div>
  )
}
