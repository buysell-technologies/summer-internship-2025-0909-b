import { useEffect, useState } from 'react';
import type { KpiCardProps } from '../components/KpiCard';
import { generateKpiData } from '../../../mocks/kpi';
import { convertCSVFromArray } from '../../../utils/convertCSVFromArray';
import type {
  ModelCustomer,
  ModelOrder,
  ModelStock,
} from '../../../api/generated/model';

const useKpiCardProps = ({
  orders,
  customers,
  stocks,
}: {
  orders: ModelOrder[];
  customers: ModelCustomer[];
  stocks: ModelStock[];
}) => {
  const [kpiCardProps, setKpiCardProps] = useState<KpiCardProps[]>([]);
  useEffect(() => {
    const kpi = generateKpiData(orders, customers, stocks);
    const stocksCsvData = convertCSVFromArray(stocks);
    const customersCsvData = convertCSVFromArray(customers);
    const ordersCsvData = convertCSVFromArray(orders);
    setKpiCardProps([
      {
        title: kpi.orders.title,
        value: kpi.orders.value,
        trend: kpi.orders.trend,
        csvData: ordersCsvData,
        csvFilename: 'orders.csv',
      },
      {
        title: kpi.stocks.title,
        value: kpi.stocks.value,
        trend: kpi.stocks.trend,
        csvData: stocksCsvData,
        csvFilename: 'stocks.csv',
      },
      {
        title: kpi.customers.title,
        value: kpi.customers.value,
        trend: kpi.customers.trend,
        csvData: customersCsvData,
        csvFilename: 'customers.csv',
      },
    ]);
  }, [customers, orders, stocks]);
  return kpiCardProps;
};

export default useKpiCardProps;
