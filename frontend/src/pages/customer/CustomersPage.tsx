import { useState, useEffect } from 'react';
import { useGetCustomers } from '../../api/generated/api';
import CustomerTable from '../../features/customer/components/CustomerTable';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

type CustomerPageSettings = {
  rowsPerPage: number;
  lastUpdated?: string;
};

const CUSTOMER_PAGE_SETTINGS_STORAGE_KEY = 'customer_page_settings';

const DEFAULT_SETTINGS: CustomerPageSettings = {
  rowsPerPage: 10,
};

const VALID_PAGE_SIZES = [5, 10, 25, 50, 100] as const;
type ValidPageSize = (typeof VALID_PAGE_SIZES)[number];

const CustomersPage = () => {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState<number>(() => {
    const stored = localStorage.getItem(CUSTOMER_PAGE_SETTINGS_STORAGE_KEY)!;
    const parsed = JSON.parse(stored) as CustomerPageSettings;
    if (
      typeof parsed.rowsPerPage === 'number' &&
      VALID_PAGE_SIZES.includes(parsed.rowsPerPage as ValidPageSize)
    ) {
      return parsed.rowsPerPage;
    }
    return DEFAULT_SETTINGS.rowsPerPage;
  });

  const { data, isLoading, error, refetch } = useGetCustomers({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
  });

  useEffect(() => {
    const settings: CustomerPageSettings = {
      rowsPerPage,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(
      CUSTOMER_PAGE_SETTINGS_STORAGE_KEY,
      JSON.stringify(settings),
    );
  }, [rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && VALID_PAGE_SIZES.includes(value as ValidPageSize)) {
      setRowsPerPage(value);
      setPage(0);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && VALID_PAGE_SIZES.includes(value as ValidPageSize)) {
      setRowsPerPage(value);
      setPage(0);
    }
  };

  const handleResetSettings = () => {
    try {
      localStorage.removeItem(CUSTOMER_PAGE_SETTINGS_STORAGE_KEY);
      setRowsPerPage(DEFAULT_SETTINGS.rowsPerPage);
      setPage(0);
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          顧客データの取得中にエラーが発生しました。
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          再試行
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'min-content',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
            fontWeight: 600,
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          顧客管理
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">表示件数:</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={rowsPerPage}
              onChange={handleSelectChange}
              displayEmpty
            >
              {VALID_PAGE_SIZES.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}件
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" size="small" onClick={handleResetSettings}>
            設定をリセット
          </Button>
        </Box>

        <CustomerTable
          customers={data || []}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default CustomersPage;
