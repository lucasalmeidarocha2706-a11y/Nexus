"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Ola! Sou o assistente IA do Nexus. Como posso ajudar voce hoje?",
    timestamp: new Date(),
  },
]

// Mock responses - ready for real API integration
const mockResponses = [
  "Posso ajudar voce a organizar suas tarefas de forma mais eficiente. Quer que eu sugira uma estrategia?",
  "Entendi! Vou analisar e te dar uma resposta personalizada em breve. Por enquanto, posso ajudar com o gerenciamento de tarefas.",
  "Boa pergunta! Para integrar com uma API externa, voce pode configurar o endpoint na pagina de configuracoes.",
  "Recomendo dividir essa tarefa em subtarefas menores. Assim fica mais facil acompanhar o progresso.",
  "Quer que eu crie um resumo das suas tarefas pendentes? Posso organizar por prioridade.",
]

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulated AI response - ready for real API
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500))

    const response: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, response])
    setIsTyping(false)
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-shadow hover:shadow-xl"
            aria-label="Abrir assistente IA"
          >
            <MessageCircle size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm sm:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 right-0 z-50 flex h-svh w-full flex-col border-l border-border bg-background sm:bottom-6 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-2xl sm:border sm:shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground">
                    <Bot size={14} className="text-background" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Assistente IA
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Sempre disponivel
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Fechar assistente"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-2.5 ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          msg.role === "assistant"
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <Bot size={14} />
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-foreground text-background"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="flex gap-2.5"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                          <Bot size={14} />
                        </div>
                        <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
                          <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: 0,
                            }}
                          />
                          <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: 0.2,
                            }}
                          />
                          <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: 0.4,
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                    disabled={isTyping}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-opacity disabled:opacity-40"
                    aria-label="Enviar mensagem"
                  >
                    {isTyping ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </motion.button>
                </div>
                <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
                  Nexus IA pode cometer erros. Verifique informacoes importantes.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
