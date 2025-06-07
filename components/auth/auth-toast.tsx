'use client'

import { useEffect } from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { AlertTriangle, ShieldOff, Lock } from 'lucide-react'

// Create a content component that uses useSearchParams
function AuthToastContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')
  
  useEffect(() => {
    if (error === 'admin_access_denied') {
      toast.custom(
        () => (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <ShieldOff className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800">
                  Access Denied
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  {message || 'Only administrators can access this page'}
                </p>
              </div>
            </div>
          </div>
        ),
        {
          id: 'admin-access-error',
          duration: 6000,
        }
      )
    } else if (error === 'admin_auth_required') {
      toast.custom(
        () => (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Authentication Required
                </p>
                <p className="mt-1 text-sm text-blue-700">
                  Sign in to access the administrative area
                </p>
              </div>
            </div>
          </div>
        ),
        {
          id: 'admin-auth-required',
          duration: 6000,
        }
      )
    } else if (error === 'admin_check_failed') {
      toast.custom(
        () => (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Permission Check Failed
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Unable to verify administrative permissions
                </p>
              </div>
            </div>
          </div>
        ),
        {
          id: 'admin-check-failed',
          duration: 6000,
        }
      )
    }
  }, [error, message])
  
  return null // This component doesn't render anything directly
}

// Main component with Suspense boundary
export function AuthToast() {
  return (
    <Suspense fallback={null}>
      <AuthToastContent />
    </Suspense>
  )
}