import { getCurrentVapi, vapiManager } from "./vapi-manager";

// Export the current VAPI instance (with automatic fallback)
export const vapi = getCurrentVapi();

// Export the manager for advanced usage
export { vapiManager };

// Convenience function to get a fresh VAPI instance
export const getVapiInstance = () => getCurrentVapi();

// Export the manager's executeWithFallback method for direct use
export const executeWithFallback =
  vapiManager.executeWithFallback.bind(vapiManager);
