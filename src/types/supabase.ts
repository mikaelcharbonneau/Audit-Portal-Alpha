export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      AuditReports: {
        Row: {
          Id: string
          ReportData: Json
          Timestamp: string
          UserEmail: string
        }
        Insert: {
          Id?: string
          ReportData: Json
          Timestamp?: string
          UserEmail: string
        }
        Update: {
          Id?: string
          ReportData?: Json
          Timestamp?: string
          UserEmail?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}