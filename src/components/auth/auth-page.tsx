"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Mail, Lock, UserIcon, Eye, EyeOff, AlertCircle, Check, RefreshCw } from "lucide-react"
import type { User } from "@/types/user"

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "abhi@gmail.com",
    password: "abhishek@1234",
    name: "Admin User",
    role: "admin",
    avatar: "/images/logo.png",
  },
  {
    id: "2",
    email: "manager@example.com",
    password: "manager123",
    name: "Manager User",
    role: "manager",
    avatar: "https://i.pravatar.cc/150?img=35",
  },
]

export default function AuthPage() {
  const router = useRouter()
  const [view, setView] = useState<"login" | "forgot-password">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)

  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_email")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isLocked, lockTimer])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) {
      setError(`Account temporarily locked. Try again in ${lockTimer} seconds.`)
      return
    }

    setLoading(true)
    setError(null)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      user.lastLogin = new Date()
      sessionStorage.setItem("admin_session", JSON.stringify(user))
      if (rememberMe) {
        localStorage.setItem("admin_email", email)
      } else {
        localStorage.removeItem("admin_email")
      }
      router.push("/dashboard")
      setLoginAttempts(0)
      setSuccess(`Welcome back, ${user.name}!`)
    } else {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      if (newAttempts >= 3) {
        setIsLocked(true)
        setLockTimer(30)
        setError("Too many failed attempts. Account locked for 30 seconds.")
      } else {
        setError(`Invalid credentials. Attempts: ${newAttempts}/3`)
      }
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (mockUsers.some((u) => u.email === email)) {
      setError("Email already registered")
      setLoading(false)
      return
    }
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      email,
      password,
      name,
      role: "viewer",
      lastLogin: new Date(),
    }
    mockUsers.push(newUser)
    sessionStorage.setItem("admin_session", JSON.stringify(newUser))
    setSuccess("Registration successful!")
    router.push("/dashboard")
    setLoading(false)
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(`If ${email} exists in our system, you'll receive a password reset link.`)
    setView("login")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-4 md:mx-8 lg:mx-12 bg-white rounded-lg shadow-xl flex flex-col md:flex-row overflow-hidden"
      >
        <div className="w-full md:w-1/3 bg-orange-500 p-8 flex flex-col justify-center items-center">
          <img src="/images/logo.png" alt="VedaAI Logo" className="w-32 h-32 mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4 text-center">VedaAI</h1>
          <p className="text-orange-100 text-center mb-4">Administrative Control Panel</p>
        </div>
        <div className="w-full md:w-2/3 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {view === "login" ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  {isRegistering ? "Create Admin Account" : "Admin Login"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {isRegistering
                    ? "Register a new administrator account"
                    : "Enter your credentials to access the dashboard"}
                </p>
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                    <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
                  {isRegistering && (
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                        required
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {!isRegistering && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setView("forgot-password")
                          setError(null)
                          setSuccess(null)
                        }}
                        className="text-orange-500 hover:text-orange-600 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className={`w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center ${
                      loading || isLocked ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        {isRegistering ? "Creating Account..." : "Signing In..."}
                      </>
                    ) : (
                      <>
                        {isRegistering ? "Create Account" : "Sign In"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsRegistering(!isRegistering)
                      setError(null)
                      setSuccess(null)
                      setEmail("")
                      setPassword("")
                      setName("")
                    }}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    {isRegistering ? "Already have an account? Sign In" : ""}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-password-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reset Admin Password</h2>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                      required
                    />
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setView("login")
                        setError(null)
                      }}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

