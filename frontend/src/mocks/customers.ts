/**
 * このファイルは編集しないでください
 */

import type { ModelCustomer } from '../api/generated/model';

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

export const mockData = (length: number): ModelCustomer[] =>
  Array.from({ length: length }, (_, idx) => {
    const idNum = idx + 1;
    const id = String(idNum);
    const isJuly = idNum <= 50;
    const created_at = randomDateInMonthIso(
      2024,
      isJuly ? 7 : 8,
      idNum * 73939133 + 17,
    );

    const firstNames = [
      'John',
      'Jane',
      'Alex',
      'Chris',
      'Sam',
      'Taylor',
      'Jordan',
      'Casey',
      'Riley',
      'Morgan',
    ];
    const lastNames = [
      'Doe',
      'Smith',
      'Johnson',
      'Brown',
      'Davis',
      'Miller',
      'Wilson',
      'Moore',
      'Taylor',
      'Anderson',
    ];
    const fn = firstNames[idNum % firstNames.length];
    const ln = lastNames[(idNum * 3) % lastNames.length];

    return {
      id,
      name: `${fn} ${ln} ${id}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${id}@example.com`,
      address: `${100 + idNum} Main St, Anytown, USA`,
      created_at,
      deleted_at: undefined,
      phone_number: `080-${String(1000 + ((idNum * 73) % 9000)).padStart(4, '0')}-${String(1000 + ((idNum * 137) % 9000)).padStart(4, '0')}`,
      tenant_id: String(((idNum * 7) % 5) + 1),
      updated_at: created_at,
    } satisfies ModelCustomer;
  });

export const mockDataForDashboard = mockData(80000);
