'use client'

import { useState, useEffect, useRef } from 'react'
import { Task, useTasks } from '@/contexts/TaskContext'
import { Edit, Trash2, Calendar, Flag, CheckCircle, Clock, AlertTriangle, MoreVertical, Star } from 'lucide-react'
import { TaskForm } from './TaskForm'

interface TaskCardProps {
  task: Task
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { updateTask, deleteTask } = useTasks()
  const [showEditForm, setShowEditForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Click outside handler for menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      case 'in-progress':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      case 'todo':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'in-progress':
        return <Clock className="h-4 w-4" />
      case 'todo':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await updateTask(task._id, { status: newStatus })
    } catch (error) {
      // Error handled in context
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true)
      try {
        await deleteTask(task._id)
      } catch (error) {
        // Error handled in context
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
  const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()

  return (
    <>
      <div className="task-card group">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {task.title}
            </h3>
          </div>
          <div className="relative ml-4" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 animate-bounce-in">
                <button
                  onClick={() => {
                    setShowEditForm(true)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Task</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete()
                    setShowMenu(false)
                  }}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Task'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Status and Priority */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`status-badge ${getStatusColor(task.status)} flex items-center space-x-1`}>
              {getStatusIcon(task.status)}
              <span>{task.status.replace('-', ' ')}</span>
            </span>
          </div>
          <div className={`priority-badge border ${getPriorityColor(task.priority)}`}>
            <Flag className="h-3 w-3 mr-1" />
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center text-sm mb-4 p-2 rounded-lg ${
            isOverdue 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : isDueToday 
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'bg-gray-50 text-gray-600'
          }`}>
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">
              Due: {formatDate(task.dueDate)}
              {isOverdue && ' (Overdue)'}
              {isDueToday && ' (Today)'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {task.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="btn-success flex-1 text-sm py-2 flex items-center justify-center space-x-1"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete</span>
            </button>
          )}
          {task.status === 'todo' && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center space-x-1"
            >
              <Clock className="h-4 w-4" />
              <span>Start</span>
            </button>
          )}
          {task.status === 'in-progress' && (
            <button
              onClick={() => handleStatusChange('todo')}
              className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center space-x-1"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Pause</span>
            </button>
          )}
        </div>

        {/* Created Date */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Created {new Date(task.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {showEditForm && (
        <TaskForm
          task={task}
          onClose={() => setShowEditForm(false)}
          onSubmit={() => setShowEditForm(false)}
        />
      )}
    </>
  )
} 