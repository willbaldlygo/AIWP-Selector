// Segment colours. Every one holds white text at better than 4.5:1 contrast,
// so labels stay readable after Zoom's video compression.
export const WHEEL_COLORS: string[] = [
  '#1d4ed8', // blue
  '#0f766e', // teal
  '#7c3aed', // violet
  '#be185d', // pink
  '#c2410c', // orange
  '#4d7c0f', // olive
  '#0e7490', // cyan
  '#a21caf', // magenta
  '#b45309', // amber
];

export const TIMER_OPTIONS = [30, 60, 90, 120];
export const DEFAULT_DURATION = 60;
export const SPIN_MS = 3200;
export const REDUCED_SPIN_MS = 600;

export const STORAGE_KEYS = {
  roster: 'spin-time:roster',
  done: 'spin-time:done',
  duration: 'spin-time:duration',
};

export const SAMPLE_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
