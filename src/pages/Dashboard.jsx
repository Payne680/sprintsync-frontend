import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { logout } from '../api/auth'
// Remove API imports since we're using dummy data
// import { getTasks } from '../api/tasks'
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

  // Dummy tasks data
  const dummyTasks = [
    {
      id: 1,
      title: 'Setup authentication system',
      description: 'Implement login and signup functionality',
      status: 'done',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2025-07-30',
      createdAt: '2025-07-25',
    },
    {
      id: 2,
      title: 'Create dashboard UI',
      description: 'Design and implement the main dashboard interface',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: '2025-08-05',
      createdAt: '2025-07-26',
    },
    {
      id: 3,
      title: 'Add task management',
      description: 'Implement CRUD operations for tasks',
      status: 'todo',
      priority: 'high',
      assignee: 'Bob Johnson',
      dueDate: '2025-08-10',
      createdAt: '2025-07-27',
    },
    {
      id: 4,
      title: 'Setup API integration',
      description: 'Connect frontend with backend APIs',
      status: 'todo',
      priority: 'low',
      assignee: 'Alice Brown',
      dueDate: '2025-08-15',
      createdAt: '2025-07-28',
    },
  ]

  const [tasks, setTasks] = useState(dummyTasks)
  const [loading, setLoading] = useState(false) // No loading needed for dummy data
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // No need for useEffect since we're using dummy data
  // useEffect(() => {
  //   loadTasks()
  // }, [])

  // No need for loadTasks function since we're using dummy data
  // const loadTasks = async () => {
  //   try {
  //     const tasksData = await getTasks()
  //     setTasks(tasksData)
  //   } catch (error) {
  //     console.error('Failed to load tasks:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

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

  const handleTaskUpdate = () => {
    // For demo purposes, just close the modal
    // In a real app, this would update the tasks state
    setShowTaskModal(false)
    setEditingTask(null)
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
              <AiSuggestionBox />
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
            <TaskList tasks={filteredTasks} onTaskUpdate={() => {}} onEditTask={handleEditTask} />
          </div>
        </main>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => setShowTaskModal(false)}
          onSave={handleTaskUpdate}
        />
      )}
    </div>
  )
}

export default Dashboard
