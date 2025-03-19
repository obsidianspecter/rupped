"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <AlertTriangle className="h-16 w-16 text-amber-600 mb-6" />
      <h2 className="text-3xl font-bold mb-3">Something went wrong</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We apologize for the inconvenience. Our team has been notified of this issue.
      </p>
      <Button onClick={() => reset()} className="bg-amber-600 hover:bg-amber-700">
        Try Again
      </Button>
    </div>
  )
}

