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
      access_request: {
        Row: {
          dataroom_id: number
          id: number
          requested_at: string
          status: Database["public"]["Enums"]["application_status"]
          user_id: string
        }
        Insert: {
          dataroom_id: number
          id?: number
          requested_at?: string
          status?: Database["public"]["Enums"]["application_status"]
          user_id: string
        }
        Update: {
          dataroom_id?: number
          id?: number
          requested_at?: string
          status?: Database["public"]["Enums"]["application_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_request_dataroom_id_fkey"
            columns: ["dataroom_id"]
            isOneToOne: false
            referencedRelation: "dataroom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_request_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business: {
        Row: {
          business_name: string | null
          business_type: number | null
          id: number
          joined_date: string | null
          location: string | null
          user_id: string
        }
        Insert: {
          business_name?: string | null
          business_type?: number | null
          id?: number
          joined_date?: string | null
          location?: string | null
          user_id: string
        }
        Update: {
          business_name?: string | null
          business_type?: number | null
          id?: number
          joined_date?: string | null
          location?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Business_businessType_fkey"
            columns: ["business_type"]
            isOneToOne: false
            referencedRelation: "business_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_application: {
        Row: {
          business_name: string
          business_type_id: number
          community_size: string
          created_at: string
          id: number
          is_for_sale: boolean
          is_generating_revenue: boolean
          is_in_us: boolean
          location: string | null
          money_raised_to_date: number | null
          pitch_deck_url: string
          project_application_id: number | null
          status: Database["public"]["Enums"]["application_status"]
          user_id: string
        }
        Insert: {
          business_name: string
          business_type_id: number
          community_size: string
          created_at?: string
          id?: number
          is_for_sale: boolean
          is_generating_revenue: boolean
          is_in_us: boolean
          location?: string | null
          money_raised_to_date?: number | null
          pitch_deck_url: string
          project_application_id?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          user_id: string
        }
        Update: {
          business_name?: string
          business_type_id?: number
          community_size?: string
          created_at?: string
          id?: number
          is_for_sale?: boolean
          is_generating_revenue?: boolean
          is_in_us?: boolean
          location?: string | null
          money_raised_to_date?: number | null
          pitch_deck_url?: string
          project_application_id?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_application_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BusinessApplication_businessTypeId_fkey"
            columns: ["business_type_id"]
            isOneToOne: false
            referencedRelation: "business_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BusinessApplication_projectApplicationId_fkey"
            columns: ["project_application_id"]
            isOneToOne: false
            referencedRelation: "project_application"
            referencedColumns: ["id"]
          },
        ]
      }
      business_type: {
        Row: {
          description: string | null
          id: number
          value: string
        }
        Insert: {
          description?: string | null
          id?: number
          value: string
        }
        Update: {
          description?: string | null
          id?: number
          value?: string
        }
        Relationships: []
      }
      country: {
        Row: {
          id: number
          value: string
        }
        Insert: {
          id?: number
          value: string
        }
        Update: {
          id?: number
          value?: string
        }
        Relationships: []
      }
      dataroom: {
        Row: {
          created_at: string
          id: number
          is_public: boolean
          project_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_public?: boolean
          project_id: number
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: number
          is_public?: boolean
          project_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dataroom_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dataroom_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_card"
            referencedColumns: ["project_id"]
          },
        ]
      }
      dataroom_material: {
        Row: {
          dataroom_id: number
          file_type_id: number
          file_url: string
          id: number
          uploaded_at: string
        }
        Insert: {
          dataroom_id: number
          file_type_id: number
          file_url: string
          id?: number
          uploaded_at?: string
        }
        Update: {
          dataroom_id?: number
          file_type_id?: number
          file_url?: string
          id?: number
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dataroom_material_dataroom_id_fkey"
            columns: ["dataroom_id"]
            isOneToOne: false
            referencedRelation: "dataroom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dataroom_material_file_type_id_fkey"
            columns: ["file_type_id"]
            isOneToOne: false
            referencedRelation: "material_file_type"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_status: {
        Row: {
          id: number
          value: string
        }
        Insert: {
          id?: number
          value: string
        }
        Update: {
          id?: number
          value?: string
        }
        Relationships: []
      }
      follow: {
        Row: {
          created_at: string
          id: number
          project_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          project_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          project_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Follow_projectId_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Follow_projectId_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_card"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "follow_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      funded_status: {
        Row: {
          description: string | null
          id: number
          value: string
        }
        Insert: {
          description?: string | null
          id?: number
          value: string
        }
        Update: {
          description?: string | null
          id?: number
          value?: string
        }
        Relationships: []
      }
      investment_deal: {
        Row: {
          created_time: string
          deal_amount: number
          deal_status_id: number | null
          id: number
          investor_id: string
          project_id: number
        }
        Insert: {
          created_time?: string
          deal_amount: number
          deal_status_id?: number | null
          id?: number
          investor_id: string
          project_id: number
        }
        Update: {
          created_time?: string
          deal_amount?: number
          deal_status_id?: number | null
          id?: number
          investor_id?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "investment_deal_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "InvestmentDeal_dealStatusId_fkey1"
            columns: ["deal_status_id"]
            isOneToOne: false
            referencedRelation: "deal_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "InvestmentDeal_projectId_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "InvestmentDeal_projectId_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_card"
            referencedColumns: ["project_id"]
          },
        ]
      }
      material_file_type: {
        Row: {
          description: string | null
          id: number
          value: string
        }
        Insert: {
          description?: string | null
          id?: number
          value: string
        }
        Update: {
          description?: string | null
          id?: number
          value?: string
        }
        Relationships: []
      }
      material_type: {
        Row: {
          id: number
          value: string
        }
        Insert: {
          id?: number
          value: string
        }
        Update: {
          id?: number
          value?: string
        }
        Relationships: []
      }
      meeting_log: {
        Row: {
          created_at: string
          end_time: string
          id: number
          meet_date: string
          note: string | null
          project_id: number
          start_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: number
          meet_date: string
          note?: string | null
          project_id: number
          start_time: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: number
          meet_date?: string
          note?: string | null
          project_id?: number
          start_time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_card"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "meeting_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification: {
        Row: {
          created_at: string
          id: number
          is_read: boolean
          message: string | null
          receiver_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_read?: boolean
          message?: string | null
          receiver_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_read?: boolean
          message?: string | null
          receiver_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_receiver_id_fkey"
            columns: ["receiver_id"]
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
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      project: {
        Row: {
          business_id: number
          card_image_url: string | null
          dataroom_id: number | null
          deadline: string | null
          id: number
          project_description: string | null
          project_name: string
          project_short_description: string
          project_stats_id: number | null
          project_status_id: number | null
          project_type_id: number | null
          published_time: string
        }
        Insert: {
          business_id: number
          card_image_url?: string | null
          dataroom_id?: number | null
          deadline?: string | null
          id?: number
          project_description?: string | null
          project_name: string
          project_short_description: string
          project_stats_id?: number | null
          project_status_id?: number | null
          project_type_id?: number | null
          published_time: string
        }
        Update: {
          business_id?: number
          card_image_url?: string | null
          dataroom_id?: number | null
          deadline?: string | null
          id?: number
          project_description?: string | null
          project_name?: string
          project_short_description?: string
          project_stats_id?: number | null
          project_status_id?: number | null
          project_type_id?: number | null
          published_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "Project_businessId_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_dataroom_id_fkey"
            columns: ["dataroom_id"]
            isOneToOne: false
            referencedRelation: "dataroom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Project_projectStatsId_fkey"
            columns: ["project_stats_id"]
            isOneToOne: false
            referencedRelation: "project_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Project_projectStatusId_fkey"
            columns: ["project_status_id"]
            isOneToOne: false
            referencedRelation: "project_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Project_projectTypeId_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "project_type"
            referencedColumns: ["id"]
          },
        ]
      }
      project_application: {
        Row: {
          business_id: number | null
          created_at: string
          deadline: string | null
          id: number
          min_investment: number | null
          pitch_deck_url: string | null
          project_logo: string | null
          project_name: string | null
          project_photos: string[] | null
          project_type_id: number | null
          short_description: string | null
          status: Database["public"]["Enums"]["application_status"]
          target_investment: number | null
          user_id: string
        }
        Insert: {
          business_id?: number | null
          created_at?: string
          deadline?: string | null
          id?: number
          min_investment?: number | null
          pitch_deck_url?: string | null
          project_logo?: string | null
          project_name?: string | null
          project_photos?: string[] | null
          project_type_id?: number | null
          short_description?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          target_investment?: number | null
          user_id: string
        }
        Update: {
          business_id?: number | null
          created_at?: string
          deadline?: string | null
          id?: number
          min_investment?: number | null
          pitch_deck_url?: string | null
          project_logo?: string | null
          project_name?: string | null
          project_photos?: string[] | null
          project_type_id?: number | null
          short_description?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          target_investment?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_application_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_application_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ProjectApplication_projectTypeId_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "project_type"
            referencedColumns: ["id"]
          },
        ]
      }
      project_application_tag: {
        Row: {
          id: number
          item_id: number | null
          tag_id: number
        }
        Insert: {
          id?: number
          item_id?: number | null
          tag_id: number
        }
        Update: {
          id?: number
          item_id?: number | null
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_application_tag_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "project_application"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_application_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      project_investment_detail: {
        Row: {
          funded_status_id: number | null
          investment_deadline: string | null
          min_investment: number | null
          project_id: number
          target_investment: number | null
          total_investment: number | null
        }
        Insert: {
          funded_status_id?: number | null
          investment_deadline?: string | null
          min_investment?: number | null
          project_id: number
          target_investment?: number | null
          total_investment?: number | null
        }
        Update: {
          funded_status_id?: number | null
          investment_deadline?: string | null
          min_investment?: number | null
          project_id?: number
          target_investment?: number | null
          total_investment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_investment_detail_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_investment_detail_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "project_card"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "ProjectInvestmentDetail_fundedStatusId_fkey1"
            columns: ["funded_status_id"]
            isOneToOne: false
            referencedRelation: "funded_status"
            referencedColumns: ["id"]
          },
        ]
      }
      project_log: {
        Row: {
          changed_at: string | null
          id: number
          new_data: Json | null
          old_data: Json | null
          operation_type: string
          record_id: number
          table_name: string
        }
        Insert: {
          changed_at?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          operation_type: string
          record_id: number
          table_name: string
        }
        Update: {
          changed_at?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          operation_type?: string
          record_id?: number
          table_name?: string
        }
        Relationships: []
      }
      project_material: {
        Row: {
          description: string | null
          id: number
          material_file_type_id: number | null
          material_type_id: number | null
          material_url: string[] | null
          project_id: number
        }
        Insert: {
          description?: string | null
          id?: number
          material_file_type_id?: number | null
          material_type_id?: number | null
          material_url?: string[] | null
          project_id: number
        }
        Update: {
          description?: string | null
          id?: number
          material_file_type_id?: number | null
          material_type_id?: number | null
          material_url?: string[] | null
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_material_material_file_type_id_fkey"
            columns: ["material_file_type_id"]
            isOneToOne: false
            referencedRelation: "material_file_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_material_material_type_id_fkey"
            columns: ["material_type_id"]
            isOneToOne: false
            referencedRelation: "material_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ProjectMaterial_projectId_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ProjectMaterial_projectId_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_card"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_meeting_time: {
        Row: {
          created_at: string
          id: number
          meet_date: string
          project_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          meet_date: string
          project_id: number
        }
        Update: {
          created_at?: string
          id?: number
          meet_date?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_meeting_time_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_meeting_time_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_card"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_stats: {
        Row: {
          id: number
          last_update: string | null
          page_visit_counts: number
        }
        Insert: {
          id?: number
          last_update?: string | null
          page_visit_counts: number
        }
        Update: {
          id?: number
          last_update?: string | null
          page_visit_counts?: number
        }
        Relationships: []
      }
      project_status: {
        Row: {
          description: string | null
          id: number
          value: string
        }
        Insert: {
          description?: string | null
          id?: number
          value: string
        }
        Update: {
          description?: string | null
          id?: number
          value?: string
        }
        Relationships: []
      }
      project_tag: {
        Row: {
          id: number
          item_id: number | null
          tag_id: number
        }
        Insert: {
          id?: number
          item_id?: number | null
          tag_id: number
        }
        Update: {
          id?: number
          item_id?: number | null
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ItemTag_itemId_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemTag_itemId_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "project_card"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "ItemTag_tagId_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      project_type: {
        Row: {
          description: string | null
          id: number
          value: string
        }
        Insert: {
          description?: string | null
          id?: number
          value: string
        }
        Update: {
          description?: string | null
          id?: number
          value?: string
        }
        Relationships: []
      }
      tag: {
        Row: {
          id: number
          value: string
        }
        Insert: {
          id?: number
          value: string
        }
        Update: {
          id?: number
          value?: string
        }
        Relationships: []
      }
      user_role: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["role"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      project_card: {
        Row: {
          image_url: string | null
          join_date: string | null
          location: string | null
          min_investment: number | null
          project_id: number | null
          project_name: string | null
          short_description: string | null
          tags: string[] | null
          total_investor: number | null
          total_raise: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_username: {
        Args: {
          full_name: string
          email: string
        }
        Returns: string
      }
      get_investment_deals_count:
        | {
            Args: {
              project_id: number
            }
            Returns: number
          }
        | {
            Args: {
              project_id: string
            }
            Returns: number
          }
      get_total_investment_amount:
        | {
            Args: {
              project_id: number
            }
            Returns: number
          }
        | {
            Args: {
              project_id: string
            }
            Returns: number
          }
      get_user_id_by_email: {
        Args: {
          email: string
        }
        Returns: {
          id: string
        }[]
      }
    }
    Enums: {
      application_status: "pending" | "approve" | "reject"
      role: "admin" | "business" | "investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
