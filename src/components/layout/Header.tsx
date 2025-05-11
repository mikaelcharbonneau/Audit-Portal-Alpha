import { Link, useLocation } from 'react-router-dom';
import { Bell, Home, Clipboard, BarChart, Settings, LogOut } from 'lucide-react';
import HPELogo from '../ui/HPELogo';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { Header as GrommetHeader, Box, Nav, Button, Avatar, Text, ResponsiveContext, DropButton } from 'grommet';
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

  const userAvatar = (
    <Avatar background="brand" src={user.avatarUrl} size="medium">
      {!user.avatarUrl && user.name.charAt(0)}
    </Avatar>
  );

  return (
    <GrommetHeader background={darkMode ? 'background-back' : 'background-front'} pad={{ horizontal: 'xlarge', vertical: 'small' }} elevation="small">
      <Box direction="row" align="center" fill="horizontal">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <HPELogo height={32} />
          <Text margin={{ left: 'small' }} weight="bold" color="text-strong" size="large">Walkthrough App</Text>
        </Link>
        <Box flex="grow" justify="center" direction="row">
          {size !== 'small' && (
            <Nav direction="row" gap="small">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                  <Box
                    direction="row"
                    align="center"
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    background={isActive(item.path) ? { color: 'brand', opacity: 'weak' } : undefined}
                    round="small"
                    gap="xsmall"
                  >
                    {item.icon}
                    <Text color={isActive(item.path) ? 'brand' : 'text'} weight={isActive(item.path) ? 'bold' : undefined}>
                      {item.label}
                    </Text>
                  </Box>
                </Link>
              ))}
            </Nav>
          )}
        </Box>
        <Box direction="row" align="center" gap="small">
          <Button plain icon={<Bell size={20} />} a11yTitle="Notifications" />
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }}>
            <Box pad="xsmall" round="full" hoverIndicator>
              <Settings size={20} />
            </Box>
          </Link>
          <DropButton
            dropAlign={{ top: 'bottom', right: 'right' }}
            icon={userAvatar}
            label={<Text size="small">{user.name}</Text>}
            dropContent={
              <Box pad="small" background="background-front" gap="small">
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <Text>Profile</Text>
                </Link>
                <Button onClick={() => signOut()} label="Logout" icon={<LogOut size={18} />} plain />
              </Box>
            }
          />
        </Box>
      </Box>
      {size === 'small' && (
        <Box direction="row" gap="xsmall" margin={{ top: 'small' }} overflow="auto">
          <Nav direction="row" gap="xsmall">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <Box
                  direction="row"
                  align="center"
                  pad={{ horizontal: 'small', vertical: 'xsmall' }}
                  background={isActive(item.path) ? { color: 'brand', opacity: 'weak' } : undefined}
                  round="small"
                  gap="xsmall"
                >
                  {item.icon}
                  <Text color={isActive(item.path) ? 'brand' : 'text'} weight={isActive(item.path) ? 'bold' : undefined}>
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