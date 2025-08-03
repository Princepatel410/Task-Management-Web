'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { useState } from 'react'
import { Sparkles, CheckCircle, Clock, Target, Zap } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(true)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="loading-spinner h-16 w-16 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Dashboard />
  }

  const features = [
    {
      icon: CheckCircle,
      title: "Task Management",
      description: "Organize tasks with status tracking and priority levels"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Live synchronization across all your devices"
    },
    {
      icon: Target,
      title: "Progress Tracking",
      description: "Visual analytics and completion statistics"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with modern technologies for optimal performance"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12 fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-blue-600 animate-pulse-glow" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 text-shadow">
              Task Manager
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Organize your life with our powerful task management platform. 
              Stay productive, track progress, and achieve your goals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 slide-up" style={{animationDelay: '0.2s'}}>
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="card text-center group hover:scale-105 transition-all duration-300"
                style={{animationDelay: `${0.3 + index * 0.1}s`}}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Auth Section */}
          <div className="max-w-md mx-auto bounce-in" style={{animationDelay: '0.6s'}}>
            <div className="card">
              <div className="flex mb-8 rounded-xl overflow-hidden bg-gray-50 p-1">
                <button
                  onClick={() => setShowLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    showLogin
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    !showLogin
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
              
              {showLogin ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 fade-in" style={{animationDelay: '0.8s'}}>
            <p className="text-gray-500 text-sm">
              Built with ❤️ using Next.js, Node.js, and MongoDB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 