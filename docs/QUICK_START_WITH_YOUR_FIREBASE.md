# 🚀 Quick Setup - Sierra Estates with Your Firebase Credentials

Your Firebase project is ready! Here's exactly what to do next.

## ✅ Your Firebase Details

```
Project Name: sierra-estates
API Key: AIzaSy...your-own-key-from-firebase-console ✓
Auth Domain: sierra-estates.firebaseapp.com ✓
Project ID: sierra-estates ✓
Storage Bucket: sierra-estates.firebasestorage.app ✓
Sender ID: 941030513456 ✓
App ID: 1:941030513456:web:56209a1495d69f217086f5 ✓
```

---

## 📋 Step-by-Step Setup (15 minutes)

### **Step 1: Create Your Project Folder**

```bash
# Open Command Prompt / PowerShell / Terminal on your PC
npx create-next-app@latest sierra-estatese --typescript --tailwind

# Choose default options (just press Enter for most)
cd sierra-estatese
```

### **Step 2: Copy the .env.local File**

1. Copy `.env.local-UPDATED` from outputs
2. Rename it to `.env.local` (remove the `-UPDATED` part)
3. Paste it in your project root folder (`sierra-estatese/.env.local`)

**Your credentials are already in there!** ✅

### **Step 3: Create Folder Structure**

```
sierra-estatese/
├── lib/                    ← Create this folder
├── app/
│   ├── landing/           ← Create this folder
│   └── api/               ← Create these folders
│       ├── leads/
│       ├── viewing-requests/
│       └── properties/
│           └── sync/
├── components/            ← Create this folder
└── scripts/               ← Create this folder
```

### **Step 4: Copy Code Files**

Copy these files to their locations:

**lib/ folder:**
- `firebase-config-UPDATED.ts` → Rename to `firebase-config.ts`
- `propertyFinder-service.ts`

**app/landing/ folder:**
- `page.tsx`

**components/ folder:**
- `PropertyMap.tsx`

**scripts/ folder:**
- `importFromExcel.ts`

**API Routes:**
- `api-routes.ts` → Split into 3 files (see below)

### **Step 5: Create API Routes**

The `api-routes.ts` file contains 3 API routes. Create them separately:

**File 1: `app/api/leads/route.ts`**
Copy from `api-routes.ts` - lines for `/leads` endpoint (first section)

**File 2: `app/api/viewing-requests/route.ts`**
Copy from `api-routes.ts` - lines for `/viewing-requests` endpoint (second section)

**File 3: `app/api/properties/sync/route.ts`**
Create folder: `app/api/properties/sync/`
Copy from `api-routes.ts` - lines for `/properties/sync` endpoint (third section)

### **Step 6: Install Dependencies**

```bash
npm install firebase leaflet react-leaflet axios
npm install --save-dev @types/leaflet xlsx
```

### **Step 7: Set Up Firestore Collections**

Go to [Firebase Console](https://console.firebase.google.com)

1. Select "sierra-estates" project
2. Click "Firestore Database"
3. Create these 4 collections:

#### **Collection 1: listings**
```
Document structure:
{
  code: "PROP_001",
  timestamp: (timestamp),
  name: "Agent Name",
  mobile: "1234567890",
  availability: "Available",
  bedrooms: 2,
  location: "New Cairo",
  unitPrice: 28000,
  furnitureStatus: "Half Furnished",
  propertyType: "Apartment",
  owner: "Owner",
  rentPeriodType: ["Yearly", "Monthly"],
  agentName: "Ahmed Fawzy",
  latitude: 30.0088,
  longitude: 31.2855,
  createdAt: (timestamp),
  updatedAt: (timestamp),
  featured: false
}
```

#### **Collection 2: leads**
```
Document structure:
{
  propertyCode: "PROP_001",
  visitorName: "John Doe",
  visitorEmail: "john@example.com",
  visitorPhone: "+971501234567",
  message: "Interested",
  source: "inquiry",
  status: "new",
  createdAt: (timestamp),
  updatedAt: (timestamp)
}
```

#### **Collection 3: viewing_requests**
```
Document structure:
{
  propertyCode: "PROP_001",
  visitorName: "John Doe",
  visitorEmail: "john@example.com",
  visitorPhone: "+971501234567",
  preferredDate: "2026-05-15",
  preferredTime: "14:30",
  numberOfPeople: 2,
  message: "Request",
  status: "pending",
  createdAt: (timestamp),
  updatedAt: (timestamp)
}
```

#### **Collection 4: compounds**
```
Document structure:
{
  name: "New Cairo",
  latitude: 30.0088,
  longitude: 31.2855,
  listingCount: 5,
  createdAt: (timestamp)
}
```

### **Step 8: Add Security Rules**

In Firebase Console → Firestore → Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /listings/{document=**} {
      allow read;
    }
    match /leads/{document=**} {
      allow create;
      allow read, update: if request.auth != null;
    }
    match /viewing_requests/{document=**} {
      allow create;
      allow read, update: if request.auth != null;
    }
    match /compounds/{document=**} {
      allow read;
    }
  }
}
```

Click "Publish"

### **Step 9: Import Your Data**

```bash
# Copy your Excel file to: sierra-estatese/data/properties.xlsx

# Run import script
npx ts-node scripts/importFromExcel.ts ./data/properties.xlsx
```

You should see: `✅ Successfully imported X properties to Firestore`

### **Step 10: Run Locally**

```bash
npm run dev
```

Open: **http://localhost:3000/landing**

You should see:
✅ Header "Sierra Estatese Properties"
✅ Search filters
✅ Interactive map
✅ Property listings

---

## 🧪 Test the Application

### **Test Search**
- Type a location in search box
- Try different filters
- Properties should update

### **Test Map**
- Hover over numbered markers
- Click on properties
- Details should appear

### **Test Forms**
- Select a property
- Click "Viewing" or "Inquiry" tab
- Fill form and submit
- Check Firestore for new documents

### **Test API**
```bash
# Test leads API
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "propertyCode": "PROP_001",
    "visitorName": "Test",
    "visitorEmail": "test@example.com",
    "visitorPhone": "+971501234567",
    "message": "Test",
    "source": "inquiry"
  }'
```

---

## 📱 Your Project Structure (Final)

```
sierra-estatese/
├── lib/
│   ├── firebase-config.ts       ✅ Your Firebase setup
│   └── propertyFinder-service.ts ✅ API client
├── app/
│   ├── landing/
│   │   └── page.tsx             ✅ Landing page
│   └── api/
│       ├── leads/
│       │   └── route.ts         ✅ API route 1
│       ├── viewing-requests/
│       │   └── route.ts         ✅ API route 2
│       └── properties/
│           └── sync/
│               └── route.ts     ✅ API route 3
├── components/
│   └── PropertyMap.tsx          ✅ Map component
├── scripts/
│   └── importFromExcel.ts       ✅ Data import
├── data/
│   └── properties.xlsx          ✅ Your Excel file
├── .env.local                   ✅ Your credentials
├── package.json                 ✅ Dependencies
└── (other Next.js files...)
```

---

## 🎯 Next Actions

1. **Download** `.env.local-UPDATED` and `firebase-config-UPDATED.ts`
2. **Create** Next.js project with command above
3. **Rename and copy** files to correct locations
4. **Create** Firestore collections in Firebase Console
5. **Add** security rules
6. **Run** `npm install` and `npm run dev`
7. **Import** your Excel data
8. **Test** everything works

---

## 🚀 Deploy to Production

When ready:

```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
npm install -g vercel
vercel --prod
```

---

## 📞 Your Credentials (Keep Safe!)

```
Firebase Project: sierra-estates
API Key: AIzaSy...your-own-key-from-firebase-console
Project ID: sierra-estates
Auth Domain: sierra-estates.firebaseapp.com

⚠️  NEVER share these publicly!
⚠️  NEVER commit .env.local to git!
⚠️  NEVER put credentials in code!
```

---

## ✨ You're All Set!

Everything is configured and ready to go. Just follow the 10 steps above and you'll have a live real estate platform in about 30 minutes!

**Questions?** Check:
- SETUP_GUIDE.md for detailed help
- API_DOCUMENTATION.md for API examples
- IMPLEMENTATION_CHECKLIST.md to track progress

---

Good luck! 🚀 Your Sierra Estatese platform awaits! 🏡
