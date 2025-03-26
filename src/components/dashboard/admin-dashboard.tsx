
"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { gsap } from "gsap"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import type { User } from "@/types/user"

// Interfaces
interface CounterProps {
  target: number
  duration?: number
}

interface AdminDashboardProps {
  onViewOrganizations: () => void
  currentUser: User | null
}

interface UsageTrendData {
  month: string
  students: number
  teachers: number
}

interface AIToolData {
  name: string
  value: number
  color: string
}

interface OrganizationData {
  name: string
  students: number
  teachers: number
}

interface EngagementData {
  day: string
  chats: number
  sessions: number
}

// Counter animation component
const Counter: React.FC<CounterProps> = ({ target, duration = 1500 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start: number | null = null
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const animationId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationId)
  }, [target, duration])

  return <span>{count === target ? target : count}</span>
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewOrganizations, currentUser }) => {
  // Animation references
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const statsRowRef = useRef<HTMLDivElement>(null)
  const usageTrendsRef = useRef<HTMLDivElement>(null)
  const organizationsRef = useRef<HTMLDivElement>(null)
  const aiToolsRef = useRef<HTMLDivElement>(null)
  const userEngagementRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  // Sample data for charts
  const usageTrendsData: UsageTrendData[] = [
    { month: "Oct", students: 1800, teachers: 320 },
    { month: "Nov", students: 1950, teachers: 340 },
    { month: "Dec", students: 2000, teachers: 350 },
    { month: "Jan", students: 2100, teachers: 370 },
    { month: "Feb", students: 2150, teachers: 385 },
    { month: "Mar", students: 2200, teachers: 400 },
  ]

  const aiToolsData: AIToolData[] = [
    { name: "AI Tutor", value: 42, color: "#f8a43c" },
    { name: "Content Generator", value: 28, color: "#f86f3c" },
    { name: "Quiz Creator", value: 16, color: "#555555" },
    { name: "Study Planner", value: 14, color: "#333333" },
  ]

  const organizationsData: OrganizationData[] = [
    { name: "DPS Bokaro", students: 550, teachers: 100 },
    { name: "Holy Cross School", students: 450, teachers: 80 },
    { name: "Coaching 1", students: 600, teachers: 120 },
    { name: "Coaching 2", students: 400, teachers: 70 },
    { name: "DYP College", students: 200, teachers: 30 },
  ]

  const engagementData: EngagementData[] = [
    { day: "Mon", chats: 850, sessions: 420 },
    { day: "Tue", chats: 940, sessions: 450 },
    { day: "Wed", chats: 1020, sessions: 480 },
    { day: "Thu", chats: 980, sessions: 460 },
    { day: "Fri", chats: 1100, sessions: 510 },
    { day: "Sat", chats: 700, sessions: 340 },
    { day: "Sun", chats: 650, sessions: 310 },
  ]

  // Animation with GSAP
  useEffect(() => {
    const elements = [
      headerRef.current,
      statsRowRef.current,
      usageTrendsRef.current,
      organizationsRef.current,
      aiToolsRef.current,
      userEngagementRef.current,
      actionsRef.current,
    ].filter(Boolean) as HTMLElement[]

    gsap.set(elements, { opacity: 0, y: 20 })

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    elements.forEach((el, index) => {
      tl.to(
        el,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        index === 0 ? 0 : "-=0.3",
      )
    })
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-100 py-4 px-4 sm:px-8 md:px-12">
      <div className="container mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-center bg-[#222222] text-white p-5 rounded-2xl shadow-lg mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Veda AI Dashboard</h1>
            <p className="text-gray-300 mt-1">Analytics overview</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center bg-[#333333] p-2 px-4 rounded-lg">
            <div className="flex flex-col items-center mr-6">
              <span className="text-gray-400 text-sm">Active Now</span>
              <span className="text-2xl font-bold">
                <Counter target={220} />
              </span>
            </div>
            <div className="h-10 w-[1px] bg-gray-600 mr-6"></div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm">Chats Today</span>
              <span className="text-2xl font-bold">
                <Counter target={5000} />
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div ref={statsRowRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Organizations</p>
                <p className="text-3xl font-bold mt-1">
                  <Counter target={10} />
                </p>
              </div>
              <div className="bg-[#f8a43c] rounded-lg p-2 opacity-90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
            <div className="flex mt-4">
              <span className="text-green-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="ml-1">+2</span>
              </span>
              <span className="text-gray-400 text-sm ml-2">since last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Students</p>
                <p className="text-3xl font-bold mt-1">
                  <Counter target={2200} />
                </p>
              </div>
              <div className="bg-[#f86f3c] rounded-lg p-2 opacity-90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex mt-4">
              <span className="text-green-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="ml-1">+150</span>
              </span>
              <span className="text-gray-400 text-sm ml-2">since last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Teachers</p>
                <p className="text-3xl font-bold mt-1">
                  <Counter target={400} />
                </p>
              </div>
              <div className="bg-[#222222] rounded-lg p-2 opacity-90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
            </div>
            <div className="flex mt-4">
              <span className="text-green-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="ml-1">+30</span>
              </span>
              <span className="text-gray-400 text-sm ml-2">since last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">New Users Today</p>
                <p className="text-3xl font-bold mt-1">
                  <Counter target={100} />
                </p>
              </div>
              <div className="bg-[#333333] rounded-lg p-2 opacity-90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex mt-4">
              <span className="text-green-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="ml-1">+15%</span>
              </span>
              <span className="text-gray-400 text-sm ml-2">vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div ref={usageTrendsRef} className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Usage Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageTrendsData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f8a43c" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f8a43c" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f86f3c" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f86f3c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#f8a43c"
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                  />
                  <Area
                    type="monotone"
                    dataKey="teachers"
                    stroke="#f86f3c"
                    fillOpacity={1}
                    fill="url(#colorTeachers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div ref={organizationsRef} className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Organization Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={organizationsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#f8a43c" name="Students" />
                  <Bar dataKey="teachers" fill="#f86f3c" name="Teachers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div ref={aiToolsRef} className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Most Used AI Tools</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aiToolsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {aiToolsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div ref={userEngagementRef} className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly User Engagement</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="chats" stroke="#f8a43c" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="sessions" stroke="#f86f3c" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div ref={actionsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-[#f8a43c] to-[#f86f3c] rounded-xl shadow-lg p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white text-xl font-bold">View Organizations</h3>
              <p className="text-white opacity-80">Manage all 10 organizations</p>
            </div>
            <button
              onClick={onViewOrganizations}
              className="bg-white text-gray-900 px-5 py-2 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
            >
              View All
            </button>
          </div>

          <div className="bg-[#222222] rounded-xl shadow-lg p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white text-xl font-bold">Usage Reports</h3>
              <p className="text-white opacity-80">Download detailed analytics</p>
            </div>
            <button className="bg-white text-gray-900 px-5 py-2 rounded-lg hover:bg-gray-100 transition duration-200 font-medium">
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

