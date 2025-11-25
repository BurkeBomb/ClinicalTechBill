
import { useEffect, useState } from "react";

export const useMonitoringTimer = (currentCase: any) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [billableTime, setBillableTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const monitoringStart = currentCase?.monitoringStart;
    const monitoringEnd = currentCase?.monitoringEnd;
    const totalPausedDuration = currentCase?.totalPausedDuration || 0;

    if (currentCase?.status === "ACTIVE" && monitoringStart && !currentCase.currentPauseStart) {
      interval = setInterval(() => {
        const now = Date.now();
        const totalDuration = (now - monitoringStart) / 1000;
        const billableSeconds = totalDuration - totalPausedDuration;
        setElapsedSeconds(Math.floor(totalDuration));
        setBillableTime(Math.floor(billableSeconds));
      }, 1000);
    } else if (currentCase?.status === "READY_FOR_CODING" && monitoringStart && monitoringEnd) {
      const totalDuration = (monitoringEnd - monitoringStart) / 1000;
      const billableSeconds = totalDuration - totalPausedDuration;
      setElapsedSeconds(Math.floor(totalDuration));
      setBillableTime(Math.floor(billableSeconds));
    }

    return () => interval && clearInterval(interval);
  }, [currentCase]);

  return { elapsedSeconds, billableTime, isPaused };
};
