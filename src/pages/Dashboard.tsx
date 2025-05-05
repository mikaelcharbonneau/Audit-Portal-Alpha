import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import StatusCard from '../components/dashboard/StatusCard';
import InspectionCard from '../components/dashboard/InspectionCard';
import ReportCard from '../components/dashboard/ReportCard';
import { currentUser, recentInspections, reports, issues } from '../data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const completedInspections = recentInspections.filter(i => i.status === 'completed').length;
  const activeIssues = issues.filter(i => i.status === 'open' || i.status === 'in-progress').length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-hpe-blue-700">Dashboard</h1>
          <p className="text-hpe-blue-500 mt-1">
            Welcome back, {currentUser.name}
          </p>
        </div>
        <button
          onClick={() => navigate('/inspection')}
          className="btn-primary mt-4 sm:mt-0"
        >
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Start Walkthrough
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatusCard
          title="Completed Walkthroughs"
          count={completedInspections}
          icon={<ClipboardCheck className="h-6 w-6 text-white" />}
          color="bg-hpe-green"
          onClick={() => navigate('/reports')}
        />
        <StatusCard
          title="Active Issues"
          count={activeIssues}
          icon={<AlertCircle className="h-6 w-6 text-white" />}
          color="bg-hpe-warning"
          onClick={() => navigate('/reports')}
        />
        <StatusCard
          title="Resolved Issues"
          count={resolvedIssues}
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          color="bg-hpe-blue-500"
          onClick={() => navigate('/reports')}
        />
      </div>

      {/* Recent Inspections */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Inspections</h2>
          <button
            onClick={() => navigate('/reports')}
            className="text-sm text-hpe-green hover:text-hpe-green-600 font-medium flex items-center"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentInspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </div>
      </div>

      {/* Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Reports</h2>
          <button
            onClick={() => navigate('/reports')}
            className="text-sm text-hpe-green hover:text-hpe-green-600 font-medium flex items-center"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;