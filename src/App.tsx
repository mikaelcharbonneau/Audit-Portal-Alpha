import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import InspectionFlow from './pages/InspectionFlow';
import Inspections from './pages/Inspections';
import Confirmation from './pages/Confirmation';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import { UserProvider } from './context/UserContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';

const modernDarkTheme = {
  ...(hpe as any),
  global: {
    ...(hpe as any).global,
    colors: {
      ...(hpe as any).global.colors,
      background: {
        dark: '#181A20', // true neutral dark
        light: (hpe as any).global.colors.background?.light || '#fff',
      },
      'background-back': {
        dark: '#181A20', // main app background
        light: (hpe as any).global.colors['background-back']?.light || '#fff',
      },
      'background-front': {
        dark: '#23232b', // card/panel background, slightly lighter
        light: (hpe as any).global.colors['background-front']?.light || '#fff',
      },
      'background-contrast': {
        dark: '#23232b', // for extra contrast (optional)
        light: (hpe as any).global.colors['background-contrast']?.light || '#fff',
      },
      'background-strong': {
        dark: '#23232b',
        light: (hpe as any).global.colors['background-strong']?.light || '#fff',
      },
      'background-weak': {
        dark: '#23232b',
        light: (hpe as any).global.colors['background-weak']?.light || '#fff',
      },
      'border': {
        dark: '#353945',
        light: (hpe as any).global.colors.border?.light || '#E0E0E0',
      },
      'text': {
        dark: '#F5F6FA',
        light: (hpe as any).global.colors.text?.light || '#222',
      },
      'text-strong': {
        dark: '#fff',
        light: (hpe as any).global.colors['text-strong']?.light || '#222',
      },
      'text-weak': {
        dark: '#A3A7B0',
        light: (hpe as any).global.colors['text-weak']?.light || '#666',
      },
    },
    elevation: {
      ...(hpe as any).global.elevation,
      dark: {
        ...(hpe as any).global.elevation?.dark,
        small: '0 2px 8px 0 rgba(0,0,0,0.18)',
        medium: '0 4px 16px 0 rgba(0,0,0,0.22)',
      },
    },
    edgeSize: {
      ...(hpe as any).global.edgeSize,
      small: '8px',
      medium: '16px',
      large: '24px',
    },
    rounding: {
      ...(hpe as any).global.rounding,
      small: '12px',
      medium: '18px',
      large: '24px',
    },
  },
};

function AppContent() {
  const { darkMode } = useTheme();
  return (
    <Grommet theme={modernDarkTheme} full themeMode={darkMode ? 'dark' : 'light'}>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="inspections" element={<Inspections />} />
            <Route path="inspection" element={<InspectionFlow />} />
            <Route path="confirmation" element={<Confirmation />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserProvider>
    </Grommet>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
