import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { ShoppingBag, ShoppingCart, Laptop, Watch } from '@mui/icons-material';

interface ActivityItem {
  id: number;
  type: 'purchase' | 'sale' | 'inventory';
  title: string;
  time: string;
  amount: string;
  icon: React.ReactNode;
  color: string;
}

const ActivityFeed = () => {
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: 'purchase',
      title: 'iPhone 14 Pro を買取',
      time: '2時間前',
      amount: '¥85,000',
      icon: <ShoppingBag fontSize="small" />,
      color: '#2196f3',
    },
    {
      id: 2,
      type: 'sale',
      title: 'シャネル バッグ を販売',
      time: '4時間前',
      amount: '¥220,000',
      icon: <ShoppingCart fontSize="small" />,
      color: '#4caf50',
    },
    {
      id: 3,
      type: 'inventory',
      title: 'MacBook Pro を入庫',
      time: '6時間前',
      amount: '¥120,000',
      icon: <Laptop fontSize="small" />,
      color: '#ff9800',
    },
    {
      id: 4,
      type: 'sale',
      title: 'ロレックス を査定完了',
      time: '8時間前',
      amount: '¥1,200,000',
      icon: <Watch fontSize="small" />,
      color: '#2196f3',
    },
  ];

  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e0e0e0',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 1,
          }}
        >
          最近のアクティビティ
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: '0.875rem',
            mb: 3,
          }}
        >
          直近の取引活動
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {activities.map((activity) => (
            <Box
              key={activity.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                position: 'relative',
                '&:not(:last-child)::after': {
                  content: '""',
                  position: 'absolute',
                  left: 18,
                  top: 40,
                  bottom: -10,
                  width: '2px',
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: activity.color,
                  fontSize: '1rem',
                  zIndex: 1,
                }}
              >
                {activity.icon}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: '#1a1a1a',
                    fontSize: '0.875rem',
                    mb: 0.5,
                  }}
                >
                  {activity.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    fontSize: '0.75rem',
                  }}
                >
                  {activity.time}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: activity.type === 'sale' ? '#4caf50' : '#1a1a1a',
                  fontSize: '0.875rem',
                  textAlign: 'right',
                }}
              >
                {activity.amount}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
