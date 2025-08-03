'use client'

import { Task } from '@/contexts/TaskContext'
import { CheckCircle, Clock, AlertCircle, TrendingUp, Target, Calendar, Zap } from 'lucide-react'

interface TaskStatsProps {
  tasks: Task[]
}

export const TaskStats = ({ tasks }: TaskStatsProps) => {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length
  const todoTasks = tasks.filter(task => task.status === 'todo').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false
    return new Date(task.dueDate) < new Date() && task.status !== 'completed'
  }).length

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      description: 'All tasks in your workspace'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      description: 'Successfully finished tasks'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      description: 'Currently being worked on'
    },
    {
      title: 'Todo',
      value: todoTasks,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
      description: 'Tasks waiting to be started'
    },
    {
      title: 'High Priority',
      value: highPriorityTasks,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      description: 'Urgent tasks requiring attention'
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      description: 'Tasks past their due date'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.title} 
            className="card group hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.title}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
                <p className="text-sm text-gray-500">Your task completion rate</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold gradient-text">{completionRate}%</p>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{todoTasks}</div>
                <div className="text-xs text-gray-500">Todo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Manage your tasks efficiently</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">High Priority Tasks</span>
              </div>
              <span className="text-sm font-bold text-red-600">{highPriorityTasks}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Overdue Tasks</span>
              </div>
              <span className="text-sm font-bold text-orange-600">{overdueTasks}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Due Today</span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {tasks.filter(task => {
                  if (!task.dueDate) return false
                  const today = new Date().toDateString()
                  const dueDate = new Date(task.dueDate).toDateString()
                  return dueDate === today && task.status !== 'completed'
                }).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 