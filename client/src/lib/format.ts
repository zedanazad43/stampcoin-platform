export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('ar-SA', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}
