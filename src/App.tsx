import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Inspections from './pages/Inspections';
import InspectionFlow from './pages/InspectionFlow';
import Confirmation from './pages/Confirmation';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Grommet theme={hpe} full>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="inspections" element={<Inspections />} />
              <Route path="inspection" element={<InspectionFlow />} />
              <Route path="confirmation" element={<Confirmation />} />
              <Route path="reports/:id" element={<Reports />} />
              <Route path="not-found" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Route>
          </Routes>
        </Grommet>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;