// VapiTest.tsx content commented out for safe removal
"use client";

import { useState } from "react";
import {
  printVapiStatus,
  getVapiStatus,
  isVapiHealthy,
  getVapiRecommendation,
} from "@/lib/vapi-status";
import { vapiManager } from "@/lib/vapi-manager";

const VapiTest = () => {
  const [status, setStatus] = useState<unknown[]>([]);
  const [health, setHealth] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<string>("");

  const checkStatus = () => {
    const currentStatus = getVapiStatus();
    setStatus(currentStatus);
    setHealth(isVapiHealthy());
    setRecommendation(getVapiRecommendation());

    // Also print to console for debugging
    printVapiStatus();
  };

  const resetAccount = (accountName: string) => {
    vapiManager.resetErrorCount(accountName);
    checkStatus(); // Refresh status
  };

  return (
    <div>
      <h2>VAPI Multi-Account Test</h2>
      <button onClick={checkStatus}>Check Status</button>
      <div>Status: {JSON.stringify(status)}</div>
      <div>Health: {health ? "Healthy" : "Unhealthy"}</div>
      <div>Recommendation: {recommendation}</div>
      <button onClick={() => resetAccount("account1")}>Reset Account 1</button>
    </div>
  );
};

export default VapiTest;
