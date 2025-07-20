import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Bell,
  Plus,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Stethoscope,
  MapPin,
  Phone
} from 'lucide-react';
import { db } from '../lib/supabase';
import { Appointment } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await db.getAppointments(user.id, user.role);
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      patient_id: user?.role === 'patient' ? user.id : 'patient1',
      doctor_id: user?.role === 'doctor' ? user.id : 'doctor1',
      appointment_date: '2024-01-15',
      appointment_time: '10:00',
      duration: 30,
      status: 'confirmed',
      reason_for_visit: 'Regular checkup',
      created_at: '2024-01-10',
      updated_at: '2024-01-10',
      patient: user?.role === 'doctor' ? {
        id: 'patient1',
        email: 'john@example.com',
        role: 'patient' as const,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        profile: {
          id: 'profile1',
          user_id: 'patient1',
          first_name: 'John',
          last_name: 'Doe',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        }
      } : undefined,
      doctor: user?.role === 'patient' ? {
        id: 'doctor1',
        user_id: 'doctor1',
        license_number: 'MD123456',
        specialty: 'Cardiology',
        years_of_experience: 15,
        education: 'Harvard Medical School',
        consultation_fee: 200,
        clinic_name: 'Heart Care Center',
        rating: 4.9,
        total_reviews: 127,
        is_verified: true,
        is_approved: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        user: {
          id: 'doctor1',
          email: 'dr.wilson@example.com',
          role: 'doctor' as const,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          profile: {
            id: 'profile2',
            user_id: 'doctor1',
            first_name: 'Sarah',
            last_name: 'Wilson',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          }
        }
      } : undefined,
    },
    {
      id: '2',
      patient_id: user?.role === 'patient' ? user.id : 'patient2',
      doctor_id: user?.role === 'doctor' ? user.id : 'doctor2',
      appointment_date: '2024-01-20',
      appointment_time: '14:30',
      duration: 45,
      status: 'pending',
      reason_for_visit: 'Follow-up consultation',
      created_at: '2024-01-12',
      updated_at: '2024-01-12',
      patient: user?.role === 'doctor' ? {
        id: 'patient2',
        email: 'jane@example.com',
        role: 'patient' as const,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        profile: {
          id: 'profile3',
          user_id: 'patient2',
          first_name: 'Jane',
          last_name: 'Smith',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        }
      } : undefined,
      doctor: user?.role === 'patient' ? {
        id: 'doctor2',
        user_id: 'doctor2',
        license_number: 'MD789012',
        specialty: 'Dermatology',
        years_of_experience: 12,
        education: 'Johns Hopkins University',
        consultation_fee: 180,
        clinic_name: 'Skin Health Clinic',
        rating: 4.8,
        total_reviews: 89,
        is_verified: true,
        is_approved: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        user: {
          id: 'doctor2',
          email: 'dr.chen@example.com',
          role: 'doctor' as const,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          profile: {
            id: 'profile4',
            user_id: 'doctor2',
            first_name: 'Michael',
            last_name: 'Chen',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          }
        }
      } : undefined,
    },
  ];

  const displayAppointments = appointments.length > 0 ? appointments : mockAppointments;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = displayAppointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const stats = [
    {
      title: 'Total Appointments',
      value: displayAppointments.length,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Confirmed',
      value: displayAppointments.filter(a => a.status === 'confirmed').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Pending',
      value: displayAppointments.filter(a => a.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+3%',
    },
    {
      title: user?.role === 'doctor' ? 'Patients' : 'Doctors',
      value: user?.role === 'doctor' ? '45' : '12',
      icon: Users,
      color: 'bg-purple-500',
      change: '+15%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.profile?.first_name || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'doctor' 
                  ? 'Manage your appointments and patient care'
                  : 'Track your appointments and health journey'
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              {user?.role === 'patient' && (
                <button className="btn-primary flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Appointments Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.role === 'doctor' ? 'Patient Appointments' : 'My Appointments'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                        {user?.role === 'doctor' ? (
                          <User className="h-6 w-6 text-primary-600" />
                        ) : (
                          <Stethoscope className="h-6 w-6 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user?.role === 'doctor' 
                            ? `${appointment.patient?.profile?.first_name} ${appointment.patient?.profile?.last_name}`
                            : `Dr. ${appointment.doctor?.user?.profile?.first_name} ${appointment.doctor?.user?.profile?.last_name}`
                          }
                        </h3>
                        <p className="text-sm text-gray-600">
                          {user?.role === 'doctor' 
                            ? appointment.reason_for_visit
                            : appointment.doctor?.specialty
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.appointment_time}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {getStatusIcon(appointment.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>

                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {user?.role === 'patient' && appointment.doctor && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{appointment.doctor.clinic_address}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{appointment.doctor.clinic_phone}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-600 mb-6">
                    {filter === 'all' 
                      ? "You don't have any appointments yet."
                      : `No ${filter} appointments found.`
                    }
                  </p>
                  {user?.role === 'patient' && (
                    <button className="btn-primary">
                      Book Your First Appointment
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;