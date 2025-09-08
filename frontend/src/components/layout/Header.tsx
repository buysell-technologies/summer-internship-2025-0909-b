import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';

import { AccountCircle, Translate, Public } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';
import { TIMEZONE } from '../../constants/timezones';
import { LOCALE } from '../../constants/locales';
import { useI18n } from '../../providers/I18nProvider';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { setLocale, setTimezone, locale, timezone } = useI18n();
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const timezoneButtonRef = useRef<HTMLButtonElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: '100vw',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
          リユース管理システム
        </Typography>

        <Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            ref={accountButtonRef}
          >
            <AccountCircle />
          </IconButton>
          <IconButton
            size="large"
            aria-label="language of current user"
            aria-controls="menu-language"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            ref={languageButtonRef}
          >
            <Translate />
          </IconButton>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-timezone"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            ref={timezoneButtonRef}
          >
            <Public />
          </IconButton>
        </Box>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl?.contains(accountButtonRef.current))}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              navigate({ to: '/profile' });
              handleClose();
            }}
          >
            プロファイル
          </MenuItem>
          <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
        </Menu>
        <Menu
          id="menu-language"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl?.contains(languageButtonRef.current))}
          onClose={handleClose}
        >
          {Object.values(LOCALE).map((item) => (
            <MenuItem
              key={item}
              value={item}
              selected={locale === item}
              onClick={() => {
                setLocale(item);
                handleClose();
              }}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>
        <Menu
          id="menu-timezone"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl?.contains(timezoneButtonRef.current))}
          onClose={handleClose}
        >
          {Object.values(TIMEZONE).map((item) => (
            <MenuItem
              key={item}
              value={item}
              onClick={() => {
                setTimezone(item);
                handleClose();
              }}
              selected={timezone === item}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
