"use client"

import { useSyncExternalStore } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
} from "lucide-react"
import { getTasks, subscribe } from "@/lib/store"
import { mockUser } from "@/lib/supabase"
import Link from "next/link"

function useTaskStore() {
  return useSyncExternalStore(subscribe, getTasks, getTasks)
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const tasks = useTaskStore()
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const recentTasks = tasks.slice(0, 5)

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      {/* Welcome */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {greeting}, {mockUser.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aqui esta um resumo das suas atividades.
        </p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total de tarefas",
            value: totalTasks,
            icon: Clock,
            color: "text-foreground",
          },
          {
            label: "Pendentes",
            value: pendingTasks,
            icon: Circle,
            color: "text-chart-5",
          },
          {
            label: "Concluidas",
            value: completedTasks,
            icon: CheckCircle2,
            color: "text-success",
          },
          {
            label: "Conclusao",
            value: `${completionRate}%`,
            icon: TrendingUp,
            color: "text-chart-2",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/30"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent tasks */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Tarefas recentes</h2>
          <Link
            href="/dashboard/tasks"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver todas
          </Link>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {recentTasks.map((task) => (
            <motion.div
              key={task.id}
              variants={item}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/30"
            >
              {task.completed ? (
                <CheckCircle2 size={16} className="shrink-0 text-success" />
              ) : (
                <Circle size={16} className="shrink-0 text-muted-foreground" />
              )}
              <span
                className={`flex-1 text-sm ${
                  task.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </span>
              <span className="text-xs text-muted-foreground/60">
                {new Date(task.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </motion.div>
          ))}
          {recentTasks.length === 0 && (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground">
              Nenhuma tarefa ainda
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
