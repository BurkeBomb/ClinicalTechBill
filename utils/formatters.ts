
export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map(v => (v < 10 ? "0" + v : v)).join(":");
};

export const formatCurrency = (value: number) => `R ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
