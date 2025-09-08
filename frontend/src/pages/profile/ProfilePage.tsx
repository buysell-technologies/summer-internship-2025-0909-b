import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import ProfileForm from '../../features/profile/components/ProfileForm';
import { useAuth } from '../../hooks/useAuth';
import { useGetUsersId } from '../../api/generated/api';

const ProfilePage = () => {
  const { userId } = useAuth();
  const {
    data: user,
    isPending: isGettingUser,
    error,
    refetch,
  } = useGetUsersId(userId || '', { query: { enabled: !!userId } });

  if (isGettingUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          従業員データの取得中にエラーが発生しました。
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          再試行
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'min-content',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
            fontWeight: 600,
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          プロフィール管理
        </Typography>
      </Box>
      {/* Content */}
      <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%', maxWidth: '100%' }}>
        {user && (
          <Alert severity="info" sx={{ mb: 2 }}>
            現在ログイン中の従業員 : {user.name} ({user.employee_number})
          </Alert>
        )}
        <ProfileForm user={user} refetch={refetch} />
      </Box>
    </Box>
  );
};

export default ProfilePage;
