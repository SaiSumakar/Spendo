export function formatCurrency(
  amount: number,
  currency?: string,
  locale = 'en-IN'
): string {
  try {
    if (!currency) {
      return amount.toLocaleString(locale);
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return amount.toLocaleString(locale);
  }
}