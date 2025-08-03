'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface ValidationErrors {
  email?: string
  password?: string
  general?: string
}

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState({ email: false, password: false })
  const { login } = useAuth()

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return undefined
  }

  const validateForm = (): boolean => {
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    setErrors({
      email: emailError,
      password: passwordError
    })
    
    return !emailError && !passwordError
  }

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    if (field === 'email') {
      const emailError = validateEmail(email)
      setErrors(prev => ({ ...prev, email: emailError }))
    } else if (field === 'password') {
      const passwordError = validatePassword(password)
      setErrors(prev => ({ ...prev, password: passwordError }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({ email: true, password: true })
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setErrors({}) // Clear previous errors
    
    try {
      await login(email, password)
    } catch (error: any) {
      // Handle specific error types
      if (error.response?.status === 401) {
        setErrors({ general: 'Invalid email or password. Please try again.' })
      } else if (error.response?.status === 404) {
        setErrors({ general: 'Account not found. Please check your email or create a new account.' })
      } else if (error.response?.status >= 500) {
        setErrors({ general: 'Server error. Please try again later.' })
      } else if (error.message === 'Network Error') {
        setErrors({ general: 'Connection error. Please check your internet connection.' })
      } else {
        setErrors({ general: 'Login failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const isEmailValid = !errors.email && email.length > 0
  const isPasswordValid = !errors.password && password.length > 0
  const isFormValid = isEmailValid && isPasswordValid

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">{errors.general}</p>
            <p className="text-xs text-red-600 mt-1">Please check your credentials and try again.</p>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
          Email Address
        </label>
        <div className="relative group">
          <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            isEmailValid ? 'text-green-500' : errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-blue-500'
          }`} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (touched.email) {
                const error = validateEmail(e.target.value)
                setErrors(prev => ({ ...prev, email: error }))
              }
            }}
            onBlur={() => handleBlur('email')}
            className={`input pl-12 pr-12 transition-all duration-300 ${
              isEmailValid 
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' 
                : errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : ''
            }`}
            placeholder="Enter your email address"
            required
            disabled={loading}
          />
          {isEmailValid && (
            <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
        </div>
        {errors.email && touched.email && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
          Password
        </label>
        <div className="relative group">
          <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            isPasswordValid ? 'text-green-500' : errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-blue-500'
          }`} />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (touched.password) {
                const error = validatePassword(e.target.value)
                setErrors(prev => ({ ...prev, password: error }))
              }
            }}
            onBlur={() => handleBlur('password')}
            className={`input pl-12 pr-12 transition-all duration-300 ${
              isPasswordValid 
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' 
                : errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : ''
            }`}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && touched.password && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
          disabled={loading}
        >
          Forgot your password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !isFormValid}
        className="btn-primary w-full flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Signing In...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </>
        )}
      </button>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors duration-300"
            disabled={loading}
          >
            Create one now
          </button>
        </p>
      </div>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-400">
          🔒 Your data is encrypted and secure
        </p>
      </div>
    </form>
  )
} 