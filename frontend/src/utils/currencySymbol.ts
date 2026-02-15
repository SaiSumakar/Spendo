
export function getCurrencySymbol(
  currency: string,
  locale = 'en-IN'
): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).formatToParts(1);

    const symbol = parts.find(p => p.type === 'currency')?.value;
    return symbol ?? currency;
  } catch {
    return currency;
  }
}