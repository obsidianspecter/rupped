import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
      <AlertTriangle className="h-16 w-16 text-amber-600 mb-6" />
      <h1 className="text-4xl font-bold mb-3">Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/#products">Browse Products</Link>
        </Button>
      </div>
    </div>
  )
}

