/*
// setup-env.js content commented out for safe removal
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const envTemplate = `# VAPI Configuration - Multiple Accounts with Fallback Support
# =============================================================

# Primary VAPI Account (Original - Keep your existing credentials)
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

# Google AI Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# Base URL Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id_here
FIREBASE_CLIENT_EMAIL=your_firebase_client_email_here
FIREBASE_PRIVATE_KEY=your_firebase_private_key_here

# =============================================================
# Vercel Deployment Instructions:
# =============================================================
# 
# 1. Copy all these environment variables to your Vercel project
# 2. Go to your Vercel dashboard → Project Settings → Environment Variables
# 3. Add each variable with its corresponding value
# 4. Make sure to set the environment (Production, Preview, Development)
# 5. Update NEXT_PUBLIC_BASE_URL to your Vercel domain in production
#
# How the Multi-VAPI System Works:
# 
# 1. The system will automatically try VAPI_ACCOUNT_1 first
# 2. If that fails (credits depleted, errors, etc.), it moves to VAPI_ACCOUNT_2
# 3. This continues through all 4 accounts
# 4. If all accounts fail, it falls back to the original single config
# 5. Each account tracks error counts and gets disabled after 3 consecutive failures
# 6. The system automatically re-enables accounts after a period of time
#
# Benefits:
# - No downtime when one account runs out of credits
# - Automatic load balancing across multiple accounts
# - Built-in error handling and recovery
# - Easy to add more accounts by following the naming pattern
#
# Usage:
# - Just add your VAPI credentials to the corresponding environment variables
# - The system handles everything else automatically
# - You can monitor account status using vapiManager.getStatus()
`;

const vercelEnvTemplate = `# Vercel Environment Variables Template
# Copy these to your Vercel project settings

# Primary VAPI Account
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_primary_web_token_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_primary_workflow_id_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_primary_assistant_id_here

# VAPI Account 1
NEXT_PUBLIC_VAPI_WEB_TOKEN_1=your_web_token_1_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID_1=your_workflow_id_1_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID_1=your_assistant_id_1_here

# VAPI Account 2
NEXT_PUBLIC_VAPI_WEB_TOKEN_2=your_web_token_2_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID_2=your_workflow_id_2_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID_2=your_assistant_id_2_here

# VAPI Account 3
NEXT_PUBLIC_VAPI_WEB_TOKEN_3=your_web_token_3_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID_3=your_workflow_id_3_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID_3=your_assistant_id_3_here

# VAPI Account 4
NEXT_PUBLIC_VAPI_WEB_TOKEN_4=your_web_token_4_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID_4=your_workflow_id_4_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID_4=your_assistant_id_4_here

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# Base URL (Update this to your Vercel domain)
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

# Firebase Admin
FIREBASE_PROJECT_ID=your_firebase_project_id_here
FIREBASE_CLIENT_EMAIL=your_firebase_client_email_here
FIREBASE_PRIVATE_KEY=your_firebase_private_key_here
`;

function createEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local");

  if (fs.existsSync(envPath)) {
    console.log("⚠️  .env.local already exists. Creating backup...");
    const backupPath = path.join(process.cwd(), ".env.local.backup");
    fs.copyFileSync(envPath, backupPath);
    console.log("✅ Backup created as .env.local.backup");
  }

  fs.writeFileSync(envPath, envTemplate);
  console.log("✅ .env.local file created successfully!");
}

function createVercelTemplate() {
  const vercelPath = path.join(process.cwd(), "vercel-env-template.txt");
  fs.writeFileSync(vercelPath, vercelEnvTemplate);
  console.log(
    "✅ Vercel environment template created as vercel-env-template.txt"
  );
}

function showInstructions() {
  console.log("\n🚀 Multi-VAPI Setup Complete!");
  console.log("=====================================");
  console.log("\n📝 Next Steps:");
  console.log("1. Edit .env.local and add your actual VAPI credentials");
  console.log(
    "2. For Vercel deployment, copy variables from vercel-env-template.txt"
  );
  console.log("3. Update NEXT_PUBLIC_BASE_URL to your Vercel domain");
  console.log("\n🔧 To monitor VAPI accounts:");
  console.log('   import { printVapiStatus } from "@/lib/vapi-status"');
  console.log("   printVapiStatus()");
  console.log(
    "\n📚 For detailed instructions, see VAPI-MULTI-ACCOUNT-SETUP.md"
  );
}

// Main execution
if (require.main === module) {
  try {
    createEnvFile();
    createVercelTemplate();
    showInstructions();
  } catch (error) {
    console.error("❌ Error creating environment files:", error.message);
    process.exit(1);
  }
}

module.exports = { createEnvFile, createVercelTemplate };
*/
