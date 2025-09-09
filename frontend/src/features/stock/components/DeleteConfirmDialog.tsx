import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useDeleteStocksId } from '../../../api/generated/api';

export type DeleteConfirmDialogProps = {
  open: boolean;
  stockId: number | null;
  stockName?: string;
  onClose: () => void;
  onSuccess: () => void;
};

const DeleteConfirmDialog = ({
  open,
  stockId,
  stockName,
  onClose,
  onSuccess,
}: DeleteConfirmDialogProps) => {
  const deleteMutation = useDeleteStocksId();

  const onConfirm = async () => {
    if (!stockId) return;
    await deleteMutation.mutateAsync({ id: stockId });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>削除の確認</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 1 }}>
          この商品を削除します。元に戻せません。
          {stockName ? `（${stockName}）` : ''}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleteMutation.isLoading}>
          キャンセル
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={deleteMutation.isLoading}
        >
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
