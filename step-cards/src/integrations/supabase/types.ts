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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      classes: {
        Row: {
          created_at: string
          id: string
          join_code: string
          name: string
          org_id: string | null
          teacher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          join_code?: string
          name: string
          org_id?: string | null
          teacher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          join_code?: string
          name?: string
          org_id?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_cards: {
        Row: {
          break_started_at: string | null
          class_id: string
          completed_at: string | null
          current_step: number
          feeling: string | null
          feeling_at: string | null
          help_ack_at: string | null
          help_count: number
          help_requested_at: string | null
          help_step: number | null
          home_practice_count: number
          home_practiced_at: string | null
          id: string
          lesson_id: string
          steps: Json
          sticker_id: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          break_started_at?: string | null
          class_id: string
          completed_at?: string | null
          current_step?: number
          feeling?: string | null
          feeling_at?: string | null
          help_ack_at?: string | null
          help_count?: number
          help_requested_at?: string | null
          help_step?: number | null
          home_practice_count?: number
          home_practiced_at?: string | null
          id?: string
          lesson_id: string
          steps?: Json
          sticker_id?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          break_started_at?: string | null
          class_id?: string
          completed_at?: string | null
          current_step?: number
          feeling?: string | null
          feeling_at?: string | null
          help_ack_at?: string | null
          help_count?: number
          help_requested_at?: string | null
          help_step?: number | null
          home_practice_count?: number
          home_practiced_at?: string | null
          id?: string
          lesson_id?: string
          steps?: Json
          sticker_id?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_cards_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_cards_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_cards_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          approved_at: string | null
          class_id: string
          created_at: string
          created_by: string
          ended_at: string | null
          id: string
          instruction: string
          routine_key: string
          status: Database["public"]["Enums"]["lesson_status"]
          then_activity: string
          title: string
        }
        Insert: {
          approved_at?: string | null
          class_id: string
          created_at?: string
          created_by: string
          ended_at?: string | null
          id?: string
          instruction: string
          routine_key?: string
          status?: Database["public"]["Enums"]["lesson_status"]
          then_activity?: string
          title: string
        }
        Update: {
          approved_at?: string | null
          class_id?: string
          created_at?: string
          created_by?: string
          ended_at?: string | null
          id?: string
          instruction?: string
          routine_key?: string
          status?: Database["public"]["Enums"]["lesson_status"]
          then_activity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          invite_code?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          invite_code?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_devices: {
        Row: {
          class_id: string
          created_at: string
          id: string
          last_seen_at: string
          student_id: string
          token_hash: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          last_seen_at?: string
          student_id: string
          token_hash: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          last_seen_at?: string
          student_id?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_devices_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_devices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          avatar: string
          class_id: string
          completion_history: Json
          created_at: string
          fading_enabled: boolean
          fading_pace: string
          help_choice: string
          id: string
          nickname: string
          pictogram_only: boolean
          reading_level: Database["public"]["Enums"]["reading_level"]
        }
        Insert: {
          avatar?: string
          class_id: string
          completion_history?: Json
          created_at?: string
          fading_enabled?: boolean
          fading_pace?: string
          help_choice?: string
          id?: string
          nickname: string
          pictogram_only?: boolean
          reading_level?: Database["public"]["Enums"]["reading_level"]
        }
        Update: {
          avatar?: string
          class_id?: string
          completion_history?: Json
          created_at?: string
          fading_enabled?: boolean
          fading_pace?: string
          help_choice?: string
          id?: string
          nickname?: string
          pictogram_only?: boolean
          reading_level?: Database["public"]["Enums"]["reading_level"]
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_class: {
        Args: { _class_id: string; _user_id: string }
        Returns: boolean
      }
      gen_join_code: { Args: never; Returns: string }
      is_org_admin: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      lesson_status: "review" | "live" | "ended"
      org_role: "admin" | "teacher"
      reading_level: "grade2" | "grade4" | "grade6" | "pictogram_only"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      lesson_status: ["review", "live", "ended"],
      org_role: ["admin", "teacher"],
      reading_level: ["grade2", "grade4", "grade6", "pictogram_only"],
    },
  },
} as const
