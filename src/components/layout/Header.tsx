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
      pad={{ vertical: 'small' }} 
      elevation="small"
    >
      <Box
        direction="row"
        align="center"
        justify="between"
        width={{ max: 'xxlarge' }}
        margin="auto"
        pad={{ horizontal: 'medium' }}
        fill="horizontal"
      >
        {/* Logo Section */}
        <Box 
          direction="row" 
          align="center"
          gap="medium"
          flex={false}
        >
          <Box width="32px" height="32px">
            <HPELogo height={32} />
          </Box>
          <Text weight="bold" color="text-strong">
            Walkthrough App
          </Text>
        </Box>

        {/* Navigation Section */}
        {size !== 'small' && (
          <Box flex="grow" align="center">
            <Nav direction="row" gap="medium">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    direction="row"
                    align="center"
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
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

        {/* Actions Section */}
        <Box 
          direction="row" 
          align="center" 
          gap="small"
          flex={false}
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
    </GrommetHeader>
  );
};

export default Header;