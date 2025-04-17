import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const SignUpPage = () => {
  // Intialize needed variables and corresponding update value functions
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    "fullName": "",
    "email": "",
    "password": "",
  })

  // Get the needed variables and function from useAuthStore
  const {signup, isSigningUp} = useAuthStore()

  const validateForm = () => {}
  const handleSubmit = (event) => {
    // Prevent refreshing the page
    event.preventDefault()
  }



  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left part */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full name field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Evan Huang"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>  

            {/* Email field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </div>   
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          
          {/* Already have account */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        
        </div>

      </div>

      {/* Right part */}

    </div>
  )
}

export default SignUpPage