import { TableRow, TableCell } from '@mui/material';
import type { ModelStock } from '../../../api/generated/model';
import { useI18n } from '../../../providers/I18nProvider';

interface StockTableRowProps {
  stock: ModelStock;
  columnWidths: {
    id: string;
    name: string;
    price: string;
    quantity: string;
    created: string;
    updated: string;
  };
  isMobile: boolean;
}

const StockTableRow = ({
  stock,
  columnWidths,
  isMobile,
}: StockTableRowProps) => {
  const { formatDate } = useI18n();

  const formatCurrency = (price?: number) => {
    if (price === undefined || price === null) return '-';
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  return (
    <TableRow
      hover
      sx={{
        '&:hover': {
          backgroundColor: '#f8f9fa',
        },
        '&:nth-of-type(even)': {
          backgroundColor: '#fbfbfb',
        },
      }}
    >
      <TableCell
        sx={{
          width: columnWidths.id,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          py: 1.5,
          fontSize: '0.875rem',
        }}
      >
        {stock.id || '-'}
      </TableCell>
      <TableCell
        sx={{
          width: columnWidths.name,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          py: 1.5,
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {stock.name || '-'}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          width: columnWidths.price,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          py: 1.5,
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#2e7d32',
        }}
      >
        {formatCurrency(stock.price)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          width: columnWidths.quantity,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          py: 1.5,
          fontSize: '0.875rem',
        }}
      >
        {stock.quantity || 0}
      </TableCell>
      {!isMobile && (
        <TableCell
          sx={{
            width: columnWidths.created,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            py: 1.5,
            fontSize: '0.875rem',
            color: '#666',
          }}
        >
          {formatDate(stock.created_at) || '-'}
        </TableCell>
      )}
      <TableCell
        sx={{
          width: columnWidths.updated,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          py: 1.5,
          fontSize: '0.875rem',
          color: '#666',
        }}
      >
        {formatDate(stock.updated_at) || '-'}
      </TableCell>
    </TableRow>
  );
};

export default StockTableRow;
