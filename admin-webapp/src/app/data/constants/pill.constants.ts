import { TonoPill } from '@data/types/pill.types';

/** Pill fill + text, and the dot, per tone. Status scales: dots 500, text 700 (400 dark), tints 50/100. */
export const CLASES_PILL: Record<TonoPill, { pill: string; punto: string }> = {
  success: {
    pill: 'bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400',
    punto: 'bg-success-500',
  },
  warning: {
    pill: 'bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-400',
    punto: 'bg-warning-500',
  },
  danger: {
    pill: 'bg-danger-50 text-danger-700 dark:bg-danger-950/50 dark:text-danger-400',
    punto: 'bg-danger-500',
  },
  info: {
    pill: 'bg-info-50 text-info-700 dark:bg-info-950/50 dark:text-info-400',
    punto: 'bg-info-500',
  },
  neutral: {
    pill: 'bg-panel-muted text-ink-muted',
    punto: 'bg-ink-subtle',
  },
};
