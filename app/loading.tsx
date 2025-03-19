import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-amber-600 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading Rupped gear...</p>
      </div>
    </div>
  )
}

