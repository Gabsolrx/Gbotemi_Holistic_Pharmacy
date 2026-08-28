export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscount(price: number, previousPrice?: number): number {
  if (!previousPrice || previousPrice <= price) return 0;
  return Math.round(((previousPrice - price) / previousPrice) * 100);
}
