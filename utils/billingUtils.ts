
export const calculateTimeBasedCodes = (start: number, end: number, paused: number) => {
  if (!start || !end || end < start) return { code137: 0, code139: 0, totalMinutes: 0, billableMinutes: 0 };
  const totalSeconds = (end - start) / 1000;
  const billableSeconds = Math.max(0, totalSeconds - paused);
  const billableMinutes = Math.ceil(billableSeconds / 60);
  const units137 = billableMinutes > 0 ? 1 : 0;
  const units139 = billableMinutes > 60 ? Math.ceil((billableMinutes - 60) / 60) : 0;
  return { code137: units137, code139: units139, totalMinutes: Math.ceil(totalSeconds / 60), billableMinutes };
};
