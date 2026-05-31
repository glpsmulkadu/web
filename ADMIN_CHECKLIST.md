# Admin Panel - Quick Setup Checklist

Complete these steps to get your admin panel working:

---

## ✅ Firebase Setup

- [ ] **Create Firebase Project**
  - [ ] Go to [Firebase Console](https://console.firebase.google.com/)
  - [ ] Create new project named "GLPS-Mulkadu-Admin"
  - [ ] Wait for project to be created

- [ ] **Enable Authentication**
  - [ ] Go to Build > Authentication
  - [ ] Click "Get started"
  - [ ] Enable "Email/Password" provider
  - [ ] Save

- [ ] **Get Firebase Credentials**
  - [ ] Go to Project Settings (gear icon)
  - [ ] Go to "Your apps" section
  - [ ] Click Web icon (</>) to add web app
  - [ ] Copy the Firebase config object

---

## 📝 Code Configuration

- [ ] **Update firebase-config.js**
  - [ ] Open `js/firebase-config.js`
  - [ ] Replace `YOUR_API_KEY` with actual API key
  - [ ] Replace `YOUR_AUTH_DOMAIN` with actual domain
  - [ ] Replace `YOUR_PROJECT_ID` with actual project ID
  - [ ] Replace other credentials
  - [ ] Save file

---

## 👤 Create Admin Account

- [ ] **Add Admin User in Firebase**
  - [ ] Go to Firebase Console
  - [ ] Go to Build > Authentication > Users tab
  - [ ] Click "Add user"
  - [ ] Email: `admin@example.com`
  - [ ] Password: (create strong password, save it!)
  - [ ] Click "Add user"

---

## 🧪 Test the Admin Panel

- [ ] **Test Login**
  - [ ] Open browser
  - [ ] Go to: `http://localhost:8000/admin/login.html`
  - [ ] Enter email: `admin@example.com`
  - [ ] Enter password: (the one you just created)
  - [ ] Click "Sign In"
  - [ ] Should see: ✅ Success message
  - [ ] Should be redirected to dashboard

- [ ] **Verify Dashboard**
  - [ ] Check that sidebar is visible
  - [ ] Check that your email shows in header
  - [ ] Check that all sections are visible in sidebar
  - [ ] Click different sections to test navigation

- [ ] **Test Logout**
  - [ ] Click red "Logout" button
  - [ ] Should be redirected to login page
  - [ ] Try accessing `/admin/dashboard.html` directly
  - [ ] Should redirect to login automatically

- [ ] **Test Mobile Responsive**
  - [ ] Press F12 to open Developer Tools
  - [ ] Click mobile device icon
  - [ ] Test at 375px width (mobile)
  - [ ] Test menu toggle button
  - [ ] Check that layout is responsive

---

## 🔒 Security Configuration

- [ ] **Firestore Security Rules** (if using Firestore)
  - [ ] Go to Firebase Console
  - [ ] Build > Firestore Database
  - [ ] Go to Rules tab
  - [ ] Set up rules to only allow authenticated admins

- [ ] **Add .gitignore Rule** (if using git)
  - [ ] Add to `.gitignore`:
    ```
    js/firebase-config.js
    .env.local
    ```

---

## 📱 Optional: Allow More Admins

If you want to add more admin accounts:

- [ ] Go to Firebase Console
- [ ] Go to Authentication > Users
- [ ] Click "Add user"
- [ ] Enter email and password
- [ ] Click "Add user"

Each admin can now login to the panel!

---

## 📚 Next Steps (Optional)

When you're ready for more features:

- [ ] Read `ADMIN_DEVELOPER.md` for module documentation
- [ ] Plan your first feature (announcements, gallery, etc)
- [ ] Add Firestore collections for content
- [ ] Create edit/delete functionality

---

## 🆘 Troubleshooting

**Issue:** Login page keeps redirecting  
**Solution:** Check that firebase-config.js has correct credentials

**Issue:** "Firebase is not defined"  
**Solution:** Make sure scripts have `type="module"`

**Issue:** Sidebar not working on mobile  
**Solution:** Clear browser cache with Ctrl+Shift+Del

**Issue:** Cannot add admin user in Firebase  
**Solution:** Make sure you enabled Email/Password authentication

---

## 💾 Files You Just Got

```
✅ js/firebase-config.js           (Firebase setup)
✅ admin/login.html                (Login page)
✅ admin/dashboard.html            (Dashboard page)
✅ admin/js/auth.js                (Auth module)
✅ admin/js/dashboard.js           (Dashboard logic)
✅ admin/css/admin.css             (Styling)
✅ ADMIN_SETUP.md                  (This guide)
✅ ADMIN_DEVELOPER.md              (Developer reference)
✅ ADMIN_CHECKLIST.md              (This checklist)
```

---

## 🎉 Completion Status

When all items are checked, your admin panel is ready!

- [ ] Firebase project created
- [ ] Credentials updated in firebase-config.js
- [ ] Admin account created
- [ ] Login works
- [ ] Dashboard accessible
- [ ] Logout works
- [ ] Mobile responsive
- [ ] Ready for next features!

---

**Start Date:** May 27, 2026  
**Status:** ⏳ In Progress  
**Next Step:** Configure Firebase credentials and test login

Good luck! 🚀
