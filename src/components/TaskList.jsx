import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// Remove API imports since we're using dummy data
// import { updateTask, deleteTask } from "../api/tasks";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Calendar,
  AlertCircle,
  GripVertical,
} from 'lucide-react'

// Droppable Column Component
const DroppableColumn = ({ children, id, title, color, count }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg border border-gray-200 ${
        isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
    >
      <div className={`p-4 border-b border-gray-200 ${color} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
      </div>
      <div className="p-4 min-h-[200px]">{children}</div>
    </div>
  )
}

// Sortable Task Item Component
const SortableTaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDropdownOpen(!dropdownOpen)
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                  setDropdownOpen(false)
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                  setDropdownOpen(false)
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
          {task.assignee && (
            <div className="flex items-center text-gray-500">
              <User className="w-3 h-3 mr-1" />
              <span>{task.assignee}</span>
            </div>
          )}
        </div>
        {task.dueDate && (
          <div className="flex items-center text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const TaskList = ({ tasks, onTaskUpdate, onEditTask, onDeleteTask }) => {
  const [loading, setLoading] = useState(false)
  const [activeTask, setActiveTask] = useState(null)
  const [taskOrder, setTaskOrder] = useState(tasks)

  const statusColumns = {
    todo: { title: 'To Do', color: 'bg-gray-100 border-gray-300' },
    'in-progress': {
      title: 'In Progress',
      color: 'bg-yellow-100 border-yellow-300',
    },
    done: { title: 'Done', color: 'bg-green-100 border-green-300' },
  }

  // Update local task order when tasks prop changes
  React.useEffect(() => {
    setTaskOrder(tasks)
  }, [tasks])

  // Group tasks by status
  const tasksByStatus = taskOrder.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = []
    }
    acc[task.status].push(task)
    return acc
  }, {})

  const handleStatusChange = async (taskId, newStatus) => {
    setLoading(true)
    try {
      // Update local state immediately for optimistic UI
      setTaskOrder((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
      )

      // Call the parent's update handler instead of direct API call
      await onTaskUpdate(taskId, { status: newStatus })
    } catch (error) {
      console.error('Failed to update task:', error)
      // Revert on error
      setTaskOrder(tasks)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true)
      try {
        // Use the parent's delete handler
        await onDeleteTask(taskId)
      } catch (error) {
        console.error('Failed to delete task:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event) => {
    const { active } = event
    const task = taskOrder.find((t) => t.id === active.id)
    setActiveTask(task)
  }

  const handleDragOver = (event) => {
    const { active, over } = event

    if (!over) return

    const activeTaskId = active.id
    const overTaskId = over.id

    // If dropping on the same task, do nothing
    if (activeTaskId === overTaskId) return

    const activeTask = taskOrder.find((t) => t.id === activeTaskId)
    const overTask = taskOrder.find((t) => t.id === overTaskId)

    if (!activeTask) return

    // Check if we're dropping on a column (droppable zone)
    if (typeof overTaskId === 'string' && overTaskId.startsWith('droppable-')) {
      const newStatus = overTaskId.replace('droppable-', '')

      if (activeTask.status !== newStatus) {
        setTaskOrder((prevTasks) =>
          prevTasks.map((task) =>
            task.id === activeTaskId ? { ...task, status: newStatus } : task
          )
        )
      }
      return
    }

    // If both tasks exist and are in different columns, move to the target column
    if (overTask && activeTask.status !== overTask.status) {
      setTaskOrder((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeTaskId ? { ...task, status: overTask.status } : task
        )
      )
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    setActiveTask(null)

    if (!over) return

    const activeTaskId = active.id
    const overTaskId = over.id

    const activeTask = taskOrder.find((t) => t.id === activeTaskId)

    if (!activeTask) return

      // Handle dropping on column
      if (typeof overTaskId === 'string' && overTaskId.startsWith('droppable-')) {
        const newStatus = overTaskId.replace('droppable-', '')

        if (activeTask.status !== newStatus) {
          await handleStatusChange(activeTaskId, newStatus)
        }
        return
      }    // Handle reordering within same column or moving between columns
    const overTask = taskOrder.find((t) => t.id === overTaskId)

    if (overTask) {
      const activeIndex = taskOrder.findIndex((t) => t.id === activeTaskId)
      const overIndex = taskOrder.findIndex((t) => t.id === overTaskId)

      if (activeIndex !== overIndex) {
        const newTaskOrder = arrayMove(taskOrder, activeIndex, overIndex)
        setTaskOrder(newTaskOrder)

        // If moved to different column, update status
        if (activeTask.status !== overTask.status) {
          await handleStatusChange(activeTaskId, overTask.status)
        }
      }
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-600 mb-4">Get started by creating your first task</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(statusColumns).map(([status, column]) => {
          const columnTasks = tasksByStatus[status] || []

          return (
            <DroppableColumn
              key={status}
              id={`droppable-${status}`}
              title={column.title}
              color={column.color}
              count={columnTasks.length}
            >
              <SortableContext
                items={columnTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <SortableTaskItem
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableColumn>
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg opacity-90 rotate-3 transform">
            <h4 className="font-medium text-gray-900 text-sm">{activeTask.title}</h4>
            {activeTask.description && (
              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{activeTask.description}</p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default TaskList
