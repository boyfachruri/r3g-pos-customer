export const formatCurrencyIDR = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2, // Bisa ubah ke 2 jika ingin format Rp 1.000,00
    }).format(value);
  };