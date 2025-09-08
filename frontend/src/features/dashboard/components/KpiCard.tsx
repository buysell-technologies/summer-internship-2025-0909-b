import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
  Download,
} from '@mui/icons-material';
import { useState, useCallback } from 'react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  valueColor?: string;
  csvData?: string;
  csvFilename?: string;
}

const KpiCard = ({
  title,
  value,
  trend,
  valueColor = '#1a1a1a',
  csvData,
  csvFilename = 'kpi.csv',
}: KpiCardProps) => {
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const open = Boolean(menuEl);
  const handleMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setMenuEl(e.currentTarget);
    },
    [],
  );
  const handleMenuClose = useCallback(() => setMenuEl(null), []);
  const handleDownloadCsv = useCallback(() => {
    if (!csvData) return;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = csvFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    handleMenuClose();
  }, [csvData, csvFilename, handleMenuClose]);
  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e0e0e0',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Box sx={{ color: '#666', opacity: 0.7 }}>
            <IconButton
              aria-label="more actions"
              size="small"
              onClick={handleMenuOpen}
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={menuEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleDownloadCsv} disabled={!csvData}>
                <Download sx={{ mr: 1, fontSize: 18 }} /> CSVをダウンロード
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Typography
          variant="h3"
          component="div"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem' },
            fontWeight: 700,
            color: valueColor,
            mb: trend ? 1 : 0,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend.isPositive ? (
              <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: trend.isPositive ? '#4caf50' : '#f44336',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {trend.value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#999',
                fontSize: '0.75rem',
                ml: 0.5,
              }}
            >
              {trend.label}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
