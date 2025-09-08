/**
 * このファイルは編集しないでください
 */

import { ModelOrderStatus, type ModelOrder } from '../api/generated/model';

const daysInMonth = (year: number, month1to12: number): number => {
  return new Date(year, month1to12, 0).getDate();
};

const seededRandom = (seed: number): number => {
  // 線形合同法（固定的な擬似乱数）
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;
  return ((a * seed + c) % m) / m;
};

const randomDateInMonthIso = (
  year: number,
  month1to12: number,
  seed: number,
): string => {
  const dim = daysInMonth(year, month1to12);
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed * 7 + 13);
  const r3 = seededRandom(seed * 17 + 29);
  const day = Math.max(1, Math.min(dim, Math.floor(r1 * dim) + 1));
  const hour = Math.floor(r2 * 24);
  const minute = Math.floor(r3 * 60);
  return new Date(
    Date.UTC(year, month1to12 - 1, day, hour, minute, 0),
  ).toISOString();
};

export const mockData = (length: number): ModelOrder[] =>
  Array.from({ length: length }, (_, idx) => {
    const id = idx + 1;
    const isJuly = id <= 50;
    const created_at = randomDateInMonthIso(
      2024,
      isJuly ? 7 : 8,
      id * 9301 + 49297,
    );
    const delivery_date = randomDateInMonthIso(
      2024,
      isJuly ? 7 : 8,
      id * 104729 + 7,
    );

    const quantity = (Math.floor(seededRandom(id * 31) * 5) + 1) as number; // 1..5
    const unit = 2490 + (id % 3) * 125; // 価格の素
    const total_amount = unit * quantity;
    const statusPool = [
      ModelOrderStatus.StatusPending,
      ModelOrderStatus.StatusShipped,
      ModelOrderStatus.StatusDelivered,
      ModelOrderStatus.StatusCancelled,
    ] as const;
    const status = statusPool[id % statusPool.length];

    return {
      id,
      customer_id: String(((id * 7) % 50) + 1),
      stock_id: 100 + ((id * 11) % 200),
      quantity,
      total_amount,
      status,
      delivery_date,
      created_at,
      updated_at: created_at,
    } satisfies ModelOrder;
  });

export const mockDataForDashboard = mockData(80000);
