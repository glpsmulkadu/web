/* ============================================
   Dashboard Module
   Dashboard Logic & State Management
   ============================================ */

import { getCurrentUser, adminLogout, onAuthChange } from './auth.js';
import { createAnnouncement, fetchAnnouncements, deleteAnnouncement } from './announcements.js';
import { createStaffMember, fetchStaffMembers, deleteStaffMember } from './staff.js';
import { uploadImage } from './storage.js';
import { createVideo, fetchVideos, deleteVideo } from './videos.js';
import { createDonor, fetchDonors, deleteDonor } from './donors.js';
import { createGalleryCollection, fetchGalleryCollections, deleteGalleryCollection } from './gallery.js';
import { showToast, formatDate, setButtonLoading, createEmptyState } from './utils.js';

// ============================================
// 🛡️ PROTECTED PAGE GUARD
// ============================================

/**
 * Protect Dashboard Pages
 * Redirects unauthenticated users to login
 * Call this on page load in dashboard pages
 */
export function protectDashboardPage() {
  onAuthChange((user) => {
    if (!user) {
      console.log('🚫 Access denied - redirecting to login');
      window.location.href = './login.html';
    } else {
      console.log('✅ Access granted for:', user.email);
      showDashboardContent();
      displayUserInfo(user);
    }
  });

  return true;
}

/**
 * Initialize Dashboard Page
 * Sets up auth state listener and displays user info
 * Call this at the start of dashboard.html script
 */
export function initDashboard() {
  // Listen for auth state changes
  onAuthChange((user) => {
    if (user) {
      // User is logged in
      displayUserInfo(user);
      showDashboardContent();
    } else {
      // User is logged out
      redirectToLogin();
    }
  });

  // Set up logout button listener
  setupLogoutButton();

  // Set up announcement UI and fetch existing announcements
  setupAnnouncementsSection();

  // Set up gallery UI and fetch existing collections
  setupGallerySection();

  // Set up staff UI and fetch existing staff members
  setupStaffSection();

  // Set up video UI and fetch existing videos
  setupVideosSection();

  // Set up donor UI and fetch existing donors
  setupDonorsSection();
}

/**
 * Display User Information
 * Shows user email in the header
 */
function displayUserInfo(user) {
  const userEmailElement = document.getElementById('user-email');
  const userNameElement = document.getElementById('user-name');
  
  if (userEmailElement) {
    userEmailElement.textContent = user.email;
  }
  
  if (userNameElement) {
    // Extract name from email (before @) or use 'Admin'
    const name = user.displayName || user.email.split('@')[0];
    userNameElement.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  }
}

/**
 * Show Dashboard Content
 * Displays main dashboard area
 */
function showDashboardContent() {
  const loadingScreen = document.getElementById('loading-screen');
  const dashboardContent = document.getElementById('dashboard-content');
  
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
  if (dashboardContent) {
    dashboardContent.style.display = 'block';
  }
}

/**
 * Redirect to Login
 * Redirects user to login page
 */
function redirectToLogin() {
  console.log('🚫 Session ended - redirecting to login');
  window.location.href = './login.html';
}

/**
 * Setup Logout Button
 * Handles logout click event
 */
function setupLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      try {
        // Disable button to prevent multiple clicks
        logoutBtn.disabled = true;
        logoutBtn.textContent = 'Logging out...';
        
        // Logout
        await adminLogout();
        
        // Redirect to login (auth state change will handle this)
        window.location.href = './login.html';
      } catch (error) {
        console.error('Logout error:', error);
        logoutBtn.disabled = false;
        logoutBtn.textContent = 'Logout';
        alert('Error logging out: ' + error.message);
      }
    });
  }
}

/**
 * Toggle Sidebar (Mobile)
 * Opens/closes sidebar on mobile devices
 */
export function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
  if (overlay) {
    overlay.classList.toggle('visible');
  }
}

/**
 * Close Sidebar
 * Closes sidebar (used when clicking links)
 */
export function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar) {
    sidebar.classList.remove('open');
  }
  if (overlay) {
    overlay.classList.remove('visible');
  }
}

function createAnnouncementCard(announcement) {
  const card = document.createElement('article');
  card.className = 'card announcement-card';
  card.dataset.id = announcement.id;

  const title = document.createElement('h3');
  title.className = 'announcement-title';
  title.textContent = announcement.title;

  const content = document.createElement('p');
  content.className = 'announcement-content';
  content.textContent = announcement.content;

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.alignItems = 'center';
  footer.style.marginTop = '12px';

  const timestamp = document.createElement('time');
  timestamp.className = 'text-muted';
  timestamp.dateTime = announcement.createdAt || '';
  timestamp.textContent = formatDate(announcement.createdAt);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'form-button';
  deleteButton.style.background = 'var(--danger)';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await handleDeleteAnnouncement(announcement.id);
  });

  footer.appendChild(timestamp);
  footer.appendChild(deleteButton);

  card.appendChild(title);
  card.appendChild(content);
  card.appendChild(footer);

  return card;
}

async function loadAnnouncements() {
  const announcementsList = document.getElementById('announcements-list');
  if (!announcementsList) {
    return;
  }

  const publishButton = document.getElementById('publish-btn');
  setButtonLoading(publishButton, true, 'Loading announcements...');

  try {
    const announcements = await fetchAnnouncements();
    announcementsList.innerHTML = '';

    if (announcements.length === 0) {
      announcementsList.appendChild(createEmptyState('No announcements published yet.'));
    } else {
      announcements.forEach((announcement) => {
        announcementsList.appendChild(createAnnouncementCard(announcement));
      });
    }

    const statAnnouncements = document.getElementById('stat-announcements');
    if (statAnnouncements) {
      statAnnouncements.textContent = String(announcements.length);
    }
  } catch (error) {
    console.error('Announcements load error:', error);
    announcementsList.innerHTML = '';
    announcementsList.appendChild(createEmptyState('Could not load announcements.'));
    showToast('Failed to load announcements.', 'error');
  } finally {
    setButtonLoading(publishButton, false);
  }
}

async function handleAnnouncementSubmit(event) {
  event.preventDefault();

  const titleInput = document.getElementById('announcement-title');
  const contentInput = document.getElementById('announcement-content');

  if (!titleInput || !contentInput) {
    return;
  }

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    showToast('Please enter both title and content.', 'error');
    return;
  }

  const publishButton = document.getElementById('publish-btn');
  setButtonLoading(publishButton, true, 'Publishing...');

  try {
    await createAnnouncement(title, content);
    titleInput.value = '';
    contentInput.value = '';
    await loadAnnouncements();
    showToast('Announcement published successfully.', 'success');
  } catch (error) {
    console.error('Announcement publish error:', error);
    showToast('Failed to publish announcement.', 'error');
  } finally {
    setButtonLoading(publishButton, false);
  }
}

async function handleDeleteAnnouncement(id) {
  if (!id) {
    return;
  }

  const confirmDelete = window.confirm('Are you sure you want to delete this announcement?');
  if (!confirmDelete) {
    return;
  }

  try {
    await deleteAnnouncement(id);
    await loadAnnouncements();
    showToast('Announcement deleted successfully.', 'success');
  } catch (error) {
    console.error('Announcement delete error:', error);
    showToast('Could not delete announcement.', 'error');
  }
}

function createStaffCard(member) {
  const card = document.createElement('article');
  card.className = 'card announcement-card';
  card.dataset.id = member.id;

  const layout = document.createElement('div');
  layout.style.display = 'flex';
  layout.style.alignItems = 'center';
  layout.style.gap = '16px';

  const avatar = document.createElement('img');
  avatar.src = member.photoURL || '';
  avatar.alt = member.name || 'Staff photo';
  avatar.style.width = '72px';
  avatar.style.height = '72px';
  avatar.style.borderRadius = '50%';
  avatar.style.objectFit = 'cover';
  avatar.style.border = '1px solid var(--border)';
  avatar.style.background = 'var(--bg)';

  const details = document.createElement('div');
  details.style.flex = '1';

  const name = document.createElement('h3');
  name.textContent = member.name;
  name.style.marginBottom = '4px';

  const designation = document.createElement('p');
  designation.textContent = member.designation;
  designation.style.margin = '0';
  designation.style.color = 'var(--text-muted)';

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.alignItems = 'center';
  footer.style.marginTop = '16px';

  const timestamp = document.createElement('time');
  timestamp.className = 'text-muted';
  timestamp.dateTime = member.createdAt || '';
  timestamp.textContent = formatDate(member.createdAt);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'form-button';
  deleteButton.style.background = 'var(--danger)';
  deleteButton.style.width = 'auto';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await handleDeleteStaff(member.id);
  });

  details.appendChild(name);
  details.appendChild(designation);
  layout.appendChild(avatar);
  layout.appendChild(details);

  footer.appendChild(timestamp);
  footer.appendChild(deleteButton);

  card.appendChild(layout);
  card.appendChild(footer);

  return card;
}

async function loadStaffMembers() {
  const staffList = document.getElementById('staff-list');
  if (!staffList) {
    return;
  }

  const addButton = document.getElementById('add-staff-btn');
  setButtonLoading(addButton, true, 'Loading staff...');

  try {
    const staffMembers = await fetchStaffMembers();
    staffList.innerHTML = '';

    if (staffMembers.length === 0) {
      staffList.appendChild(createEmptyState('No staff members added yet.'));
    } else {
      staffMembers.forEach((member) => {
        staffList.appendChild(createStaffCard(member));
      });
    }
  } catch (error) {
    console.error('Staff load error:', error);
    staffList.innerHTML = '';
    staffList.appendChild(createEmptyState('Could not load staff members.'));
    showToast('Failed to load staff members.', 'error');
  } finally {
    setButtonLoading(addButton, false);
  }
}

async function handleStaffSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('staff-name');
  const designationInput = document.getElementById('staff-designation');
  const photoInput = document.getElementById('staff-photo');

  if (!nameInput || !designationInput || !photoInput) {
    return;
  }

  const name = nameInput.value.trim();
  const designation = designationInput.value.trim();
  const photoFile = photoInput.files && photoInput.files[0];

  if (!name || !designation || !photoFile) {
    showToast('Please fill out all staff fields and select an image.', 'error');
    return;
  }

  if (!photoFile.type.startsWith('image/')) {
    showToast('Please select a valid image file.', 'error');
    photoInput.value = '';
    updateStaffPreview(null);
    return;
  }

  const addButton = document.getElementById('add-staff-btn');
  setButtonLoading(addButton, true, 'Adding staff...');

  try {
    const photoURL = await uploadImage(photoFile, 'staff');
    await createStaffMember(name, designation, photoURL);
    nameInput.value = '';
    designationInput.value = '';
    photoInput.value = '';
    updateStaffPreview(null);
    await loadStaffMembers();
    showToast('Staff member added successfully.', 'success');
  } catch (error) {
    console.error('Staff add error:', error);
    showToast('Could not add staff member.', 'error');
  } finally {
    setButtonLoading(addButton, false);
  }
}

function updateStaffPreview(file) {
  const previewImage = document.getElementById('staff-preview');
  if (!previewImage) {
    return;
  }

  if (!file) {
    previewImage.src = '';
    previewImage.style.display = 'none';
    return;
  }

  const previewURL = URL.createObjectURL(file);
  previewImage.src = previewURL;
  previewImage.style.display = 'block';
  previewImage.onload = () => {
    URL.revokeObjectURL(previewURL);
  };
}

function handleStaffPhotoChange(event) {
  const file = event.target.files && event.target.files[0];

  if (!file) {
    updateStaffPreview(null);
    return;
  }

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file.', 'error');
    event.target.value = '';
    updateStaffPreview(null);
    return;
  }

  updateStaffPreview(file);
}

async function handleDeleteStaff(id) {
  if (!id) {
    return;
  }

  const confirmDelete = window.confirm('Are you sure you want to delete this staff member?');
  if (!confirmDelete) {
    return;
  }

  const addButton = document.getElementById('add-staff-btn');
  setButtonLoading(addButton, true, 'Deleting staff...');

  try {
    await deleteStaffMember(id);
    await loadStaffMembers();
    showToast('Staff member deleted successfully.', 'success');
  } catch (error) {
    console.error('Staff delete error:', error);
    showToast('Could not delete staff member.', 'error');
  } finally {
    setButtonLoading(addButton, false);
  }
}

function setupStaffSection() {
  const form = document.getElementById('staff-form');
  const photoInput = document.getElementById('staff-photo');

  if (form) {
    form.addEventListener('submit', handleStaffSubmit);
  }

  if (photoInput) {
    photoInput.addEventListener('change', handleStaffPhotoChange);
  }

  loadStaffMembers();
}

function createGalleryCard(collection) {
  const card = document.createElement('article');
  card.className = 'card announcement-card';
  card.dataset.id = collection.id;

  const coverImage = document.createElement('img');
  coverImage.src = collection.coverImageUrl || '';
  coverImage.alt = collection.title || 'Gallery cover image';
  coverImage.style.width = '100%';
  coverImage.style.borderRadius = '16px';
  coverImage.style.objectFit = 'cover';
  coverImage.style.marginBottom = '16px';

  const title = document.createElement('h3');
  title.textContent = collection.title;
  title.style.marginBottom = '8px';

  const description = document.createElement('p');
  description.textContent = collection.description;
  description.style.margin = '0';
  description.style.color = 'var(--text-muted)';
  description.style.marginBottom = '12px';

  const imageCount = document.createElement('p');
  const count = Array.isArray(collection.images) ? collection.images.length : 0;
  imageCount.textContent = `${count} ${count === 1 ? 'image' : 'images'}`;
  imageCount.style.margin = '0';
  imageCount.style.color = 'var(--text-muted)';

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.alignItems = 'center';
  footer.style.marginTop = '16px';
  footer.style.gap = '12px';

  const timestamp = document.createElement('time');
  timestamp.className = 'text-muted';
  timestamp.dateTime = collection.createdAt || '';
  timestamp.textContent = formatDate(collection.createdAt);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'form-button';
  deleteButton.style.background = 'var(--danger)';
  deleteButton.style.width = 'auto';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await handleDeleteGallery(collection.id);
  });

  footer.appendChild(timestamp);
  footer.appendChild(deleteButton);

  card.appendChild(coverImage);
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(imageCount);
  card.appendChild(footer);

  return card;
}

async function loadGalleryCollections() {
  const galleryList = document.getElementById('gallery-list');
  if (!galleryList) {
    return;
  }

  const addButton = document.getElementById('add-gallery-btn');
  setButtonLoading(addButton, true, 'Loading gallery...');

  try {
    const collections = await fetchGalleryCollections();
    galleryList.innerHTML = '';

    if (collections.length === 0) {
      galleryList.appendChild(createEmptyState('No gallery collections added yet.'));
    } else {
      collections.forEach((collection) => {
        galleryList.appendChild(createGalleryCard(collection));
      });
    }

    const statGallery = document.getElementById('stat-gallery');
    if (statGallery) {
      statGallery.textContent = String(collections.length);
    }
  } catch (error) {
    console.error('Gallery load error:', error);
    galleryList.innerHTML = '';
    galleryList.appendChild(createEmptyState('Could not load gallery collections.'));
    showToast('Failed to load gallery collections.', 'error');
  } finally {
    setButtonLoading(addButton, false);
  }
}

async function handleGallerySubmit(event) {
  event.preventDefault();

  const titleInput = document.getElementById('gallery-title');
  const descriptionInput = document.getElementById('gallery-description');
  const coverInput = document.getElementById('gallery-cover-image');
  const imagesInput = document.getElementById('gallery-images');

  if (!titleInput || !descriptionInput || !coverInput || !imagesInput) {
    return;
  }

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const coverFile = coverInput.files && coverInput.files[0];
  const imageFiles = imagesInput.files ? Array.from(imagesInput.files) : [];

  if (!title || !description || !coverFile || imageFiles.length === 0) {
    showToast('Please fill out all gallery fields and select images.', 'error');
    return;
  }

  const allFiles = [coverFile].concat(imageFiles);
  const hasInvalidFile = allFiles.some((file) => !file.type || !file.type.startsWith('image/'));
  if (hasInvalidFile) {
    showToast('Please select valid image files only.', 'error');
    return;
  }

  const addButton = document.getElementById('add-gallery-btn');
  setButtonLoading(addButton, true, 'Uploading images...');

  try {
    const coverImageUrl = await uploadImage(coverFile, 'gallery');
    const images = await Promise.all(
      imageFiles.map((file) => uploadImage(file, 'gallery'))
    );

    await createGalleryCollection(title, description, coverImageUrl, images);
    titleInput.value = '';
    descriptionInput.value = '';
    coverInput.value = '';
    imagesInput.value = '';
    await loadGalleryCollections();
    showToast('Gallery collection added successfully.', 'success');
  } catch (error) {
    console.error('Gallery add error:', error);
    showToast('Could not add gallery collection.', 'error');
  } finally {
    setButtonLoading(addButton, false);
  }
}

async function handleDeleteGallery(id) {
  if (!id) {
    return;
  }

  const confirmDelete = window.confirm('Are you sure you want to delete this gallery collection?');
  if (!confirmDelete) {
    return;
  }

  const addButton = document.getElementById('add-gallery-btn');
  setButtonLoading(addButton, true, 'Deleting...');

  try {
    await deleteGalleryCollection(id);
    await loadGalleryCollections();
    showToast('Gallery collection deleted successfully.', 'success');
  } catch (error) {
    console.error('Gallery delete error:', error);
    showToast('Could not delete gallery collection.', 'error');
  } finally {
    setButtonLoading(addButton, false);
  }
}

function setupGallerySection() {
  const form = document.getElementById('gallery-form');

  if (form) {
    form.addEventListener('submit', handleGallerySubmit);
  }

  loadGalleryCollections();
}

function createVideoCard(video) {
  const card = document.createElement('article');
  card.className = 'card announcement-card';
  card.dataset.id = video.id;

  const thumbnail = document.createElement('img');
  thumbnail.src = video.thumbnailUrl || '';
  thumbnail.alt = video.title || 'Video thumbnail';
  thumbnail.style.width = '100%';
  thumbnail.style.borderRadius = '16px';
  thumbnail.style.objectFit = 'cover';
  thumbnail.style.marginBottom = '16px';

  const title = document.createElement('h3');
  title.textContent = video.title;
  title.style.marginBottom = '8px';

  const description = document.createElement('p');
  description.textContent = video.description;
  description.style.margin = '0';
  description.style.color = 'var(--text-muted)';
  description.style.marginBottom = '16px';

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.flexWrap = 'wrap';
  footer.style.justifyContent = 'space-between';
  footer.style.alignItems = 'center';
  footer.style.gap = '12px';

  const linkButton = document.createElement('a');
  linkButton.className = 'form-button';
  linkButton.href = video.youtubeUrl;
  linkButton.target = '_blank';
  linkButton.rel = 'noreferrer noopener';
  linkButton.textContent = 'Watch on YouTube';
  linkButton.style.textDecoration = 'none';
  linkButton.style.display = 'inline-flex';
  linkButton.style.alignItems = 'center';

  const deleteButton = document.createElement('button');
  deleteButton.className = 'form-button';
  deleteButton.style.background = 'var(--danger)';
  deleteButton.style.width = 'auto';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await handleDeleteVideo(video.id);
  });

  const timestamp = document.createElement('time');
  timestamp.className = 'text-muted';
  timestamp.dateTime = video.createdAt || '';
  timestamp.textContent = formatDate(video.createdAt);
  timestamp.style.marginTop = '12px';
  timestamp.style.display = 'block';

  footer.appendChild(linkButton);
  footer.appendChild(deleteButton);

  card.appendChild(thumbnail);
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(timestamp);
  card.appendChild(footer);

  return card;
}

async function loadVideos() {
  const videosList = document.getElementById('videos-list');
  if (!videosList) {
    return;
  }

  const publishButton = document.getElementById('publish-video-btn');
  setButtonLoading(publishButton, true, 'Loading videos...');

  try {
    const videos = await fetchVideos();
    videosList.innerHTML = '';

    if (videos.length === 0) {
      videosList.appendChild(createEmptyState('No videos published yet.'));
    } else {
      videos.forEach((video) => {
        videosList.appendChild(createVideoCard(video));
      });
    }

    const statVideos = document.getElementById('stat-videos');
    if (statVideos) {
      statVideos.textContent = String(videos.length);
    }
  } catch (error) {
    console.error('Videos load error:', error);
    videosList.innerHTML = '';
    videosList.appendChild(createEmptyState('Could not load videos.'));
    showToast('Failed to load videos.', 'error');
  } finally {
    setButtonLoading(publishButton, false);
  }
}

async function handleVideoSubmit(event) {
  event.preventDefault();

  const titleInput = document.getElementById('video-title');
  const descriptionInput = document.getElementById('video-description');
  const urlInput = document.getElementById('video-url');

  if (!titleInput || !descriptionInput || !urlInput) {
    return;
  }

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const youtubeUrl = urlInput.value.trim();

  if (!title || !description || !youtubeUrl) {
    showToast('Please fill out all video fields.', 'error');
    return;
  }

  const publishButton = document.getElementById('publish-video-btn');
  setButtonLoading(publishButton, true, 'Publishing...');

  try {
    await createVideo(title, description, youtubeUrl);
    titleInput.value = '';
    descriptionInput.value = '';
    urlInput.value = '';
    await loadVideos();
    showToast('Video published successfully.', 'success');
  } catch (error) {
    console.error('Video publish error:', error);
    showToast('Could not publish video.', 'error');
  } finally {
    setButtonLoading(publishButton, false);
  }
}

async function handleDeleteVideo(id) {
  if (!id) {
    return;
  }

  const confirmDelete = window.confirm('Are you sure you want to delete this video?');
  if (!confirmDelete) {
    return;
  }

  const publishButton = document.getElementById('publish-video-btn');
  setButtonLoading(publishButton, true, 'Deleting...');

  try {
    await deleteVideo(id);
    await loadVideos();
    showToast('Video deleted successfully.', 'success');
  } catch (error) {
    console.error('Video delete error:', error);
    showToast('Could not delete video.', 'error');
  } finally {
    setButtonLoading(publishButton, false);
  }
}

function setupVideosSection() {
  const form = document.getElementById('video-form');

  if (form) {
    form.addEventListener('submit', handleVideoSubmit);
  }

  loadVideos();
}

function createDonorCard(donor) {
  const card = document.createElement('article');
  card.className = 'card announcement-card';
  card.dataset.id = donor.id;

  const name = document.createElement('h3');
  name.textContent = donor.name;
  name.style.marginBottom = '8px';

  const amount = document.createElement('p');
  amount.textContent = `₹${Number(donor.amount || 0).toLocaleString()}`;
  amount.style.margin = '0';
  amount.style.fontWeight = '700';
  amount.style.color = 'var(--primary)';

  const purpose = document.createElement('p');
  purpose.textContent = donor.purpose;
  purpose.style.margin = '8px 0 0';
  purpose.style.color = 'var(--text-muted)';

  const donationDate = document.createElement('p');
  donationDate.textContent = donor.date;
  donationDate.style.margin = '8px 0 0';
  donationDate.style.color = 'var(--text-muted)';

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.alignItems = 'center';
  footer.style.marginTop = '16px';
  footer.style.gap = '12px';

  const timestamp = document.createElement('time');
  timestamp.className = 'text-muted';
  timestamp.dateTime = donor.createdAt || '';
  timestamp.textContent = formatDate(donor.createdAt);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'form-button';
  deleteButton.style.background = 'var(--danger)';
  deleteButton.style.width = 'auto';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await handleDeleteDonor(donor.id);
  });

  footer.appendChild(timestamp);
  footer.appendChild(deleteButton);

  card.appendChild(name);
  card.appendChild(amount);
  card.appendChild(purpose);
  card.appendChild(donationDate);
  card.appendChild(footer);

  return card;
}

async function loadDonors() {
  const donorsList = document.getElementById('donors-list');
  if (!donorsList) {
    return;
  }

  const addButton = document.getElementById('add-donor-btn');
  setButtonLoading(addButton, true, 'Loading donors...');

  try {
    const donors = await fetchDonors();
    donorsList.innerHTML = '';

    if (donors.length === 0) {
      donorsList.appendChild(createEmptyState('No donors added yet.'));
    } else {
      donors.forEach((donor) => {
        donorsList.appendChild(createDonorCard(donor));
      });
    }

    const statDonors = document.getElementById('stat-donors');
    if (statDonors) {
      statDonors.textContent = String(donors.length);
    }
  } catch (error) {
    console.error('Donors load error:', error);
    donorsList.innerHTML = '';
    donorsList.appendChild(createEmptyState('Could not load donors.'));
    showToast('Failed to load donors.', 'error');
  } finally {
    setButtonLoading(addButton, false);
  }
}

async function handleDonorSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('donor-name');
  const amountInput = document.getElementById('donor-amount');
  const purposeInput = document.getElementById('donor-purpose');
  const dateInput = document.getElementById('donor-date');

  if (!nameInput || !amountInput || !purposeInput || !dateInput) {
    return;
  }

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const purpose = purposeInput.value.trim();
  const date = dateInput.value;

  if (!name || !Number.isFinite(amount) || amount <= 0 || !purpose || !date) {
    showToast('Please fill out all donor fields with a valid amount.', 'error');
    return;
  }

  const addButton = document.getElementById('add-donor-btn');
  setButtonLoading(addButton, true, 'Adding donor...');

  try {
    await createDonor(name, amount, purpose, date);
    nameInput.value = '';
    amountInput.value = '';
    purposeInput.value = '';
    dateInput.value = '';
    await loadDonors();
    showToast('Donor added successfully.', 'success');
  } catch (error) {
    console.error('Donor add error:', error);
    showToast('Could not add donor.', 'error');
  } finally {
    setButtonLoading(addButton, false);
  }
}

async function handleDeleteDonor(id) {
  if (!id) {
    return;
  }

  const confirmDelete = window.confirm('Are you sure you want to delete this donor?');
  if (!confirmDelete) {
    return;
  }

  const addButton = document.getElementById('add-donor-btn');
  setButtonLoading(addButton, true, 'Deleting...');

  try {
    await deleteDonor(id);
    await loadDonors();
    showToast('Donor deleted successfully.', 'success');
  } catch (error) {
    console.error('Donor delete error:', error);
    showToast('Could not delete donor.', 'error');
  } finally {
    setButtonLoading(addButton, false);
  }
}

function setupDonorsSection() {
  const form = document.getElementById('donor-form');

  if (form) {
    form.addEventListener('submit', handleDonorSubmit);
  }

  loadDonors();
}

function setupAnnouncementsSection() {
  const form = document.getElementById('announcement-form');

  if (form) {
    form.addEventListener('submit', handleAnnouncementSubmit);
  }

  loadAnnouncements();
}

/**
 * Setup Sidebar Toggle Button
 * Initializes mobile menu button
 */
export function setupSidebarToggle() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  
  // Close sidebar when clicking links
  const sidebarLinks = document.querySelectorAll('#sidebar a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
  });
}

// ============================================
// 📊 DASHBOARD STATE
// ============================================

/**
 * Set Active Section
 * Highlights active sidebar item
 */
export function setActiveSection(sectionId) {
  // Remove active class from all links
  document.querySelectorAll('#sidebar a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to current link
  const activeLink = document.querySelector(`#sidebar a[data-section="${sectionId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

/**
 * Show Section
 * Displays a specific dashboard section
 */
export function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show selected section
  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = 'block';
    setActiveSection(sectionId);
  }
}

/**
 * Setup Navigation
 * Initialize sidebar navigation
 */
export function setupNavigation() {
  // Set Overview as default active section
  setActiveSection('overview');
  
  // Add click handlers to navigation links
  document.querySelectorAll('#sidebar a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      showSection(sectionId);
    });
  });
}
