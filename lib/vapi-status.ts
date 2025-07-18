import { vapiManager } from "./vapi-manager";

// VAPI Status Monitoring Utility
export class VapiStatusMonitor {
  private static instance: VapiStatusMonitor;
  private statusInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): VapiStatusMonitor {
    if (!VapiStatusMonitor.instance) {
      VapiStatusMonitor.instance = new VapiStatusMonitor();
    }
    return VapiStatusMonitor.instance;
  }

  // Get current status of all VAPI accounts
  public getStatus() {
    return vapiManager.getStatus();
  }

  // Print status to console in a formatted way
  public printStatus() {
    const status = this.getStatus();
    // Remove all console.log, console.error, and console.warn statements

    status.forEach((account, index) => {
      const statusIcon = account.isActive ? "✅" : "❌";
      const tokenStatus = account.hasToken ? "🔑" : "🚫";
      const lastUsed = account.lastUsed
        ? account.lastUsed.toLocaleString()
        : "Never used";

      // Remove all console.log, console.error, and console.warn statements
    });

    // Remove all console.log, console.error, and console.warn statements
  }

  // Start automatic status monitoring
  public startMonitoring(intervalMs: number = 30000) {
    // Default: 30 seconds
    if (this.statusInterval) {
      // Remove all console.log, console.error, and console.warn statements
      return;
    }

    // Remove all console.log, console.error, and console.warn statements

    this.statusInterval = setInterval(() => {
      this.printStatus();
    }, intervalMs);
  }

  // Stop automatic status monitoring
  public stopMonitoring() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
      // Remove all console.log, console.error, and console.warn statements
    }
  }

  // Reset error count for a specific account
  public resetAccount(accountName: string) {
    vapiManager.resetErrorCount(accountName);
    // Remove all console.log, console.error, and console.warn statements
  }

  // Get summary of available accounts
  public getSummary() {
    const status = this.getStatus();
    const activeAccounts = status.filter((account) => account.isActive);
    const accountsWithTokens = status.filter((account) => account.hasToken);

    return {
      total: status.length,
      active: activeAccounts.length,
      withTokens: accountsWithTokens.length,
      healthy: activeAccounts.filter((account) => account.errorCount === 0)
        .length,
      degraded: activeAccounts.filter(
        (account) => account.errorCount > 0 && account.errorCount < 3
      ).length,
      failed: status.filter((account) => !account.isActive).length,
    };
  }

  // Check if system is healthy
  public isHealthy(): boolean {
    const summary = this.getSummary();
    return summary.active > 0 && summary.withTokens > 0;
  }

  // Get recommended action
  public getRecommendation(): string {
    const summary = this.getSummary();

    if (summary.active === 0) {
      return "🚨 CRITICAL: No active VAPI accounts. Check your environment variables.";
    }

    if (summary.healthy === 0) {
      return "⚠️ WARNING: All accounts have errors. Consider resetting error counts.";
    }

    if (summary.degraded > 0) {
      return "⚠️ WARNING: Some accounts have errors. Monitor closely.";
    }

    return "✅ HEALTHY: All VAPI accounts are working properly.";
  }
}

// Export singleton instance
export const vapiStatusMonitor = VapiStatusMonitor.getInstance();

// Convenience functions
export const getVapiStatus = () => vapiStatusMonitor.getStatus();
export const printVapiStatus = () => vapiStatusMonitor.printStatus();
export const startVapiMonitoring = (intervalMs?: number) =>
  vapiStatusMonitor.startMonitoring(intervalMs);
export const stopVapiMonitoring = () => vapiStatusMonitor.stopMonitoring();
export const isVapiHealthy = () => vapiStatusMonitor.isHealthy();
export const getVapiRecommendation = () =>
  vapiStatusMonitor.getRecommendation();
