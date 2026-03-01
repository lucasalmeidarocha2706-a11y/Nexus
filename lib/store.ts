import type { Task } from "./supabase"

// In-memory task store for development - ready for Supabase integration
let tasks: Task[] = [
  {
    id: "1",
    user_id: "1",
    title: "Configurar autenticacao com Supabase",
    description: "Integrar o sistema de login com Supabase Auth",
    completed: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    user_id: "1",
    title: "Implementar CRUD de tarefas no backend",
    description: "Criar endpoints para gerenciar tarefas",
    completed: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    user_id: "1",
    title: "Adicionar notificacoes por email",
    description: "Enviar lembretes de tarefas pendentes",
    completed: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    user_id: "1",
    title: "Revisar design da landing page",
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

let listeners: (() => void)[] = []

function notifyListeners() {
  listeners.forEach((l) => l())
}

export function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function getTasks(): Task[] {
  return [...tasks]
}

export function addTask(title: string, description?: string): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    user_id: "1",
    title,
    description,
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  tasks = [task, ...tasks]
  notifyListeners()
  return task
}

export function updateTask(id: string, updates: Partial<Pick<Task, "title" | "description" | "completed">>): Task | null {
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) return null
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
  )
  notifyListeners()
  return tasks[index]
}

export function deleteTask(id: string): boolean {
  const before = tasks.length
  tasks = tasks.filter((t) => t.id !== id)
  if (tasks.length !== before) {
    notifyListeners()
    return true
  }
  return false
}

export function toggleTask(id: string): Task | null {
  const task = tasks.find((t) => t.id === id)
  if (!task) return null
  return updateTask(id, { completed: !task.completed })
}
