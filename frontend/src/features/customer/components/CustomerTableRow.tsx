import { TableRow, TableCell } from '@mui/material';
import type { ModelCustomer } from '../../../api/generated/model';
import { useI18n } from '../../../providers/I18nProvider';

interface CustomerTableRowProps {
  customer: ModelCustomer;
  columnWidths: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    created: string;
  };
  isMobile: boolean;
}

const CustomerTableRow = ({
  customer,
  columnWidths,
  isMobile,
}: CustomerTableRowProps) => {
  const { formatDate } = useI18n();

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
        {customer.id?.substring(0, 8) + '...' || '-'}
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
        {customer.name || '-'}
      </TableCell>
      <TableCell
        sx={{
          width: columnWidths.email,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          py: 1.5,
          fontSize: '0.875rem',
          color: '#1976d2',
        }}
      >
        {customer.email || '-'}
      </TableCell>
      <TableCell
        sx={{
          width: columnWidths.phone,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          py: 1.5,
          fontSize: '0.875rem',
        }}
      >
        {customer.phone_number || '-'}
      </TableCell>
      {!isMobile && (
        <TableCell
          sx={{
            width: columnWidths.address,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            py: 1.5,
            fontSize: '0.875rem',
            color: '#666',
          }}
        >
          {customer.address || '-'}
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
        {formatDate(customer.created_at) || '-'}
      </TableCell>
    </TableRow>
  );
};

export default CustomerTableRow;
