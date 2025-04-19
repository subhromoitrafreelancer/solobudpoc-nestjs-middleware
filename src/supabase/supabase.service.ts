import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;
  private supabaseAdminClient: SupabaseClient;
  
  constructor(private configService: ConfigService) {
    // Create regular Supabase client with anon key
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Create admin client with service role key
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!serviceRoleKey) {
      throw new Error('Missing Supabase service role key');
    }
    
    this.supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey);
  }
  
  /**
   * Get the Supabase client with the anonymous key
   */
  getClient(): SupabaseClient {
    return this.supabaseClient;
  }
  
  /**
   * Get the Supabase admin client with the service role key
   * Use with caution as this bypasses RLS policies
   */
  getAdminClient(): SupabaseClient {
    return this.supabaseAdminClient;
  }
}