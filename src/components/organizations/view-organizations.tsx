"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Tooltip } from "react-tooltip"
import type { Institution } from "@/types/institution"
import type { User } from "@/types/user"

const IconChevronLeft: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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
    width="24"
    height="24"
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
    width="18"
    height="18"
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

const IconEdit: React.FC = () => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

const IconTrash: React.FC = () => (
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
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
)

const IconPlus: React.FC = () => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

interface ViewOrganizationsProps {
  onBackToDashboard: () => void
  onViewOrganizationDetails: (organization: Institution) => void
  currentUser: User | null
}

const ViewOrganizations: React.FC<ViewOrganizationsProps> = ({
  onBackToDashboard,
  onViewOrganizationDetails,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<"Schools" | "Coaching Centers">("Schools")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "district" | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all")
  const [institutions, setInstitutions] = useState<Institution[]>([
    {
      id: 1,
      name: "DPS Bokaro",
      address: "Sector 4",
      district: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827004",
      status: "enabled",
      type: "school",
    },
    {
      id: 2,
      name: "St. Xavier's School",
      address: "Sector 1",
      district: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827001",
      status: "enabled",
      type: "school",
    },
    {
      id: 3,
      name: "Chinmaya Vidyalaya",
      address: "Sector 5",
      district: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827006",
      status: "enabled",
      type: "school",
    },
    {
      id: 4,
      name: "Holy Cross School",
      address: "Sector 3",
      district: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827003",
      status: "enabled",
      type: "school",
    },
    {
      id: 5,
      name: "DAV Public School",
      address: "Sector 6",
      district: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827006",
      status: "enabled",
      type: "school",
    },
    {
      id: 6,
      name: "Kendriya Vidyalaya",
      address: "Sector 2",
      district: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827002",
      status: "enabled",
      type: "school",
    },
    {
      id: 7,
      name: "Sacred Heart School",
      address: "Sector 8",
      district: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827008",
      status: "enabled",
      type: "school",
    },
    {
      id: 8,
      name: "Bansal Classes",
      address: "Sector 2",
      district: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827002",
      status: "enabled",
      type: "coaching",
    },
    {
      id: 9,
      name: "Aakash Institute",
      address: "Sector 4",
      district: "Bokaro Steel City",
      state: "Jharkhand",
      pincode: "827004",
      status: "enabled",
      type: "coaching",
    },
  ])
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null)
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newInstitution, setNewInstitution] = useState<Institution>({
    id: 0,
    name: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    status: "enabled",
    type: activeTab === "Schools" ? "school" : "coaching",
  })

  const searchInputRef = useRef<HTMLInputElement>(null)
  const deleteModalRef = useRef<HTMLDivElement>(null)
  const editModalRef = useRef<HTMLDivElement>(null)
  const addModalRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)
  const listItemsRef = useRef<(HTMLDivElement | null)[]>([])

  const itemsPerPage = 5

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
    }
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 },
      )
    }
  }, [])

  useEffect(() => {
    if (listItemsRef.current.length) {
      gsap.fromTo(
        listItemsRef.current.filter(Boolean),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
      )
    }
  }, [currentPage, activeTab, institutions, statusFilter])

  useEffect(() => {
    if (paginationRef.current) {
      gsap.fromTo(
        paginationRef.current.children,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
      )
    }
  }, [currentPage])

  useEffect(() => {
    if (showDeleteModal !== null && deleteModalRef.current) {
      gsap.fromTo(
        deleteModalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      )
    }
    if (editingInstitution && editModalRef.current) {
      gsap.fromTo(
        editModalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      )
    }
    if (showAddModal && addModalRef.current) {
      gsap.fromTo(
        addModalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      )
    }
  }, [showDeleteModal, editingInstitution, showAddModal])

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredInstitutions = institutions
    .filter((institution) => {
      const matchesType = activeTab === "Schools" ? institution.type === "school" : institution.type === "coaching"
      const matchesSearch =
        institution.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        institution.address.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        institution.district.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        institution.state.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        institution.pincode.includes(debouncedSearchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || institution.status === statusFilter
      return matchesType && matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (!sortBy) return 0
      const valueA = a[sortBy].toLowerCase()
      const valueB = b[sortBy].toLowerCase()
      return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    })

  const totalPages = Math.max(1, Math.ceil(filteredInstitutions.length / itemsPerPage))
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, filteredInstitutions.length)
  const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage)
  const currentItems = filteredInstitutions.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(filteredInstitutions.length / itemsPerPage))
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages)
    }
  }, [filteredInstitutions, currentPage])

  const toggleStatus = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setInstitutions((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, status: inst.status === "enabled" ? "disabled" : "enabled" } : inst,
      ),
    )
  }

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteModal(id)
  }

  const confirmDelete = () => {
    if (showDeleteModal !== null) {
      setInstitutions((prev) => {
        const newInstitutions = prev.filter((inst) => inst.id !== showDeleteModal)
        const newTotalPages = Math.max(1, Math.ceil(newInstitutions.length / itemsPerPage))
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages)
        }
        return newInstitutions
      })
      setShowDeleteModal(null)
    }
  }

  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const institution = institutions.find((inst) => inst.id === id)
    if (institution) setEditingInstitution({ ...institution })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editingInstitution) {
      setEditingInstitution({ ...editingInstitution, [name]: value })
    }
  }

  const saveEdit = () => {
    if (editingInstitution) {
      setInstitutions((prev) =>
        prev.map((inst) => (inst.id === editingInstitution.id ? { ...editingInstitution } : inst)),
      )
      setEditingInstitution(null)
    }
  }

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewInstitution((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = () => {
    if (newInstitution.name.trim()) {
      setInstitutions((prev) => [
        ...prev,
        { ...newInstitution, id: prev.length + 1, type: activeTab === "Schools" ? "school" : "coaching" },
      ])
      setNewInstitution({
        id: 0,
        name: "",
        address: "",
        district: "",
        state: "",
        pincode: "",
        status: "enabled",
        type: activeTab === "Schools" ? "school" : "coaching",
      })
      setShowAddModal(false)
    }
  }

  const handleSort = (field: "name" | "district") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDeleteModal !== null && deleteModalRef.current && !deleteModalRef.current.contains(e.target as Node)) {
        setShowDeleteModal(null)
      }
      if (editingInstitution && editModalRef.current && !editModalRef.current.contains(e.target as Node)) {
        setEditingInstitution(null)
      }
      if (showAddModal && addModalRef.current && !addModalRef.current.contains(e.target as Node)) {
        setShowAddModal(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDeleteModal, editingInstitution, showAddModal])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDeleteModal(null)
        setEditingInstitution(null)
        setShowAddModal(false)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.altKey) {
        if (e.key === "ArrowLeft" && currentPage > 1) {
          e.preventDefault()
          setCurrentPage((prev) => prev - 1)
        } else if (e.key === "ArrowRight" && currentPage < totalPages) {
          e.preventDefault()
          setCurrentPage((prev) => prev + 1)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, totalPages])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handleTabChange = (tab: "Schools" | "Coaching Centers") => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearchQuery("")
    setSortBy(null)
    setStatusFilter("all")
  }

  const formatAddress = (institution: Institution) => {
    return `${institution.address}, ${institution.district}, ${institution.state} - ${institution.pincode}`
  }

  const renderPagination = () => {
    const pages = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`w-10 sm:w-8 md:w-10 h-10 sm:h-8 md:h-10 rounded-lg font-medium text-sm sm:text-xs md:text-sm cursor-pointer ${
              currentPage === i ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-gray-100"
            } shadow-md`}
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
          className={`w-10 sm:w-8 md:w-10 h-10 sm:h-8 md:h-10 rounded-lg font-medium text-sm sm:text-xs md:text-sm cursor-pointer ${
            currentPage === 1 ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-gray-100"
          } shadow-md`}
          onClick={() => setCurrentPage(1)}
          aria-label="Go to page 1"
          aria-current={currentPage === 1 ? "page" : undefined}
        >
          1
        </button>,
      )

      const startPage = Math.max(2, currentPage - 2)
      const endPage = Math.min(totalPages - 1, currentPage + 2)

      if (startPage > 2) {
        pages.push(
          <span
            key="start-ellipsis"
            className="w-10 sm:w-8 md:w-10 h-10 sm:h-8 md:h-10 flex items-center justify-center text-gray-900 text-sm sm:text-xs md:text-sm"
          >
            ...
          </span>,
        )
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            className={`w-10 sm:w-8 md:w-10 h-10 sm:h-8 md:h-10 rounded-lg font-medium text-sm sm:text-xs md:text-sm cursor-pointer ${
              currentPage === i ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-gray-100"
            } shadow-md`}
            onClick={() => setCurrentPage(i)}
            aria-label={`Go to page ${i}`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>,
        )
      }

      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="end-ellipsis"
            className="w-10 sm:w-8 md:w-10 h-10 sm:h-8 md:h-10 flex items-center justify-center text-gray-900 text-sm sm:text-xs md:text-sm"
          >
            ...
          </span>,
        )
      }

      pages.push(
        <button
          key={totalPages}
          className={`w-10 sm:w-8 md:w-10 h-10 sm:h-8 md:h-10 rounded-lg font-medium text-sm sm:text-xs md:text-sm cursor-pointer ${
            currentPage === totalPages ? "bg-black text-white" : "bg-white text-gray-900 hover:bg-gray-100"
          } shadow-md`}
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

  return (
    <div className="min-h-screen bg-gray py-6 px-4 sm:px-8 md:px-12">
      <div className="container mx-auto">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center justify-between sm:justify-between md:justify-start w-full">
            <button
              onClick={onBackToDashboard}
              className="text-orange-900 hover:text-orange-700 mr-4 cursor-pointer bg-white p-2 rounded-full shadow-md transition-all hover:shadow-lg"
              aria-label="Go back"
              data-tooltip-id="navigation-tooltip"
            >
              <IconChevronLeft />
            </button>
            <div className="bg-white p-1 rounded-full shadow-md flex justify-end sm:justify-end md:justify-center gap-2 sm:gap-0">
              <button
                className={`px-6 sm:px-4 md:px-6 py-2 sm:py-1 md:py-2 rounded-full text-sm sm:text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "Schools" ? "bg-black text-white" : "text-orange-900 hover:bg-orange-100"
                }`}
                onClick={() => handleTabChange("Schools")}
                aria-pressed={activeTab === "Schools"}
                data-tooltip-id="tab-tooltip"
              >
                Schools
              </button>
              <button
                className={`px-6 sm:px-4 md:px-6 py-2 sm:py-1 md:py-2 rounded-full text-sm sm:text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "Coaching Centers" ? "bg-black text-white" : "text-orange-900 hover:bg-orange-100"
                }`}
                onClick={() => handleTabChange("Coaching Centers")}
                aria-pressed={activeTab === "Coaching Centers"}
                data-tooltip-id="tab-tooltip"
              >
                Coaching Centers
              </button>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-orange-500">
                  <IconSearch />
                </span>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Search for ${activeTab} (Ctrl+K)`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 sm:py-1 md:py-2 w-full rounded-full border-2 border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm text-orange-900 placeholder-orange-400 text-sm sm:text-xs md:text-sm cursor-text"
                aria-label="Search for institutions"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "enabled" | "disabled")}
              className="px-4 py-2 rounded-full border-2 border-orange-200 bg-white text-orange-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">All Status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-orange-900">{activeTab}</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-800 transition-colors"
          >
            <IconPlus />
            <span>Add New {activeTab === "Schools" ? "School" : "Coaching Center"}</span>
          </button>
        </div>

        <div
          ref={contentRef}
          className={`bg-white p-6 sm:p-4 md:p-6 rounded-xl shadow-xl ${editingInstitution || showDeleteModal || showAddModal ? "blur-sm" : ""}`}
        >
          {currentItems.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => handleSort("name")}
                  className="text-orange-900 hover:text-orange-700 font-medium"
                >
                  Sort by Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSort("district")}
                  className="text-orange-900 hover:text-orange-700 font-medium"
                >
                  Sort by District {sortBy === "district" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
              {currentItems.map((institution, index) => (
                <div
                  key={institution.id}
                  ref={(el: HTMLDivElement | null) => {
                    listItemsRef.current[index] = el
                  }}
                  className={`flex flex-col md:flex-row md:items-center justify-between px-4 sm:px-3 md:px-4 py-4 sm:py-3 md:py-4 rounded-lg border-l-4 ${
                    institution.status === "enabled"
                      ? "bg-orange-50 border-orange-500 hover:bg-orange-100"
                      : "bg-gray-100 border-gray-400 hover:bg-gray-200"
                  } hover:shadow-lg transition-all cursor-pointer`}
                  onClick={() => onViewOrganizationDetails(institution)}
                >
                  <div className="flex items-center space-x-4 w-full md:w-1/3 mb-3 sm:mb-2 md:mb-0">
                    <div
                      className={`w-12 sm:w-10 md:w-12 h-12 sm:h-10 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        institution.status === "enabled" ? "bg-orange-500" : "bg-gray-400"
                      } text-white font-medium text-lg sm:text-base md:text-lg shadow-md`}
                      aria-hidden="true"
                    >
                      {institution.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-orange-900 text-lg sm:text-base md:text-lg break-words md:truncate">
                      {institution.name}
                    </span>
                  </div>
                  <div className="text-orange-800 flex-grow ml-0 md:ml-8 mt-2 sm:mt-1 md:mt-0 text-sm w-full md:w-1/3 md:text-center">
                    <div className="break-words md:inline-block md:truncate">{formatAddress(institution)}</div>
                  </div>
                  <div className="flex items-center space-x-4 sm:space-x-2 md:space-x-4 mt-3 sm:mt-2 md:mt-0 w-full md:w-1/3 justify-end">
                    <button
                      className={`flex items-center justify-between w-28 sm:w-20 md:w-28 px-4 sm:px-2 md:px-4 py-2 sm:py-1 md:py-2 rounded-md border-2 shadow-sm flex-shrink-0 text-sm sm:text-xs md:text-sm cursor-pointer transition-colors ${
                        institution.status === "enabled"
                          ? "bg-orange-50 border-orange-500 text-orange-700 hover:bg-orange-100"
                          : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={(e) => toggleStatus(institution.id, e)}
                      aria-label={`Toggle status for ${institution.name}`}
                      data-tooltip-id="status-tooltip"
                    >
                      <span className="capitalize font-medium">{institution.status}</span>
                    </button>
                    <button
                      className="p-2 sm:p-1 md:p-2 text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-full flex-shrink-0 cursor-pointer transition-colors"
                      onClick={(e) => handleEdit(institution.id, e)}
                      aria-label={`Edit ${institution.name}`}
                      data-tooltip-id="action-tooltip"
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="p-2 sm:p-1 md:p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-full flex-shrink-0 cursor-pointer transition-colors"
                      onClick={(e) => handleDelete(institution.id, e)}
                      aria-label={`Delete ${institution.name}`}
                      data-tooltip-id="action-tooltip"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-6 md:py-10">
              <p className="text-orange-600 text-lg sm:text-base md:text-lg">No institutions found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Add New {activeTab === "Schools" ? "School" : "Coaching Center"}
              </button>
            </div>
          )}

          {filteredInstitutions.length > 0 && (
            <div
              ref={paginationRef}
              className="flex justify-center items-center mt-8 sm:mt-4 md:mt-8 gap-2 sm:gap-1 md:gap-2 flex-wrap"
            >
              <button
                className="px-4 sm:px-2 md:px-4 py-2 sm:py-1 md:py-2 rounded-lg bg-orange-100 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-orange-900 font-medium text-sm sm:text-xs md:text-sm cursor-pointer transition-colors"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <span className="flex items-center gap-2 sm:gap-1 md:gap-2">
                  <IconChevronLeft /> Back
                </span>
              </button>
              {renderPagination()}
              <button
                className="px-4 sm:px-2 md:px-4 py-2 sm:py-1 md:py-2 rounded-lg bg-orange-100 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-orange-900 font-medium text-sm sm:text-xs md:text-sm cursor-pointer transition-colors"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <span className="flex items-center gap-2 sm:gap-1 md:gap-2">
                  Next <IconChevronRight />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <Tooltip id="navigation-tooltip" place="bottom" content="Back to Dashboard" />
      <Tooltip id="tab-tooltip" place="bottom" content="Switch Tab" />
      <Tooltip id="status-tooltip" place="top" content="Toggle Status" />
      <Tooltip id="action-tooltip" place="top" content="Edit/Delete" />

      {showDeleteModal !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-xl p-6 sm:p-4 md:p-6 max-w-md sm:max-w-[90vw] md:max-w-md w-full mx-4 sm:mx-2 md:mx-4 shadow-2xl border-2 border-orange-200"
          >
            <h2 className="text-xl font-bold text-orange-900 mb-4">Confirm Delete</h2>
            <p className="text-orange-800 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{institutions.find((inst) => inst.id === showDeleteModal)?.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => setShowDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingInstitution && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            ref={editModalRef}
            className="bg-white rounded-xl p-6 sm:p-4 md:p-6 max-w-lg sm:max-w-[90vw] md:max-w-lg w-full mx-4 sm:mx-2 md:mx-4 shadow-2xl border-2 border-orange-200"
          >
            <h2 className="text-xl font-bold text-orange-900 mb-4">Edit Institution</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-orange-800 mb-1 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingInstitution.name}
                  onChange={handleEditChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editingInstitution.address}
                  onChange={handleEditChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">District</label>
                <input
                  type="text"
                  name="district"
                  value={editingInstitution.district}
                  onChange={handleEditChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">State</label>
                <input
                  type="text"
                  name="state"
                  value={editingInstitution.state}
                  onChange={handleEditChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={editingInstitution.pincode}
                  onChange={handleEditChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">Status</label>
                <select
                  name="status"
                  value={editingInstitution.status}
                  onChange={handleEditChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => setEditingInstitution(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            ref={addModalRef}
            className="bg-white rounded-xl p-6 sm:p-4 md:p-6 max-w-lg sm:max-w-[90vw] md:max-w-lg w-full mx-4 sm:mx-2 md:mx-4 shadow-2xl border-2 border-orange-200"
          >
            <h2 className="text-xl font-bold text-orange-900 mb-4">
              Add New {activeTab === "Schools" ? "School" : "Coaching Center"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-orange-800 mb-1 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newInstitution.name}
                  onChange={handleAddChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newInstitution.address}
                  onChange={handleAddChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">District</label>
                <input
                  type="text"
                  name="district"
                  value={newInstitution.district}
                  onChange={handleAddChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">State</label>
                <input
                  type="text"
                  name="state"
                  value={newInstitution.state}
                  onChange={handleAddChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={newInstitution.pincode}
                  onChange={handleAddChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-orange-800 mb-1 text-sm">Status</label>
                <select
                  name="status"
                  value={newInstitution.status}
                  onChange={handleAddChange}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                onClick={handleAddSubmit}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewOrganizations

