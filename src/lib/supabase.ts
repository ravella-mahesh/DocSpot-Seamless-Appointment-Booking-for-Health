import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.warn('Supabase not configured. Using demo mode with mock data.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const db = {
  // User operations
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        profile:user_profiles(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Doctor operations
  async getDoctors(filters?: { specialty?: string; location?: string; search?: string }) {
    let query = supabase
      .from('doctors')
      .select(`
        *,
        user:users!doctors_user_id_fkey(
          id,
          email,
          profile:user_profiles(*)
        )
      `)
      .eq('is_approved', true)
      .eq('is_verified', true);

    if (filters?.specialty) {
      query = query.ilike('specialty', `%${filters.specialty}%`);
    }

    if (filters?.search) {
      query = query.or(`
        specialty.ilike.%${filters.search}%,
        clinic_name.ilike.%${filters.search}%,
        bio.ilike.%${filters.search}%
      `);
    }

    const { data, error } = await query.order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getDoctor(id: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        user:users!doctors_user_id_fkey(
          id,
          email,
          profile:user_profiles(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Appointment operations
  async createAppointment(appointment: Partial<any>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAppointments(userId: string, role: string) {
    const column = role === 'doctor' ? 'doctor_id' : 'patient_id';
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(
          id,
          email,
          profile:user_profiles(*)
        ),
        doctor:doctors!appointments_doctor_id_fkey(
          *,
          user:users!doctors_user_id_fkey(
            id,
            email,
            profile:user_profiles(*)
          )
        )
      `)
      .eq(column, userId)
      .order('appointment_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updateAppointment(id: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Time slot operations
  async getAvailableSlots(doctorId: string, date: string) {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .eq('is_available', true)
      .order('start_time');
    
    if (error) throw error;
    return data;
  },

  // Review operations
  async getDoctorReviews(doctorId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        patient:users!reviews_patient_id_fkey(
          profile:user_profiles(first_name, last_name)
        )
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};