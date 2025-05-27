import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Incidents from './pages/Incidents';
import Inspections from './pages/Inspections';
import InspectionFlow from './pages/InspectionFlow';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/inspections" element={<Inspections />} />
        <Route path="/inspection-flow" element={<InspectionFlow />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;