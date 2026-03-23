const moneyFormatter = new Intl.NumberFormat('en-IN')

export function formatMoney(value) {
  return `Rs ${moneyFormatter.format(value)}`
}
