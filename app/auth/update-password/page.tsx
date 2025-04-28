"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm"

// Create a client component that uses useSearchParams
function UpdatePasswordContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  
  return <UpdatePasswordForm code={code} />
}

// Main page component with Suspense boundary
export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-950">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <UpdatePasswordContent />
      </Suspense>
    </div>
  )
}