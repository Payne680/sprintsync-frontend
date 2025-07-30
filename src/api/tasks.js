import axios from 'axios'

// Data mapping functions between backend and frontend formats

// Map backend task format to frontend format
const mapBackendTaskToFrontend = (backendTask) => {
  if (!backendTask) return null

  return {
    id: backendTask.id,
    title: backendTask.title || '',
    description: backendTask.description || '',
    status: mapBackendStatusToFrontend(backendTask.status),
    priority: backendTask.priority || 'medium', // Assuming backend will add priority field
    assignee: backendTask.assignee || backendTask.userId ? `User ${backendTask.userId}` : '', // Map userId to assignee name
    dueDate: backendTask.dueDate || '', // Assuming backend will add dueDate field
    totalMinutes: backendTask.totalMinutes || 0,
    createdAt: backendTask.createdAt,
    updatedAt: backendTask.updatedAt,
  }
}

// Map frontend task format to backend format
const mapFrontendTaskToBackend = (frontendTask) => {
  if (!frontendTask) return null

  const backendData = {}

  // Only include fields that are provided (for partial updates)
  if (frontendTask.title !== undefined) {
    backendData.title = frontendTask.title
  }
  if (frontendTask.description !== undefined) {
    backendData.description = frontendTask.description
  }
  if (frontendTask.status !== undefined) {
    backendData.status = mapFrontendStatusToBackend(frontendTask.status)
  }
  if (frontendTask.totalMinutes !== undefined) {
    backendData.totalMinutes = frontendTask.totalMinutes
  }

  console.log('Mapping frontend to backend:', frontendTask, '→', backendData)
  return backendData
}

// Map backend status format to frontend format
const mapBackendStatusToFrontend = (backendStatus) => {
  switch (backendStatus) {
    case 'TODO':
      return 'todo'
    case 'IN_PROGRESS':
      return 'in-progress'
    case 'DONE':
      return 'done'
    default:
      return 'todo'
  }
}

// Map frontend status format to backend format
const mapFrontendStatusToBackend = (frontendStatus) => {
  switch (frontendStatus) {
    case 'todo':
      return 'TODO'
    case 'in-progress':
      return 'IN_PROGRESS'
    case 'done':
      return 'DONE'
    default:
      return 'TODO'
  }
}

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
axios.defaults.baseURL = API_BASE_URL

// Task API endpoints
export const getTasks = async () => {
  try {
    console.log('Fetching tasks from:', `${API_BASE_URL}/api/tasks`)
    const response = await axios.get('/api/tasks')
    console.log('Tasks response:', response.data)

    // Handle both array response and object with tasks array
    const tasksArray = response.data.tasks || response.data

    // Map backend response to frontend format
    const mappedTasks = tasksArray.map(mapBackendTaskToFrontend)

    return mappedTasks
  } catch (error) {
    console.error('Get tasks error:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)

    // Fallback to localStorage or dummy data if backend is not available
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      console.log('Backend not available, using localStorage or dummy data')
      return getTasksFromLocalStorage()
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch tasks')
  }
}

export const createTask = async (taskData) => {
  try {
    console.log('Creating task:', taskData)

    // Map frontend task data to backend format
    const backendTaskData = mapFrontendTaskToBackend(taskData)

    const response = await axios.post('/api/tasks', backendTaskData)
    console.log('Create task response:', response.data)

    // Map backend response back to frontend format
    const frontendTask = mapBackendTaskToFrontend(response.data.task || response.data)

    return frontendTask
  } catch (error) {
    console.error('Create task error:', error)
    console.error('Error response:', error.response?.data)

    // Fallback for demo purposes - save to localStorage
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      console.log('Backend not available, saving to localStorage')
      const newTask = {
        id: Date.now(),
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      saveTaskToLocalStorage(newTask)
      return newTask
    }

    throw new Error(error.response?.data?.message || 'Failed to create task')
  }
}

export const updateTask = async (taskId, taskData) => {
  try {
    console.log('API: Updating task:', taskId, 'with frontend data:', taskData)

    // Map frontend task data to backend format
    const backendTaskData = mapFrontendTaskToBackend(taskData)
    console.log('API: Mapped to backend format:', backendTaskData)

    const response = await axios.put(`/api/tasks/${taskId}`, backendTaskData)
    console.log('API: Update task response:', response.data)

    // Map backend response back to frontend format
    const frontendTask = mapBackendTaskToFrontend(response.data.task || response.data)
    console.log('API: Mapped response to frontend format:', frontendTask)

    return frontendTask
  } catch (error) {
    console.error('Update task error:', error)
    console.error('Error response:', error.response?.data)

    // Fallback for demo purposes - update in localStorage
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      console.log('Backend not available, updating in localStorage')
      const updatedTask = updateTaskInLocalStorage(taskId, taskData)
      return updatedTask
    }

    throw new Error(error.response?.data?.message || 'Failed to update task')
  }
}

// Update only the status of a task using the /:id/status endpoint
export const updateTaskStatus = async (taskId, status) => {
  try {
    const backendStatus = mapFrontendStatusToBackend(status)
    console.log('API: Updating task status using /status endpoint:', taskId, backendStatus)
    const response = await axios.patch(`/api/tasks/${taskId}/status`, { status: backendStatus })
    // The backend should return the updated task object
    const frontendTask = mapBackendTaskToFrontend(response.data.task || response.data)
    console.log('API: Mapped response to frontend format:', frontendTask)
    return frontendTask
  } catch (error) {
    console.error('Update task status error:', error)
    console.error('Error response:', error.response?.data)

    // Fallback for demo purposes - update in localStorage
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      console.log('Backend not available, updating status in localStorage')
      const updatedTask = updateTaskInLocalStorage(taskId, { status })
      return updatedTask
    }

    throw new Error(error.response?.data?.message || 'Failed to update task status')
  }
}

export const deleteTask = async (taskId) => {
  try {
    console.log('Deleting task:', taskId)
    const response = await axios.delete(`/api/tasks/${taskId}`)
    console.log('Delete task response:', response.data)
    return response.data
  } catch (error) {
    console.error('Delete task error:', error)
    console.error('Error response:', error.response?.data)

    // Fallback for demo purposes - delete from localStorage
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      console.log('Backend not available, deleting from localStorage')
      deleteTaskFromLocalStorage(taskId)
      return { success: true, message: 'Task deleted from localStorage' }
    }

    throw new Error(error.response?.data?.message || 'Failed to delete task')
  }
}

export const getAiSuggestions = async (context) => {
  try {
    console.log('Getting AI suggestions with context:', context)
    const response = await axios.post('/api/ai/suggestions', { context })
    console.log('AI suggestions response:', response.data)
    return response.data.suggestions || response.data
  } catch (error) {
    console.error('AI suggestions error:', error)
    console.error('Error response:', error.response?.data)

    // Fallback to dummy suggestions if backend AI is not available
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      console.log('AI backend not available, using dummy suggestions')
      return getDummyAiSuggestions()
    }

    throw new Error(error.response?.data?.message || 'Failed to get AI suggestions')
  }
}

// localStorage helper functions for persistence without backend
const TASKS_STORAGE_KEY = 'sprintsync_tasks'

const getTasksFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY)
    if (stored) {
      const tasks = JSON.parse(stored)
      console.log('Loaded tasks from localStorage:', tasks)
      return tasks
    }
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error)
  }

  // Return dummy tasks if localStorage is empty or corrupted
  console.log('No tasks in localStorage, using dummy data')
  const dummyTasks = getDummyTasks()
  saveTasksToLocalStorage(dummyTasks)
  return dummyTasks
}

const saveTasksToLocalStorage = (tasks) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    console.log('Saved tasks to localStorage:', tasks)
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error)
  }
}

const saveTaskToLocalStorage = (newTask) => {
  const currentTasks = getTasksFromLocalStorage()
  const updatedTasks = [...currentTasks, newTask]
  saveTasksToLocalStorage(updatedTasks)
  return newTask
}

const updateTaskInLocalStorage = (taskId, taskData) => {
  const currentTasks = getTasksFromLocalStorage()
  const taskIndex = currentTasks.findIndex((task) => task.id == taskId)

  if (taskIndex === -1) {
    console.warn('Task not found in localStorage:', taskId)
    return { id: taskId, ...taskData, updatedAt: new Date().toISOString() }
  }

  const updatedTask = {
    ...currentTasks[taskIndex],
    ...taskData,
    updatedAt: new Date().toISOString(),
  }

  currentTasks[taskIndex] = updatedTask
  saveTasksToLocalStorage(currentTasks)
  console.log('Updated task in localStorage:', updatedTask)
  return updatedTask
}

const deleteTaskFromLocalStorage = (taskId) => {
  const currentTasks = getTasksFromLocalStorage()
  const updatedTasks = currentTasks.filter((task) => task.id != taskId)
  saveTasksToLocalStorage(updatedTasks)
  console.log('Deleted task from localStorage:', taskId)
}

// Dummy data fallbacks
const getDummyTasks = () => {
  return [
    {
      id: 1,
      title: 'Setup authentication system',
      description: 'Implement login and signup functionality',
      status: 'done',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2025-07-30',
      createdAt: '2025-07-25',
      updatedAt: '2025-07-25',
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
      updatedAt: '2025-07-26',
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
      updatedAt: '2025-07-27',
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
      updatedAt: '2025-07-28',
    },
  ]
}

const getDummyAiSuggestions = () => {
  return [
    {
      type: 'productivity',
      title: 'Optimize Task Prioritization',
      description:
        'Consider grouping similar tasks together to reduce context switching and improve focus.',
      impact: 'high',
    },
    {
      type: 'workflow',
      title: 'Set Time Blocks',
      description:
        'Allocate specific time blocks for different types of tasks to improve time management.',
      impact: 'medium',
    },
    {
      type: 'collaboration',
      title: 'Daily Standups',
      description:
        'Implement brief daily check-ins to keep team aligned and identify blockers early.',
      impact: 'high',
    },
  ]
}

// Initialize axios interceptors for authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle authentication errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
