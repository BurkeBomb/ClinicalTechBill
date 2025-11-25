
import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useMonitoringTimer } from "../hooks/useMonitoringTimer";
import { formatTime } from "../utils/formatters";

interface Props {
  currentCase: any;
  userId: string;
}

const MonitoringPanel: React.FC<Props> = ({ currentCase, userId }) => {
  const { elapsedSeconds, billableTime, isPaused } = useMonitoringTimer(currentCase);

  const handleStartMonitoring = async () => {
    const caseRef = doc(db, `users/${userId}/cases`, currentCase.id);
    await updateDoc(caseRef, { status: "ACTIVE", monitoringStart: Date.now() });
  };

  const handlePauseResume = async () => {
    const caseRef = doc(db, `users/${userId}/cases`, currentCase.id);
    await updateDoc(caseRef, { currentPauseStart: isPaused ? null : Date.now() });
  };

  const handleEnd = async () => {
    const caseRef = doc(db, `users/${userId}/cases`, currentCase.id);
    await updateDoc(caseRef, { status: "READY_FOR_CODING", monitoringEnd: Date.now() });
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-lg font-bold mb-4">Monitoring Panel</h2>
      {currentCase.status === "ACTIVE" ? (
        <>
          <p>Total Time: {formatTime(elapsedSeconds)}</p>
          <p>Billable Time: {formatTime(billableTime)}</p>
          <div className="flex gap-4 mt-4">
            <button onClick={handlePauseResume} className="bg-yellow-500 text-white px-4 py-2 rounded">
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button onClick={handleEnd} className="bg-red-600 text-white px-4 py-2 rounded">End Case</button>
          </div>
        </>
      ) : (
        <button onClick={handleStartMonitoring} className="bg-blue-600 text-white px-4 py-2 rounded">Start Monitoring</button>
      )}
    </div>
  );
};

export default MonitoringPanel;
