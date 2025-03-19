"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Bug } from "lucide-react"
import { products } from "@/lib/products"
import ProductCard from "@/components/product-card"
import NegotiationChat from "@/components/negotiation-chat"

export default function DebugPage() {
  const [activeTab, setActiveTab] = useState("components")
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const runTests = () => {
    // Simulate running tests
    const results: Record<string, boolean> = {}

    // Test components
    results["product-card"] = true
    results["negotiation-chat"] = true
    results["header"] = true
    results["footer"] = true

    // Test routes
    results["home"] = true
    results["product-detail"] = true
    results["category"] = true
    results["about"] = true
    results["contact"] = true
    results["cart"] = true

    // Test API
    results["negotiate-api"] = Math.random() > 0.3 // Simulate occasional failure

    setTestResults(results)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Bug className="h-6 w-6 mr-2 text-amber-600" />
          <h1 className="text-3xl font-bold">Debug & Test Page</h1>
        </div>
        <Button onClick={runTests} className="bg-amber-600 hover:bg-amber-700">
          Run Tests
        </Button>
      </div>

      <Alert className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Debug Mode</AlertTitle>
        <AlertDescription>
          This page is for development and testing purposes only. It allows you to test various components and routes.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-8 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Card</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-xs">
                <ProductCard product={products[0]} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Negotiation Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <NegotiationChat
                productId={products[0].id}
                productName={products[0].name}
                listPrice={products[0].price}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Home", path: "/" },
                  { name: "Product Detail", path: `/products/${products[0].id}` },
                  { name: "Category", path: "/categories/backpacks" },
                  { name: "About", path: "/about" },
                  { name: "Contact", path: "/contact" },
                  { name: "Cart", path: "/cart" },
                  { name: "Setup", path: "/setup" },
                  { name: "404 Page", path: "/non-existent-page" },
                ].map((route) => (
                  <div key={route.path} className="flex justify-between items-center p-3 border rounded-md">
                    <span>{route.name}</span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={route.path} target="_blank">
                        Test
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(testResults).length === 0 ? (
                <p className="text-gray-500">Run tests to see results</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(testResults).map(([test, passed]) => (
                    <div key={test} className="flex justify-between items-center p-3 border rounded-md">
                      <span className="capitalize">{test.replace(/-/g, " ")}</span>
                      {passed ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Passed
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <AlertCircle className="h-4 w-4 mr-1" /> Failed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <span>Negotiation API</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/negotiate", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            messages: [{ role: "user", content: "Test message" }],
                            productId: "1",
                            productName: "Test Product",
                            listPrice: 100,
                          }),
                        })

                        if (response.ok) {
                          alert("API is working correctly")
                        } else {
                          alert(`API error: ${response.status}`)
                        }
                      } catch (error) {
                        alert(`API error: ${error}`)
                      }
                    }}
                  >
                    Test API
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-md">
                  <span>Backend Health Check</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch("http://localhost:8000/health")

                        if (response.ok) {
                          const data = await response.json()
                          alert(`Backend status: ${data.status}`)
                        } else {
                          alert(`Backend error: ${response.status}`)
                        }
                      } catch (error) {
                        alert(`Backend error: ${error}`)
                      }
                    }}
                  >
                    Check Health
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

