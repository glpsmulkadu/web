# Admin Panel - Developer Reference

Quick reference for using the admin panel modules.

---

## Firebase Configuration

**File:** `js/firebase-config.js`

Exports Firebase services as ES modules.

```javascript
import { auth, db, storage } from '../js/firebase-config.js';
```

### Exported Services
- `auth` - Firebase Authentication instance
- `db` - Firestore database instance
- `storage` - Cloud Storage instance

---

## Authentication Module

**File:** `admin/js/auth.js`

Handles all authentication operations.

### Functions

#### `adminLogin(email, password)`
Log in an admin user.

```javascript
import { adminLogin } from './auth.js';

try {
  const user = await adminLogin('admin@example.com', 'password123');
  console.log('Logged in as:', user.email);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

**Parameters:**
- `email` (string) - Admin email
- `password` (string) - Admin password

**Returns:** Firebase user object

**Throws:** Error with user-friendly message

---

#### `adminLogout()`
Log out the current admin user.

```javascript
import { adminLogout } from './auth.js';

try {
  await adminLogout();
  console.log('Logged out successfully');
} catch (error) {
  console.error('Logout failed:', error.message);
}
```

**Returns:** Promise (void)

**Throws:** Error if logout fails

---

#### `onAuthChange(callback)`
Listen for authentication state changes.

```javascript
import { onAuthChange } from './auth.js';

const unsubscribe = onAuthChange((user) => {
  if (user) {
    console.log('User logged in:', user.email);
    // User is logged in
  } else {
    console.log('User logged out');
    // User is logged out
  }
});

// To stop listening:
// unsubscribe();
```

**Parameters:**
- `callback` (function) - Called with user object (or null if logged out)

**Returns:** Unsubscribe function

---

#### `getCurrentUser()`
Get the currently logged-in user.

```javascript
import { getCurrentUser } from './auth.js';

const user = getCurrentUser();
if (user) {
  console.log('Current user:', user.email);
} else {
  console.log('No user logged in');
}
```

**Returns:** User object or null

---

## Dashboard Module

**File:** `admin/js/dashboard.js`

Handles dashboard UI and logic.

### Page Protection

#### `protectDashboardPage()`
Protect a page - redirects to login if not authenticated.

**Call at the start of dashboard pages:**

```html
<script type="module">
  import { protectDashboardPage } from '../admin/js/dashboard.js';
  
  if (!protectDashboardPage()) {
    throw new Error('Access denied');
  }
</script>
```

**Returns:** boolean (true if authenticated)

---

### Dashboard Initialization

#### `initDashboard()`
Initialize the dashboard (auth listeners, logout button, etc).

```javascript
import { initDashboard } from './dashboard.js';

// Call once on page load
window.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});
```

**Does:**
- Sets up auth state listener
- Displays user information
- Handles logout
- Redirects if logged out

---

### Sidebar & Navigation

#### `setupSidebarToggle()`
Set up mobile sidebar toggle button.

```javascript
import { setupSidebarToggle } from './dashboard.js';

setupSidebarToggle();
```

---

#### `setupNavigation()`
Initialize sidebar navigation sections.

```javascript
import { setupNavigation } from './dashboard.js';

setupNavigation();
```

**Requires HTML elements:**
```html
<a href="#" data-section="section-id">Link</a>
<section id="section-id" class="dashboard-section">Content</section>
```

---

#### `toggleSidebar()`
Toggle sidebar open/closed (mobile).

```javascript
import { toggleSidebar } from './dashboard.js';

toggleSidebar();
```

---

#### `closeSidebar()`
Close the sidebar.

```javascript
import { closeSidebar } from './dashboard.js';

closeSidebar();
```

---

### Section Management

#### `showSection(sectionId)`
Show a specific dashboard section.

```javascript
import { showSection } from './dashboard.js';

showSection('announcements');  // Show announcements section
```

**Parameters:**
- `sectionId` (string) - ID of section to show

---

#### `setActiveSection(sectionId)`
Set the active sidebar item.

```javascript
import { setActiveSection } from './dashboard.js';

setActiveSection('announcements');
```

**Parameters:**
- `sectionId` (string) - ID of section

---

## Complete Dashboard Example

Here's a minimal complete example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My Dashboard</title>
  <link rel="stylesheet" href="admin/css/admin.css">
</head>
<body>
  <div class="admin-container">
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <h2>Admin</h2>
      </div>
      <ul class="sidebar-menu">
        <li><a href="#" data-section="section1">Section 1</a></li>
        <li><a href="#" data-section="section2">Section 2</a></li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <header class="admin-header">
        <button id="sidebar-toggle">☰</button>
        <h1>Dashboard</h1>
        <button id="logout-btn">Logout</button>
      </header>

      <div class="dashboard-main">
        <section id="section1" class="dashboard-section show">
          Content 1
        </section>
        <section id="section2" class="dashboard-section">
          Content 2
        </section>
      </div>
    </div>
  </div>

  <script type="module">
    import { 
      initDashboard, 
      protectDashboardPage, 
      setupSidebarToggle, 
      setupNavigation 
    } from './admin/js/dashboard.js';

    if (!protectDashboardPage()) return;

    window.addEventListener('DOMContentLoaded', () => {
      initDashboard();
      setupSidebarToggle();
      setupNavigation();
    });
  </script>
</body>
</html>
```

---

## Working with Firestore (Coming Soon)

When you're ready to add content management:

```javascript
import { db } from '../js/firebase-config.js';
import { collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Add announcement
async function addAnnouncement(title, content) {
  try {
    const docRef = await addDoc(collection(db, 'announcements'), {
      title,
      content,
      createdAt: new Date()
    });
    console.log('Added:', docRef.id);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get announcements
async function getAnnouncements() {
  try {
    const snapshot = await getDocs(collection(db, 'announcements'));
    const announcements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return announcements;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## CSS Classes

### Layout
- `.admin-container` - Main flex container
- `.sidebar` - Sidebar navigation
- `.main-content` - Main content area
- `.admin-header` - Top header
- `.dashboard-main` - Content container
- `.dashboard-section` - Page sections

### Components
- `.card` - Content card with shadow
- `.form-group` - Form field container
- `.form-button` - Action button
- `.alert` - Alert messages
- `.badge` - Status badge
- `.stat-box` - Statistics box

### Utilities
- `.hidden` - Display none
- `.text-center` - Text align center
- `.text-muted` - Muted text color
- `.mt-10`, `.mt-20`, `.mt-30` - Margin top
- `.mb-10`, `.mb-20`, `.mb-30` - Margin bottom
- `.gap-10`, `.gap-20` - Gap between items
- `.flex`, `.flex-col` - Flexbox
- `.items-center` - Align items center
- `.justify-center` - Justify content center
- `.justify-between` - Justify space between

---

## Error Messages

Auth module converts Firebase errors to user-friendly messages:

| Firebase Error | User Message |
|---|---|
| `auth/invalid-email` | Invalid email address |
| `auth/user-not-found` | Email not found |
| `auth/wrong-password` | Incorrect password |
| `auth/too-many-requests` | Too many failed attempts. Try later. |
| `auth/user-disabled` | Account has been disabled |
| `auth/weak-password` | Password should be 6+ characters |
| `auth/email-already-in-use` | Email already in use |
| `auth/network-request-failed` | Network error. Check connection. |

---

## Color Variables

Defined in `admin/css/admin.css`:

```css
--primary: #1a7a41;           /* Green */
--primary-dark: #146133;
--primary-light: #22a855;
--accent: #d4930d;            /* Gold */
--accent-dark: #b37a08;
--accent-light: #f0b429;
--bg: #eef1f5;                /* Light gray background */
--card: #ffffff;              /* White cards */
--text: #1f2937;              /* Dark text */
--text-secondary: #4b5563;
--text-muted: #9ca3af;        /* Gray text */
--border: #e5e7eb;
--success: #10b981;           /* Green */
--danger: #ef4444;            /* Red */
--warning: #f59e0b;           /* Orange */
```

---

## Best Practices

1. **Always use ES modules:** Use `import/export`, not global variables
2. **Handle errors:** Wrap async operations in try/catch
3. **Protect pages:** Call `protectDashboardPage()` on dashboard pages
4. **Set up listeners:** Call `initDashboard()` and `setupNavigation()`
5. **Security:** Never store secrets in client code
6. **Testing:** Test login/logout functionality after any changes

---

**Last Updated:** May 27, 2026  
**Version:** 1.0.0
