import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Router from './Router';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Router />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;