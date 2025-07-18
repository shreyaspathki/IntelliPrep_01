import Vapi from "@vapi-ai/web";

// VAPI Configuration Interface
interface VapiConfig {
  webToken: string;
  workflowId?: string;
  assistantId?: string;
  name: string;
  isActive: boolean;
  lastUsed?: Date;
  errorCount: number;
}

// Multi-Account VAPI Configuration (4 accounts + fallback)
const vapiConfigs: VapiConfig[] = [
  {
    name: "VAPI_ACCOUNT_1",
    webToken: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN_1 || "",
    workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID_1,
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_1,
    isActive: true,
    errorCount: 0,
  },
  {
    name: "VAPI_ACCOUNT_2",
    webToken: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN_2 || "",
    workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID_2,
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_2,
    isActive: true,
    errorCount: 0,
  },
  {
    name: "VAPI_ACCOUNT_3",
    webToken: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN_3 || "",
    workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID_3,
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_3,
    isActive: true,
    errorCount: 0,
  },
  {
    name: "VAPI_ACCOUNT_4",
    webToken: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN_4 || "",
    workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID_4,
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_4,
    isActive: true,
    errorCount: 0,
  },
];

// Fallback to original single config if no multiple configs are set
const hasMultiAccountSetup = vapiConfigs.some((config) => config.webToken);
if (!hasMultiAccountSetup) {
  vapiConfigs[0] = {
    name: "VAPI_DEFAULT",
    webToken: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || "",
    workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
    isActive: true,
    errorCount: 0,
  };
}

class VapiManager {
  private currentIndex = 0;
  private vapiInstances: Map<string, Vapi> = new Map();

  constructor() {
    this.initializeVapiInstances();
    this.logCurrentStatus();
  }

  private initializeVapiInstances() {
    vapiConfigs.forEach((config) => {
      if (config.webToken && config.isActive) {
        try {
          const vapiInstance = new Vapi(config.webToken);
          this.vapiInstances.set(config.name, vapiInstance);
        } catch (error) {
          config.isActive = false;
        }
      }
    });
  }

  private getNextAvailableConfig(): VapiConfig | null {
    const availableConfigs = vapiConfigs.filter(
      (config) => config.isActive && config.webToken && config.errorCount < 3
    );

    if (availableConfigs.length === 0) {
      return null;
    }

    // Find the config with the least error count and most recent usage
    const bestConfig = availableConfigs.reduce((best, current) => {
      if (current.errorCount < best.errorCount) return current;
      if (current.errorCount === best.errorCount) {
        if (!current.lastUsed || !best.lastUsed) return current;
        return current.lastUsed < best.lastUsed ? current : best;
      }
      return best;
    });

    return bestConfig;
  }

  private markConfigAsUsed(configName: string) {
    const config = vapiConfigs.find((c) => c.name === configName);
    if (config) {
      config.lastUsed = new Date();
    }
  }

  private markConfigAsError(configName: string) {
    const config = vapiConfigs.find((c) => c.name === configName);
    if (config) {
      config.errorCount++;
      if (config.errorCount >= 3) {
        config.isActive = false;
      }
    }
  }

  public getCurrentVapi(): Vapi | null {
    const config = this.getNextAvailableConfig();
    if (!config) {
      return null;
    }

    const vapiInstance = this.vapiInstances.get(config.name);
    if (!vapiInstance) {
      return null;
    }

    this.markConfigAsUsed(config.name);
    return vapiInstance;
  }

  public async executeWithFallback<T>(
    operation: (vapi: Vapi) => Promise<T>,
    configName?: string
  ): Promise<T> {
    let lastError: Error | null = null;
    const attemptedConfigs = new Set<string>();

    // Try the specified config first if provided
    if (configName) {
      const config = vapiConfigs.find(
        (c) => c.name === configName && c.isActive
      );
      if (config) {
        const vapiInstance = this.vapiInstances.get(config.name);
        if (vapiInstance) {
          try {
            this.markConfigAsUsed(config.name);
            const result = await operation(vapiInstance);
            return result;
          } catch (error) {
            this.markConfigAsError(config.name);
            lastError = error as Error;
            attemptedConfigs.add(config.name);
          }
        }
      }
    }

    // Try all available configs
    for (const config of vapiConfigs) {
      if (
        !config.isActive ||
        !config.webToken ||
        attemptedConfigs.has(config.name)
      ) {
        continue;
      }

      const vapiInstance = this.vapiInstances.get(config.name);
      if (!vapiInstance) continue;

      try {
        this.markConfigAsUsed(config.name);
        const result = await operation(vapiInstance);
        return result;
      } catch (error) {
        this.markConfigAsError(config.name);
        lastError = error as Error;
        attemptedConfigs.add(config.name);
      }
    }

    // If we get here, all configs failed
    throw lastError || new Error("All VAPI configurations are unavailable");
  }

  public getStatus() {
    return vapiConfigs.map((config) => ({
      name: config.name,
      isActive: config.isActive,
      errorCount: config.errorCount,
      lastUsed: config.lastUsed,
      hasToken: !!config.webToken,
    }));
  }

  public resetErrorCount(configName: string) {
    const config = vapiConfigs.find((c) => c.name === configName);
    if (config) {
      config.errorCount = 0;
      config.isActive = true;
    }
  }

  private logCurrentStatus() {
    // Remove all console.log, console.error, and console.warn statements
  }
}

// Create singleton instance
export const vapiManager = new VapiManager();

// Export a convenience function for getting the current VAPI instance
export const getCurrentVapi = () => vapiManager.getCurrentVapi();

// Export the manager for advanced usage
export default vapiManager;
