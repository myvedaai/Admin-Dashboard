"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import ViewUsers from "../../../../components/users/view-users"
import Header from "../../../../components/layout/header"
import type { User } from "@/types/user"

export default function ManageUsersPage() {
  const router = useRouter()
  const params = useParams()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [organizationId, setOrganizationId] = useState<number | null>(null)

  useEffect(() => {
    const session = sessionStorage.getItem("admin_session")
    if (!session) {
      router.push("/")
      return
    }

    try {
      const user = JSON.parse(session)
      setCurrentUser(user)
      setOrganizationId(Number.parseInt(params.id as string))
    } catch (e) {
      sessionStorage.removeItem("admin_session")
      router.push("/")
    }
  }, [router, params.id])

  const handleBackToDashboard = () => {
    router.push(`/organizations/${organizationId}`)
  }

  if (!currentUser || !organizationId) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} />
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ViewUsers
          organizationId={organizationId}
          onBackToDashboard={handleBackToDashboard}
          currentUser={currentUser}
        />
      </main>
    </div>
  )
}

