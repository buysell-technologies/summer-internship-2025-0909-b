import { useMemo, useState } from 'react';
import { useGetStocks } from '../../api/generated/api';
import StockTable from '../../features/stock/components/StockTable';
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button,
  Snackbar,
} from '@mui/material';
import { convertCSVFromArray } from '../../utils/convertCSVFromArray';
import CreateStockDialog from '../../features/stock/components/CreateStockDialog';
import EditStockDialog from '../../features/stock/components/EditStockDialog';
import DeleteConfirmDialog from '../../features/stock/components/DeleteConfirmDialog';
import type { ModelStock } from '../../api/generated/model';

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
      return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
      }).format(price);
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

  // Dialog states
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editTarget, setEditTarget] = useState<ModelStock | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ModelStock | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleCreateSuccess = () => {
    setSnackbar({
      open: true,
      message: '商品を登録しました',
      severity: 'success',
    });
    refetch();
  };

  const handleEditSuccess = () => {
    setSnackbar({
      open: true,
      message: '商品を更新しました',
      severity: 'success',
    });
    refetch();
  };

  const handleDeleteSuccess = () => {
    setSnackbar({ open: true, message: '削除しました', severity: 'success' });
    refetch();
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
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
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          新規登録
        </Button>
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
          <Box sx={{ flex: 1, minHeight: 0 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={exportStocksCsv}
              disabled={isExporting}
              sx={{ minWidth: { xs: '100%', sm: 140 }, fontWeight: 600 }}
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
          onEdit={(s) => {
            setEditTarget(s);
            setOpenEdit(true);
          }}
          onDelete={(s) => {
            setDeleteTarget(s);
            setOpenDelete(true);
          }}
        />
      </Box>

      <CreateStockDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={handleCreateSuccess}
      />
      <EditStockDialog
        open={openEdit}
        stock={editTarget}
        onClose={() => setOpenEdit(false)}
        onSuccess={handleEditSuccess}
      />
      <DeleteConfirmDialog
        open={openDelete}
        stockId={deleteTarget ? Number(deleteTarget.id) : null}
        stockName={deleteTarget?.name}
        onClose={() => setOpenDelete(false)}
        onSuccess={handleDeleteSuccess}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        message={snackbar.message}
      />
    </Box>
  );
};

export default StocksPage;
