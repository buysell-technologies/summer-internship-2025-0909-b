import { Stack, TextField, Typography, Chip } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import type { ProfileFormType } from '../types/ProfileFormType';

const NameInput = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormType>();

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>名前</Typography>
        <Chip label="必須" variant="filled" size="small" color="error" />
      </Stack>
      <TextField
        {...register('name')}
        placeholder="例）バイセル 太郎"
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        variant="outlined"
        margin="normal"
        autoComplete="name"
      />
    </Stack>
  );
};

export default NameInput;
