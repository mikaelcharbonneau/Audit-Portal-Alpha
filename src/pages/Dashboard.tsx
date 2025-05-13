import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface Inspection {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: {
    datahall: string;
    status: string;
    isUrgent: boolean;
    [key: string]: any;
  };
}

const dataHalls = [
  'Island 1',
  'Island 8',
  'Island 9',
  'Island 10',
  'Island 11',
  'Island 12',
  'Green Nitrogen'
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchInspections();
  }, []);

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
    active: inspections.filter(i => i.ReportData.isUrgent).length,
    resolved: inspections.filter(i => !i.ReportData.isUrgent).length
  };

  const handleDataHallSelect = (datahall: string) => {
    navigate('/inspection', { state: { selectedDataHall: datahall } });
    setShowDropdown(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {inspections[0]?.UserEmail || 'User'}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600"
          >
            <ClipboardList className="w-5 h-5" />
            Start Walkthrough
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50">
              {dataHalls.map((hall) => (
                <button
                  key={hall}
                  onClick={() => handleDataHallSelect(hall)}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                >
                  {hall}
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
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/reports/${inspection.Id}`)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  inspection.ReportData.isUrgent ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {inspection.ReportData.isUrgent ? 'Urgent' : 'Normal'}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(inspection.Timestamp), 'MMM d, yyyy')}
                </span>
              </div>
              <p className="font-medium mb-1">{inspection.ReportData.datahall}</p>
              <p className="text-sm text-gray-600">
                {inspection.ReportData.isUrgent ? 'Issues reported' : 'No issues reported'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Reports</h2>
          <button
            onClick={() => navigate('/reports')}
            className="text-emerald-500 hover:text-emerald-600"
          >
            View All
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {inspections.slice(0, 3).map((inspection) => (
            <div
              key={inspection.Id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/reports/${inspection.Id}`)}
            >
              <div 
                className="relative h-48 bg-cover bg-center"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg)`,
                }}
              >
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-medium text-white mb-2">
                    Daily Issue Report - {format(new Date(inspection.Timestamp), 'MMM do yyyy')}
                  </h3>
                  <p className="text-sm text-gray-200">{inspection.ReportData.datahall}</p>
                </div>
              </div>
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-4 text-sm text-gray-600">
                  <button className="hover:text-emerald-600 transition-colors">View</button>
                  <button className="hover:text-emerald-600 transition-colors">Download</button>
                  <button className="hover:text-emerald-600 transition-colors">Share</button>
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