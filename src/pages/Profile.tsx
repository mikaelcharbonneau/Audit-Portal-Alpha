import { format } from 'date-fns';
import { Settings, Mail, Phone, Building, Clock, Download, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { currentUser } from '../data/mockData';

const ProfileActivity = [
  { type: 'inspection', date: '2023-04-15', description: 'Completed walkthrough of Data Center A' },
  { type: 'issue', date: '2023-04-12', description: 'Resolved cooling issue in Rack B3' },
  { type: 'report', date: '2023-04-10', description: 'Generated monthly report for Data Center B' },
  { type: 'inspection', date: '2023-04-08', description: 'Started walkthrough of Data Center C' },
  { type: 'issue', date: '2023-04-05', description: 'Identified network issue in Rack D1' },
  { type: 'inspection', date: '2023-04-01', description: 'Completed walkthrough of Data Center B' },
];

const Profile = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const user = currentUser;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="h-12 md:h-16 bg-emerald-50"></div>
        
        <div className="px-6 pb-6 pt-16 md:pt-0 md:flex relative">
          {/* Avatar */}
          <div className="absolute -top-16 md:relative md:-top-12 md:mr-6">
            <div className="relative group w-32 h-32">
              <div className="avatar w-full h-full border-4 border-white text-white bg-emerald-500 text-4xl overflow-hidden">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Info */}
          <div className="md:flex-1 md:pt-12">
            <h1 className="text-2xl font-bold text-emerald-700 mb-1">
              {user.name}
            </h1>
            <p className="text-emerald-600 mb-4">
              {user.role}
            </p>
            
            <div className="space-y-2 max-w-md">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-emerald-500 mr-2" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-emerald-500 mr-2" />
                <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-emerald-500 mr-2" />
                <span className="text-sm text-gray-600">Data Center Operations</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-emerald-500 mr-2" />
                <span className="text-sm text-gray-600">Last active: Today at 10:45 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity Log */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-emerald-700">Activity Log</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {ProfileActivity.map((activity, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex justify-between mb-1">
                    <span 
                      className={`chip ${
                        activity.type === 'inspection' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : activity.type === 'issue' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(activity.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 text-center">
              <button className="text-sm text-emerald-500 font-medium hover:text-emerald-600">
                View All Activity
              </button>
            </div>
          </div>
        </div>
        
        {/* Settings and Stats */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-emerald-700">Settings</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dark Theme</span>
                <button 
                  onClick={toggleDarkMode}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${darkMode ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span 
                    className={`inline-block w-5 h-5 transform transition-transform bg-white rounded-full ${darkMode ? 'translate-x-6' : 'translate-x-1'} flex items-center justify-center`}
                  >
                    {darkMode ? (
                      <Moon size={12} className="text-emerald-600" />
                    ) : (
                      <Sun size={12} className="text-emerald-600" />
                    )}
                  </span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Notifications</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="toggle-1" 
                    defaultChecked 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-1" 
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Push Notifications</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="toggle-2" 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-2" 
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto-save Reports</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="toggle-3"
                    defaultChecked 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-3" 
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-emerald-700">Statistics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Walkthroughs Completed</span>
                    <span className="text-sm font-medium text-emerald-700">28</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Issues Resolved</span>
                    <span className="text-sm font-medium text-emerald-700">42</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Reports Generated</span>
                    <span className="text-sm font-medium text-emerald-700">15</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-colors rounded-md py-2 px-4 text-sm flex items-center justify-center">
                <Download className="h-4 w-4 mr-1" />
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