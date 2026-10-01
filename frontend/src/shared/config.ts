const now = new Date();
const pad = (n: number) => String(n).padStart(2, '0');

export const CURRENT_MONTH = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;

const label = now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
export const CURRENT_MONTH_LABEL = label.charAt(0).toUpperCase() + label.slice(1);

export function defaultDate(): string {
  return `${CURRENT_MONTH}-${pad(now.getDate())}`;
}
