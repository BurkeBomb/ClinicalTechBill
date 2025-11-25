
import React, { useMemo } from "react";
import { calculateTimeBasedCodes } from "../utils/billingUtils";
import { formatCurrency } from "../utils/formatters";

interface Props {
  currentCase: any;
}

const BillingPreview: React.FC<Props> = ({ currentCase }) => {
  const timeCalculation = useMemo(() => {
    if (currentCase?.status === "READY_FOR_CODING") {
      return calculateTimeBasedCodes(currentCase.monitoringStart, currentCase.monitoringEnd, currentCase.totalPausedDuration || 0);
    }
    return null;
  }, [currentCase]);

  if (!timeCalculation) return <p className="mt-6">End monitoring to view billing preview.</p>;

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-lg font-bold mb-4">Billing Preview</h2>
      <p>Total Billable Time: {timeCalculation.billableMinutes} minutes</p>
      <p>Code 137 Units: {timeCalculation.code137}</p>
      <p>Code 139 Units: {timeCalculation.code139}</p>
      <p>Total Claim Value: {formatCurrency((timeCalculation.code137 + timeCalculation.code139) * 1305.4)}</p>
    </div>
  );
};

export default BillingPreview;
