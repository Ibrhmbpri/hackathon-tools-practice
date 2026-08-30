import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Task = {
  id: number
  title: string
  completed: boolean
  created_at: string
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setTasks(data ?? [])
    }

    setLoading(false)
  }

  async function addTask() {
    const trimmed = title.trim()
    if (!trimmed || adding) return

    setAdding(true)

    const { data, error } = await supabase
      .from("tasks")
      .insert({ title: trimmed })
      .select()
      .single()

    if (error) {
      console.error(error)
      alert(error.message)
    } else {
      setTasks((current) => [data, ...current])
      setTitle("")
    }

    setAdding(false)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-16">
      <Card className="mx-auto max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Hackathon Tools Practice</CardTitle>
          <CardDescription>
            React + Supabase + shadcn/ui
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask()
              }}
              placeholder="Enter a task"
            />

            <Button onClick={addTask} disabled={adding}>
              {adding ? "Adding..." : "Add task"}
            </Button>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-muted-foreground">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks yet.</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border bg-background p-3"
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default App