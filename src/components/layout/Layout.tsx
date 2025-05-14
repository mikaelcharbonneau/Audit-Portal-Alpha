import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';
import { Box } from 'grommet';

const Layout = () => {
  const { darkMode } = useTheme();
  
  return (
    <Box fill direction="column" background={darkMode ? 'background-back' : 'background-front'}>
      <Header />
      <Box 
        as="main" 
        flex 
        overflow="auto"
        background={darkMode ? 'background-back' : 'background-front'}
      >
        <Box
          width={{ max: 'xxlarge' }}
          margin="auto"
          pad={{ horizontal: 'medium' }}
          fill
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;