"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SetupGuide from "@/components/setup-guide"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldAlert, Terminal, Server, Database, Settings, Cpu, HardDrive, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export default function SetupPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState("setup")
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    // Simple client-side check if user came from password dialog
    const checkAuth = () => {
      // In a real app, you would use a more secure method like a session or token
      const lastPath = sessionStorage.getItem("lastPath")

      if (lastPath === "/") {
        setAuthorized(true)
        setIsLoading(false)
      } else {
        // Show password dialog
        setShowDialog(true)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement
    const password = passwordInput.value

    if (password === "2122") {
      setAuthorized(true)
      setShowDialog(false)
      sessionStorage.setItem("lastPath", "/setup")
    } else {
      alert("Incorrect password")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (showDialog) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h2 className="text-xl font-bold mb-4">Admin Access</h2>
          <p className="text-gray-600 mb-4">Enter password to access the AI backend setup.</p>
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <Input type="password" name="password" placeholder="Enter password" className="w-full" autoFocus />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => router.push("/")}>
                  Cancel
                </Button>
                <Button type="submit">Access Setup</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (!authorized) {
    router.push("/")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Button variant="ghost" asChild className="self-start">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Rupped AI Backend Setup</h1>
        <div className="w-[100px] hidden sm:block"></div> {/* Spacer for centering on larger screens */}
      </div>

      <Alert className="mb-6 border-amber-600/50 bg-amber-50">
        <ShieldAlert className="h-4 w-4 text-amber-600" />
        <AlertTitle>Admin Area</AlertTitle>
        <AlertDescription>
          This page is for system administrators only. It allows you to configure and monitor the AI backend for the
          negotiation system.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="setup">
            <Terminal className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Setup Guide</span>
            <span className="sm:hidden">Setup</span>
          </TabsTrigger>
          <TabsTrigger value="status">
            <Server className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">System Status</span>
            <span className="sm:hidden">Status</span>
          </TabsTrigger>
          <TabsTrigger value="models">
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">AI Models</span>
            <span className="sm:hidden">Models</span>
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Advanced</span>
            <span className="sm:hidden">Config</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="mt-6">
          <SetupGuide />
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <SystemStatus />
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <ModelManager />
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <AdvancedSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SystemStatus() {
  const [status, setStatus] = useState<{
    backend?: { status: string; message?: string }
    ollama?: { status: string; message?: string }
    models?: { status: string; available: string[]; message?: string }
    system?: { cpu: number; memory: number; disk: number }
  }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      // Check backend health
      const response = await fetch("http://localhost:8000/health")

      if (response.ok) {
        const data = await response.json()
        setStatus({
          backend: { status: "healthy", message: "FastAPI backend is running" },
          ollama: {
            status: data.ollama === "connected" ? "healthy" : "error",
            message: data.ollama === "connected" ? "Ollama service is running" : "Ollama service is not running",
          },
          models: {
            status: data.llama3 === "available" ? "healthy" : "warning",
            available: data.llama3 === "available" ? ["llama3"] : [],
            message:
              data.message ||
              (data.llama3 === "available" ? "Llama 3 model is available" : "Llama 3 model is not available"),
          },
          system: {
            cpu: Math.random() * 30 + 10, // Mock data
            memory: Math.random() * 40 + 30,
            disk: Math.random() * 20 + 5,
          },
        })
      } else {
        setStatus({
          backend: { status: "error", message: "FastAPI backend is not running" },
          ollama: { status: "unknown", message: "Cannot determine Ollama status" },
          models: { status: "unknown", available: [], message: "Cannot determine model status" },
        })
      }
    } catch (error) {
      setStatus({
        backend: { status: "error", message: "Cannot connect to FastAPI backend" },
        ollama: { status: "unknown", message: "Cannot determine Ollama status" },
        models: { status: "unknown", available: [], message: "Cannot determine model status" },
      })
    } finally {
      setIsLoading(false)
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    checkStatus()
    // Set up polling every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">System Status</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {lastChecked && (
            <span className="text-sm text-gray-500 hidden md:inline">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={checkStatus}
            disabled={isLoading}
            className="bg-stone-800 hover:bg-stone-900 w-full sm:w-auto"
          >
            {isLoading ? "Checking..." : "Refresh Status"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Backend Server"
          status={status.backend?.status || "unknown"}
          message={status.backend?.message || "Checking status..."}
          icon={<Server className="h-5 w-5" />}
        />
        <StatusCard
          title="Ollama Service"
          status={status.ollama?.status || "unknown"}
          message={status.ollama?.message || "Checking status..."}
          icon={<Cpu className="h-5 w-5" />}
        />
        <StatusCard
          title="AI Models"
          status={status.models?.status || "unknown"}
          message={status.models?.message || "Checking status..."}
          icon={<Database className="h-5 w-5" />}
        />
      </div>

      {status.system && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg">System Resources</CardTitle>
            <CardDescription>Current resource utilization</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-4">
              <ResourceMeter label="CPU Usage" value={status.system.cpu} icon={<Cpu className="h-4 w-4" />} />
              <ResourceMeter
                label="Memory Usage"
                value={status.system.memory}
                icon={<HardDrive className="h-4 w-4" />}
              />
              <ResourceMeter label="Disk Usage" value={status.system.disk} icon={<Database className="h-4 w-4" />} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg">Server Logs</CardTitle>
          <CardDescription>Recent activity from the backend server</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="bg-black text-green-400 font-mono text-xs sm:text-sm p-4 rounded-md h-[200px] overflow-y-auto">
            {isLoading ? (
              <div className="animate-pulse">Loading logs...</div>
            ) : (
              <>
                <div>[{new Date(Date.now() - 60000).toISOString()}] INFO: Server started</div>
                <div>[{new Date(Date.now() - 50000).toISOString()}] INFO: Connected to Ollama service</div>
                <div>[{new Date(Date.now() - 40000).toISOString()}] INFO: Loaded Llama 3 model</div>
                <div>
                  [{new Date(Date.now() - 30000).toISOString()}] INFO: Handling negotiation request for product #1
                </div>
                <div>[{new Date(Date.now() - 20000).toISOString()}] INFO: Negotiation completed successfully</div>
                <div>[{new Date(Date.now() - 10000).toISOString()}] INFO: Health check performed</div>
                <div>[{new Date().toISOString()}] INFO: System status checked</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusCard({
  title,
  status,
  message,
  icon,
}: {
  title: string
  status: string
  message: string
  icon: React.ReactNode
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
      case "error":
        return <Badge className="bg-red-500">Error</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  return (
    <Card className={`border-2 ${getStatusColor(status)}`}>
      <CardHeader className="pb-2 p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <span className="bg-white p-1 sm:p-2 rounded-full mr-2">{icon}</span>
            {title}
          </CardTitle>
          {getStatusBadge(status)}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs sm:text-sm">{message}</p>
      </CardContent>
    </Card>
  )
}

function ResourceMeter({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  const getColor = (value: number) => {
    if (value < 50) return "bg-green-500"
    if (value < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm font-medium">
          {icon}
          <span className="ml-2">{label}</span>
        </div>
        <span className="text-sm font-medium">{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${getColor(value)} transition-all duration-500`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

function ModelManager() {
  const [models, setModels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPulling, setIsPulling] = useState(false)
  const [pullProgress, setPullProgress] = useState(0)
  const [selectedModel, setSelectedModel] = useState("llama3")
  const [pullMessage, setPullMessage] = useState("")

  const fetchModels = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/models")
      if (response.ok) {
        const data = await response.json()
        setModels(data.models || [])
      }
    } catch (error) {
      console.error("Failed to fetch models:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const pullModel = async () => {
    setIsPulling(true)
    setPullProgress(0)
    setPullMessage(`Starting to pull ${selectedModel}...`)

    try {
      const response = await fetch("http://localhost:8000/api/pull-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model_name: selectedModel }),
      })

      if (response.ok) {
        // Simulate progress since the actual API doesn't provide progress updates
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 10
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            setPullMessage(`Successfully pulled ${selectedModel}!`)
            fetchModels() // Refresh the model list
            setTimeout(() => setIsPulling(false), 1000)
          } else {
            setPullMessage(`Pulling ${selectedModel}... Please wait.`)
          }
          setPullProgress(progress)
        }, 1000)
      } else {
        setPullMessage(`Failed to pull ${selectedModel}`)
        setTimeout(() => setIsPulling(false), 3000)
      }
    } catch (error) {
      setPullMessage(`Error: ${error}`)
      setTimeout(() => setIsPulling(false), 3000)
    }
  }

  useEffect(() => {
    fetchModels()
  }, [])

  const availableModels = [
    { id: "llama3", name: "Llama 3", description: "Meta's Llama 3 model (8B parameters)", size: "4.7 GB" },
    { id: "llama3:8b", name: "Llama 3 (8B)", description: "Llama 3 8B parameters", size: "4.7 GB" },
    {
      id: "llama3:70b",
      name: "Llama 3 (70B)",
      description: "Llama 3 70B parameters (requires 48GB+ RAM)",
      size: "39 GB",
    },
    { id: "mistral", name: "Mistral", description: "Mistral 7B model", size: "4.1 GB" },
    { id: "gemma:2b", name: "Gemma 2B", description: "Google's Gemma 2B model", size: "1.4 GB" },
    { id: "gemma:7b", name: "Gemma 7B", description: "Google's Gemma 7B model", size: "4.8 GB" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">AI Models</h2>
        <Button onClick={fetchModels} disabled={isLoading} variant="outline" className="w-full sm:w-auto">
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg">Installed Models</CardTitle>
          <CardDescription>Models currently available on your Ollama instance</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          ) : models.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {models.map((model) => (
                <Card key={model.name} className="border border-gray-200">
                  <CardHeader className="pb-2 p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{model.name}</CardTitle>
                      <Badge className="bg-green-500">Installed</Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">{model.modified}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-xs sm:text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Size:</span>
                        <span>{(model.size / (1024 * 1024 * 1024)).toFixed(1)} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Digest:</span>
                        <span className="font-mono text-xs truncate max-w-[200px]">{model.digest}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No models installed. Pull a model to get started.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg">Pull New Model</CardTitle>
          <CardDescription>Download and install a new AI model from Ollama</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availableModels.map((model) => (
                <div
                  key={model.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedModel === model.id
                      ? "border-amber-600 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="font-medium mb-1 text-sm sm:text-base">{model.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-2">{model.description}</div>
                  <div className="text-xs text-gray-500">Size: {model.size}</div>
                </div>
              ))}
            </div>

            {isPulling ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{pullMessage}</span>
                  <span>{Math.round(pullProgress)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 transition-all duration-300"
                    style={{ width: `${pullProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <Button onClick={pullModel} className="w-full bg-amber-600 hover:bg-amber-700">
                Pull Selected Model
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdvancedSettings() {
  const [settings, setSettings] = useState({
    port: "8000",
    host: "0.0.0.0",
    ollamaUrl: "http://localhost:11434",
    defaultModel: "llama3",
    temperature: "0.7",
    maxTokens: "2048",
    debugMode: false,
    enableFallback: true,
  })

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Advanced Settings</h2>
        <Button className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">Save Changes</Button>
      </div>

      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-600">Warning</AlertTitle>
        <AlertDescription className="text-red-700 text-sm">
          Changing these settings may affect the functionality of the AI negotiation system. Proceed with caution and
          ensure you understand the implications of each setting.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg">Server Configuration</CardTitle>
          <CardDescription>Configure the FastAPI backend server</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Server Port</label>
              <Input value={settings.port} onChange={(e) => handleChange("port", e.target.value)} />
              <p className="text-xs text-gray-500">The port on which the FastAPI server runs</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Server Host</label>
              <Input value={settings.host} onChange={(e) => handleChange("host", e.target.value)} />
              <p className="text-xs text-gray-500">The host address for the server (0.0.0.0 for all interfaces)</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ollama API URL</label>
              <Input value={settings.ollamaUrl} onChange={(e) => handleChange("ollamaUrl", e.target.value)} />
              <p className="text-xs text-gray-500">The URL of your Ollama API endpoint</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Debug Mode</label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => handleChange("debugMode", checked)}
                />
                <span>{settings.debugMode ? "Enabled" : "Disabled"}</span>
              </div>
              <p className="text-xs text-gray-500">Enable verbose logging for debugging</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg">AI Configuration</CardTitle>
          <CardDescription>Configure the AI model parameters</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Model</label>
              <Select value={settings.defaultModel} onValueChange={(value) => handleChange("defaultModel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3">Llama 3</SelectItem>
                  <SelectItem value="llama3:8b">Llama 3 (8B)</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                  <SelectItem value="gemma:7b">Gemma 7B</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">The default AI model to use for negotiation</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Temperature: {settings.temperature}</label>
              <Slider
                min={0}
                max={2}
                step={0.1}
                value={[Number.parseFloat(settings.temperature)]}
                onValueChange={(value) => handleChange("temperature", value[0].toString())}
              />
              <p className="text-xs text-gray-500">Controls randomness (0 = deterministic, 2 = very random)</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Tokens</label>
              <Input
                type="number"
                value={settings.maxTokens}
                onChange={(e) => handleChange("maxTokens", e.target.value)}
              />
              <p className="text-xs text-gray-500">Maximum number of tokens in the response</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Enable OpenAI Fallback</label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.enableFallback}
                  onCheckedChange={(checked) => handleChange("enableFallback", checked)}
                />
                <span>{settings.enableFallback ? "Enabled" : "Disabled"}</span>
              </div>
              <p className="text-xs text-gray-500">Fall back to OpenAI if Ollama is unavailable</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg">System Maintenance</CardTitle>
          <CardDescription>Maintenance operations for the backend system</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1">
                Restart Server
              </Button>
              <Button variant="outline" className="flex-1">
                Clear Cache
              </Button>
              <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                Reset All Settings
              </Button>
            </div>
            <div className="pt-4 border-t">
              <Button variant="destructive" className="w-full">
                Uninstall All Models
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

