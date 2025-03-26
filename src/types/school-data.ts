export interface AiTool {
  name: string
  enabled: boolean
}

export interface SchoolData {
  id: number
  name: string
  location?: string
  logo: string
  affiliation: string
  email: string
  contact: string[]
  principal: {
    name: string
    phone: string
    image?: string
  }
  stats: {
    totalStudents: number
    totalTeachers: number
    activeStudents: number
    activeTeachers: number
  }
  aiTools: {
    forStudents: AiTool[]
    forTeachers: AiTool[]
    allocated: number
  }
  status: "Active" | "Inactive"
}

