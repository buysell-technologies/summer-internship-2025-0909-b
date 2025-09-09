import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { usePutStocksId } from '../../../api/generated/api';
import type { ModelStock } from '../../../api/generated/model';
import { useAuth } from '../../../hooks/useAuth';

export type EditStockDialogProps = {
  open: boolean;
  stock: ModelStock | null;
  onClose: () => void;
  onSuccess: () => void;
};

type FormValues = {
  name: string;
  price: number;
  quantity: number;
};

const EditStockDialog = ({
  open,
  stock,
  onClose,
  onSuccess,
}: EditStockDialogProps) => {
  const { userId, storeId } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormValues>({
    values: {
      name: stock?.name ?? '',
      price: stock?.price ?? 0,
      quantity: stock?.quantity ?? 0,
    },
  });

  const updateMutation = usePutStocksId();

  const onSubmit = async (values: FormValues) => {
    if (!stock?.id) return;
    await updateMutation.mutateAsync({
      id: Number(stock.id),
      data: {
        name: values.name,
        price: Number(values.price),
        quantity: Number(values.quantity),
        store_id: storeId ?? '00000000-0000-0000-0000-000000000000',
        user_id: userId ?? '00000000-0000-0000-0000-000000000000',
      },
    });
    reset();
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>在庫を編集</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="商品名"
            {...register('name', {
              required: '1〜100文字で入力してください',
              minLength: 1,
              maxLength: 100,
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="価格"
            type="number"
            inputMode="numeric"
            {...register('price', {
              valueAsNumber: true,
              min: { value: 0, message: '0以上の数値を入力してください' },
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <TextField
            label="在庫数"
            type="number"
            inputMode="numeric"
            {...register('quantity', {
              valueAsNumber: true,
              min: { value: 0, message: '0以上の整数を入力してください' },
            })}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          更新
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStockDialog;
