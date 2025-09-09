import { useMemo, useState } from 'react';
import { useGetStocks } from '../../api/generated/api';
import StockTable from '../../features/stock/components/StockTable';
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { convertCSVFromArray } from '../../utils/convertCSVFromArray';

const StocksPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error, refetch } = useGetStocks({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportableRows = useMemo(() => {
    const stocks = data || [];
    const formatPrice = (price?: number) => {
      if (price === undefined || price === null) return '';
      return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
    };
    const formatDate = (iso?: string) => {
      if (!iso) return '';
      const d = new Date(iso);
      const yyyy = String(d.getFullYear());
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const HH = String(d.getHours()).padStart(2, '0');
      const MM = String(d.getMinutes()).padStart(2, '0');
      return `${yyyy}/${mm}/${dd} ${HH}:${MM}`;
    };
    // 日本語ヘッダーの順序でキーを作成
    return stocks.map((s) => ({
      ID: s.id ?? '',
      商品名: s.name ?? '',
      価格: formatPrice(s.price),
      在庫数: s.quantity ?? '',
      作成日時: formatDate(s.created_at),
      更新日時: formatDate(s.updated_at),
    }));
  }, [data]);

  const exportStocksCsv = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      if (!exportableRows.length) {
        throw new Error('出力対象の在庫データがありません');
      }
      const csvCore = convertCSVFromArray(exportableRows);
      // Googleスプレッドシート対応でBOMを付与
      const csv = `\uFEFF${csvCore}`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const now = new Date();
      const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      link.setAttribute('download', `stocks_${ts}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'CSV出力に失敗しました');
    } finally {
      setIsExporting(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
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
          在庫データの取得中にエラーが発生しました。
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
          在庫管理
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        {/* 検索・フィルタUIとCSV出力ボタンの行 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2.5,
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          {/* 左側: 検索・フィルタUI用プレースホルダー（既存UIが入る想定） */}
          <Box sx={{ flex: 1, minHeight: 0 }} />

          {/* 右側: CSV出力ボタン */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={exportStocksCsv}
              disabled={isExporting}
              sx={{
                minWidth: { xs: '100%', sm: 140 },
                fontWeight: 600,
              }}
            >
              {isExporting ? '出力中…' : 'CSV出力'}
            </Button>
          </Box>
        </Box>
        {exportError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {exportError}
          </Alert>
        )}
        <StockTable
          stocks={data || []}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default StocksPage;
