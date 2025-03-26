export interface Institution {
  id: number
  name: string
  address: string
  district: string
  state: string
  pincode: string
  status: "enabled" | "disabled"
  type: "school" | "coaching"
}

