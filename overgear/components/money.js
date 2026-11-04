// How the store writes a price: $1,234.50. Shared by the components of the sublibrary and the example.
export const money = (n) => `$${(+n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
