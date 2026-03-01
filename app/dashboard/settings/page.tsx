"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor, Check, Eye, EyeOff } from "lucide-react"
import { mockUser } from "@/lib/supabase"

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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState(mockUser.name)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const handleSaveName = () => {
    // Ready for Supabase integration
    mockUser.name = name
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSavePassword = () => {
    // Ready for Supabase integration
    setCurrentPassword("")
    setNewPassword("")
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 2000)
  }

  const themes = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Configuracoes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie sua conta e preferencias.
        </p>
      </motion.div>

      {/* Profile section */}
      <motion.div
        variants={item}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="text-sm font-semibold text-foreground">Perfil</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Atualize suas informacoes pessoais.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{mockUser.email}</p>
            </div>
          </div>

          {/* Name input */}
          <div>
            <label
              htmlFor="settings-name"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Nome
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 sm:max-w-sm"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label
              htmlFor="settings-email"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Email
            </label>
            <input
              id="settings-email"
              type="email"
              value={mockUser.email}
              readOnly
              className="w-full rounded-lg border border-input bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground sm:max-w-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveName}
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Salvar alteracoes
            </motion.button>
            <AnimatePresence>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-1.5 text-xs text-success"
                >
                  <Check size={14} />
                  Salvo com sucesso
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Password section */}
      <motion.div
        variants={item}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="text-sm font-semibold text-foreground">Senha</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Atualize sua senha de acesso.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label
              htmlFor="current-password"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Senha atual
            </label>
            <div className="relative sm:max-w-sm">
              <input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Sua senha atual"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showCurrentPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Nova senha
            </label>
            <div className="relative sm:max-w-sm">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Sua nova senha"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showNewPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSavePassword}
              disabled={!currentPassword || !newPassword}
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Atualizar senha
            </motion.button>
            <AnimatePresence>
              {passwordSaved && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-1.5 text-xs text-success"
                >
                  <Check size={14} />
                  Senha atualizada
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Theme section */}
      <motion.div
        variants={item}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="text-sm font-semibold text-foreground">Aparencia</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Escolha o tema da interface.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 sm:max-w-sm">
          {themes.map((t) => {
            const isActive = theme === t.value
            return (
              <motion.button
                key={t.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTheme(t.value)}
                className={`relative flex flex-col items-center gap-2 rounded-xl border px-4 py-4 transition-colors ${
                  isActive
                    ? "border-foreground/30 bg-accent"
                    : "border-border hover:bg-accent/50"
                }`}
              >
                <t.icon size={20} className={isActive ? "text-foreground" : "text-muted-foreground"} />
                <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="themeIndicator"
                    className="absolute right-2 top-2"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground">
                      <Check size={10} className="text-background" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        variants={item}
        className="rounded-xl border border-destructive/20 bg-card p-6"
      >
        <h2 className="text-sm font-semibold text-destructive">Zona de perigo</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Acoes irreversiveis para sua conta.
        </p>
        <div className="mt-5">
          <button className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
            Excluir conta
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
