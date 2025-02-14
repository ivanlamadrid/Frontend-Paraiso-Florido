export interface Student {
    id: string
    created_at: string
    given_name: string
    fathers_name: string | null
    mothers_name: string | null
    school_id: string
    level_id: number | null
    identity: string | null
    check_time_id: string | null
  }
  
  export interface Level {
    id: number
    level_name: string | null
  }
  
  export interface CheckTime {
    id: string
    name: string | null
    check_in_start: string | null
    check_in_end: string | null
    check_out_start: string | null
    check_out_end: string | null
    school_id: string
  }
  
  