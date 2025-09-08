import { Button, Stack, Alert, Snackbar, Box } from '@mui/material';
import {
  FormProvider,
  useForm,
  type FieldErrors,
  type SubmitHandler,
  type SubmitErrorHandler,
} from 'react-hook-form';
import { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileFormSchema } from '../schemas/ProfileFormSchema';
import NameInput from './NameInput';
import EmailInput from './EmailInput';
import type { ProfileFormType } from '../types/ProfileFormType';
import { usePutUsersId } from '../../../api/generated/api';
import type { ModelUser } from '../../../api/generated/model';

type ProfileFormProps = {
  user?: ModelUser;
  refetch?: () => void;
};

const ProfileForm = ({ user, refetch }: ProfileFormProps) => {
  const { mutate: updateUser, isPending: isPuttingUsersId } = usePutUsersId();
  // TODO: 共通なSnackbarの状態管理を作成する
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const methods = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileFormSchema),
    // MEMO: フォームの初期値を設定
    defaultValues: {
      name: '',
      email: '',
    },
    // MEMO: useGetUsersIdで取得した従業員データの値を取得後にフォームに設定
    values: user
      ? {
          name: user.name || '',
          email: user.email || '',
        }
      : undefined,
  });

  const isFormDirty = methods.formState.isDirty;

  const onValid: SubmitHandler<ProfileFormType> = useCallback(
    (value: ProfileFormType) => {
      updateUser(
        {
          id: user?.id || '',
          data: {
            name: value.name,
            email: value.email,
            store_id: user?.store_id || '',
            employee_number: user?.employee_number || '',
            userID: user?.id || '',
          },
        },
        {
          onSuccess: () => {
            refetch?.();
            setSnackbarMessage('従業員情報を更新しました。');
            setSnackbarOpen(true);
          },
          onError: (error) => {
            setSnackbarMessage('従業員情報の更新に失敗しました。');
            setSnackbarOpen(true);
            console.error('従業員情報の更新に失敗しました。:', error);
          },
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, updateUser, methods, refetch],
  );

  const onInvalid: SubmitErrorHandler<ProfileFormType> = (
    errors: FieldErrors,
  ) => {
    console.error('入力内容に誤りがあります。:', errors);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          ログイン中の従業員データが見つかりません。
        </Alert>
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onValid, onInvalid)}>
        <Stack spacing={2}>
          <NameInput />
          <EmailInput />
          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              size="medium"
              sx={{ width: 'fit-content', mt: 2 }}
              disabled={!isFormDirty}
              loading={isPuttingUsersId}
            >
              保存
            </Button>
          </Stack>
        </Stack>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </FormProvider>
  );
};

export default ProfileForm;
