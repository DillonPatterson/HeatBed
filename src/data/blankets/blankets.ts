import type { BlanketProfile } from '../../types';

export const blanketProfiles: BlanketProfile[] = [
  {
    id: 'none',
    label: 'No blanket',
    retention: 0.82,
    airflow: 1.1,
    stageTint: 'rgba(255,120,40,0.00)',
    note: 'Heat escapes fast, especially at the edges.',
  },
  {
    id: 'sheet',
    label: 'Sheet only',
    retention: 0.94,
    airflow: 1.02,
    stageTint: 'rgba(255,120,40,0.04)',
    note: 'A little hold, still breezy.',
  },
  {
    id: 'comforter',
    label: 'Comforter',
    retention: 1.08,
    airflow: 0.92,
    stageTint: 'rgba(255,100,30,0.08)',
    note: 'Typical heat trap with decent spread.',
  },
  {
    id: 'duvet',
    label: 'Duvet',
    retention: 1.18,
    airflow: 0.88,
    stageTint: 'rgba(255,90,20,0.12)',
    note: 'Retains heat and smooths cool pockets.',
  },
  {
    id: 'winter',
    label: 'Heavy winter blanket',
    retention: 1.32,
    airflow: 0.78,
    stageTint: 'rgba(255,80,10,0.18)',
    note: 'High retention, faster heat buildup, slower release.',
  },
];
