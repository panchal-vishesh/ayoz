const moneyFormatter = new Intl.NumberFormat('en-IN')

export function formatMoney(value) {
  return `₹${moneyFormatter.format(value)}`
}
