// Демо-данные
export const CURRENT_MONTH = '2026-09';
export const CURRENT_MONTH_LABEL = 'Сентябрь 2026';

export function defaultDate(): string {
  const today = new Date().toISOString().slice(0, 10);
  return today.startsWith(CURRENT_MONTH) ? today : `${CURRENT_MONTH}-01`;
}
