export type FormErrors<T> = Partial<Record<keyof T, string>>;

export function validateMoney(raw: string, label = 'Сумма'): string | undefined {
  const value = raw.trim().replace(',', '.');
  if (!value) return `Введите ${label.toLowerCase()}`;
  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    return `Введите число, не более 2 знаков после запятой`;
  }
  const n = Number(value);
  if (n <= 0) return `${label} должна быть больше нуля`;
  if (n >= 10_000_000_000) return `${label} слишком большая`;
  return undefined;
}

export function parseMoney(raw: string): number {
  return Number(raw.trim().replace(',', '.'));
}

export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.values(errors).some(Boolean);
}
