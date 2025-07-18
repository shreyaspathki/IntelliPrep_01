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
    <div className="p-6 bg-dark-200 rounded-lg">
      <h3 className="text-xl font-bold text-primary-200 mb-4">
        VAPI Multi-Account Test
      </h3>

      <div className="space-y-4">
        <button
          onClick={checkStatus}
          className="px-4 py-2 bg-primary-200 text-dark-100 rounded hover:bg-primary-200/80"
        >
          Check VAPI Status
        </button>

        {status.length > 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-dark-300 rounded">
              <h4 className="font-semibold text-primary-100 mb-2">
                System Health:
              </h4>
              <p
                className={`text-sm ${
                  health ? "text-green-400" : "text-red-400"
                }`}
              >
                {health ? "✅ Healthy" : "❌ Unhealthy"}
              </p>
              <p className="text-sm text-light-100 mt-1">{recommendation}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-primary-100">
                Account Status:
              </h4>
              {status.map((account) => (
                <div
                  key={(account as any).name}
                  className="p-3 bg-dark-300 rounded flex justify-between items-center"
                >
                  <div>
                    <span
                      className={`font-medium ${
                        (account as any).isActive
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {(account as any).isActive ? "✅" : "❌"}{" "}
                      {(account as any).name}
                    </span>
                    <p className="text-xs text-light-100">
                      Token:{" "}
                      {(account as any).hasToken ? "🔑 Present" : "🚫 Missing"}{" "}
                      | Errors: {(account as any).errorCount}/3 | Last Used:{" "}
                      {(account as any).lastUsed
                        ? new Date((account as any).lastUsed).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                  {(account as any).errorCount > 0 && (
                    <button
                      onClick={() => resetAccount((account as any).name)}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      Reset
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VapiTest;
