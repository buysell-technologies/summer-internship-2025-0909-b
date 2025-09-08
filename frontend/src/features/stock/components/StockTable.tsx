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
import type { ModelStock } from '../../../api/generated/model';
import StockTableRow from './StockTableRow';

interface StockTableProps {
  stocks: ModelStock[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StockTable = ({
  stocks,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: StockTableProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (stocks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          在庫データがありません
        </Typography>
      </Box>
    );
  }

  // レスポンシブなカラム幅設定
  const getColumnWidths = () => {
    if (isMobile) {
      return {
        id: '10%',
        name: '35%',
        price: '20%',
        quantity: '15%',
        created: '0%', // モバイルでは非表示
        updated: '20%',
      };
    } else if (isTablet) {
      return {
        id: '8%',
        name: '30%',
        price: '18%',
        quantity: '12%',
        created: '16%',
        updated: '16%',
      };
    } else {
      return {
        id: '8%',
        name: '25%',
        price: '15%',
        quantity: '10%',
        created: '21%',
        updated: '21%',
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
              ID
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
              商品名
            </TableCell>
            <TableCell
              align="right"
              sx={{
                width: columnWidths.price,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              価格
            </TableCell>
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
              在庫数
            </TableCell>
            {!isMobile && (
              <TableCell
                sx={{
                  width: columnWidths.created,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2,
                  color: '#555',
                }}
              >
                作成日時
              </TableCell>
            )}
            <TableCell
              sx={{
                width: columnWidths.updated,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              更新日時
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks.map((stock) => (
            <StockTableRow
              key={stock.id}
              stock={stock}
              columnWidths={columnWidths}
              isMobile={isMobile}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={-1}
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

export default StockTable;
