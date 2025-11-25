
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthComponent from "./components/AuthComponent";
import CaseCapture from "./components/CaseCapture";
import MonitoringPanel from "./components/MonitoringPanel";
import BillingPreview from "./components/BillingPreview";
import { collection, onSnapshot, query } from "firebase/firestore";

const App: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentCase, setCurrentCase] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || "");
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Fetch cases from Firestore
  useEffect(() => {
    if (!userId) return;
    const casePath = `users/${userId}/cases`;
    const q = query(collection(db, casePath));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const caseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCases(caseList);
      const activeCase = caseList.find(c => c.status === "ACTIVE" || c.status === "DRAFT");
      setCurrentCase(activeCase || null);
    });
    return () => unsubscribe();
  }, [userId]);

  if (!isAuthReady) return <div className="p-6 text-center">Loading...</div>;
  if (!userId) return <AuthComponent />;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700">IONM Billing Simulator</h1>
      <button
        onClick={() => signOut(auth)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>

      {/* Case Capture */}
      <CaseCapture userId={userId} />

      {/* Monitoring Panel */}
      {currentCase && (
        <>
          <MonitoringPanel currentCase={currentCase} userId={userId} />
          <BillingPreview currentCase={currentCase} />
        </>
      )}

      {/* Recent Cases */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="text-lg font-bold mb-4">Recent Cases</h2>
        {cases.length === 0 ? (
          <p>No cases logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {cases.map(c => (
              <li key={c.id} className="border p-2 rounded">
                <p className="font-semibold">{c.patientName}</p>
                <p>{c.procedureName} | Status: {c.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
