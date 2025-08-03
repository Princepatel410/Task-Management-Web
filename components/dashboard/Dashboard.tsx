'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTasks } from '@/contexts/TaskContext'
import { useTheme } from '@/contexts/ThemeContext'
import { TaskList } from './TaskList'
import { TaskForm } from './TaskForm'
import { TaskStats } from './TaskStats'
import { Plus, LogOut, User, Menu, X, Bell, Settings, CheckCircle, Clock, AlertTriangle, Moon, Sun, Volume2, VolumeX, Edit3 } from 'lucide-react'

export const Dashboard = () => {
  const { user, logout } = useAuth()
  const { tasks, loading } = useTasks()
  const { darkMode, toggleDarkMode } = useTheme()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [notifications] = useState([
    {
      id: 1,
      type: 'task',
      message: 'Task "Complete project documentation" is due today',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      message: 'You have 3 overdue tasks that need attention',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'achievement',
      message: 'Congratulations! You completed 5 tasks this week',
      time: '2 hours ago',
      read: true
    }
  ])

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const handleLogout = () => {
    logout()
  }

  const getFilterCount = (status: string) => {
    return tasks.filter(t => t.status === status).length
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'reminder':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'achievement':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled)
    console.log('Notifications toggled:', !notificationsEnabled)
  }

  const handleProfileSettings = () => {
    setShowSettings(false)
    // You can add profile settings modal here
    console.log('Opening profile settings...')
    alert('Profile settings feature coming soon!')
  }

  const handleMarkAllAsRead = () => {
    console.log('Marking all notifications as read...')
    alert('All notifications marked as read!')
  }

  // Debug log to check current theme state
  console.log('Current dark mode state:', darkMode)

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-2xl font-bold gradient-text">Task Manager</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{unreadNotifications}</span>
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-bounce-in">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-gray-100">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="relative">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                
                {showSettings && (
                  <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-bounce-in">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Settings</h3>
                    </div>
                    <div className="py-2">
                      <button 
                        onClick={toggleDarkMode}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                          <span className="dark:text-gray-100">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </div>
                        <div className={`w-6 h-3 rounded-full transition-colors ${
                          darkMode ? 'bg-blue-500' : 'bg-gray-300'
                        }`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                            darkMode ? 'translate-x-3' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </button>
                      <button 
                        onClick={handleNotificationsToggle}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {notificationsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                          <span className="dark:text-gray-100">Notifications</span>
                        </div>
                        <div className={`w-6 h-3 rounded-full transition-colors ${
                          notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                        }`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                            notificationsEnabled ? 'translate-x-3' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </button>
                      <button 
                        onClick={handleProfileSettings}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span className="dark:text-gray-100">Profile Settings</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden md:flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors bg-white/50 dark:bg-gray-800/50 rounded-xl px-4 py-2 hover:bg-white/80 dark:hover:bg-gray-700/80"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="mb-8 fade-in">
          <TaskStats tasks={tasks} />
        </div>

        {/* Filter and Add Task */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('todo')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'todo'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              Todo ({getFilterCount('todo')})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'in-progress'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              In Progress ({getFilterCount('in-progress')})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              Completed ({getFilterCount('completed')})
            </button>
          </div>

          <button
            onClick={() => setShowTaskForm(true)}
            className="btn-primary flex items-center space-x-2 group"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Task List */}
        <div className="slide-up" style={{animationDelay: '0.2s'}}>
          <TaskList tasks={filteredTasks} loading={loading} />
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            onClose={() => setShowTaskForm(false)}
            onSubmit={() => setShowTaskForm(false)}
          />
        )}
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold dark:text-gray-100">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 dark:text-gray-300" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowSettings(true)
                  setSidebarOpen(false)
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="h-5 w-5 inline mr-3" />
                <span className="dark:text-gray-100">Settings</span>
              </button>
              <button 
                onClick={() => {
                  setShowNotifications(true)
                  setSidebarOpen(false)
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Bell className="h-5 w-5 inline mr-3" />
                <span className="dark:text-gray-100">Notifications</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
              >
                <LogOut className="h-5 w-5 inline mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handlers for dropdowns */}
      {(showNotifications || showSettings) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false)
            setShowSettings(false)
          }}
        />
      )}
    </div>
  )
} 