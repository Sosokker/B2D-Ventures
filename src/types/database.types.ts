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
      Address: {
        Row: {
          city: string | null
          countryId: number
          created_at: string
          id: number
          postalCode: string | null
          province: string | null
          street: string | null
          suite: string | null
        }
        Insert: {
          city?: string | null
          countryId: number
          created_at?: string
          id?: number
          postalCode?: string | null
          province?: string | null
          street?: string | null
          suite?: string | null
        }
        Update: {
          city?: string | null
          countryId?: number
          created_at?: string
          id?: number
          postalCode?: string | null
          province?: string | null
          street?: string | null
          suite?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Address_countryId_fkey"
            columns: ["countryId"]
            isOneToOne: false
            referencedRelation: "Country"
            referencedColumns: ["id"]
          },
        ]
      }
      Business: {
        Row: {
          businessName: string | null
          businessType: number | null
          id: number
          joinedDate: string | null
          location: string | null
          userId: number
        }
        Insert: {
          businessName?: string | null
          businessType?: number | null
          id?: number
          joinedDate?: string | null
          location?: string | null
          userId: number
        }
        Update: {
          businessName?: string | null
          businessType?: number | null
          id?: number
          joinedDate?: string | null
          location?: string | null
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Business_businessType_fkey"
            columns: ["businessType"]
            isOneToOne: false
            referencedRelation: "BusinessType"
            referencedColumns: ["id"]
          },
        ]
      }
      BusinessType: {
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
      Country: {
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
      DealStatus: {
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
      Follow: {
        Row: {
          followedTimeStamp: string | null
          id: number
          projectId: number
        }
        Insert: {
          followedTimeStamp?: string | null
          id?: number
          projectId: number
        }
        Update: {
          followedTimeStamp?: string | null
          id?: number
          projectId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Follow_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
        ]
      }
      FundedStatus: {
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
      InvestmentDeal: {
        Row: {
          createdTime: string | null
          dealAmount: number | null
          dealStatusId: number | null
          id: number
          investorId: string
          projectId: number | null
        }
        Insert: {
          createdTime?: string | null
          dealAmount?: number | null
          dealStatusId?: number | null
          id?: number
          investorId?: string
          projectId?: number | null
        }
        Update: {
          createdTime?: string | null
          dealAmount?: number | null
          dealStatusId?: number | null
          id?: number
          investorId?: string
          projectId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "InvestmentDeal_dealStatusId_fkey1"
            columns: ["dealStatusId"]
            isOneToOne: false
            referencedRelation: "DealStatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "InvestmentDeal_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
        ]
      }
      Investor: {
        Row: {
          addressId: number | null
          id: number
          userId: string
        }
        Insert: {
          addressId?: number | null
          id?: number
          userId: string
        }
        Update: {
          addressId?: number | null
          id?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Investor_addressId_fkey"
            columns: ["addressId"]
            isOneToOne: false
            referencedRelation: "Address"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investor_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemTag: {
        Row: {
          id: number
          itemId: number | null
          tagId: number
        }
        Insert: {
          id?: number
          itemId?: number | null
          tagId: number
        }
        Update: {
          id?: number
          itemId?: number | null
          tagId?: number
        }
        Relationships: [
          {
            foreignKeyName: "ItemTag_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemTag_tagId_fkey"
            columns: ["tagId"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          },
        ]
      }
      MaterialType: {
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
      Profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Project: {
        Row: {
          businessId: number
          cardImage: string | null
          id: number
          projectDescription: string | null
          projectName: string
          projectShortDescription: string
          projectStatsId: number | null
          projectStatusId: number | null
          projectTypeId: number | null
          publishedTime: string
        }
        Insert: {
          businessId: number
          cardImage?: string | null
          id?: number
          projectDescription?: string | null
          projectName: string
          projectShortDescription: string
          projectStatsId?: number | null
          projectStatusId?: number | null
          projectTypeId?: number | null
          publishedTime?: string | null
        }
        Update: {
          businessId?: number
          cardImage?: string | null
          id?: number
          projectDescription?: string | null
          projectName?: string
          projectShortDescription?: string
          projectStatsId?: number | null
          projectStatusId?: number | null
          projectTypeId?: number | null
          publishedTime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Project_businessId_fkey"
            columns: ["businessId"]
            isOneToOne: false
            referencedRelation: "Business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Project_projectStatsId_fkey"
            columns: ["projectStatsId"]
            isOneToOne: false
            referencedRelation: "ProjectStats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Project_projectStatusId_fkey"
            columns: ["projectStatusId"]
            isOneToOne: false
            referencedRelation: "ProjectStatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Project_projectTypeId_fkey"
            columns: ["projectTypeId"]
            isOneToOne: false
            referencedRelation: "ProjectType"
            referencedColumns: ["id"]
          },
        ]
      }
      ProjectInvestmentDetail: {
        Row: {
          fundedStatusId: number | null
          id: number
          investmentDeadline: string | null
          minInvestment: number | null
          projectId: number
          targetInvestment: number | null
          totalInvestment: number | null
        }
        Insert: {
          fundedStatusId?: number | null
          id?: number
          investmentDeadline?: string | null
          minInvestment?: number | null
          projectId: number
          targetInvestment?: number | null
          totalInvestment?: number | null
        }
        Update: {
          fundedStatusId?: number | null
          id?: number
          investmentDeadline?: string | null
          minInvestment?: number | null
          projectId?: number
          targetInvestment?: number | null
          totalInvestment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ProjectInvestmentDetail_fundedStatusId_fkey1"
            columns: ["fundedStatusId"]
            isOneToOne: false
            referencedRelation: "FundedStatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ProjectInvestmentDetail_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
        ]
      }
      ProjectMaterial: {
        Row: {
          description: string | null
          id: number
          materialTypeId: number | null
          materialUrl: string | null
          projectId: number
        }
        Insert: {
          description?: string | null
          id?: number
          materialTypeId?: number | null
          materialUrl?: string | null
          projectId: number
        }
        Update: {
          description?: string | null
          id?: number
          materialTypeId?: number | null
          materialUrl?: string | null
          projectId?: number
        }
        Relationships: [
          {
            foreignKeyName: "ProjectMaterial_materialTypeId_fkey1"
            columns: ["materialTypeId"]
            isOneToOne: false
            referencedRelation: "MaterialType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ProjectMaterial_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
        ]
      }
      ProjectStats: {
        Row: {
          id: number
          lastUpdate: string | null
          pageVisitCounts: number
        }
        Insert: {
          id?: number
          lastUpdate?: string | null
          pageVisitCounts: number
        }
        Update: {
          id?: number
          lastUpdate?: string | null
          pageVisitCounts?: number
        }
        Relationships: []
      }
      ProjectStatus: {
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
      ProjectType: {
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
      Tag: {
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
