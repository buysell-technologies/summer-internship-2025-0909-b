// src/mocks/kpi.tsx
import type {
  ModelOrder,
  ModelCustomer,
  ModelStock,
} from '../api/generated/model';

export const generateKpiData = (
  orders: ModelOrder[],
  customers: ModelCustomer[],
  stocks: ModelStock[],
): {
  orders: {
    title: string;
    value: string | number;
    trend: { value: string; isPositive: boolean; label: string };
  };
  stocks: {
    title: string;
    value: string | number;
    trend: { value: string; isPositive: boolean; label: string };
  };
  customers: {
    title: string;
    value: string | number;
    trend: { value: string; isPositive: boolean; label: string };
  };
} => {
  const ym = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  };

  const months = Array.from(
    new Set([
      ...orders.map((o) => ym(o.created_at)),
      ...customers.map((c) => ym(c.created_at)),
      ...stocks.map((s) => ym(s.created_at)),
    ]),
  )
    .filter(Boolean)
    .sort();

  const latestYm = months[months.length - 1];
  const prevYm = months[months.length - 2] ?? latestYm;

  const sumOrders = (key: string) =>
    orders
      .filter((o) => ym(o.created_at) === key)
      .reduce((a, o) => a + (o.total_amount ?? 0), 0);
  const sumStocksByMonth = (key: string) =>
    stocks
      .filter((s) => ym(s.created_at) === key)
      .reduce((a, s) => a + (s.quantity ?? 0), 0);
  const countCustomersByMonth = (key: string) =>
    customers.filter((c) => ym(c.created_at) === key).length;

  const pct = (prev: number, curr: number) =>
    prev === 0 ? 0 : ((curr - prev) / prev) * 100;
  const yen = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  });
  const num = new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 0 });

  const thisOrders = sumOrders(latestYm);
  const prevOrders = sumOrders(prevYm);
  const thisStocks = sumStocksByMonth(latestYm);
  const prevStocks = sumStocksByMonth(prevYm);
  const thisCustomers = countCustomersByMonth(latestYm);
  const prevCustomers = countCustomersByMonth(prevYm);
  return {
    orders: {
      title: '今月の売上',
      value: yen.format(thisOrders),
      trend: {
        value: `${pct(prevOrders, thisOrders) >= 0 ? '+' : ''}${pct(prevOrders, thisOrders).toFixed(1)}%`,
        isPositive: pct(prevOrders, thisOrders) >= 0,
        label: '前月比',
      },
    },
    stocks: {
      title: '総在庫数',
      value: num.format(thisStocks),
      trend: {
        value: `${pct(prevStocks, thisStocks) >= 0 ? '+' : ''}${pct(prevStocks, thisStocks).toFixed(1)}%`,
        isPositive: pct(prevStocks, thisStocks) >= 0,
        label: '前月比',
      },
    },
    customers: {
      title: '顧客数',
      value: num.format(thisCustomers),
      trend: {
        value: `${pct(prevCustomers, thisCustomers) >= 0 ? '+' : ''}${pct(prevCustomers, thisCustomers).toFixed(1)}%`,
        isPositive: pct(prevCustomers, thisCustomers) >= 0,
        label: '前月比',
      },
    },
  };
};
