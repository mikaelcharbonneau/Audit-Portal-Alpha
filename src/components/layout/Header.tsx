import { Link, useLocation } from 'react-router-dom';
import { Bell, Home, Clipboard, BarChart } from 'lucide-react';
import HPELogo from '../ui/HPELogo';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { Header as GrommetHeader, Box, Nav, Button, Text, ResponsiveContext } from 'grommet';
import { useContext } from 'react';

const Header = () => {
  const location = useLocation();
  const { darkMode } = useTheme();
  const { user } = useUser();
  const size = useContext(ResponsiveContext);

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/inspections', icon: <Clipboard size={20} />, label: 'Inspections' },
    { path: '/reports', icon: <BarChart size={20} />, label: 'Reports' },
  ];

  const isActive = (path: string) => location.pathname === path;

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
          basis="1/4"
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <HPELogo height={32} />
            <Text margin={{ left: 'small' }} weight="bold" color="text-strong">
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
          basis="1/4" 
          justify="end"
          gap="small"
        >
          <Button 
            plain 
            icon={<Bell size={20} />} 
            a11yTitle="Notifications" 
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