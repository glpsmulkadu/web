// Reusable admin utilities for the dashboard.

const TOAST_CONTAINER_ID = 'admin-toast-container';
const TOAST_DURATION = 3000;

const toastColors = {
  success: '#10b981',
  error: '#ef4444',
  info: '#2563eb',
};

const toastBackgrounds = {
  success: 'rgba(16, 185, 129, 0.1)',
  error: 'rgba(239, 68, 68, 0.1)',
  info: 'rgba(37, 99, 235, 0.1)',
};

/**
 * Create or return the shared toast container.
 */
function getToastContainer() {
  let container = document.getElementById(TOAST_CONTAINER_ID);

  if (!container) {
    container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.style.zIndex = '9999';
    container.style.maxWidth = '320px';
    document.body.appendChild(container);
  }

  return container;
}

/**
 * Show a toast notification in the admin panel.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
export function showToast(message, type = 'info') {
  const container = getToastContainer();
  const toast = document.createElement('div');

  const color = toastColors[type] || toastColors.info;
  const background = toastBackgrounds[type] || toastBackgrounds.info;

  toast.textContent = message;
  toast.style.padding = '14px 16px';
  toast.style.borderRadius = '14px';
  toast.style.border = `1px solid ${color}`;
  toast.style.background = background;
  toast.style.color = '#111827';
  toast.style.fontSize = '14px';
  toast.style.lineHeight = '1.4';
  toast.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.08)';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-10px)';
  toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  toast.style.wordBreak = 'break-word';
  toast.style.whiteSpace = 'pre-wrap';

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';

    window.setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, TOAST_DURATION);
}

/**
 * Convert a Firestore Timestamp or a normal date value into a readable string.
 * @param {any} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) {
    return 'Invalid date';
  }

  let dateValue = value;

  if (typeof value.toDate === 'function') {
    dateValue = value.toDate();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    dateValue = new Date(value);
  }

  if (!(dateValue instanceof Date) || Number.isNaN(dateValue.getTime())) {
    return 'Invalid date';
  }

  return dateValue.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Toggle a button loading state while preserving its original text.
 * @param {HTMLElement} button
 * @param {boolean} isLoading
 * @param {string} loadingText
 */
export function setButtonLoading(button, isLoading, loadingText = 'Loading...') {
  if (!button) {
    return;
  }

  const originalTextKey = 'data-original-button-text';
  const originalDisabledKey = 'data-original-button-disabled';

  if (isLoading) {
    if (!button.hasAttribute(originalTextKey)) {
      button.setAttribute(originalTextKey, button.textContent || '');
    }
    if (!button.hasAttribute(originalDisabledKey)) {
      button.setAttribute(originalDisabledKey, String(button.disabled));
    }

    button.textContent = loadingText;
    button.disabled = true;
  } else {
    if (button.hasAttribute(originalTextKey)) {
      button.textContent = button.getAttribute(originalTextKey) || '';
      button.removeAttribute(originalTextKey);
    }

    if (button.hasAttribute(originalDisabledKey)) {
      button.disabled = button.getAttribute(originalDisabledKey) === 'true';
      button.removeAttribute(originalDisabledKey);
    } else {
      button.disabled = false;
    }
  }
}

/**
 * Create a reusable empty state element for dashboard cards.
 * @param {string} message
 * @returns {HTMLElement}
 */
export function createEmptyState(message) {
  const emptyState = document.createElement('div');
  emptyState.className = 'card';
  emptyState.style.display = 'flex';
  emptyState.style.flexDirection = 'column';
  emptyState.style.alignItems = 'center';
  emptyState.style.justifyContent = 'center';
  emptyState.style.minHeight = '120px';
  emptyState.style.textAlign = 'center';
  emptyState.style.color = '#6b7280';
  emptyState.style.background = '#f8fafc';
  emptyState.style.border = '1px dashed rgba(156, 163, 175, 0.5)';

  const text = document.createElement('p');
  text.textContent = message;
  text.style.margin = '0';
  text.style.fontSize = '15px';
  text.style.lineHeight = '1.6';

  emptyState.appendChild(text);
  return emptyState;
}
