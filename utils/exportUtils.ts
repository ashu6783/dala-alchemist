import { unparse } from 'papaparse';

export const exportToCSV = (data: any[], filename = 'data.csv') => {
  if (!data || !data.length) return;

  const csv = unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  a.click();
};
