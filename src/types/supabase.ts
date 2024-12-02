export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          terms_accepted_at: string;
          role_id: number;
          is_active: boolean;
          space_limit: number;
          status: string;
          created_at: string;
          // ... other fields
        };
        Insert: {
          email: string;
          terms_accepted_at: string;
          role_id: number;
          is_active: boolean;
          space_limit: number;
          status: string;
          created_at: string;
        };
      };
      user_register: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          name: string;
          phone_number: string;
          ip_address: string | null;
          conversation: Json;
          status: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          user_id: string;
          email: string;
          name: string;
          phone_number: string;
          ip_address?: string;
          conversation: Json;
          status: string;
          created_at: string;
          updated_at?: string;
        };
      };
    };
  };
}
