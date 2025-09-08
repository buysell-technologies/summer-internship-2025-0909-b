/**
 * このファイルは編集しないでください
 */

import type { ModelStock } from '../api/generated/model';

const daysInMonth = (year: number, month1to12: number): number => {
  return new Date(year, month1to12, 0).getDate();
};

const seededRandom = (seed: number): number => {
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

export const mockData = (length: number): ModelStock[] =>
  Array.from({ length: length }, (_, idx) => {
    const id = idx + 1;
    const isJuly = id <= 50;
    const created_at = randomDateInMonthIso(
      2024,
      isJuly ? 7 : 8,
      id * 92821 + 311,
    );

    const priceBase = 1500 + ((id * 37) % 2000); // 1,500〜3,499
    const quantity = Math.floor(seededRandom(id * 19) * 50) + 1; // 1..50

    const names = [
      'Standard Widget',
      'Premium Widget',
      'Deluxe Widget',
      'Standard Gadget',
      'Pro Gadget',
      'Ultra Gadget',
      'Basic Component',
      'Advanced Component',
      'Accessory Pack',
      'Refurbished Unit',
    ];
    const name = `${names[id % names.length]} #${id}`;

    return {
      id,
      name,
      price: priceBase,
      quantity,
      store_id: String(((id * 11) % 8) + 1),
      user_id: String(((id * 13) % 5) + 1),
      created_at,
      updated_at: created_at,
    } satisfies ModelStock;
  });

export const mockDataForDashboard = mockData(80000);
