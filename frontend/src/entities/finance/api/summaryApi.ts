import { request } from '../../../shared/api/http';

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}

interface SummaryDto {
  month: string;
  income: string;
  expense: string;
}

export const summaryApi = {
  list: async (months = 6): Promise<MonthlySummary[]> =>
    (await request<SummaryDto[]>(`/transactions/summary?months=${months}`)).map((d) => ({
      month: d.month,
      income: Number(d.income),
      expense: Number(d.expense),
    })),
};
