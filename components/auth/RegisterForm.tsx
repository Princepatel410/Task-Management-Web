'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react'

interface ValidationErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

interface PasswordStrength {
  score: number
  feedback: string
  color: string
}

export const RegisterForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false })
  const { register } = useAuth()

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    let feedback = ''

    if (password.length >= 8) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    switch (score) {
      case 0:
      case 1:
        return { score, feedback: 'Very weak', color: 'text-red-500' }
      case 2:
        return { score, feedback: 'Weak', color: 'text-orange-500' }
      case 3:
        return { score, feedback: 'Fair', color: 'text-yellow-500' }
      case 4:
        return { score, feedback: 'Good', color: 'text-blue-500' }
      case 5:
        return { score, feedback: 'Strong', color: 'text-green-500' }
      default:
        return { score, feedback: '', color: 'text-gray-500' }
    }
  }

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Full name is required'
    if (name.trim().length < 2) return 'Name must be at least 2 characters'
    if (name.trim().length > 50) return 'Name must be less than 50 characters'
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces'
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
    return undefined
  }

  const validateConfirmPassword = (confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password'
    if (confirmPassword !== password) return 'Passwords do not match'
    return undefined
  }

  const validateForm = (): boolean => {
    const nameError = validateName(name)
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(confirmPassword)
    
    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    })
    
    return !nameError && !emailError && !passwordError && !confirmPasswordError
  }

  const handleBlur = (field: 'name' | 'email' | 'password' | 'confirmPassword') => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    switch (field) {
      case 'name':
        const nameError = validateName(name)
        setErrors(prev => ({ ...prev, name: nameError }))
        break
      case 'email':
        const emailError = validateEmail(email)
        setErrors(prev => ({ ...prev, email: emailError }))
        break
      case 'password':
        const passwordError = validatePassword(password)
        setErrors(prev => ({ ...prev, password: passwordError }))
        break
      case 'confirmPassword':
        const confirmPasswordError = validateConfirmPassword(confirmPassword)
        setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }))
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setErrors({}) // Clear previous errors
    
    try {
      await register(name.trim(), email, password)
    } catch (error: any) {
      // Handle specific error types
      if (error.response?.status === 409) {
        setErrors({ general: 'An account with this email already exists. Please try signing in instead.' })
      } else if (error.response?.status >= 500) {
        setErrors({ general: 'Server error. Please try again later.' })
      } else if (error.message === 'Network Error') {
        setErrors({ general: 'Connection error. Please check your internet connection.' })
      } else {
        setErrors({ general: 'Registration failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const isNameValid = !errors.name && name.trim().length > 0
  const isEmailValid = !errors.email && email.length > 0
  const isPasswordValid = !errors.password && password.length > 0
  const isConfirmPasswordValid = !errors.confirmPassword && confirmPassword.length > 0
  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid

  const passwordStrength = checkPasswordStrength(password)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">{errors.general}</p>
            <p className="text-xs text-red-600 mt-1">Please check your information and try again.</p>
          </div>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
          Full Name
        </label>
        <div className="relative group">
          <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            isNameValid ? 'text-green-500' : errors.name ? 'text-red-500' : 'text-gray-400 group-focus-within:text-blue-500'
          }`} />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (touched.name) {
                const error = validateName(e.target.value)
                setErrors(prev => ({ ...prev, name: error }))
              }
            }}
            onBlur={() => handleBlur('name')}
            className={`input pl-12 pr-12 transition-all duration-300 ${
              isNameValid 
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' 
                : errors.name 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : ''
            }`}
            placeholder="Enter your full name"
            required
            disabled={loading}
          />
          {isNameValid && (
            <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
        </div>
        {errors.name && touched.name && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.name}</span>
          </div>
        )}
      </div>

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
            placeholder="Create a strong password"
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
        
        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Password strength:</span>
              <span className={`font-medium ${passwordStrength.color}`}>
                {passwordStrength.feedback}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  passwordStrength.score <= 1 ? 'bg-red-500' :
                  passwordStrength.score === 2 ? 'bg-orange-500' :
                  passwordStrength.score === 3 ? 'bg-yellow-500' :
                  passwordStrength.score === 4 ? 'bg-blue-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              <p>• At least 8 characters</p>
              <p>• Mix of uppercase and lowercase letters</p>
              <p>• Include numbers and special characters</p>
            </div>
          </div>
        )}
        
        {errors.password && touched.password && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
          Confirm Password
        </label>
        <div className="relative group">
          <Shield className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            isConfirmPasswordValid ? 'text-green-500' : errors.confirmPassword ? 'text-red-500' : 'text-gray-400 group-focus-within:text-blue-500'
          }`} />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (touched.confirmPassword) {
                const error = validateConfirmPassword(e.target.value)
                setErrors(prev => ({ ...prev, confirmPassword: error }))
              }
            }}
            onBlur={() => handleBlur('confirmPassword')}
            className={`input pl-12 pr-12 transition-all duration-300 ${
              isConfirmPasswordValid 
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' 
                : errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : ''
            }`}
            placeholder="Confirm your password"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
            disabled={loading}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && touched.confirmPassword && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.confirmPassword}</span>
          </div>
        )}
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
            Creating Account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </>
        )}
      </button>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors duration-300"
            disabled={loading}
          >
            Sign in here
          </button>
        </p>
      </div>

      {/* Terms and Security Notice */}
      <div className="text-center space-y-2">
        <p className="text-xs text-gray-400">
          By creating an account, you agree to our{' '}
          <button type="button" className="text-blue-600 hover:text-blue-700 underline">
            Terms of Service
          </button>{' '}
          and{' '}
          <button type="button" className="text-blue-600 hover:text-blue-700 underline">
            Privacy Policy
          </button>
        </p>
        <p className="text-xs text-gray-400">
          🔒 Your data is encrypted and secure
        </p>
      </div>
    </form>
  )
} 