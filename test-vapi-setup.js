/*
// test-vapi-setup.js content commented out for safe removal
// Test script to verify multi-account VAPI setup
const fs = require("fs");
const path = require("path");

// Simple .env parser
function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const env = {};

    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
        }
      }
    });

    return env;
  } catch (error) {
    console.error("❌ Error reading .env.local file:", error.message);
    return {};
  }
}

// Load environment variables
const env = parseEnvFile(".env.local");

console.log("🔍 Testing Multi-Account VAPI Setup");
console.log("=====================================\n");

// Check environment variables
const accounts = [
  {
    name: "VAPI_ACCOUNT_1",
    token: env.NEXT_PUBLIC_VAPI_WEB_TOKEN_1,
    workflow: env.NEXT_PUBLIC_VAPI_WORKFLOW_ID_1,
    assistant: env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_1,
  },
  {
    name: "VAPI_ACCOUNT_2",
    token: env.NEXT_PUBLIC_VAPI_WEB_TOKEN_2,
    workflow: env.NEXT_PUBLIC_VAPI_WORKFLOW_ID_2,
    assistant: env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_2,
  },
  {
    name: "VAPI_ACCOUNT_3",
    token: env.NEXT_PUBLIC_VAPI_WEB_TOKEN_3,
    workflow: env.NEXT_PUBLIC_VAPI_WORKFLOW_ID_3,
    assistant: env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_3,
  },
  {
    name: "VAPI_ACCOUNT_4",
    token: env.NEXT_PUBLIC_VAPI_WEB_TOKEN_4,
    workflow: env.NEXT_PUBLIC_VAPI_WORKFLOW_ID_4,
    assistant: env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_4,
  },
];

// Check each account
let validAccounts = 0;
accounts.forEach((account, index) => {
  const hasToken = !!account.token;
  const hasWorkflow = !!account.workflow;
  const hasAssistant = !!account.assistant;
  const isValid = hasToken && hasWorkflow && hasAssistant;

  if (isValid) validAccounts++;

  console.log(`${index + 1}. ${account.name}:`);
  console.log(
    `   Token: ${hasToken ? "✅" : "❌"} ${hasToken ? "Present" : "Missing"}`
  );
  console.log(
    `   Workflow: ${hasWorkflow ? "✅" : "❌"} ${
      hasWorkflow ? "Present" : "Missing"
    }`
  );
  console.log(
    `   Assistant: ${hasAssistant ? "✅" : "❌"} ${
      hasAssistant ? "Present" : "Missing"
    }`
  );
  console.log(`   Status: ${isValid ? "✅ VALID" : "❌ INVALID"}`);
  console.log("");
});

// Check fallback account
const fallbackToken = env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
const fallbackWorkflow = env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
const fallbackAssistant = env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
const hasFallback = !!(fallbackToken && fallbackWorkflow && fallbackAssistant);

console.log("Fallback Account (Original):");
console.log(
  `   Token: ${fallbackToken ? "✅" : "❌"} ${
    fallbackToken ? "Present" : "Missing"
  }`
);
console.log(
  `   Workflow: ${fallbackWorkflow ? "✅" : "❌"} ${
    fallbackWorkflow ? "Present" : "Missing"
  }`
);
console.log(
  `   Assistant: ${fallbackAssistant ? "✅" : "❌"} ${
    fallbackAssistant ? "Present" : "Missing"
  }`
);
console.log(`   Status: ${hasFallback ? "✅ VALID" : "❌ INVALID"}`);
console.log("");

// Summary
console.log("📊 Summary:");
console.log(`   Valid Multi-Accounts: ${validAccounts}/4`);
console.log(
  `   Fallback Account: ${hasFallback ? "✅ Available" : "❌ Missing"}`
);
console.log(`   Total Available: ${validAccounts + (hasFallback ? 1 : 0)}`);

if (validAccounts > 0) {
  console.log("\n✅ Multi-account VAPI setup is working!");
  console.log("   The system will use the multi-account configuration.");
} else if (hasFallback) {
  console.log("\n⚠️ Multi-account setup not found, but fallback is available.");
  console.log("   The system will use the single account configuration.");
} else {
  console.log("\n❌ No valid VAPI configurations found!");
  console.log("   Please check your .env.local file.");
}

console.log("\n🚀 Ready to test the application!");
*/
