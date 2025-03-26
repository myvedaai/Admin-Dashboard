"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  ArrowLeft,
  Settings,
  Users,
  UserCheck,
  Award,
  Mail,
  Phone,
  MapPin,
  Star,
  Clock,
  Trash,
  Power,
  PowerOff,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { SchoolData, AiTool } from "@/types/school-data"
import type { User } from "@/types/user"

// Type Definitions
interface RecentTool {
  name: string
  target: "Students" | "Teachers"
  timestamp: string
  action: "Added" | "Removed" | "Enabled" | "Disabled"
}

interface CustomRequirement {
  requirement: string
  frequency: number
}

// PrincipalInfo, OrganizationStats, TopCustomRequirements, RecentlyAddedTools, ToolCard, AIToolsAllocation, ActivityChart
const PrincipalInfo: React.FC<{ principal: SchoolData["principal"] }> = ({ principal }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Principal Information</h2>
    </div>
    <div className="p-6 flex flex-col items-center">
      <img
        src={principal.image || "https://via.placeholder.com/150"}
        alt={principal.name}
        className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-orange-500"
      />
      <h3 className="text-xl font-bold text-gray-900 mb-1">{principal.name}</h3>
      <p className="text-gray-600 flex items-center">
        <Phone className="h-5 w-5 mr-2 text-orange-600" />
        {principal.phone}
      </p>
    </div>
  </div>
)

const OrganizationStats: React.FC<{ stats: SchoolData["stats"]; onViewManageUsers: () => void }> = ({
  stats,
  onViewManageUsers,
}) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Organization Statistics</h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="h-6 w-6 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Total Students</span>
          </div>
          <div className="text-3xl font-bold text-orange-500">{stats.totalStudents}</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center mb-2">
            <UserCheck className="h-6 w-6 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Total Teachers</span>
          </div>
          <div className="text-3xl font-bold text-orange-600">{stats.totalTeachers}</div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={onViewManageUsers}
          className="inline-flex items-center px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors shadow-md"
        >
          <Users className="h-5 w-5 mr-2" />
          Manage Users
        </button>
      </div>
    </div>
  </div>
)

const TopCustomRequirements: React.FC<{ requirements: CustomRequirement[] }> = ({ requirements }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Top Custom Requirements</h2>
    </div>
    <div className="p-6 space-y-4">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-start">
          <Star className="h-5 w-5 text-orange-500 mr-2 mt-1" />
          <div>
            <p className="text-gray-800 font-medium">{req.requirement}</p>
            <p className="text-gray-500 text-sm">{req.frequency} requests</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const RecentlyAddedTools: React.FC<{ tools: RecentTool[] }> = ({ tools }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Recent Tool Activities</h2>
    </div>
    <div className="p-6 space-y-4">
      {tools.length > 0 ? (
        tools.map((tool, index) => (
          <div key={index} className="flex items-start">
            <Clock className="h-5 w-5 text-orange-500 mr-2 mt-1" />
            <div>
              <p className="text-gray-800 font-medium">
                <span
                  className={
                    tool.action === "Added"
                      ? "text-green-600"
                      : tool.action === "Removed"
                        ? "text-red-600"
                        : tool.action === "Enabled"
                          ? "text-blue-600"
                          : "text-orange-600"
                  }
                >
                  {tool.action}
                </span>{" "}
                {tool.name} ({tool.target})
              </p>
              <p className="text-gray-500 text-sm">At {tool.timestamp}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No recent tool activities</p>
      )}
    </div>
  </div>
)

interface ToolCardProps {
  tool: AiTool
  target: "Students" | "Teachers"
  onToggle: (name: string, target: "Students" | "Teachers") => void
  onRemove: (name: string, target: "Students" | "Teachers") => void
  color: string
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, target, onToggle, onRemove, color }) => (
  <div
    className={`flex-shrink-0 w-28 h-28 bg-orange-50 rounded-lg flex flex-col items-center justify-center p-2 border-2 ${
      tool.enabled ? `border-${color}-500` : "border-gray-300"
    }`}
  >
    <div className="relative w-full">
      <img
        src={toolIcons[tool.name as keyof typeof toolIcons] || "https://via.placeholder.com/60"}
        alt={tool.name}
        className={`w-12 h-12 rounded-md object-cover mx-auto mb-1 ${!tool.enabled ? "opacity-50" : ""}`}
      />
      <div className="absolute top-0 right-0 flex gap-1">
        <button
          onClick={() => onToggle(tool.name, target)}
          className={`p-1 rounded-full ${tool.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          title={tool.enabled ? "Disable tool" : "Enable tool"}
        >
          {tool.enabled ? <Power className="h-3 w-3" /> : <PowerOff className="h-3 w-3" />}
        </button>
        <button
          onClick={() => onRemove(tool.name, target)}
          className="p-1 rounded-full bg-gray-100 text-gray-600"
          title="Remove tool"
        >
          <Trash className="h-3 w-3" />
        </button>
      </div>
    </div>
    <p className="text-gray-800 text-xs text-center">{tool.name}</p>
    <p className="text-[10px] text-center mt-1">
      <span
        className={`px-1 py-0.5 rounded-full ${tool.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
      >
        {tool.enabled ? "Enabled" : "Disabled"}
      </span>
    </p>
  </div>
)

interface AIToolsAllocationProps {
  aiTools: SchoolData["aiTools"]
  onToggleTool: (name: string, target: "Students" | "Teachers") => void
  onRemoveTool: (name: string, target: "Students" | "Teachers") => void
  onShowModal: () => void
}

const AIToolsAllocation: React.FC<AIToolsAllocationProps> = ({ aiTools, onToggleTool, onRemoveTool, onShowModal }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">AI Tools Allocation</h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-orange-50 rounded-lg flex items-center">
          <Users className="h-6 w-6 text-orange-500 mr-2" />
          <div>
            <span className="text-sm font-medium text-gray-700">AI Tools for Students</span>
            <div className="text-2xl font-bold text-orange-500">{aiTools.forStudents.length}</div>
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg flex items-center">
          <UserCheck className="h-6 w-6 text-orange-600 mr-2" />
          <div>
            <span className="text-sm font-medium text-gray-700">AI Tools for Teachers</span>
            <div className="text-2xl font-bold text-orange-600">{aiTools.forTeachers.length}</div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">For Students</h3>
          <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {aiTools.forStudents.map((tool, index) => (
              <ToolCard
                key={index}
                tool={tool}
                target="Students"
                onToggle={onToggleTool}
                onRemove={onRemoveTool}
                color="orange"
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">For Teachers</h3>
          <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {aiTools.forTeachers.map((tool, index) => (
              <ToolCard
                key={index}
                tool={tool}
                target="Teachers"
                onToggle={onToggleTool}
                onRemove={onRemoveTool}
                color="orange"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="px-6 pb-6">
      <button
        onClick={onShowModal}
        className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg flex items-center justify-center transition-colors"
      >
        <Settings className="h-5 w-5 mr-2" />
        Add or Delete AI Tools
      </button>
    </div>
  </div>
)

interface ActivityChartProps {
  title: string
  subtitle: string
  data: { day: string; active: number }[]
  activeCount: number
  color: string
}

const ActivityChart: React.FC<ActivityChartProps> = ({ title, subtitle, data, activeCount, color }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
          <p className="text-gray-700">{subtitle}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-4xl font-bold text-gray-800">{activeCount}</div>
          <div className="text-gray-600">Active {title.split(" ")[1]}</div>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="active" stroke={color} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
)

// Sample Data
const studentActivityData = [
  { day: "Mon", active: 850 },
  { day: "Tue", active: 920 },
  { day: "Wed", active: 980 },
  { day: "Thu", active: 940 },
  { day: "Fri", active: 1000 },
  { day: "Sat", active: 700 },
  { day: "Sun", active: 650 },
]

const teacherActivityData = [
  { day: "Mon", active: 45 },
  { day: "Tue", active: 50 },
  { day: "Wed", active: 55 },
  { day: "Thu", active: 52 },
  { day: "Fri", active: 58 },
  { day: "Sat", active: 40 },
  { day: "Sun", active: 38 },
]

const topCustomRequirements: CustomRequirement[] = [
  { requirement: "Enhanced AI Quiz Generator", frequency: 45 },
  { requirement: "Personalized Study Plans", frequency: 32 },
  { requirement: "Real-time Attendance Tracking", frequency: 28 },
]

const availableAITools = [
  "Lesson Planner",
  "Interactive Whiteboard",
  "Performance Dashboard",
  "Homework Assistant",
  "Exam Simulator",
]

const toolIcons = {
  "Quiz Generator": "https://via.placeholder.com/60/FF8C00/FFFFFF?text=QG",
  "Study Planner": "https://via.placeholder.com/60/FF8C00/FFFFFF?text=SP",
  "Attendance Tracker": "https://via.placeholder.com/60/F86F3C/FFFFFF?text=AT",
  "Grade Analyzer": "https://via.placeholder.com/60/F86F3C/FFFFFF?text=GA",
  "Lesson Planner": "https://via.placeholder.com/60/FF8C00/FFFFFF?text=LP",
  "Interactive Whiteboard": "https://via.placeholder.com/60/F86F3C/FFFFFF?text=IW",
  "Performance Dashboard": "https://via.placeholder.com/60/FF8C00/FFFFFF?text=PD",
  "Homework Assistant": "https://via.placeholder.com/60/F86F3C/FFFFFF?text=HA",
  "Exam Simulator": "https://via.placeholder.com/60/FF8C00/FFFFFF?text=ES",
}

// Main Component
interface OrganizationDetailsProps {
  initialSchoolData?: SchoolData
  onBackToOrganizations: () => void
  onViewManageUsers: () => void
  currentUser: User | null
}

const OrganizationDetails: React.FC<OrganizationDetailsProps> = ({
  initialSchoolData,
  onBackToOrganizations,
  onViewManageUsers,
  currentUser,
}) => {
  const [school, setSchool] = useState<SchoolData | null>(null)
  const [showAIToolsModal, setShowAIToolsModal] = useState(false)
  const [selectedTool, setSelectedTool] = useState("")
  const [targetGroup, setTargetGroup] = useState<"Students" | "Teachers">("Students")
  const [recentTools, setRecentTools] = useState<RecentTool[]>([])
  const [modalView, setModalView] = useState<"add" | "manage">("add")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSchool(initialSchoolData || null)
  }, [initialSchoolData])

  const handleAddAITool = useCallback(() => {
    if (!selectedTool || !school) {
      setError(selectedTool ? "School data is not available." : "Please select a tool to add.")
      return
    }
    const newTool: AiTool = { name: selectedTool, enabled: true }
    const updatedSchool: SchoolData = {
      ...school,
      aiTools: {
        ...school.aiTools,
        [targetGroup === "Students" ? "forStudents" : "forTeachers"]: [
          ...school.aiTools[targetGroup === "Students" ? "forStudents" : "forTeachers"],
          newTool,
        ],
        allocated: school.aiTools.allocated + 1,
      },
    }
    setSchool(updatedSchool)
    setRecentTools((prev: RecentTool[]): RecentTool[] =>
      [
        {
          name: selectedTool,
          target: targetGroup,
          timestamp: new Date().toLocaleTimeString(),
          action: "Added" as const, // Use 'as const' to enforce literal type
        },
        ...prev,
      ].slice(0, 5),
    )
    setSelectedTool("")
    setShowAIToolsModal(false)
    setError(null)
  }, [selectedTool, targetGroup, school])

  const handleRemoveTool = useCallback(
    (toolName: string, target: "Students" | "Teachers") => {
      if (!school) return
      const updatedSchool: SchoolData = {
        ...school,
        aiTools: {
          ...school.aiTools,
          [target === "Students" ? "forStudents" : "forTeachers"]: school.aiTools[
            target === "Students" ? "forStudents" : "forTeachers"
          ].filter((t) => t.name !== toolName),
          allocated: school.aiTools.allocated - 1,
        },
      }
      setSchool(updatedSchool)
      setRecentTools((prev: RecentTool[]): RecentTool[] =>
        [
          {
            name: toolName,
            target,
            timestamp: new Date().toLocaleTimeString(),
            action: "Removed" as const, // Use 'as const' to enforce literal type
          },
          ...prev,
        ].slice(0, 5),
      )
    },
    [school],
  )

  const handleToggleToolStatus = useCallback(
    (toolName: string, target: "Students" | "Teachers") => {
      if (!school) return
      const updateTools = (tools: AiTool[]) =>
        tools.map((t) => (t.name === toolName ? { ...t, enabled: !t.enabled } : t))
      const currentTool = school.aiTools[target === "Students" ? "forStudents" : "forTeachers"].find(
        (t) => t.name === toolName,
      )
      const action: "Enabled" | "Disabled" = currentTool?.enabled ? "Disabled" : "Enabled"
      const updatedSchool: SchoolData = {
        ...school,
        aiTools: {
          ...school.aiTools,
          [target === "Students" ? "forStudents" : "forTeachers"]: updateTools(
            school.aiTools[target === "Students" ? "forStudents" : "forTeachers"],
          ),
        },
      }
      setSchool(updatedSchool)
      setRecentTools((prev: RecentTool[]): RecentTool[] =>
        [
          {
            name: toolName,
            target,
            timestamp: new Date().toLocaleTimeString(),
            action: action, // Already correctly typed as "Enabled" | "Disabled"
          },
          ...prev,
        ].slice(0, 5),
      )
    },
    [school],
  )

  if (!school)
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex items-center justify-center text-gray-600">
        Loading organization details...
      </div>
    )

  const availableToolsToAdd = availableAITools.filter(
    (tool) =>
      !school.aiTools.forStudents.some((t) => t.name === tool) &&
      !school.aiTools.forTeachers.some((t) => t.name === tool),
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 pb-8">
        <button
          onClick={onBackToOrganizations}
          className="inline-flex items-center text-gray-900 font-bold hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Organizations
        </button>
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 w-20 h-20 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
              {school.name.substring(0, 2)}
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{school.name}</h1>
              <div className="flex items-center text-gray-500 mb-3">
                <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                <span className="text-gray-600">{school.location}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <Award className="h-5 w-5 mr-2 text-orange-500" />
                  <span>{school.affiliation}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2 text-orange-500" />
                  <span>{school.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2 text-orange-500" />
                  <span>{school.contact.join(" / ")}</span>
                </div>
              </div>
            </div>
            <div
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                school.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {school.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <PrincipalInfo principal={school.principal} />
            <OrganizationStats stats={school.stats} onViewManageUsers={onViewManageUsers} />
            <TopCustomRequirements requirements={topCustomRequirements} />
            <RecentlyAddedTools tools={recentTools} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <AIToolsAllocation
              aiTools={school.aiTools}
              onToggleTool={handleToggleToolStatus}
              onRemoveTool={handleRemoveTool}
              onShowModal={() => {
                setModalView("add")
                setShowAIToolsModal(true)
              }}
            />
            <ActivityChart
              title="Active Students"
              subtitle="Currently active students in your organization"
              data={studentActivityData}
              activeCount={school.stats.activeStudents}
              color="#f97316"
            />
            <ActivityChart
              title="Active Teachers"
              subtitle="Currently active teachers in your organization"
              data={teacherActivityData}
              activeCount={school.stats.activeTeachers}
              color="#ea580c"
            />
          </div>
        </div>
        {showAIToolsModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">AI Tools Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setModalView("add")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      modalView === "add" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    Add Tools
                  </button>
                  <button
                    onClick={() => setModalView("manage")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      modalView === "manage" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    Manage Tools
                  </button>
                </div>
              </div>
              {modalView === "add" && (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Currently Allocated Tools</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 font-medium mb-2">For Students:</p>
                        {school.aiTools.forStudents.length > 0 ? (
                          <ul className="space-y-1">
                            {school.aiTools.forStudents.map((tool, index) => (
                              <li key={index} className="text-sm flex items-center">
                                <span
                                  className={`w-2 h-2 rounded-full mr-2 ${
                                    tool.enabled ? "bg-green-500" : "bg-red-500"
                                  }`}
                                ></span>
                                {tool.name}
                                <span className="text-xs ml-2 text-gray-500">
                                  ({tool.enabled ? "Enabled" : "Disabled"})
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm">None</p>
                        )}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 font-medium mb-2">For Teachers:</p>
                        {school.aiTools.forTeachers.length > 0 ? (
                          <ul className="space-y-1">
                            {school.aiTools.forTeachers.map((tool, index) => (
                              <li key={index} className="text-sm flex items-center">
                                <span
                                  className={`w-2 h-2 rounded-full mr-2 ${
                                    tool.enabled ? "bg-green-500" : "bg-red-500"
                                  }`}
                                ></span>
                                {tool.name}
                                <span className="text-xs ml-2 text-gray-500">
                                  ({tool.enabled ? "Enabled" : "Disabled"})
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm">None</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="targetGroup" className="block text-sm font-medium text-gray-700 mb-2">
                      Target Group
                    </label>
                    <select
                      id="targetGroup"
                      value={targetGroup}
                      onChange={(e) => setTargetGroup(e.target.value as "Students" | "Teachers")}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    >
                      <option value="Students">Students</option>
                      <option value="Teachers">Teachers</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="aiTool" className="block text-sm font-medium text-gray-700 mb-2">
                      Select AI Tool to Add
                    </label>
                    <select
                      id="aiTool"
                      value={selectedTool}
                      onChange={(e) => setSelectedTool(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    >
                      <option value="">Select a tool</option>
                      {availableToolsToAdd.map((tool) => (
                        <option key={tool} value={tool}>
                          {tool}
                        </option>
                      ))}
                    </select>
                  </div>
                  {error && <div className="mb-4 p-2 bg-red-100 text-red-800 rounded-lg">{error}</div>}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowAIToolsModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAITool}
                      disabled={!selectedTool}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Tool
                    </button>
                  </div>
                </>
              )}
              {modalView === "manage" && (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Manage Student Tools</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                      {school.aiTools.forStudents.length > 0 ? (
                        school.aiTools.forStudents.map((tool, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <img
                                src={toolIcons[tool.name as keyof typeof toolIcons] || "https://via.placeholder.com/40"}
                                alt={tool.name}
                                className="w-10 h-10 rounded-md object-cover mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{tool.name}</p>
                                <p className={`text-xs ${tool.enabled ? "text-green-600" : "text-red-600"}`}>
                                  {tool.enabled ? "Enabled" : "Disabled"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleToolStatus(tool.name, "Students")}
                                className={`p-2 rounded-lg ${
                                  tool.enabled
                                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                }`}
                                title={tool.enabled ? "Disable tool" : "Enable tool"}
                              >
                                {tool.enabled ? <PowerOff className="h-5 w-5" /> : <Power className="h-5 w-5" />}
                              </button>
                              <button
                                onClick={() => handleRemoveTool(tool.name, "Students")}
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                                title="Remove tool"
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">No tools allocated for students</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Manage Teacher Tools</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                      {school.aiTools.forTeachers.length > 0 ? (
                        school.aiTools.forTeachers.map((tool, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <img
                                src={toolIcons[tool.name as keyof typeof toolIcons] || "https://via.placeholder.com/40"}
                                alt={tool.name}
                                className="w-10 h-10 rounded-md object-cover mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{tool.name}</p>
                                <p className={`text-xs ${tool.enabled ? "text-green-600" : "text-red-600"}`}>
                                  {tool.enabled ? "Enabled" : "Disabled"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleToolStatus(tool.name, "Teachers")}
                                className={`p-2 rounded-lg ${
                                  tool.enabled
                                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                }`}
                                title={tool.enabled ? "Disable tool" : "Enable tool"}
                              >
                                {tool.enabled ? <PowerOff className="h-5 w-5" /> : <Power className="h-5 w-5" />}
                              </button>
                              <button
                                onClick={() => handleRemoveTool(tool.name, "Teachers")}
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                                title="Remove tool"
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">No tools allocated for teachers</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAIToolsModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizationDetails

