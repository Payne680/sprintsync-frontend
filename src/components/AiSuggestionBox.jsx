import { useState } from 'react'
import { Sparkles, RefreshCw, Lightbulb, TrendingUp } from 'lucide-react'
import { getAiSuggestions } from '../api/tasks'

const AiSuggestionBox = ({ onAddTask }) => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [taskTitle, setTaskTitle] = useState('')

  const handleGetSuggestions = async () => {
    setLoading(true)
    setError('')

    try {
      const context = 'Current task management workflow and productivity optimization'
      const aiSuggestions = await getAiSuggestions(context)
      setSuggestions(aiSuggestions)
    } catch (err) {
      setError(err.message)
      // Fallback suggestions for demo
      setSuggestions([
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
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTaskDescription = async () => {
    if (!taskTitle.trim()) {
      setError('Please enter a task title')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate AI generating task description based on title
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      // Generate detailed description based on task title
      const generatedTask = {
        type: 'generated',
        title: taskTitle.trim(),
        description: generateTaskDescription(taskTitle.trim()),
        impact: 'medium',
        estimatedHours: Math.floor(Math.random() * 8) + 2, // Random 2-10 hours
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      }

      setSuggestions([generatedTask])
      setTaskTitle('') // Clear input after generating
    } catch (err) {
      setError('Failed to generate task description')
    } finally {
      setLoading(false)
    }
  }

  const generateTaskDescription = (title) => {
    // Simple AI-like task description generation based on keywords
    const lowerTitle = title.toLowerCase()

    if (lowerTitle.includes('api') || lowerTitle.includes('backend')) {
      return `Design and implement REST API endpoints for ${title}. Include proper authentication, validation, error handling, and documentation. Ensure scalability and follow best practices for API design.`
    } else if (
      lowerTitle.includes('ui') ||
      lowerTitle.includes('interface') ||
      lowerTitle.includes('frontend')
    ) {
      return `Create responsive user interface for ${title}. Design wireframes, implement components with proper styling, ensure accessibility standards, and optimize for mobile devices.`
    } else if (lowerTitle.includes('database') || lowerTitle.includes('db')) {
      return `Set up database schema and operations for ${title}. Design efficient tables, create necessary indexes, implement data validation, and ensure data integrity and security.`
    } else if (lowerTitle.includes('test') || lowerTitle.includes('testing')) {
      return `Develop comprehensive testing strategy for ${title}. Write unit tests, integration tests, and end-to-end tests. Set up automated testing pipeline and ensure good code coverage.`
    } else if (lowerTitle.includes('deploy') || lowerTitle.includes('deployment')) {
      return `Configure deployment pipeline for ${title}. Set up CI/CD workflows, containerization, environment configurations, monitoring, and rollback strategies.`
    } else if (lowerTitle.includes('security') || lowerTitle.includes('auth')) {
      return `Implement security measures for ${title}. Include authentication, authorization, input validation, data encryption, and security audit procedures.`
    } else {
      return `Analyze requirements and implement ${title}. Break down into smaller tasks, research best practices, create technical specifications, develop solution, and ensure quality through testing and code review.`
    }
  }

  const handleAddTask = async (suggestion) => {
    if (!onAddTask) {
      console.warn('onAddTask prop not provided to AiSuggestionBox')
      return
    }

    try {
      // Convert AI suggestion to task format compatible with backend
      const taskData = {
        title: suggestion.title,
        description: suggestion.description,
        status: 'todo',
        priority: suggestion.priority || 'medium',
        assignee: '', // User can edit this later
        dueDate: '', // User can set this later
        totalMinutes: (suggestion.estimatedHours || 4) * 60, // Convert hours to minutes for backend
      }

      await onAddTask(taskData)

      // Optionally remove the suggestion from the list after adding
      if (suggestion.id) {
        setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id))
      }
    } catch (error) {
      console.error('Failed to add task from AI suggestion:', error)
      setError('Failed to add task. Please try again.')
    }
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-orange-600 bg-orange-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'productivity':
        return <TrendingUp className="w-4 h-4" />
      case 'workflow':
        return <RefreshCw className="w-4 h-4" />
      case 'collaboration':
        return <Lightbulb className="w-4 h-4" />
      default:
        return <Sparkles className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          AI Task Generator
        </h3>
        <button
          onClick={handleGetSuggestions}
          disabled={loading}
          className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Task Title Input Section */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100 p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Generate Task Description</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter task title (e.g., 'Create user authentication API')"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerateTaskDescription()}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            disabled={loading}
          />
          <button
            onClick={handleGenerateTaskDescription}
            disabled={loading || !taskTitle.trim()}
            className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Description'}
          </button>
        </div>
      </div>

      {error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</div>}

      {suggestions.length === 0 && !loading && (
        <div className="text-center py-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">
            Get AI-powered suggestions to optimize your workflow
          </p>
          <button
            onClick={handleGetSuggestions}
            className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors"
          >
            Get Suggestions
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start space-x-2">
                <div className="text-purple-600 mt-0.5">{getTypeIcon(suggestion.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {suggestion.priority && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(suggestion.priority)}`}
                        >
                          {suggestion.priority}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getImpactColor(suggestion.impact)}`}
                      >
                        {suggestion.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">
                    {suggestion.description}
                  </p>
                  {suggestion.estimatedHours && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Est. {suggestion.estimatedHours}h
                      </span>
                      <button
                        onClick={() => handleAddTask(suggestion)}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-200 transition-colors"
                      >
                        Add to Tasks
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AiSuggestionBox
