import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { logout } from '../api/auth'
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from '../api/tasks'
import TaskList from '../components/TaskList'
import TaskModal from '../components/TaskModal'
import AiSuggestionBox from '../components/AiSuggestionBox'
import {
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  LogOut,
  Zap,
  BarChart3,
  Calendar,
  Users,
} from 'lucide-react'

const Dashboard = () => {
  const { user, setUser } = useAuth()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      console.log('Dashboard: Loading tasks from backend...')
      const tasksData = await getTasks()
      console.log('Dashboard: Loaded tasks:', tasksData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to load tasks:', error)
      // Error handling - could show a toast notification here
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setShowTaskModal(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const handleTaskSave = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, taskData)
      } else {
        // Create new task
        await createTask(taskData)
      }

      // Reload tasks to get updated data
      await loadTasks()
      setShowTaskModal(false)
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to save task:', error)
      // Re-throw error so TaskModal can show it
      throw error
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId)
      // Reload tasks to reflect deletion
      await loadTasks()
    } catch (error) {
      console.error('Failed to delete task:', error)
      // Error handling - could show error message to user
    }
  }

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      if (taskId && updates) {
        // Called from TaskList with specific updates (like drag and drop)
        console.log('Dashboard: Updating task:', taskId, 'with updates:', updates)
        const updatedTask = await updateTask(taskId, updates)
        console.log('Dashboard: Task update successful, received:', updatedTask)

        // Update the task in local state immediately instead of reloading all tasks
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)))

        console.log('Dashboard: Local state updated with new task data')
      } else {
        // Called as simple refresh
        console.log('Dashboard: Refreshing task list...')
        await loadTasks()
      }
    } catch (error) {
      console.error('Dashboard: Failed to update task:', error)
      // Show user-friendly error message
      alert('Failed to update task. Please try again.')
    }
  }

  const handleAddTaskFromAI = async (taskData) => {
    try {
      await createTask(taskData)
      // Reload tasks to show the new task
      await loadTasks()
    } catch (error) {
      console.error('Failed to add task from AI suggestion:', error)
      throw error
    }
  }

  // Real-time drag-and-drop status change handler
  const handleTaskStatusChange = async (taskId, newStatus) => {
    // Optimistically update UI
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    )
    try {
      // Persist to backend
      const updatedTask = await updateTaskStatus(taskId, newStatus)
      // Patch with backend response (in case other fields changed)
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)))
    } catch (error) {
      // Optionally revert UI and show error
      await loadTasks()
      alert('Failed to update task status. Please try again.')
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">SprintSync</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-blue-600 font-medium">
                  Tasks
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Projects
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Reports
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="space-y-6">
              {/* Stats */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Overview
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Total Tasks</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{taskStats.total}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-900">In Progress</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-600">
                      {taskStats.inProgress}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">Completed</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">{taskStats.done}</span>
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              <AiSuggestionBox onAddTask={handleAddTaskFromAI} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                  <p className="text-gray-600">Manage and track your team's tasks</p>
                </div>
                <button
                  onClick={handleCreateTask}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Task</span>
                </button>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="input-field pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    className="input-field w-auto"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskStatusChange={handleTaskStatusChange}
              onEditTask={handleEditTask}
              onDeleteTask={handleTaskDelete}
            />
          </div>
        </main>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => setShowTaskModal(false)}
          onSave={handleTaskSave}
        />
      )}
    </div>
  )
}

export default Dashboard
