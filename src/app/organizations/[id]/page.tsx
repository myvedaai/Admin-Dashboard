"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import OrganizationDetails from "../../../components/organizations/organization-details"
import Header from "../../../components/layout/header"
import type { User } from "@/types/user"
import type { SchoolData } from "@/types/school-data"

// Sample data for demonstration
const sampleSchoolData: SchoolData = {
  id: 1,
  name: "DPS Bokaro",
  location: "Sector 4, Bokaro Steel City, Jharkhand 827004",
  logo: "/images/logo.png",
  affiliation: "CBSE",
  email: "dpsbokaro123@dps.ac.in",
  contact: ["7896485789", "7964852136"],
  principal: { name: "Dr. P ShamRaju", phone: "7587964878", image: "/images/abhi.jpg" },
  stats: {
    totalStudents: 2000,
    totalTeachers: 75,
    activeStudents: 1100,
    activeTeachers: 60,
  },
  aiTools: {
    forStudents: [
      { name: "Quiz Generator", enabled: true },
      { name: "Study Planner", enabled: true },
    ],
    forTeachers: [
      { name: "Attendance Tracker", enabled: true },
      { name: "Grade Analyzer", enabled: true },
    ],
    allocated: 4,
  },
  status: "Active",
}

export default function OrganizationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [organizationData, setOrganizationData] = useState<SchoolData | null>(null)

  useEffect(() => {
    const session = sessionStorage.getItem("admin_session")
    if (!session) {
      router.push("/")
      return
    }

    try {
      const user = JSON.parse(session)
      setCurrentUser(user)

      const id = Number.parseInt(params.id as string)
      setOrganizationData({
        ...sampleSchoolData,
        id,
      })
    } catch (e) {
      sessionStorage.removeItem("admin_session")
      router.push("/")
    }
  }, [router, params.id])

  const handleBackToOrganizations = () => {
    router.push("/organizations")
  }

  const handleViewManageUsers = () => {
    if (organizationData) {
      router.push(`/organizations/${organizationData.id}/users`)
    }
  }

  if (!currentUser || !organizationData) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} />
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <OrganizationDetails
          initialSchoolData={organizationData}
          onBackToOrganizations={handleBackToOrganizations}
          onViewManageUsers={handleViewManageUsers}
          currentUser={currentUser}
        />
      </main>
    </div>
  )
}

