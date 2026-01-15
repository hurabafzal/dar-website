'use client'

import { Suspense } from 'react'
import AuthCallbackContent from './AuthCallbackContent'

export default function AuthCallback() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <AuthCallbackContent />
    </Suspense>
  )
}

function LoadingUI() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
        <p className="text-gray-600">Please wait while we process your login.</p>
      </div>
    </div>
  )
}

