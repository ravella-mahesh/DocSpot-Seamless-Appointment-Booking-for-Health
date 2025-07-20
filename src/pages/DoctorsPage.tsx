import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign,
  Calendar,
  ChevronDown,
  Heart,
  Award,
  Users
} from 'lucide-react';
import { db } from '../lib/supabase';
import { Doctor } from '../types';

const DoctorsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [showFilters, setShowFilters] = useState(false);

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Neurology',
    'Psychiatry',
    'Gynecology',
    'Ophthalmology',
    'Endocrinology',
    'Gastroenterology',
    'Pulmonology',
  ];

  const locations = [
    'All Locations',
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA',
  ];

  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, selectedSpecialty, selectedLocation]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      
      if (selectedSpecialty && selectedSpecialty !== 'All Specialties') {
        filters.specialty = selectedSpecialty;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }

      const data = await db.getDoctors(filters);
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedSpecialty && selectedSpecialty !== 'All Specialties') {
      params.set('specialty', selectedSpecialty);
    }
    if (selectedLocation && selectedLocation !== 'All Locations') {
      params.set('location', selectedLocation);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('');
    setSelectedLocation('');
    setSearchParams({});
  };

  // Mock data for demonstration
  const mockDoctors: Doctor[] = [
    {
      id: '1',
      user_id: '1',
      license_number: 'MD123456',
      specialty: 'Cardiology',
      years_of_experience: 15,
      education: 'Harvard Medical School',
      consultation_fee: 200,
      bio: 'Experienced cardiologist specializing in preventive cardiology and heart disease management.',
      clinic_name: 'Heart Care Center',
      clinic_address: '123 Medical Plaza, New York, NY',
      clinic_phone: '+1 (555) 123-4567',
      rating: 4.9,
      total_reviews: 127,
      is_verified: true,
      is_approved: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      user: {
        id: '1',
        email: 'dr.wilson@example.com',
        role: 'doctor' as const,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        profile: {
          id: '1',
          user_id: '1',
          first_name: 'Sarah',
          last_name: 'Wilson',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        }
      }
    },
    {
      id: '2',
      user_id: '2',
      license_number: 'MD789012',
      specialty: 'Dermatology',
      years_of_experience: 12,
      education: 'Johns Hopkins University',
      consultation_fee: 180,
      bio: 'Board-certified dermatologist with expertise in medical and cosmetic dermatology.',
      clinic_name: 'Skin Health Clinic',
      clinic_address: '456 Wellness Ave, Los Angeles, CA',
      clinic_phone: '+1 (555) 987-6543',
      rating: 4.8,
      total_reviews: 89,
      is_verified: true,
      is_approved: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      user: {
        id: '2',
        email: 'dr.chen@example.com',
        role: 'doctor' as const,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        profile: {
          id: '2',
          user_id: '2',
          first_name: 'Michael',
          last_name: 'Chen',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        }
      }
    },
    {
      id: '3',
      user_id: '3',
      license_number: 'MD345678',
      specialty: 'Pediatrics',
      years_of_experience: 8,
      education: 'Stanford Medical School',
      consultation_fee: 150,
      bio: 'Compassionate pediatrician dedicated to providing comprehensive care for children.',
      clinic_name: 'Children\'s Health Center',
      clinic_address: '789 Family Dr, Chicago, IL',
      clinic_phone: '+1 (555) 456-7890',
      rating: 4.9,
      total_reviews: 156,
      is_verified: true,
      is_approved: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      user: {
        id: '3',
        email: 'dr.rodriguez@example.com',
        role: 'doctor' as const,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        profile: {
          id: '3',
          user_id: '3',
          first_name: 'Maria',
          last_name: 'Rodriguez',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        }
      }
    },
  ];

  const displayDoctors = doctors.length > 0 ? doctors : mockDoctors;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Doctor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our network of verified healthcare professionals and book your appointment today.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors, specialties, or conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty === 'All Specialties' ? '' : specialty}>
                    {specialty}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {locations.map((location) => (
                  <option key={location} value={location === 'All Locations' ? '' : location}>
                    {location}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="btn-primary px-8 py-3 whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* Active Filters */}
          {(searchTerm || selectedSpecialty || selectedLocation) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Search: {searchTerm}
                </span>
              )}
              {selectedSpecialty && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  {selectedSpecialty}
                </span>
              )}
              {selectedLocation && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  {selectedLocation}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {loading ? 'Loading...' : `${displayDoctors.length} doctors found`}
          </h2>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDoctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {doctor.user?.profile?.first_name} {doctor.user?.profile?.last_name}
                      </h3>
                      <p className="text-primary-600 font-medium">{doctor.specialty}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{doctor.years_of_experience} years experience</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{doctor.clinic_address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({doctor.total_reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>${doctor.consultation_fee}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {doctor.bio}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-green-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Available Today</span>
                  </div>
                  
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors group-hover:shadow-md"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && displayDoctors.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all available doctors.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;