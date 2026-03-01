"use client"

import { motion } from "framer-motion"
import { TaskList } from "@/components/task-list"

export default function TasksPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <TaskList />
    </motion.div>
  )
}
