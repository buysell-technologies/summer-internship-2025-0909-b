import { Chip, Stack, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import type { ProfileFormType } from '../types/ProfileFormType';

const EmailInput = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormType>();

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>メールアドレス</Typography>
        <Chip label="必須" variant="filled" size="small" color="error" />
      </Stack>
      <TextField
        {...register('email')}
        placeholder="例）sample@buysell-technologies.com"
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        variant="outlined"
        margin="normal"
        autoComplete="email"
      />
    </Stack>
  );
};

export default EmailInput;
