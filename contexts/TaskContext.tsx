'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

export interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  userId: string
}

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  createTask: (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  getTasks: () => Promise<void>
  getTaskById: (id: string) => Task | undefined
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const getTasks = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await axios.get('/tasks')
      setTasks(response.data.tasks)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const response = await axios.post('/tasks', taskData)
      setTasks(prev => [response.data.task, ...prev])
      toast.success('Task created successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create task')
      throw error
    }
  }

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const response = await axios.put(`/tasks/${id}`, taskData)
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data.task : task
      ))
      toast.success('Task updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update task')
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/tasks/${id}`)
      setTasks(prev => prev.filter(task => task._id !== id))
      toast.success('Task deleted successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete task')
      throw error
    }
  }

  const getTaskById = (id: string) => {
    return tasks.find(task => task._id === id)
  }

  useEffect(() => {
    if (user) {
      getTasks()
    } else {
      setTasks([])
    }
  }, [user])

  const value = {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    getTaskById,
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
} 