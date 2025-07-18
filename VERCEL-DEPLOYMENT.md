# Vercel Deployment Guide - Multi-VAPI Setup

## 🚀 Quick Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "feat: Add multi-VAPI account system with fallback support"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository: `shreyaspathki/IntelliPrep_01`
3. Configure the project settings

### 3. Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

#### **Primary VAPI Account**

```
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_primary_web_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_primary_workflow_id
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_primary_assistant_id
```

#### **VAPI Account 1 (Fallback 1)**

```
NEXT_PUBLIC_VAPI_WEB_TOKEN_1=your_web_token_1
NEXT_PUBLIC_VAPI_WORKFLOW_ID_1=your_workflow_id_1
NEXT_PUBLIC_VAPI_ASSISTANT_ID_1=your_assistant_id_1
```

#### **VAPI Account 2 (Fallback 2)**

```
NEXT_PUBLIC_VAPI_WEB_TOKEN_2=your_web_token_2
NEXT_PUBLIC_VAPI_WORKFLOW_ID_2=your_workflow_id_2
NEXT_PUBLIC_VAPI_ASSISTANT_ID_2=your_assistant_id_2
```

#### **VAPI Account 3 (Fallback 3)**

```
NEXT_PUBLIC_VAPI_WEB_TOKEN_3=your_web_token_3
NEXT_PUBLIC_VAPI_WORKFLOW_ID_3=your_workflow_id_3
NEXT_PUBLIC_VAPI_ASSISTANT_ID_3=your_assistant_id_3
```

#### **VAPI Account 4 (Fallback 4)**

```
NEXT_PUBLIC_VAPI_WEB_TOKEN_4=your_web_token_4
NEXT_PUBLIC_VAPI_WORKFLOW_ID_4=your_workflow_id_4
NEXT_PUBLIC_VAPI_ASSISTANT_ID_4=your_assistant_id_4
```

#### **Other Required Variables**

```
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

### 4. Environment Settings

- **Environment**: Select all (Production, Preview, Development)
- **Production**: ✅
- **Preview**: ✅
- **Development**: ✅

### 5. Deploy

Click "Deploy" and wait for the build to complete!

## 🔍 Verify Multi-VAPI Setup

After deployment, you can verify the multi-VAPI system is working:

### Check VAPI Status

```typescript
// In your browser console or add to a component
import { printVapiStatus } from "@/lib/vapi-status";
printVapiStatus();
```

### Expected Output

```
🔍 VAPI Account Status:
==================================================
1. ✅ VAPI_ACCOUNT_1
   Token: 🔑 Present
   Active: Yes
   Errors: 0/3
   Last Used: [timestamp]

2. ✅ VAPI_ACCOUNT_2
   Token: 🔑 Present
   Active: Yes
   Errors: 0/3
   Last Used: [timestamp]

3. ✅ VAPI_ACCOUNT_3
   Token: 🔑 Present
   Active: Yes
   Errors: 0/3
   Last Used: [timestamp]

4. ✅ VAPI_ACCOUNT_4
   Token: 🔑 Present
   Active: Yes
   Errors: 0/3
   Last Used: [timestamp]
==================================================
```

## 🛠️ Troubleshooting

### If VAPI calls fail:

1. Check that all environment variables are set correctly
2. Verify VAPI account credits are available
3. Use `printVapiStatus()` to see which accounts are active
4. Reset error counts if needed: `vapiStatusMonitor.resetAccount('VAPI_ACCOUNT_1')`

### If deployment fails:

1. Check that all required environment variables are set
2. Ensure Firebase configuration is correct
3. Verify Google AI API key is valid
4. Check Vercel build logs for specific errors

## 📊 Benefits of Multi-VAPI Setup

- ✅ **No Downtime**: Automatic fallback when accounts run out of credits
- ✅ **Load Balancing**: Distributes requests across multiple accounts
- ✅ **Error Recovery**: Self-healing system with automatic error handling
- ✅ **Scalability**: Easy to add more VAPI accounts
- ✅ **Monitoring**: Built-in status tracking and health checks

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [VAPI Documentation](https://docs.vapi.ai/)
- [Firebase Console](https://console.firebase.google.com/)
- [Google AI Studio](https://aistudio.google.com/)

Your IntelliPrep application is now ready for production with enterprise-grade VAPI reliability! 🚀
