import { Box, Grid, Typography } from '@mui/material';
import KpiCard from '../../features/dashboard/components/KpiCard';
import SalesChart from '../../features/dashboard/components/SalesChart';
import ActivityFeed from '../../features/dashboard/components/ActivityFeed';
import { mockDataForDashboard as orders } from '../../mocks/orders';
import { mockDataForDashboard as customers } from '../../mocks/customers';
import { mockDataForDashboard as stocks } from '../../mocks/stocks';
import useKpiCardProps from '../../features/dashboard/hooks/useKpiCardProps';

const DashboardPage = () => {
  const kpiCardProps = useKpiCardProps({ orders, customers, stocks });
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
          ダッシュボード
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%', maxWidth: '100%' }}>
        {/* KPI Cards */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          sx={{ mb: 4, width: '100%' }}
        >
          {kpiCardProps.map((kpiCardProps, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 20 / 5, xl: 20 / 5 }}
              key={index}
            >
              <KpiCard
                title={kpiCardProps.title}
                value={kpiCardProps.value}
                trend={kpiCardProps.trend}
                csvData={kpiCardProps.csvData}
                csvFilename={kpiCardProps.csvFilename}
              />
            </Grid>
          ))}
        </Grid>

        {/* Charts and Activity */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <SalesChart />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <ActivityFeed />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;
