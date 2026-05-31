# 📂 File Organization Guide

## Where to Copy Each File

### **Your Downloaded Files**

```
outputs/
├── .env.local-UPDATED              → Rename and copy to: project-root/.env.local
├── firebase-config-UPDATED.ts      → Copy to: lib/firebase-config.ts
├── propertyFinder-service.ts       → Copy to: lib/propertyFinder-service.ts
├── page.tsx                        → Copy to: app/landing/page.tsx
├── PropertyMap.tsx                 → Copy to: components/PropertyMap.tsx
├── importFromExcel.ts              → Copy to: scripts/importFromExcel.ts
├── package.json                    → Copy to: project-root/package.json
├── API_ROUTES_SPLIT.txt            → Open this file - contains 3 API routes
│
└── Documentation:
    ├── 00_READ_ME_FIRST.md
    ├── README.md
    ├── SETUP_GUIDE.md
    ├── IMPLEMENTATION_CHECKLIST.md
    ├── API_DOCUMENTATION.md
    ├── QUICK_START_WITH_YOUR_FIREBASE.md
    └── This file
```

---

## Step-by-Step File Placement

### **1. Create Project Root**
```
C:\Users\YourName\Desktop\sierra-blue\
```

### **2. Create Subdirectories**
```
sierra-blue/
├── lib/                           ← Create this
├── app/
│   ├── landing/                   ← Create this
│   └── api/
│       ├── leads/                 ← Create this
│       ├── viewing-requests/       ← Create this
│       └── properties/
│           └── sync/              ← Create this
├── components/                    ← Create this
├── scripts/                       ← Create this
└── data/                          ← Create this
```

### **3. Copy Files**

#### **Root Level**
```
sierra-blue/.env.local              ← FROM .env.local-UPDATED (rename!)
sierra-blue/package.json            ← FROM package.json (overwrite existing)
```

#### **lib/ Folder**
```
sierra-blue/lib/firebase-config.ts              ← FROM firebase-config-UPDATED.ts (rename!)
sierra-blue/lib/propertyFinder-service.ts      ← FROM propertyFinder-service.ts
```

#### **app/landing/ Folder**
```
sierra-blue/app/landing/page.tsx                ← FROM page.tsx
```

#### **components/ Folder**
```
sierra-blue/components/PropertyMap.tsx          ← FROM PropertyMap.tsx
```

#### **scripts/ Folder**
```
sierra-blue/scripts/importFromExcel.ts          ← FROM importFromExcel.ts
```

#### **API Routes** (From API_ROUTES_SPLIT.txt)
```
sierra-blue/app/api/leads/route.ts              ← Copy FIRST section from API_ROUTES_SPLIT.txt
sierra-blue/app/api/viewing-requests/route.ts  ← Copy SECOND section from API_ROUTES_SPLIT.txt
sierra-blue/app/api/properties/sync/route.ts   ← Copy THIRD section from API_ROUTES_SPLIT.txt
```

#### **data/ Folder** (Your Excel File)
```
sierra-blue/data/properties.xlsx                ← Download your Excel file separately
                                                   and place it here
```

---

## File Renaming Guide

| Downloaded Name | Rename To | Location |
|-----------------|-----------|----------|
| `.env.local-UPDATED` | `.env.local` | Project root |
| `firebase-config-UPDATED.ts` | `firebase-config.ts` | `lib/` |
| (others) | (no change needed) | (as shown above) |

---

## Complete File Tree After Setup

```
sierra-blue/
│
├── .env.local                              ✓ Your Firebase credentials
├── package.json                            ✓ Dependencies
│
├── lib/
│   ├── firebase-config.ts                  ✓ Firebase setup
│   └── propertyFinder-service.ts           ✓ API client
│
├── app/
│   ├── layout.tsx                          (default Next.js)
│   ├── page.tsx                            (default Next.js)
│   │
│   ├── landing/
│   │   └── page.tsx                        ✓ Your landing page
│   │
│   └── api/
│       ├── leads/
│       │   └── route.ts                    ✓ API route 1
│       │
│       ├── viewing-requests/
│       │   └── route.ts                    ✓ API route 2
│       │
│       └── properties/
│           └── sync/
│               └── route.ts                ✓ API route 3
│
├── components/
│   └── PropertyMap.tsx                     ✓ Map component
│
├── scripts/
│   └── importFromExcel.ts                  ✓ Import script
│
├── data/
│   └── properties.xlsx                     ✓ Your Excel file
│
├── node_modules/                           (created by npm install)
├── .gitignore                              (default Next.js)
├── tsconfig.json                           (default Next.js)
├── next.config.js                          (default Next.js)
├── tailwind.config.ts                      (default Next.js)
├── postcss.config.js                       (default Next.js)
│
└── Documentation/ (optional, keep for reference)
    ├── 00_READ_ME_FIRST.md
    ├── README.md
    ├── SETUP_GUIDE.md
    ├── IMPLEMENTATION_CHECKLIST.md
    ├── API_DOCUMENTATION.md
    ├── QUICK_START_WITH_YOUR_FIREBASE.md
    └── FILE_ORGANIZATION.md (this file)
```

---

## How to Copy Files on Windows

### **Method 1: Using File Explorer**
1. Open Downloads folder (where sierra-blue-saas.zip was extracted)
2. Right-click on file → Copy
3. Navigate to sierra-blue folder
4. Navigate to destination folder
5. Right-click → Paste

### **Method 2: Using Command Prompt**
```batch
REM Example: Copy firebase-config-UPDATED.ts to lib folder
copy C:\Users\YourName\Downloads\firebase-config-UPDATED.ts C:\Users\YourName\Desktop\sierra-blue\lib\firebase-config.ts

REM Example: Copy PropertyMap.tsx to components folder
copy C:\Users\YourName\Downloads\PropertyMap.tsx C:\Users\YourName\Desktop\sierra-blue\components\
```

### **Method 3: Using VS Code**
1. Open VS Code
2. File → Open Folder → Select sierra-blue
3. Use Explorer panel to create folders
4. Copy/paste files using right-click menu

---

## API Routes Splitting Guide

The file `API_ROUTES_SPLIT.txt` contains 3 routes separated by `---` lines:

```
Route 1: app/api/leads/route.ts
---
Route 2: app/api/viewing-requests/route.ts
---
Route 3: app/api/properties/sync/route.ts
```

**To split:**
1. Open `API_ROUTES_SPLIT.txt`
2. Copy everything from start until first `---`
3. Paste into `app/api/leads/route.ts`
4. Copy section between first `---` and second `---`
5. Paste into `app/api/viewing-requests/route.ts`
6. Copy everything after second `---`
7. Paste into `app/api/properties/sync/route.ts`

---

## Verification Checklist

After copying all files, verify:

```
✓ .env.local exists in root
✓ lib/firebase-config.ts exists
✓ lib/propertyFinder-service.ts exists
✓ app/landing/page.tsx exists
✓ components/PropertyMap.tsx exists
✓ scripts/importFromExcel.ts exists
✓ app/api/leads/route.ts exists
✓ app/api/viewing-requests/route.ts exists
✓ app/api/properties/sync/route.ts exists
✓ data/properties.xlsx exists
✓ package.json updated
```

---

## Common Issues

### **File Not Found Error**
- Check file is in correct folder
- Verify file naming (case-sensitive on Mac/Linux)
- Check for hidden file extensions

### **Cannot find module errors**
- Verify firebase-config.ts is in lib/ folder
- Check propertyFinder-service.ts is in lib/ folder
- Ensure paths in imports match actual file locations

### **API Routes Not Working**
- Check all 3 route files are created
- Verify folder structure: app/api/leads/, etc.
- File must be named route.ts (not route.tsx)

### **Env Variables Not Loading**
- Check .env.local is in PROJECT ROOT (not in app/ or lib/)
- Verify variable names start with NEXT_PUBLIC_ (if used in frontend)
- Restart dev server after changing .env.local

---

## Quick Setup Command (Automated)

On Windows PowerShell:
```powershell
# Navigate to your project
cd C:\Users\YourName\Desktop\sierra-blue

# Create all folders at once
mkdir lib, "app\landing", "app\api\leads", "app\api\viewing-requests", "app\api\properties\sync", components, scripts, data

# Then copy files manually or use commands
```

---

## Next Steps After File Organization

1. ✅ All files copied and renamed
2. ✅ Run: `npm install`
3. ✅ Create Firestore collections in Firebase Console
4. ✅ Add security rules
5. ✅ Run: `npm run dev`
6. ✅ Test at http://localhost:3000/landing

---

## Support

- **Files confused?** → Reference this guide
- **API routes unclear?** → Check API_ROUTES_SPLIT.txt
- **Setup stuck?** → Read QUICK_START_WITH_YOUR_FIREBASE.md
- **Need detailed help?** → See SETUP_GUIDE.md

---

Good luck! Your file organization is crucial for the project to work. Take your time and verify each file is in the right place. 🚀
