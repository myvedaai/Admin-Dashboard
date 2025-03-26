"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ViewOrganizations from "../../components/organizations/view-organizations"
import Header from "../../components/layout/header"
import type { User } from "../../types/user"
import type { Institution } from "../../types/institution"

export default function OrganizationsPage() {
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

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const handleViewOrganizationDetails = (organization: Institution) => {
    router.push(`/organizations/${organization.id}`)
  }

  if (!currentUser) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} />
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ViewOrganizations
          onBackToDashboard={handleBackToDashboard}
          onViewOrganizationDetails={handleViewOrganizationDetails}
          currentUser={currentUser}
        />
      </main>
    </div>
  )
}

