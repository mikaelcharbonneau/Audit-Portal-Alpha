import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Settings, Mail, Phone, Building, Clock, Download, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Box, Spinner } from 'grommet';

interface Activity {
  id: string;
  type: 'inspection' | 'issue' | 'report';
  description: string;
  created_at: string;
}

interface UserStats {
  walkthroughs_completed: number;
  issues_resolved: number;
  reports_generated: number;
}

const Profile = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<UserStats>({
    walkthroughs_completed: 0,
    issues_resolved: 0,
    reports_generated: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchUserActivities(),
        fetchUserStats()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const fetchUserActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      setError('Failed to load activities');
    }
  };

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No stats found, use defaults
          return;
        }
        throw error;
      }
      if (data) {
        setStats(data);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics');
    }
  };

  const calculateProgressPercentage = (value: number, type: keyof UserStats) => {
    const maxValues = {
      walkthroughs_completed: 50,
      issues_resolved: 100,
      reports_generated: 30
    };
    return Math.min((value / maxValues[type]) * 100, 100);
  };

  if (!user) return null;

  if (loading) {
    return (
      <Box fill align="center" justify="center" pad="large">
        <Spinner size="medium" />
        <Box margin={{ top: 'medium' }}>
          <p className="text-gray-600">Loading profile...</p>
        </Box>
      </Box>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-6 flex items-center">
          <div className="w-24 h-24 bg-[#01A982] rounded-full flex items-center justify-center text-white text-3xl font-medium">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-semibold text-gray-900">{user.email}</h1>
            <p className="text-gray-600">Data Center Technician</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Last active: {format(new Date(), 'PPp')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity Log */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {activities.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No activities recorded yet
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="px-6 py-4">
                    <div className="flex justify-between mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.type === 'inspection' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : activity.type === 'issue'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(activity.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                ))
              )}
            </div>
            {activities.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 text-center">
                <button className="text-sm text-[#01A982] font-medium hover:text-[#018768]">
                  View All Activity
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings and Stats */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Settings</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dark Theme</span>
                <button 
                  onClick={toggleDarkMode}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01A982] ${
                    darkMode ? 'bg-[#01A982]' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span 
                    className={`inline-block w-5 h-5 transform transition-transform bg-white rounded-full ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Notifications</span>
                <button 
                  className={`relative inline-flex items-center h-6 rounded-full w-11 bg-[#01A982]`}
                >
                  <span className="sr-only">Toggle email notifications</span>
                  <span className="inline-block w-5 h-5 transform translate-x-6 bg-white rounded-full" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Push Notifications</span>
                <button 
                  className={`relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200`}
                >
                  <span className="sr-only">Toggle push notifications</span>
                  <span className="inline-block w-5 h-5 transform translate-x-1 bg-white rounded-full" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto-save Reports</span>
                <button 
                  className={`relative inline-flex items-center h-6 rounded-full w-11 bg-[#01A982]`}
                >
                  <span className="sr-only">Toggle auto-save reports</span>
                  <span className="inline-block w-5 h-5 transform translate-x-6 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Statistics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Walkthroughs Completed</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.walkthroughs_completed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#01A982] h-2 rounded-full" 
                      style={{ 
                        width: `${calculateProgressPercentage(stats.walkthroughs_completed, 'walkthroughs_completed')}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Issues Resolved</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.issues_resolved}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#425563] h-2 rounded-full" 
                      style={{ 
                        width: `${calculateProgressPercentage(stats.issues_resolved, 'issues_resolved')}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Reports Generated</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.reports_generated}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#FF8D6D] h-2 rounded-full" 
                      style={{ 
                        width: `${calculateProgressPercentage(stats.reports_generated, 'reports_generated')}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Download Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;