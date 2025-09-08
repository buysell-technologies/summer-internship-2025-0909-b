import { Card, CardContent, Typography, Box } from '@mui/material';

const SalesChart = () => {
  // Mock data for the chart
  const salesData = [
    { month: '7月', sales: 2.4, purchase: 0.8 },
    { month: '8月', sales: 2.2, purchase: 0.9 },
    { month: '9月', sales: 2.6, purchase: 1.2 },
    { month: '10月', sales: 2.8, purchase: 1.1 },
    { month: '11月', sales: 3.2, purchase: 1.4 },
    { month: '12月', sales: 2.9, purchase: 1.3 },
    { month: '1月', sales: 3.0, purchase: 1.2 },
  ];

  const maxValue =
    Math.max(...salesData.map((d) => Math.max(d.sales, d.purchase))) + 0.5;

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
          売上・買取推移
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: '0.875rem',
            mb: 3,
          }}
        >
          過去7ヶ月の売上と買取金額の推移
        </Typography>

        <Box sx={{ position: 'relative', height: 200, mt: 2 }}>
          {/* Y-axis labels */}
          <Box
            sx={{
              position: 'absolute',
              left: -10,
              top: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column-reverse',
              justifyContent: 'space-between',
              py: 1,
            }}
          >
            {[0, 0.8, 1.6, 2.4, 3.2].map((value) => (
              <Typography
                key={value}
                variant="caption"
                sx={{
                  color: '#999',
                  fontSize: '0.75rem',
                  transform: 'translateY(50%)',
                }}
              >
                ¥{value.toFixed(1)}M
              </Typography>
            ))}
          </Box>

          {/* Chart area */}
          <Box sx={{ ml: 4, height: '100%', position: 'relative' }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <Box
                key={ratio}
                sx={{
                  position: 'absolute',
                  bottom: `${ratio * 100}%`,
                  left: 0,
                  right: 0,
                  height: '1px',
                  backgroundColor: '#f0f0f0',
                }}
              />
            ))}

            {/* Chart lines */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {/* Sales line (blue) */}
              <polyline
                fill="none"
                stroke="#2196f3"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={salesData
                  .map(
                    (d, i) =>
                      `${(i / (salesData.length - 1)) * 100},${100 - (d.sales / maxValue) * 100}`,
                  )
                  .join(' ')}
              />

              {/* Purchase line (green) */}
              <polyline
                fill="none"
                stroke="#4caf50"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={salesData
                  .map(
                    (d, i) =>
                      `${(i / (salesData.length - 1)) * 100},${100 - (d.purchase / maxValue) * 100}`,
                  )
                  .join(' ')}
              />
            </svg>

            {/* Data points overlay */}
            <svg
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {/* Data points for sales */}
              {salesData.map((d, i) => (
                <circle
                  key={`sales-${i}`}
                  cx={`${(i / (salesData.length - 1)) * 100}%`}
                  cy={`${100 - (d.sales / maxValue) * 100}%`}
                  r="4"
                  fill="#2196f3"
                />
              ))}

              {/* Data points for purchase */}
              {salesData.map((d, i) => (
                <circle
                  key={`purchase-${i}`}
                  cx={`${(i / (salesData.length - 1)) * 100}%`}
                  cy={`${100 - (d.purchase / maxValue) * 100}%`}
                  r="4"
                  fill="#4caf50"
                />
              ))}
            </svg>
          </Box>

          {/* X-axis labels */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 1,
              ml: 4,
            }}
          >
            {salesData.map((d) => (
              <Typography
                key={d.month}
                variant="caption"
                sx={{ color: '#999', fontSize: '0.75rem' }}
              >
                {d.month}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 3, mt: 3, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 3,
                backgroundColor: '#4caf50',
                borderRadius: 1,
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: '#666', fontSize: '0.875rem' }}
            >
              買取
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 3,
                backgroundColor: '#2196f3',
                borderRadius: 1,
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: '#666', fontSize: '0.875rem' }}
            >
              売上
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
