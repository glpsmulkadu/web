# Admin Panel Setup Guide

## 📋 Overview

You now have a complete admin panel foundation with:
- **Firebase Authentication** (email/password login)
- **Protected Dashboard** (redirects unauthenticated users)
- **Responsive Sidebar** (works on mobile & desktop)
- **Modular JavaScript** (easy to extend)
- **Modern UI** (matches your website design)

---

## 📁 File Structure

```
your-website/
├── js/
│   └── firebase-config.js          # 🔑 Firebase configuration
├── admin/
│   ├── login.html                  # 🔐 Login page
│   ├── dashboard.html              # 📊 Main dashboard
│   ├── css/
│   │   └── admin.css               # 🎨 Admin panel styles
│   └── js/
│       ├── auth.js                 # 🛡️ Authentication module
│       └── dashboard.js            # 📈 Dashboard logic
└── index.html                      # (existing homepage)
```

---

## 🔧 Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: **GLPS-Mulkadu-Admin**
4. Choose your region (preferably India)
5. Click "Create project" and wait for completion

### Step 2: Enable Firebase Services

#### Enable Authentication
1. In Firebase Console, go to **Build > Authentication**
2. Click **"Get started"**
3. Click **Email/Password** provider
4. Enable it and save

#### Enable Firestore (for future use)
1. Go to **Build > Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select your region
5. Click **"Create"**

#### Enable Storage (for future use)
1. Go to **Build > Storage**
2. Click **"Get started"**
3. Click **"Next"** through the security rules
4. Choose your region

### Step 3: Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Go to **"Your apps"** section
3. Click **Web** (</>) icon to add web app
4. Name it: **"Admin Panel"**
5. Click **"Register app"**
6. Copy the Firebase config object

Should look like:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 4: Update Firebase Configuration

Open `js/firebase-config.js` and replace the config values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 5: Create Admin Account

1. In Firebase Console, go to **Build > Authentication**
2. Go to the **Users** tab
3. Click **"Add user"**
4. Enter email: `admin@example.com`
5. Enter password: (create a strong password)
6. Click **"Add user"**

Now you can login with these credentials!

---

## 🚀 Testing the Admin Panel

1. **Open login page:**
   ```
   http://localhost:8000/admin/login.html
   ```

2. **Enter credentials:**
   - Email: `admin@example.com`
   - Password: (your password from Step 5)

3. **You should see:**
   - ✅ Login success message
   - ✅ Redirect to dashboard
   - ✅ Dashboard with sidebar navigation
   - ✅ User info in header

4. **Test logout:**
   - Click red "Logout" button
   - Should redirect to login page
   - Cannot access dashboard without login

---

## 🔐 Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit Firebase config to git:**
   - Your API keys are visible in the file
   - In production, use environment variables
   - For now, keep `js/firebase-config.js` in `.gitignore`

2. **Firestore Security Rules** (for future)
   - Only allow admin users to read/write
   - Set up proper access control before going live

3. **Strong Passwords**
   - Use strong admin passwords
   - Consider 2FA in future phases

---

## 📚 Module Documentation

### auth.js

Handles all Firebase authentication:

```javascript
import { adminLogin, adminLogout, onAuthChange, getCurrentUser } from './admin/js/auth.js';

// Login
const user = await adminLogin(email, password);

// Logout
await adminLogout();

// Listen to auth changes
onAuthChange((user) => {
  if (user) console.log('Logged in:', user.email);
});

// Get current user
const currentUser = getCurrentUser();
```

### dashboard.js

Handles dashboard logic and UI:

```javascript
import { 
  initDashboard,           // Initialize dashboard
  protectDashboardPage,    // Redirect if not logged in
  setupSidebarToggle,      // Mobile menu toggle
  setupNavigation,         // Sidebar navigation
  toggleSidebar,           // Open/close sidebar
  closeSidebar,            // Close sidebar
  showSection,             // Show dashboard section
  setActiveSection         // Set active nav link
} from './admin/js/dashboard.js';
```

---

## 🎯 Next Steps (Not Included Yet)

Here's what you can add next:

### Phase 1: Content Management
- [ ] Add/edit/delete announcements
- [ ] Save announcements to Firestore
- [ ] Display announcements on website

### Phase 2: Media Management
- [ ] Upload gallery images to Firebase Storage
- [ ] Manage image categories
- [ ] Upload videos (YouTube embed or storage)

### Phase 3: Staff Management
- [ ] Add/edit staff profiles
- [ ] Upload staff photos
- [ ] Manage staff information

### Phase 4: Advanced Features
- [ ] User role management
- [ ] Activity logging
- [ ] Email notifications
- [ ] Backup/restore data

---

## 🛠️ Customization

### Change Colors

Edit `admin/css/admin.css` CSS variables:

```css
:root {
  --primary: #1a7a41;        /* Green */
  --accent: #d4930d;         /* Gold */
  --danger: #ef4444;         /* Red for logout */
  /* ... other colors ... */
}
```

### Add Sidebar Items

In `admin/dashboard.html`, add to the sidebar menu:

```html
<li>
  <a href="#" data-section="new-section">
    <span class="icon">📱</span>
    <span>New Feature</span>
  </a>
</li>
```

Then add the section HTML:

```html
<section id="new-section" class="dashboard-section">
  <div class="page-title">
    <span class="icon">📱</span>
    <span>New Feature</span>
  </div>
  <!-- Your content here -->
</section>
```

---

## 🐛 Troubleshooting

### Issue: Login page redirects before entering credentials

**Solution:** Firebase config is not set up. Check that `js/firebase-config.js` has your correct config values.

### Issue: "Firebase is not defined" error

**Solution:** Make sure all scripts use `type="module"` and import statements are correct.

### Issue: Dashboard shows "Loading..." forever

**Solution:** 
1. Check browser console for errors
2. Verify Firebase config
3. Make sure you're logged in as admin user

### Issue: Sidebar doesn't work on mobile

**Solution:** Clear browser cache and refresh page.

---

## 📞 Support

For Firebase issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)

---

## ✨ Features Included

✅ Firebase email/password authentication  
✅ Protected dashboard pages  
✅ Responsive sidebar navigation  
✅ Mobile-friendly design  
✅ User session management  
✅ Logout functionality  
✅ Error handling with user-friendly messages  
✅ Loading states  
✅ Modern UI matching website design  

---

## 📝 File Sizes (Approximate)

- `firebase-config.js`: 500 bytes
- `admin/js/auth.js`: 3 KB
- `admin/js/dashboard.js`: 5 KB
- `admin/css/admin.css`: 12 KB
- `admin/login.html`: 4 KB
- `admin/dashboard.html`: 8 KB

**Total:** ~32 KB (very lightweight!)

---

**Created:** May 27, 2026  
**Version:** 1.0.0 (Foundation)  
**Status:** ✅ Ready to use
