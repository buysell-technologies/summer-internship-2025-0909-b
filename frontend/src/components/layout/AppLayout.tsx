import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { AuthProvider } from '../../hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <AuthProvider>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Header />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#ffffff',
            marginTop: '64px',
            minWidth: 0,
            width: 'calc(100vw - 250px)',
            maxWidth: 'calc(100vw - 250px)',
            position: 'relative',
            borderLeft: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthProvider>
  );
};

export default AppLayout;
