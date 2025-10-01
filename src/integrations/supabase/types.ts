export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      city_development_funds: {
        Row: {
          allocated_amount: number
          available_amount: number
          id: string
          location: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          allocated_amount?: number
          available_amount?: number
          id?: string
          location: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          allocated_amount?: number
          available_amount?: number
          id?: string
          location?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      city_projects: {
        Row: {
          allocated_amount: number | null
          category: string
          created_at: string
          description: string
          fund_id: string
          id: string
          requested_amount: number
          status: string
          title: string
          updated_at: string
          votes_against: number | null
          votes_for: number | null
        }
        Insert: {
          allocated_amount?: number | null
          category: string
          created_at?: string
          description: string
          fund_id: string
          id?: string
          requested_amount: number
          status?: string
          title: string
          updated_at?: string
          votes_against?: number | null
          votes_for?: number | null
        }
        Update: {
          allocated_amount?: number | null
          category?: string
          created_at?: string
          description?: string
          fund_id?: string
          id?: string
          requested_amount?: number
          status?: string
          title?: string
          updated_at?: string
          votes_against?: number | null
          votes_for?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "city_projects_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "city_development_funds"
            referencedColumns: ["id"]
          },
        ]
      }
      income_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          project_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          project_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "income_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          resources: string[] | null
          skills: string[] | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          location?: string | null
          phone?: string | null
          resources?: string[] | null
          skills?: string[] | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          resources?: string[] | null
          skills?: string[] | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          contribution_percentage: number | null
          id: string
          joined_at: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          contribution_percentage?: number | null
          id?: string
          joined_at?: string
          project_id: string
          role: string
          user_id: string
        }
        Update: {
          contribution_percentage?: number | null
          id?: string
          joined_at?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_budget: number | null
          category: string
          created_at: string
          creator_id: string
          description: string
          end_date: string | null
          estimated_budget: number | null
          id: string
          location: string | null
          required_resources: string[] | null
          required_skills: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          total_income: number | null
          updated_at: string
        }
        Insert: {
          actual_budget?: number | null
          category: string
          created_at?: string
          creator_id: string
          description: string
          end_date?: string | null
          estimated_budget?: number | null
          id?: string
          location?: string | null
          required_resources?: string[] | null
          required_skills?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          total_income?: number | null
          updated_at?: string
        }
        Update: {
          actual_budget?: number | null
          category?: string
          created_at?: string
          creator_id?: string
          description?: string
          end_date?: string | null
          estimated_budget?: number | null
          id?: string
          location?: string | null
          required_resources?: string[] | null
          required_skills?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          total_income?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          city_project_id: string
          created_at: string
          id: string
          user_id: string
          vote: boolean
        }
        Insert: {
          city_project_id: string
          created_at?: string
          id?: string
          user_id: string
          vote: boolean
        }
        Update: {
          city_project_id?: string
          created_at?: string
          id?: string
          user_id?: string
          vote?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "votes_city_project_id_fkey"
            columns: ["city_project_id"]
            isOneToOne: false
            referencedRelation: "city_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      project_status: "planning" | "active" | "completed" | "cancelled"
      transaction_type: "user" | "city" | "platform"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      project_status: ["planning", "active", "completed", "cancelled"],
      transaction_type: ["user", "city", "platform"],
    },
  },
} as const
