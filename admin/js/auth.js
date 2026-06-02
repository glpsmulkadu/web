/* ============================================
   Authentication Module
   Firebase Authentication Handler
   --------------------------------------------
   This module uses the Firebase v10 modular CDN imports
   and imports the initialized `auth` instance from
   `../../js/firebase-config.js`.
   It exposes helper functions and will automatically
   attach a login form handler if a form with id
   `login-form` exists on the page.
   ============================================ */

import { auth } from '../../js/firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// ============================================
// 🔐 AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Admin Login
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<object>} Firebase user
 */
export async function adminLogin(email, password) {
  try {
    // Remember session in browser
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login successful:', userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Login failed:', error.code || error.message);
    throw new Error(getErrorMessage(error.code || error.message));
  }
}

/**
 * Admin Logout
 */
export async function adminLogout() {
  try {
    await signOut(auth);
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('❌ Logout failed:', error.code || error.message);
    throw new Error(getErrorMessage(error.code || error.message));
  }
}

/**
 * Monitor Authentication State
 * @param {function} callback - Called with user or null
 * @returns {function} Unsubscribe
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('👤 User logged in:', user.email);
      callback(user);
    } else {
      console.log('👤 User logged out');
      callback(null);
    }
  });
}

/**
 * Get Current User
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Convert Firebase Error Codes to User-Friendly Messages
 */
function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'Email not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many failed login attempts. Try again later.',
    'auth/operation-not-allowed': 'Email/password sign in is not enabled',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/email-already-in-use': 'Email already in use',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// ============================================
// LOGIN FORM HANDLER (auto-bind if present)
// ============================================

// This module will attach a submit handler if the page
// contains a form with id `login-form`. It is safe to
// keep the handler here so the form HTML stays minimal.
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return; // nothing to do on pages without the form

  const loginBtn = document.getElementById('login-btn');
  const alertBox = document.getElementById('alert');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  function showAlert(message, type = 'error') {
    if (!alertBox) {
      alert(message);
      return;
    }
    alertBox.textContent = message;
    alertBox.className = `alert show alert-${type}`;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (emailInput && emailInput.value || '').trim();
    const password = (passwordInput && passwordInput.value) || '';

    if (!email || !password) {
      showAlert('Please fill in all fields', 'error');
      return;
    }

    try {
      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.classList.add('loading');
      }
      if (alertBox) alertBox.classList.remove('show');

      const user = await adminLogin(email, password);

      showAlert(`Welcome ${user.email.split('@')[0]}!`, 'success');

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = './web/admin/dashboard.html';
      }, 400);
    } catch (err) {
      showAlert(err.message || 'Login failed. Please try again.', 'error');
      if (passwordInput) passwordInput.value = '';
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
      }
      console.error('Login error:', err);
    }
  });

  // Clear alerts on focus
  [emailInput, passwordInput].forEach((el) => {
    if (el) el.addEventListener('focus', () => {
      if (alertBox) alertBox.classList.remove('show');
    });
  });
});

// ============================================
// ✅ EXPORTS
// ============================================
export { auth };
