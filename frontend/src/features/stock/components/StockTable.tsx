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
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ModelStock } from '../../../api/generated/model';
import StockTableRow from './StockTableRow';

interface StockTableProps {
  stocks: ModelStock[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit?: (stock: ModelStock) => void;
  onDelete?: (stock: ModelStock) => void;
}

type ColumnWidths = {
  id: string;
  name: string;
  sku: string;
  price: string;
  quantity: string;
  updatedBy: string;
  created: string;
  updated: string;
};

const StockTable = ({
  stocks,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: StockTableProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (stocks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          該当する商品がありません。条件を変更してください。
        </Typography>
      </Box>
    );
  }

  // レスポンシブなカラム幅設定
  const getRawColumnWidths = () => {
    if (isMobile) {
      return {
        id: '8%',
        name: '32%',
        sku: '0%',
        price: '20%',
        quantity: '15%',
        updatedBy: '0%',
        created: '0%', // モバイルでは非表示
        updated: '17%',
        actions: '8%',
      } as const;
    } else if (isTablet) {
      return {
        id: '6%',
        name: '22%',
        sku: '12%',
        price: '14%',
        quantity: '10%',
        updatedBy: '9%',
        created: '12%',
        updated: '9%',
        actions: '6%',
      } as const;
    } else {
      return {
        id: '6%',
        name: '22%',
        sku: '12%',
        price: '12%',
        quantity: '10%',
        updatedBy: '10%',
        created: '12%',
        updated: '10%',
        actions: '6%',
      } as const;
    }
  };

  const raw = getRawColumnWidths();
  const columnWidths: ColumnWidths = {
    id: raw.id,
    name: raw.name,
    sku: raw.sku,
    price: raw.price,
    quantity: raw.quantity,
    updatedBy: raw.updatedBy,
    created: raw.created,
    updated: raw.updated,
  };

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
                width: raw.id,
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
                width: raw.name,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              商品名
            </TableCell>
            {!isMobile && (
              <TableCell
                sx={{
                  width: raw.sku,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2,
                  color: '#555',
                }}
              >
                SKU
              </TableCell>
            )}
            <TableCell
              align="right"
              sx={{
                width: raw.price,
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
                width: raw.quantity,
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
                  width: raw.updatedBy,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2,
                  color: '#555',
                }}
              >
                更新者
              </TableCell>
            )}
            {!isMobile && (
              <TableCell
                sx={{
                  width: raw.created,
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
                width: raw.updated,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
            >
              更新日時
            </TableCell>
            <TableCell
              sx={{
                width: raw.actions,
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2,
                color: '#555',
              }}
              align="right"
            >
              操作
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow
              key={stock.id}
              hover
              sx={{
                '&:hover': { backgroundColor: '#f8f9fa' },
                '&:nth-of-type(even)': { backgroundColor: '#fbfbfb' },
              }}
            >
              <StockTableRow
                stock={stock}
                columnWidths={columnWidths}
                isMobile={isMobile}
              />
              <TableCell align="right" sx={{ pr: 0, width: raw.actions }}>
                <Box sx={{ display: 'inline-flex', ml: 'auto', gap: 0.5 }}>
                  <Tooltip title="編集">
                    <IconButton size="small" onClick={() => onEdit?.(stock)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="削除">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete?.(stock)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
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
        sx={{ borderTop: '1px solid #e0e0e0' }}
      />
    </TableContainer>
  );
};

export default StockTable;
