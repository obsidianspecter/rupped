"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Error caught by boundary:", error)
      setHasError(true)
      setError(error.error)
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error?.message || "An unexpected error occurred"}</p>
        <Button
          onClick={() => {
            setHasError(false)
            setError(null)
            window.location.reload()
          }}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

