import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { locations } from '../utils/locationMapping';

interface Inspection {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: {
    location: string;
    datahall: string;
    issueCount: number;
    criticality: 'low' | 'medium' | 'high' | 'critical';
    ticketId?: string;
    userFullName: string;
    [key: string]: any;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [userFullName, setUserFullName] = useState<string>('');

  useEffect(() => {
    fetchInspections();
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setUserFullName(data.full_name);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchInspections = async () => {
    try {
      const { data } = await supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false });
      setInspections(data || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    completed: inspections.length,
    active: inspections.filter(i => i.ReportData.issueCount > 0).length,
    resolved: inspections.filter(i => i.ReportData.issueCount === 0).length
  };

  const handleLocationSelect = (location: string) => {
    navigate('/inspection', { 
      state: { selectedLocation: location }
    });
    setShowLocationDropdown(false);
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userFullName || 'User'}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600"
          >
            <ClipboardList className="w-5 h-5" />
            Start Walkthrough
            <ChevronDown className={`w-4 h-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showLocationDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-50">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <ClipboardList className="w-8 h-8 text-emerald-500" />
            <span className="text-sm text-gray-500 cursor-pointer">View all</span>
          </div>
          <h3 className="font-medium mb-2">Completed Walkthroughs</h3>
          <p className="text-3xl font-semibold">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <span className="text-sm text-gray-500 cursor-pointer">View all</span>
          </div>
          <h3 className="font-medium mb-2">Active Issues</h3>
          <p className="text-3xl font-semibold">{stats.active}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-slate-600" />
            <span className="text-sm text-gray-500 cursor-pointer">View all</span>
          </div>
          <h3 className="font-medium mb-2">Resolved Issues</h3>
          <p className="text-3xl font-semibold">{stats.resolved}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Recent Inspections</h2>
          <button
            onClick={() => navigate('/inspections')}
            className="text-emerald-500 hover:text-emerald-600"
          >
            View All
          </button>
        </div>
        <div className="grid gap-4">
          {inspections.slice(0, 4).map((inspection) => (
            <div
              key={inspection.Id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Datacenter</p>
                  <p className="font-medium">{inspection.ReportData.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data Hall</p>
                  <p className="font-medium">{inspection.ReportData.datahall}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issues Reported</p>
                  <p className="font-medium">{inspection.ReportData.issueCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Criticality</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    getCriticalityColor(inspection.ReportData.criticality)
                  }`}>
                    {inspection.ReportData.criticality || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Ticket</p>
                  <p className="font-medium">
                    {inspection.ReportData.ticketId || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inspector</p>
                  <p className="font-medium">{inspection.ReportData.userFullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {format(new Date(inspection.Timestamp), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;