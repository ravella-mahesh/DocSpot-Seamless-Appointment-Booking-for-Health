export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  profile: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact?: string;
  insurance_provider?: string;
  insurance_number?: string;
  medical_history?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  license_number: string;
  specialty: string;
  sub_specialty?: string;
  years_of_experience: number;
  education: string;
  certifications?: string[];
  languages?: string[];
  consultation_fee: number;
  bio?: string;
  clinic_name?: string;
  clinic_address?: string;
  clinic_phone?: string;
  availability_hours?: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  reason_for_visit: string;
  notes?: string;
  prescription?: string;
  follow_up_date?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
  patient?: User;
  doctor?: Doctor;
}

export interface TimeSlot {
  id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  patient?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'system' | 'promotion';
  is_read: boolean;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}