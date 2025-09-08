import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { ModelCustomer } from '../../../api/generated/model';
import CustomerTableRow from './CustomerTableRow';

interface CustomerTableProps {
  customers: ModelCustomer[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomerTable = ({
  customers,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: CustomerTableProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (customers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          顧客データがありません
        </Typography>
      </Box>
    );
  }

  // レスポンシブなカラム幅設定
  const getColumnWidths = () => {
    if (isMobile) {
      return {
        id: '15%',
        name: '25%',
        email: '30%',
        phone: '20%',
        address: '0%', // モバイルでは非表示
        created: '10%',
      };
    } else if (isTablet) {
      return {
        id: '10%',
        name: '20%',
        email: '25%',
        phone: '18%',
        address: '15%',
        created: '12%',
      };
    } else {
      return {
        id: '8%',
        name: '18%',
        email: '22%',
        phone: '15%',
        address: '20%',
        created: '17%',
      };
    }
  };

  const columnWidths = getColumnWidths();

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e0e0e0',
      }}
    >
      <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell
              sx={{
                width: columnWidths.id,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              顧客ID
            </TableCell>
            <TableCell
              sx={{
                width: columnWidths.name,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              顧客名
            </TableCell>
            <TableCell
              sx={{
                width: columnWidths.email,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              メールアドレス
            </TableCell>
            <TableCell
              sx={{
                width: columnWidths.phone,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              電話番号
            </TableCell>
            {!isMobile && (
              <TableCell
                sx={{
                  width: columnWidths.address,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2,
                  color: '#555',
                }}
              >
                住所
              </TableCell>
            )}
            <TableCell
              sx={{
                width: columnWidths.created,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              登録日時
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <CustomerTableRow
              key={customer.id}
              customer={customer}
              columnWidths={columnWidths}
              isMobile={isMobile}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={-1} // 総数が不明な場合は-1を設定
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="表示件数:"
        labelDisplayedRows={({ from, to }) => `${from}-${to}`}
        sx={{
          borderTop: '1px solid #e0e0e0',
        }}
      />
    </TableContainer>
  );
};

export default CustomerTable;
