import { TableRow, TableCell, Chip } from '@mui/material';
import type {
  ModelOrder,
  ModelOrderStatus,
} from '../../../api/generated/model';
import { useI18n } from '../../../providers/I18nProvider';

interface OrderTableRowProps {
  order: ModelOrder;
  columnWidths: {
    id: string;
    customer: string;
    stock: string;
    quantity: string;
    amount: string;
    status: string;
    delivery: string;
    created: string;
  };
  isMobile: boolean;
}

const OrderTableRow = ({
  order,
  columnWidths,
  isMobile,
}: OrderTableRowProps) => {
  const { formatDate } = useI18n();

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const getStatusColor = (status?: ModelOrderStatus) => {
    switch (status) {
      case 'PENDING':
        return { color: '#ed6c02', backgroundColor: '#fff3e0' };
      case 'SHIPPED':
        return { color: '#0288d1', backgroundColor: '#e3f2fd' };
      case 'DELIVERED':
        return { color: '#2e7d32', backgroundColor: '#e8f5e9' };
      case 'CANCELLED':
        return { color: '#d32f2f', backgroundColor: '#ffebee' };
      default:
        return { color: '#666', backgroundColor: '#f5f5f5' };
    }
  };

  const getStatusLabel = (status?: ModelOrderStatus) => {
    switch (status) {
      case 'PENDING':
        return '処理中';
      case 'SHIPPED':
        return '出荷済み';
      case 'DELIVERED':
        return '配送完了';
      case 'CANCELLED':
        return 'キャンセル';
      default:
        return status || '-';
    }
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
        {order.id || '-'}
      </TableCell>
      <TableCell
        sx={{
          width: columnWidths.customer,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          py: 1.5,
          fontSize: '0.875rem',
        }}
      >
        {order.customer_id || '-'}
      </TableCell>
      {!isMobile && (
        <TableCell
          sx={{
            width: columnWidths.stock,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            py: 1.5,
            fontSize: '0.875rem',
            color: '#666',
          }}
        >
          {order.stock_id || '-'}
        </TableCell>
      )}
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
        {order.quantity || 0}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          width: columnWidths.amount,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          py: 1.5,
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#2e7d32',
        }}
      >
        {formatCurrency(order.total_amount)}
      </TableCell>
      <TableCell
        sx={{
          width: columnWidths.status,
          py: 1.5,
        }}
      >
        <Chip
          label={getStatusLabel(order.status)}
          size="small"
          sx={{
            fontSize: '0.75rem',
            height: 24,
            ...getStatusColor(order.status),
          }}
        />
      </TableCell>
      {!isMobile && (
        <TableCell
          sx={{
            width: columnWidths.delivery,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            py: 1.5,
            fontSize: '0.875rem',
            color: '#666',
          }}
        >
          {formatDate(order.delivery_date, 'YYYY/MM/DD') || '-'}
        </TableCell>
      )}
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
        {formatDate(order.created_at) || '-'}
      </TableCell>
    </TableRow>
  );
};

export default OrderTableRow;
