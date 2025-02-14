export interface School {
    id: string
    created_at: string
    school_name: string
    contact_name: string
    email: string
    phone: string
    address: string
    website: string
    administrator_id: string
    logo_url?: string
  }
  
  export interface CheckTime {
    id: string
    created_at: string
    name: string
    check_in_start: string
    check_in_end: string
    check_out_start: string
    check_out_end: string
    school_id: string
  }
  
  