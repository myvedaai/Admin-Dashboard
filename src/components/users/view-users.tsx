"use client" // Ensure client-side rendering for Next.js

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Tooltip } from "react-tooltip"
import { RefreshCw, Edit2 } from "lucide-react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from "chart.js"

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend)

interface MentalHealthScore {
  score: number
  date: Date
}

interface Student {
  name: string
  email: string
  profilePicture: string
  grade: string
  organization: string
  isActive: boolean
  score: {
    mentalHealth: MentalHealthScore
  }
  sessionDuration?: number
}

interface Teacher {
  id: number
  name: string
  email: string
  phoneNo: string
  status: "enabled" | "disabled"
}

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "viewer"
  lastLogin?: Date
  avatar?: string
}

interface ViewUsersProps {
  organizationId: number
  onBackToDashboard: () => void
  currentUser: User | null
}

const IconChevronLeft: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
)

const IconChevronRight: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
)

const IconSearch: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const ViewUsers: React.FC<ViewUsersProps> = ({ organizationId, onBackToDashboard, currentUser }) => {
  const [activeTab, setActiveTab] = useState<"Students" | "Teachers">("Students")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [mentalHealthFilter, setMentalHealthFilter] = useState<string>("all")
  const [sessionDurationFilter, setSessionDurationFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")

  const DATABASE_STUDENTS: Student[] = [
    {
      name: "John Doe",
      email: "johndoe1234@gmail.com",
      profilePicture: "john.jpg",
      grade: "8",
      organization: "org123",
      isActive: true,
      score: { mentalHealth: { score: 35, date: new Date("2025-03-10") } },
      sessionDuration: 15,
    },
    {
      name: "Jane Smith",
      email: "janesmith@gmail.com",
      profilePicture: "jane.jpg",
      grade: "9",
      organization: "org123",
      isActive: true,
      score: { mentalHealth: { score: 92, date: new Date("2025-03-15") } },
      sessionDuration: 45,
    },
    {
      name: "Alice Johnson",
      email: "alicej@gmail.com",
      profilePicture: "alice.jpg",
      grade: "7",
      organization: "org123",
      isActive: true,
      score: { mentalHealth: { score: 95, date: new Date("2025-03-12") } },
      sessionDuration: 30,
    },
    {
      name: "Bob Brown",
      email: "bobbrown@gmail.com",
      profilePicture: "bob.jpg",
      grade: "8",
      organization: "org123",
      isActive: false,
      score: { mentalHealth: { score: 88, date: new Date("2025-02-01") } },
      sessionDuration: 10,
    },
    {
      name: "Charlie Davis",
      email: "charlied@gmail.com",
      profilePicture: "charlie.jpg",
      grade: "10",
      organization: "org123",
      isActive: true,
      score: { mentalHealth: { score: 49, date: new Date("2025-03-16") } },
      sessionDuration: 20,
    },
    {
      name: "Diana Evans",
      email: "dianae@gmail.com",
      profilePicture: "diana.jpg",
      grade: "8",
      organization: "org123",
      isActive: true,
      score: { mentalHealth: { score: 95, date: new Date("2025-03-14") } },
      sessionDuration: 35,
    },
  ]

  const DATABASE_TEACHERS: Teacher[] = [
    { id: 1, name: "Emma Wilson", email: "emmaw@gmail.com", phoneNo: "9696969696", status: "enabled" },
    { id: 2, name: "Frank Harris", email: "frankh@gmail.com", phoneNo: "9696969697", status: "enabled" },
    { id: 3, name: "Grace Lee", email: "gracel@gmail.com", phoneNo: "9696969698", status: "disabled" },
    { id: 4, name: "Henry Clark", email: "henryc@gmail.com", phoneNo: "9696969699", status: "enabled" },
    { id: 5, name: "Isabella Lewis", email: "isabellal@gmail.com", phoneNo: "9696969700", status: "enabled" },
  ]

  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)
  const listItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const tabContainerRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 5

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setStudents(DATABASE_STUDENTS)
        setTeachers(DATABASE_TEACHERS)
      } catch (err) {
        setError("Failed to load users. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [organizationId])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (headerRef.current)
        gsap.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
      if (contentRef.current)
        gsap.fromTo(
          contentRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 },
        )
      if (tabContainerRef.current)
        gsap.fromTo(
          tabContainerRef.current.children,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" },
        )
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && listItemsRef.current.length) {
      gsap.fromTo(
        listItemsRef.current.filter(Boolean),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
      )
    }
  }, [currentPage, activeTab])

  useEffect(() => {
    if (typeof window !== "undefined" && paginationRef.current) {
      gsap.fromTo(
        paginationRef.current.children,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
      )
    }
  }, [currentPage])

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredUsers =
    activeTab === "Students"
      ? students
          .filter((student) => {
            const matchesSearch =
              student.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
              student.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            const matchesStatus =
              statusFilter === "all" ||
              (statusFilter === "enabled" && student.isActive) ||
              (statusFilter === "disabled" && !student.isActive)
            const gradeNum = Number.parseInt(student.grade)
            const matchesGrade =
              gradeFilter === "all" ||
              (gradeFilter === "1-4" && gradeNum >= 1 && gradeNum <= 4) ||
              (gradeFilter === "4-6" && gradeNum >= 4 && gradeNum <= 6) ||
              (gradeFilter === "7-8" && gradeNum >= 7 && gradeNum <= 8) ||
              (gradeFilter === "9-10" && gradeNum >= 9 && gradeNum <= 10)
            const mentalHealthScore = student.score.mentalHealth.score
            const matchesMentalHealth =
              mentalHealthFilter === "all" ||
              (mentalHealthFilter === "0-35" && mentalHealthScore <= 35) ||
              (mentalHealthFilter === "36-70" && mentalHealthScore >= 36 && mentalHealthScore <= 70) ||
              (mentalHealthFilter === "71-100" && mentalHealthScore >= 71)
            const sessionDuration = student.sessionDuration || 0
            const matchesSessionDuration =
              sessionDurationFilter === "all" ||
              (sessionDurationFilter === "<15" && sessionDuration < 15) ||
              (sessionDurationFilter === "15-30" && sessionDuration >= 15 && sessionDuration <= 30) ||
              (sessionDurationFilter === ">30" && sessionDuration > 30)
            return matchesSearch && matchesStatus && matchesGrade && matchesMentalHealth && matchesSessionDuration
          })
          .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name)
            if (sortBy === "mentalHealth") return b.score.mentalHealth.score - a.score.mentalHealth.score
            if (sortBy === "sessionDuration") return (b.sessionDuration || 0) - (a.sessionDuration || 0)
            return 0
          })
      : teachers
          .filter((teacher) => {
            const matchesSearch =
              teacher.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
              teacher.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
              teacher.phoneNo.includes(debouncedSearchQuery)
            const matchesStatus = statusFilter === "all" || teacher.status === statusFilter
            return matchesSearch && matchesStatus
          })
          .sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : 0))

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))
  const indexOfFirstItem = Math.max(0, (currentPage - 1) * itemsPerPage)
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, filteredUsers.length)
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages)
  }, [filteredUsers, currentPage])

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "manager")

  const toggleStatus = (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canEdit) {
      alert("You do not have permission to toggle user status.")
      return
    }
    if (activeTab === "Students") {
      setStudents((prev) =>
        prev.map((student) => (student.email === id ? { ...student, isActive: !student.isActive } : student)),
      )
    } else {
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === id ? { ...teacher, status: teacher.status === "enabled" ? "disabled" : "enabled" } : teacher,
        ),
      )
    }
  }

  const handleEdit = (user: Student | Teacher, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canEdit) {
      alert("You do not have permission to edit this user.")
      return
    }
    // Basic edit functionality: Prompt for new name and update it
    const newName = prompt(`Enter new name for ${user.name}:`, user.name)
    if (newName && newName.trim()) {
      if (activeTab === "Students") {
        setStudents((prev) =>
          prev.map((student) =>
            student.email === (user as Student).email ? { ...student, name: newName.trim() } : student,
          ),
        )
      } else {
        setTeachers((prev) =>
          prev.map((teacher) => (teacher.id === (user as Teacher).id ? { ...teacher, name: newName.trim() } : teacher)),
        )
      }
      alert(`Updated name to "${newName.trim()}" for ${user.name}`)
    }
  }

  const handlePrevPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1)
  const handleNextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1)

  const handleTabChange = (tab: "Students" | "Teachers") => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearchQuery("")
    setStatusFilter("all")
    setGradeFilter("all")
    setMentalHealthFilter("all")
    setSessionDurationFilter("all")
    setSortBy("name")
    if (tabContainerRef.current) {
      gsap.to(tabContainerRef.current.children, {
        opacity: 0,
        x: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.fromTo(
            tabContainerRef.current!.children,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" },
          )
        },
      })
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value.startsWith("status-")) setStatusFilter(value.replace("status-", "") as "all" | "enabled" | "disabled")
    else if (value.startsWith("grade-")) setGradeFilter(value.replace("grade-", ""))
    else if (value.startsWith("mentalHealth-")) setMentalHealthFilter(value.replace("mentalHealth-", ""))
    else if (value.startsWith("sessionDuration-")) setSessionDurationFilter(value.replace("sessionDuration-", ""))
    else if (value.startsWith("sort-")) setSortBy(value.replace("sort-", ""))
    setCurrentPage(1)
  }

  const renderPagination = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-medium text-sm sm:text-base cursor-pointer ${
              currentPage === i ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-black hover:text-white"
            } shadow-md transition-colors`}
            onClick={() => setCurrentPage(i)}
            aria-label={`Go to page ${i}`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>,
        )
      }
    } else {
      pages.push(
        <button
          key={1}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-medium text-sm sm:text-base cursor-pointer ${
            currentPage === 1 ? "bg-[#f8a43c] text-white" : "bg-white text-gray-900 hover:bg-[#f8a43c] hover:text-white"
          } shadow-md transition-colors`}
          onClick={() => setCurrentPage(1)}
          aria-label="Go to page 1"
          aria-current={currentPage === 1 ? "page" : undefined}
        >
          1
        </button>,
      )
      const startPage = Math.max(2, currentPage - 2)
      const endPage = Math.min(totalPages - 1, currentPage + 2)
      if (startPage > 2)
        pages.push(
          <span
            key="start-ellipsis"
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-900 text-sm sm:text-base"
          >
            ...
          </span>,
        )
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-medium text-sm sm:text-base cursor-pointer ${
              currentPage === i
                ? "bg-[#f8a43c] text-white"
                : "bg-white text-gray-900 hover:bg-[#f8a43c] hover:text-white"
            } shadow-md transition-colors`}
            onClick={() => setCurrentPage(i)}
            aria-label={`Go to page ${i}`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>,
        )
      }
      if (endPage < totalPages - 1)
        pages.push(
          <span
            key="end-ellipsis"
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-900 text-sm sm:text-base"
          >
            ...
          </span>,
        )
      pages.push(
        <button
          key={totalPages}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-medium text-sm sm:text-base cursor-pointer ${
            currentPage === totalPages
              ? "bg-[#f8a43c] text-white"
              : "bg-white text-gray-900 hover:bg-[#f8a43c] hover:text-white"
          } shadow-md transition-colors`}
          onClick={() => setCurrentPage(totalPages)}
          aria-label={`Go to page ${totalPages}`}
          aria-current={currentPage === totalPages ? "page" : undefined}
        >
          {totalPages}
        </button>,
      )
    }
    return pages
  }

  const mentalHealthData = filteredUsers
    .filter((user): user is Student => activeTab === "Students")
    .map((student) => student.score.mentalHealth.score)
  const mentalHealthRanges = [
    { label: "0-35%", min: 0, max: 35, color: "#f86f3c" },
    { label: "36-70%", min: 36, max: 70, color: "#f8a43c" },
    { label: "71-100%", min: 71, max: 100, color: "#555555" },
  ]
  const mentalHealthCounts = mentalHealthRanges.map(
    (range) => mentalHealthData.filter((value) => value >= range.min && value <= range.max).length,
  )
  const mentalHealthRangeData = {
    labels: mentalHealthRanges.map((range) => range.label),
    datasets: [
      {
        label: "Number of Students",
        data: mentalHealthCounts,
        backgroundColor: mentalHealthRanges.map((range) => range.color),
        borderColor: mentalHealthRanges.map((range) => range.color),
        borderWidth: 1,
      },
    ],
  }

  const sessionData = filteredUsers.filter((user): user is Student => activeTab === "Students")
  const grades = ["7", "8", "9", "10"]
  const avgSessionDurations = grades.map((grade) => {
    const gradeStudents = sessionData.filter(
      (student) => student.grade === grade && student.sessionDuration !== undefined,
    )
    const totalDuration = gradeStudents.reduce((sum, student) => sum + (student.sessionDuration || 0), 0)
    return gradeStudents.length > 0 ? totalDuration / gradeStudents.length : 0
  })
  const sessionDurationData = {
    labels: grades.map((grade) => `Grade ${grade}`),
    datasets: [
      {
        label: "Average Session Duration (minutes)",
        data: avgSessionDurations,
        backgroundColor: "#f8a43c",
        borderColor: "#f8a43c",
        borderWidth: 1,
      },
    ],
  }

  const histogramOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            context.dataset.label === "Number of Students"
              ? `${context.dataset.label}: ${context.raw}`
              : `${context.dataset.label}: ${context.raw.toFixed(1)} minutes`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Category", font: { size: 14 } }, ticks: { font: { size: 12 } } },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Value", font: { size: 14 } },
        ticks: { font: { size: 12 } },
      },
    },
    maintainAspectRatio: false,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-8 w-8 text-[#f8a43c] animate-spin" />
          <span className="text-gray-700 text-base sm:text-lg">Loading users...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <p className="text-red-700 text-base sm:text-lg">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              setError(null)
              setTimeout(() => {
                setStudents(DATABASE_STUDENTS)
                setTeachers(DATABASE_TEACHERS)
                setLoading(false)
              }, 800)
            }}
            className="mt-3 px-5 py-2.5 bg-[#f8a43c] text-white rounded-lg hover:bg-[#f86f3c] transition-colors text-base sm:text-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-3 sm:py-6 px-3 sm:px-6 md:px-8 lg:px-10">
      <div className="container mx-auto">
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 bg-white p-3 sm:p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between w-full md:w-auto mb-3 md:mb-0">
            <button
              onClick={onBackToDashboard}
              className="text-gray-900 hover:text-[#f8a43c] mr-3 cursor-pointer bg-[#f8a43c]/10 p-2 sm:p-3 rounded-full shadow-md transition-all hover:shadow-lg"
              aria-label="Go back"
              data-tooltip-id="navigation-tooltip"
            >
              <IconChevronLeft />
            </button>
            <div ref={tabContainerRef} className="bg-[#f8a43c]/10 p-1.5 rounded-full shadow-md flex gap-2 sm:gap-3">
              <button
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                  activeTab === "Students" ? "bg-black text-white" : "text-gray-900 hover:bg-[#f8a43c] hover:text-white"
                }`}
                onClick={() => handleTabChange("Students")}
                aria-pressed={activeTab === "Students"}
                data-tooltip-id="tab-tooltip"
              >
                Students
              </button>
              <button
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                  activeTab === "Teachers" ? "bg-black text-white" : "text-gray-900 hover:bg-[#f8a43c] hover:text-white"
                }`}
                onClick={() => handleTabChange("Teachers")}
                aria-pressed={activeTab === "Teachers"}
                data-tooltip-id="tab-tooltip"
              >
                Teachers
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto items-center">
            <div className="relative flex-1 w-full sm:w-auto">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-gray-500">
                  <IconSearch />
                </span>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Search for ${activeTab} (Ctrl+K)`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 sm:py-2.5 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f8a43c] bg-white shadow-sm text-gray-900 placeholder-gray-400 text-sm sm:text-base cursor-text"
                aria-label="Search for users"
              />
            </div>
            <select
              onChange={handleFilterChange}
              className="px-4 py-2 sm:py-2.5 rounded-full border border-gray-200 bg-white text-gray-900 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-[#f8a43c] w-full sm:w-auto"
            >
              <optgroup label="Status">
                <option value="status-all">All Status</option>
                <option value="status-enabled">Enabled</option>
                <option value="status-disabled">Disabled</option>
              </optgroup>
              {activeTab === "Students" && (
                <>
                  <optgroup label="Grade">
                    <option value="grade-all">All Grades</option>
                    <option value="grade-1-4">Grades 1-4</option>
                    <option value="grade-4-6">Grades 4-6</option>
                    <option value="grade-7-8">Grades 7-8</option>
                    <option value="grade-9-10">Grades 9-10</option>
                  </optgroup>
                  <optgroup label="Mental Health">
                    <option value="mentalHealth-all">All Mental Health</option>
                    <option value="mentalHealth-0-35">0-35%</option>
                    <option value="mentalHealth-36-70">36-70%</option>
                    <option value="mentalHealth-71-100">71-100%</option>
                  </optgroup>
                  <optgroup label="Session Duration">
                    <option value="sessionDuration-all">All Session Durations</option>
                    <option value="sessionDuration-<15">&lt;15 min</option>
                    <option value="sessionDuration-15-30">15-30 min</option>
                    <option value="sessionDuration->30">&gt;30 min</option>
                  </optgroup>
                  <optgroup label="Sort By">
                    <option value="sort-name">Sort by Name</option>
                    <option value="sort-mentalHealth">Sort by Mental Health</option>
                    <option value="sort-sessionDuration">Sort by Session Duration</option>
                  </optgroup>
                </>
              )}
            </select>
          </div>
        </div>

        <div ref={contentRef} className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div
            className={`bg-white p-3 sm:p-4 rounded-lg shadow-md ${activeTab === "Students" ? "lg:w-8/12" : "w-full"}`}
          >
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6">{activeTab}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-8 gap-2 sm:gap-3 mb-3 sm:mb-6 text-gray-700 font-medium text-sm sm:text-base">
              <span className="sm:col-span-2 text-left">Name</span>
              <span className="sm:col-span-2 text-left sm:text-center">Email</span>
              {activeTab === "Students" ? (
                <>
                  <span className="sm:col-span-1 text-left sm:text-center">Grade</span>
                  <span className="sm:col-span-1 text-left sm:text-center">Mental Health</span>
                </>
              ) : (
                <span className="sm:col-span-2 text-left sm:text-center">Phone Number</span>
              )}
              <span className="sm:col-span-1 text-left sm:text-center">Status</span>
              <span className="sm:col-span-1 text-left sm:text-center">Actions</span>
            </div>
            {currentItems.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {currentItems.map((user, index) => (
                  <div
                    key={user.email}
                    ref={(el: HTMLDivElement | null) => void (listItemsRef.current[index] = el)}
                    className={`grid grid-cols-1 sm:grid-cols-8 gap-2 sm:gap-3 items-start sm:items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 ${
                      (user as Student).isActive || (user as Teacher).status === "enabled"
                        ? "bg-[#f8a43c]/10 border-[#f8a43c] hover:bg-[#f8a43c]/20"
                        : "bg-gray-100 border-gray-400 hover:bg-gray-200"
                    } hover:shadow-md transition-all cursor-pointer`}
                    onClick={() => alert(`Viewing details for ${user.name}`)}
                  >
                    <div className="sm:col-span-2 flex items-center space-x-3 sm:space-x-4">
                      <img
                        src={(user as Student).profilePicture || "default.jpg"}
                        alt={`${user.name}'s profile`}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-md"
                      />
                      <span className="text-gray-900 font-semibold text-sm sm:text-base">{user.name}</span>
                    </div>
                    <div className="sm:col-span-2 text-gray-800 text-sm sm:text-base text-left sm:text-center break-words">
                      {user.email}
                    </div>
                    {activeTab === "Students" ? (
                      <>
                        <div className="sm:col-span-1 text-gray-800 text-sm sm:text-base text-left sm:text-center">
                          {(user as Student).grade}
                        </div>
                        <div className="sm:col-span-1 text-sm sm:text-base text-left sm:text-center">
                          <span
                            className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${
                              (user as Student).score.mentalHealth.score >= 80
                                ? "bg-[#555555] text-white"
                                : (user as Student).score.mentalHealth.score >= 50
                                  ? "bg-[#f8a43c] text-white"
                                  : "bg-[#f86f3c] text-white"
                            }`}
                          >
                            {(user as Student).score.mentalHealth.score}%
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="sm:col-span-2 text-gray-800 text-sm sm:text-base text-left sm:text-center">
                        {(user as Teacher).phoneNo}
                      </div>
                    )}
                    <div className="sm:col-span-1 flex justify-start sm:justify-center">
                      <button
                        className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-md border text-sm sm:text-base font-medium ${
                          (user as Student).isActive || (user as Teacher).status === "enabled"
                            ? "bg-[#f8a43c]/20 border-[#f8a43c] text-[#f8a43c] hover:bg-[#f8a43c]/30"
                            : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                        } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={(e) =>
                          toggleStatus(activeTab === "Students" ? (user as Student).email : (user as Teacher).id, e)
                        }
                        disabled={!canEdit}
                        aria-label={`Toggle status for ${user.name}`}
                        data-tooltip-id="status-tooltip"
                      >
                        {(user as Student).isActive || (user as Teacher).status === "enabled" ? "Enabled" : "Disabled"}
                      </button>
                    </div>
                    <div className="sm:col-span-1 flex justify-start sm:justify-center">
                      <button
                        className={`p-2 rounded-full text-gray-600 hover:text-[#f8a43c] hover:bg-[#f8a43c]/10 transition-colors ${
                          !canEdit ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={(e) => handleEdit(user, e)}
                        disabled={!canEdit}
                        aria-label={`Edit ${user.name}`}
                        data-tooltip-id="edit-tooltip"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-gray-600 text-sm sm:text-base">No {activeTab.toLowerCase()} found</p>
              </div>
            )}

            {filteredUsers.length > 0 && (
              <div
                ref={paginationRef}
                className="flex justify-center items-center mt-6 sm:mt-8 gap-2 sm:gap-3 flex-wrap"
              >
                <button
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#f8a43c]/10 hover:bg-[#f8a43c]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-gray-900 font-medium text-sm sm:text-base cursor-pointer transition-colors"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <IconChevronLeft /> Back
                  </span>
                </button>
                {renderPagination()}
                <button
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#f8a43c]/10 hover:bg-[#f8a43c]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-gray-900 font-medium text-sm sm:text-base cursor-pointer transition-colors"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    Next <IconChevronRight />
                  </span>
                </button>
              </div>
            )}
          </div>

          {activeTab === "Students" && (
            <div className="lg:w-4/12 flex flex-col gap-4 sm:gap-6">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Mental Health Range Distribution
                </h3>
                {mentalHealthData.length > 0 ? (
                  <div className="relative h-36 sm:h-56">
                    <Bar data={mentalHealthRangeData} options={histogramOptions} />
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-600 text-sm sm:text-base">No data available to display</p>
                  </div>
                )}
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Average Session Duration per Grade
                </h3>
                {sessionData.length > 0 ? (
                  <div className="relative h-36 sm:h-56">
                    <Bar data={sessionDurationData} options={histogramOptions} />
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-600 text-sm sm:text-base">No data available to display</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Tooltip id="navigation-tooltip" place="bottom" content="Back to Organization Details" />
      <Tooltip id="tab-tooltip" place="bottom" content="Switch Tab" />
      <Tooltip id="status-tooltip" place="top" content={canEdit ? "Toggle Status" : "No Permission to Edit"} />
      <Tooltip id="edit-tooltip" place="top" content={canEdit ? "Edit User" : "No Permission to Edit"} />
    </div>
  )
}

export default ViewUsers

