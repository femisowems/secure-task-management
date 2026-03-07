import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { APP_CONFIG } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const config = inject(APP_CONFIG);
    this.supabase = createClient(
      config.supabase.url,
      config.supabase.key,
    );
  }

  get client() {
    return this.supabase;
  }

  get auth(): SupabaseClient['auth'] {
    return this.supabase.auth;
  }
}