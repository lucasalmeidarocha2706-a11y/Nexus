"use client"

import { useState, useSyncExternalStore, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Check,
  Trash2,
  Pencil,
  X,
  Circle,
  CheckCircle2,
} from "lucide-react"
import {
  getTasks,
  addTask,
  deleteTask,
  toggleTask,
  updateTask,
  subscribe,
} from "@/lib/store"
import type { Task } from "@/lib/supabase"

function useTaskStore() {
  const tasks = useSyncExternalStore(
    subscribe,
    getTasks,
    getTasks
  )
  return tasks
}

export function TaskList() {
  const tasks = useTaskStore()
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed
    if (filter === "completed") return t.completed
    return true
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length

  const handleAdd = useCallback(() => {
    if (!newTitle.trim()) return
    addTask(newTitle.trim(), newDescription.trim() || undefined)
    setNewTitle("")
    setNewDescription("")
    setShowForm(false)
  }, [newTitle, newDescription])

  const handleEdit = useCallback(
    (id: string) => {
      if (!editTitle.trim()) return
      updateTask(id, { title: editTitle.trim() })
      setEditingId(null)
      setEditTitle("")
    },
    [editTitle]
  )

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Tarefas</h2>
          <p className="text-sm text-muted-foreground">
            {completedTasks} de {totalTasks} concluidas
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Nova tarefa
        </motion.button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-foreground"
          initial={{ width: 0 }}
          animate={{
            width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : "0%",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* New task form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Titulo da tarefa"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Descricao (opcional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!newTitle.trim()}
                    className="rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {(["all", "pending", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter === f && (
              <motion.div
                layoutId="filterTab"
                className="absolute inset-0 rounded-md bg-background shadow-sm"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {f === "all" ? "Todas" : f === "pending" ? "Pendentes" : "Concluidas"}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="group rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
            >
              {editingId === task.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEdit(task.id)
                      if (e.key === "Escape") setEditingId(null)
                    }}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="rounded-md p-1.5 text-success transition-colors hover:bg-success/10"
                    aria-label="Salvar"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Cancelar"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={task.completed ? "Desmarcar tarefa" : "Marcar como concluida"}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={18} className="text-success" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium transition-all ${
                        task.completed
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(task)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Editar tarefa"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Deletar tarefa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center"
          >
            <CheckSquare className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Nenhuma tarefa encontrada</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function CheckSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}
