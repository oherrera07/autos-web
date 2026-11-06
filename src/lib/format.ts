export const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

export const formatKm = (n: number) => `${n.toLocaleString("es-MX")} km`;