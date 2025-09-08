import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { Home, Inventory, Assignment, People } from '@mui/icons-material';
import { Link, useRouterState } from '@tanstack/react-router';

const navigationItems = [
  { label: 'ダッシュボード', path: '/', icon: <Home /> },
  { label: '在庫管理', path: '/stocks', icon: <Inventory /> },
  { label: '顧客管理', path: '/customers', icon: <People /> },
  { label: '販売管理', path: '/sales', icon: <Assignment /> },
];

const Sidebar = () => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#1a1a1a',
          }}
        >
          リユース管理システム
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#e8e8e8' }} />
      <List sx={{ pt: 2 }}>
        {navigationItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <ListItem key={item.label} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? '#e3f2fd' : '#f0f4ff',
                    '& .MuiListItemIcon-root': {
                      color: '#1976d2',
                    },
                    '& .MuiListItemText-primary': {
                      color: '#1976d2',
                      fontWeight: 600,
                    },
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? '#1976d2' : '#666',
                    transition: 'color 0.2s ease',
                  },
                  '& .MuiListItemText-primary': {
                    color: isActive ? '#1976d2' : 'inherit',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          position: 'relative',
          border: 'none',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
