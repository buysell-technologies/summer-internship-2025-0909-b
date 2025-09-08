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
import type { ModelOrder } from '../../../api/generated/model';
import OrderTableRow from './OrderTableRow';

interface OrderTableProps {
  orders: ModelOrder[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrderTable = ({
  orders,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: OrderTableProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          発注データがありません
        </Typography>
      </Box>
    );
  }

  // レスポンシブなカラム幅設定
  const getColumnWidths = () => {
    if (isMobile) {
      return {
        id: '12%',
        customer: '25%',
        stock: '0%', // モバイルでは非表示
        quantity: '15%',
        amount: '18%',
        status: '15%',
        delivery: '0%', // モバイルでは非表示
        created: '15%',
      };
    } else if (isTablet) {
      return {
        id: '10%',
        customer: '20%',
        stock: '12%',
        quantity: '10%',
        amount: '15%',
        status: '12%',
        delivery: '12%',
        created: '9%',
      };
    } else {
      return {
        id: '8%',
        customer: '18%',
        stock: '12%',
        quantity: '8%',
        amount: '12%',
        status: '10%',
        delivery: '16%',
        created: '16%',
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
              発注ID
            </TableCell>
            <TableCell
              sx={{
                width: columnWidths.customer,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              顧客ID
            </TableCell>
            {!isMobile && (
              <TableCell
                sx={{
                  width: columnWidths.stock,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2,
                  color: '#555',
                }}
              >
                商品ID
              </TableCell>
            )}
            <TableCell
              align="right"
              sx={{
                width: columnWidths.quantity,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              数量
            </TableCell>
            <TableCell
              align="right"
              sx={{
                width: columnWidths.amount,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              合計金額
            </TableCell>
            <TableCell
              sx={{
                width: columnWidths.status,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              ステータス
            </TableCell>
            {!isMobile && (
              <TableCell
                sx={{
                  width: columnWidths.delivery,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2,
                  color: '#555',
                }}
              >
                配送予定日
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
              発注日時
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <OrderTableRow
              key={order.id}
              order={order}
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

export default OrderTable;
