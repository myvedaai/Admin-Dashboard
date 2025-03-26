"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "../../components/dashboard/admin-dashboard"
import Header from "../../components/layout/header"
import type { User } from "@/types/user"

export default function DashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const session = sessionStorage.getItem("admin_session")
    if (!session) {
      router.push("/")
      return
    }

    try {
      const user = JSON.parse(session)
      setCurrentUser(user)
    } catch (e) {
      sessionStorage.removeItem("admin_session")
      router.push("/")
    }
  }, [router])

  const handleViewOrganizations = () => {
    router.push("/organizations")
  }

  if (!currentUser) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} />
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AdminDashboard onViewOrganizations={handleViewOrganizations} currentUser={currentUser} />
      </main>
    </div>
  )
}

