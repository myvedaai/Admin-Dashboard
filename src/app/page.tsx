"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AuthPage from "../components/auth/auth-page"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in via session storage
    const session = sessionStorage.getItem("admin_session")
    if (session) {
      try {
        JSON.parse(session)
        router.push("/dashboard")
      } catch (e) {
        sessionStorage.removeItem("admin_session")
      }
    }
  }, [router])

  return <AuthPage />
}

