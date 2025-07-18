# VAPI Multi-Account Setup Guide

## Overview

This system allows you to use multiple VAPI accounts with automatic fallback when one account runs out of credits or encounters errors. The system supports up to 4 VAPI accounts plus the original single account as a fallback.

## 🚀 Quick Setup

### 1. Environment Variables

Copy the template from `env-template.txt` to your `.env.local` file and fill in your VAPI credentials:

```bash
# Primary VAPI Account (Original)
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_primary_web_token_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_primary_workflow_id_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_primary_assistant_id_here

# VAPI Account 1 (Fallback 1)
NEXT_PUBLIC_VAPI_WEB_TOKEN_1=your_web_token_1_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID_1=your_workflow_id_1_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID_1=your_assistant_id_1_here

# VAPI Account 2 (Fallback 2)
NEXT_PUBLIC_VAPI_WEB_TOKEN_2=your_web_token_2_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID_2=your_workflow_id_2_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID_2=your_assistant_id_2_here

# VAPI Account 3 (Fallback 3)
NEXT_PUBLIC_VAPI_WEB_TOKEN_3=your_web_token_3_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID_3=your_workflow_id_3_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID_3=your_assistant_id_3_here

# VAPI Account 4 (Fallback 4)
NEXT_PUBLIC_VAPI_WEB_TOKEN_4=your_web_token_4_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID_4=your_workflow_id_4_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID_4=your_assistant_id_4_here
```

### 2. How It Works

The system automatically:

1. **Tries VAPI_ACCOUNT_1 first** (or your primary account if no multiple configs are set)
2. **Falls back to VAPI_ACCOUNT_2** if the first fails
3. **Continues through all accounts** until one works
4. **Tracks error counts** and disables accounts after 3 consecutive failures
5. **Load balances** across available accounts

## 📊 Monitoring & Management

### Check Account Status

```typescript
import { printVapiStatus, getVapiStatus } from "@/lib/vapi-status";

// Print formatted status to console
printVapiStatus();

// Get raw status data
const status = getVapiStatus();
console.log(status);
```

### Start Automatic Monitoring

```typescript
import { startVapiMonitoring, stopVapiMonitoring } from "@/lib/vapi-status";

// Start monitoring every 30 seconds
startVapiMonitoring(30000);

// Stop monitoring
stopVapiMonitoring();
```

### Reset Account Errors

```typescript
import { vapiStatusMonitor } from "@/lib/vapi-status";

// Reset error count for a specific account
vapiStatusMonitor.resetAccount("VAPI_ACCOUNT_1");
```

### Health Check

```typescript
import { isVapiHealthy, getVapiRecommendation } from "@/lib/vapi-status";

// Check if system is healthy
const healthy = isVapiHealthy();

// Get recommendation
const recommendation = getVapiRecommendation();
```

## 🔧 Advanced Usage

### Using the VAPI Manager Directly

```typescript
import { vapiManager, executeWithFallback } from "@/lib/vapi-manager";

// Get current VAPI instance
const vapi = vapiManager.getCurrentVapi();

// Execute operation with automatic fallback
const result = await executeWithFallback(async (vapiInstance) => {
  return await vapiInstance.start(workflowId, options);
});
```

### Custom Fallback Logic

```typescript
import { vapiManager } from "@/lib/vapi-manager";

// Try specific account first
try {
  const result = await vapiManager.executeWithFallback(
    async (vapi) => await vapi.start(workflowId, options),
    "VAPI_ACCOUNT_2" // Try this account first
  );
} catch (error) {
  console.error("All VAPI accounts failed:", error);
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **"No available VAPI configurations"**

   - Check that your environment variables are set correctly
   - Ensure at least one account has valid credentials

2. **"All VAPI configurations failed"**

   - Check your VAPI account credits
   - Verify workflow IDs and assistant IDs are correct
   - Reset error counts if accounts are disabled

3. **Accounts getting disabled**
   - This is normal behavior after 3 consecutive errors
   - Use `vapiStatusMonitor.resetAccount()` to re-enable

### Debug Commands

```typescript
// Check all account statuses
printVapiStatus();

// Get system health
console.log("Healthy:", isVapiHealthy());
console.log("Recommendation:", getVapiRecommendation());

// Reset all accounts
[
  "VAPI_ACCOUNT_1",
  "VAPI_ACCOUNT_2",
  "VAPI_ACCOUNT_3",
  "VAPI_ACCOUNT_4",
].forEach((account) => {
  vapiStatusMonitor.resetAccount(account);
});
```

## 📈 Benefits

- ✅ **No Downtime**: Automatic fallback when accounts run out of credits
- ✅ **Load Balancing**: Distributes load across multiple accounts
- ✅ **Error Recovery**: Automatically handles and recovers from errors
- ✅ **Easy Scaling**: Add more accounts by following the naming pattern
- ✅ **Monitoring**: Built-in status monitoring and health checks
- ✅ **Backward Compatible**: Works with existing single-account setup

## 🔄 Migration from Single Account

If you're migrating from a single VAPI account:

1. **Keep your existing environment variables** (they'll be used as fallback)
2. **Add new account credentials** using the numbered pattern
3. **The system will automatically use the new accounts first**
4. **Your existing code will continue to work without changes**

## 📝 Example Output

When you run `printVapiStatus()`, you'll see:

```
🔍 VAPI Account Status:
==================================================
1. ✅ VAPI_ACCOUNT_1
   Token: 🔑 Present
   Active: Yes
   Errors: 0/3
   Last Used: 12/19/2024, 2:30:45 PM

2. ✅ VAPI_ACCOUNT_2
   Token: 🔑 Present
   Active: Yes
   Errors: 1/3
   Last Used: 12/19/2024, 2:25:12 PM

3. ❌ VAPI_ACCOUNT_3
   Token: 🚫 Missing
   Active: No
   Errors: 0/3
   Last Used: Never used

4. ✅ VAPI_ACCOUNT_4
   Token: 🔑 Present
   Active: Yes
   Errors: 0/3
   Last Used: 12/19/2024, 2:20:33 PM
==================================================
```

This system ensures your IntelliPrep application never runs out of VAPI credits and provides seamless fallback between multiple accounts!
