import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Home, Clipboard, AlertTriangle, BarChart, User, LogOut } from 'lucide-react';
import HPELogo from '../ui/HPELogo';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Header as GrommetHeader, Box, Nav, Button, Text, ResponsiveContext, Menu } from 'grommet';
import { useContext } from 'react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user, logout } = useAuth();
  const size = useContext(ResponsiveContext);

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/inspections', icon: <Clipboard size={20} />, label: 'Audits' },
    { path: '/incidents', icon: <AlertTriangle size={20} />, label: 'Incidents' },
    { path: '/reports', icon: <BarChart size={20} />, label: 'Reports' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <GrommetHeader 
      background={darkMode ? 'background-back' : 'background-front'} 
      pad={{ horizontal: 'medium', vertical: 'small' }} 
      elevation="small"
    >
      <Box 
        direction="row" 
        align="center" 
        justify="between"
        fill="horizontal"
        gap="medium"
      >
        {/* Logo Section */}
        <Box 
          direction="row" 
          align="center" 
          gap="small"
          width={{ min: 'auto' }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <Box width="40px" height="40px">
              <HPELogo height={40} />
            </Box>
            <Text weight="bold" color="text-strong" size="medium">
              Walkthrough App
            </Text>
          </Link>
        </Box>

        {/* Navigation Section */}
        <Box 
          flex="grow" 
          align="center" 
          justify="center"
        >
          {size !== 'small' && (
            <Nav 
              direction="row" 
              gap="medium"
            >
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    direction="row"
                    align="center"
                    pad={{ horizontal: 'medium', vertical: 'xsmall' }}
                    background={isActive(item.path) ? { color: 'brand', opacity: 'weak' } : undefined}
                    round="small"
                    gap="small"
                  >
                    {item.icon}
                    <Text 
                      color={isActive(item.path) ? 'brand' : 'text'} 
                      weight={isActive(item.path) ? 'bold' : undefined}
                    >
                      {item.label}
                    </Text>
                  </Box>
                </Link>
              ))}
            </Nav>
          )}
        </Box>

        {/* Actions Section */}
        <Box 
          direction="row" 
          align="center" 
          gap="small"
          width={{ min: 'auto' }}
        >
          <Button 
            plain 
            icon={<Bell size={20} />} 
            a11yTitle="Notifications" 
          />
          <Menu
            icon={<User size={20} />}
            items={[
              { label: 'Profile', onClick: () => navigate('/profile') },
              { label: 'Sign Out', onClick: handleLogout }
            ]}
          />
        </Box>
      </Box>

      {/* Mobile Navigation */}
      {size === 'small' && (
        <Box 
          direction="row" 
          gap="small" 
          margin={{ top: 'small' }} 
          justify="center"
          overflow="auto"
        >
          <Nav direction="row" gap="small">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ textDecoration: 'none' }}
              >
                <Box
                  direction="row"
                  align="center"
                  pad={{ horizontal: 'medium', vertical: 'xsmall' }}
                  background={isActive(item.path) ? { color: 'brand', opacity: 'weak' } : undefined}
                  round="small"
                  gap="small"
                >
                  {item.icon}
                  <Text 
                    color={isActive(item.path) ? 'brand' : 'text'} 
                    weight={isActive(item.path) ? 'bold' : undefined}
                  >
                    {item.label}
                  </Text>
                </Box>
              </Link>
            ))}
          </Nav>
        </Box>
      )}
    </GrommetHeader>
  );
};

export default Header;