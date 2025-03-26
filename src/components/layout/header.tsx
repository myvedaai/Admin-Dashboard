"use client"

import { useRouter } from "next/navigation"
import type { User } from "@/types/user"

interface HeaderProps {
  currentUser: User | null
}

export default function Header({ currentUser }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem("admin_session")
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="VedaAI Logo" className="h-8 w-8 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">VedaAI</h1>
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                <div className="text-xs text-gray-500">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </div>
              </div>
              <div className="relative">
                <button
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors"
                  onClick={handleLogout}
                >
                  <span className="text-sm font-medium text-black">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

