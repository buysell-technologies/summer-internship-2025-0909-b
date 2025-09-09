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
import { usePostStocks } from '../../../api/generated/api';
import { useAuth } from '../../../hooks/useAuth';

export type CreateStockDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type FormValues = {
  name: string;
  price: number;
  quantity: number;
};

const CreateStockDialog = ({
  open,
  onClose,
  onSuccess,
}: CreateStockDialogProps) => {
  const { userId, storeId } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: { name: '', price: 0, quantity: 0 },
  });

  const createMutation = usePostStocks();

  const onSubmit = async (values: FormValues) => {
    await createMutation.mutateAsync({
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
      <DialogTitle>新規登録</DialogTitle>
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
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateStockDialog;
