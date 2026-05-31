/* ============================================
   GLPS MULKADU — Main JavaScript
   ============================================ */


import { fetchPublicAnnouncements, fetchPublicVideos, fetchPublicDonors, fetchPublicStaff } from './public-data.js';



// ============================================
// ANNOUNCEMENTS DATA
// ============================================
// ✏️ HOW TO ADD A NEW ANNOUNCEMENT:
//    1. Copy one of the objects below
//    2. Change the id (increase by 1)
//    3. Fill in date, title, titleKn, content, contentKn
//    4. Set urgent to true or false
//    5. Save the file — done!
//
// 🗑️ HOW TO DELETE AN ANNOUNCEMENT:
//    1. Find the announcement you want to remove
//    2. Delete everything from { to the closing },
//    3. Make sure the previous item ends with a comma (or remove trailing comma if it's the last one)
//    4. Save the file — done!
// ============================================

const announcements = [
  {
    id: 1,
    date: "2025-06-01",
    title: "Give your child a brighter future — enroll them in our school today!",
    titleKn: "ನಿಮ್ಮ ಮಕ್ಕಳ ಉತ್ತಮ ಭವಿಷ್ಯಕ್ಕಾಗಿ ಇಂದು ನಮ್ಮ ಶಾಲೆಯಲ್ಲಿ ಪ್ರವೇಶ ಮಾಡಿಸಿ!",
    content: "Give your child the gift of quality education and a brighter future.Our school provides a caring environment, dedicated teachers, and opportunities for every child to grow and succeed.Admissions are now open — enroll your child today!",
    contentKn: "ಉತ್ತಮ ಶಿಕ್ಷಣದ ಮೂಲಕ ನಿಮ್ಮ ಮಕ್ಕಳಿಗೆ ಉಜ್ವಲ ಭವಿಷ್ಯವನ್ನು ನೀಡಿರಿ.ನಮ್ಮ ಶಾಲೆಯಲ್ಲಿ ಉತ್ತಮ ಶಿಕ್ಷಕರು, ಸ್ನೇಹಪೂರ್ಣ ವಾತಾವರಣ ಹಾಗೂ ಮಕ್ಕಳ ಸಮಗ್ರ ಬೆಳವಣಿಗೆಗೆ ಉತ್ತಮ ಅವಕಾಶಗಳಿವೆ.ಪ್ರವೇಶ ಪ್ರಕ್ರಿಯೆ ಆರಂಭವಾಗಿದೆ — ಇಂದುಲೇ ನಿಮ್ಮ ಮಕ್ಕಳಿಗೆ ಪ್ರವೇಶ ಮಾಡಿಸಿ!",
    urgent: false
  }
  
];

// ============================================
// CURRENT LANGUAGE
// ============================================
let currentLang = localStorage.getItem('glps-lang') || 'en';

// ============================================
// LANGUAGE TOGGLE
// ============================================
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('glps-lang', lang);
  
  // Update body class
  document.body.classList.toggle('lang-kn', lang === 'kn');
  
  // Update all text elements with data-en/data-kn attributes
  document.querySelectorAll('[data-en]').forEach(function(el) {
    var text = el.getAttribute('data-' + lang);
    if (text) {
      el.textContent = text;
    }
  });
  
  // Update placeholder attributes
  document.querySelectorAll('[data-en-placeholder]').forEach(function(el) {
    var placeholder = el.getAttribute('data-' + lang + '-placeholder');
    if (placeholder) {
      el.placeholder = placeholder;
    }
  });
  
  // Update language toggle buttons
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  
  // Re-render dynamic content
  renderAnnouncements();
  renderDonors();
  renderStaff();
}

// ============================================
// MOBILE MENU
// ============================================
function toggleMobileMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  
  if (toggle && mobileNav) {
    toggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }
}

function closeMobileMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  
  if (toggle) toggle.classList.remove('open');
  if (mobileNav) mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function handleScroll() {
  var navbar = document.querySelector('.navbar');
  var backToTop = document.querySelector('.back-to-top');
  
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.fade-up').forEach(function(el) {
    observer.observe(el);
  });
}

// ============================================
// RENDER ANNOUNCEMENTS
// ============================================
async function renderAnnouncements() {
  var container = document.getElementById('announcements-list');
  if (!container) return;

  container.innerHTML = '<p>Loading announcements...</p>';

  const announcements = await fetchPublicAnnouncements();

  if (announcements.length === 0) {
    container.innerHTML = '<p>No announcements available.</p>';
    return;
  }

  var html = '';

  announcements.forEach(function(item) {
    var title = currentLang === 'kn' && item.titleKn
      ? item.titleKn
      : item.title;

    var content = currentLang === 'kn' && item.contentKn
      ? item.contentKn
      : item.content;

    var dateStr = formatDate(item.createdAt);

    html += '<div class="announcement-item fade-up">';
    html += '  <div class="announcement-date">';
    html += '    <span class="iconify" data-icon="lucide:calendar" data-width="14"></span>';
    html += '    ' + dateStr;
    html += '  </div>';

    html += '  <div class="announcement-title">' + title + '</div>';

    html += '  <div class="announcement-content">' + content + '</div>';

    html += '</div>';
  });

  container.innerHTML = html;

  setTimeout(initScrollAnimations, 100);
}

// Render recent announcements for home page
function renderRecentAnnouncements() {
  var container = document.getElementById('recent-announcements');
  if (!container) return;
  
  var html = '';
  var recent = announcements.slice().sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  }).slice(0, 3);
  
  recent.forEach(function(item) {
    var title = currentLang === 'kn' && item.titleKn ? item.titleKn : item.title;
    var content = currentLang === 'kn' && item.contentKn ? item.contentKn : item.content;
    var dateStr = formatDate(item.date);
    
    html += '<div class="announcement-item' + (item.urgent ? ' urgent' : '') + '">';
    html += '  <div class="announcement-date">';
    html += '    <span class="iconify" data-icon="lucide:calendar" data-width="14"></span>';
    html += '    ' + dateStr;
    html += '  </div>';
    html += '  <div class="announcement-title">' + title + '</div>';
    html += '  <div class="announcement-content">' + content + '</div>';
    html += '</div>';
  });
  
  container.innerHTML = html;
}

// ============================================
// RENDER DONORS TABLE
// ============================================
async function renderDonors() {
  var tbody = document.getElementById('donors-tbody');
  if (!tbody) return;
  
  var nameHeader = currentLang === 'kn' ? 'ದಾನಿಯ ಹೆಸರು' : 'Donor Name';
  var amountHeader = currentLang === 'kn' ? 'ಮೊತ್ತ (₹)' : 'Amount (₹)';
  var purposeHeader = currentLang === 'kn' ? 'ಉದ್ದೇಶ' : 'Purpose';
  var dateHeader = currentLang === 'kn' ? 'ದಿನಾಂಕ' : 'Date';
  
  // Update table headers
  var ths = tbody.parentElement.querySelectorAll('thead th');
  if (ths.length >= 4) {
    ths[0].textContent = nameHeader;
    ths[1].textContent = amountHeader;
    ths[2].textContent = purposeHeader;
    ths[3].textContent = dateHeader;
  }

  tbody.innerHTML = '<tr><td colspan="4">Loading donors...</td></tr>';

  const donors = await fetchPublicDonors();
  
  var html = '';
  var total = 0;

  if (donors.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No donors added yet.</td></tr>';
    updateDonorsTotal(0);
    return;
  }

  donors.forEach(function(donor) {
    var amount = Number(donor.amount) || 0;
    total += amount;

    html += '<tr>';
    html += '  <td>' + donor.name + '</td>';
    html += '  <td class="amount">₹' + amount.toLocaleString() + '</td>';
    html += '  <td>' + donor.purpose + '</td>';
    html += '  <td>' + donor.date + '</td>';
    html += '</tr>';
  });
  
  tbody.innerHTML = html;
  updateDonorsTotal(total);
}

function updateDonorsTotal(total) {
  var totalEl = document.getElementById('donors-total');
  if (totalEl) {
    totalEl.textContent = '₹' + total.toLocaleString();
  }
}

// ============================================
// RENDER STAFF
// ============================================
async function renderStaff() {
  var container = document.getElementById('staff-grid');
  if (!container) return;

  container.innerHTML = '<p>Loading staff members...</p>';

  const staff = await fetchPublicStaff();

  if (staff.length === 0) {
    container.innerHTML = '<p>No staff members available yet.</p>';
    return;
  }
  
  var html = '';
  staff.forEach(function(member) {
    var name = member.name;
    var designation = member.designation;
    
    html += '<div class="staff-card fade-up">';
    html += '  <div class="staff-photo">';
    html += '    <img src="' + member.photoURL + '" alt="' + name + '" loading="lazy">';
    html += '  </div>';
    html += '  <h3>' + name + '</h3>';
    html += '  <div class="staff-role">' + designation + '</div>';
    html += '</div>';
  });
  
  container.innerHTML = html;
  setTimeout(initScrollAnimations, 100);
}

// ============================================
// RENDER VIDEOS
// ============================================
function getYouTubeEmbedUrl(youtubeUrl) {
  if (!youtubeUrl || typeof youtubeUrl !== 'string') return '';

  try {
    var parsedUrl = new URL(youtubeUrl.trim());
    var hostname = parsedUrl.hostname.toLowerCase();
    var pathname = parsedUrl.pathname;
    var videoId = '';

    if (hostname === 'www.youtube.com' || hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (parsedUrl.searchParams.has('v')) {
        videoId = parsedUrl.searchParams.get('v') || '';
      } else {
        var embedMatch = pathname.match(/^\/(?:embed|v)\/([^/?&]+)/);
        videoId = embedMatch && embedMatch[1] ? embedMatch[1] : '';
      }
    }

    if (hostname === 'youtu.be' || hostname === 'www.youtu.be') {
      videoId = pathname.slice(1).split(/[/?&]/)[0] || '';
    }

    return videoId ? 'https://www.youtube.com/embed/' + videoId : '';
  } catch (error) {
    return '';
  }
}

function createVideoCard(video) {
  var embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);
  if (!embedUrl) return null;

  var card = document.createElement('div');
  card.className = 'video-card fade-up';

  var wrapper = document.createElement('div');
  wrapper.className = 'video-wrapper';

  var iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.title = video.title || 'School video';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.loading = 'lazy';

  var caption = document.createElement('div');
  caption.className = 'video-caption';
  caption.textContent = video.title || 'School video';

  wrapper.appendChild(iframe);
  card.appendChild(wrapper);
  card.appendChild(caption);

  return card;
}

async function renderVideos() {
  var container = document.getElementById('video-grid');
  if (!container) return;

  container.innerHTML = '<p>Loading videos...</p>';

  const videos = await fetchPublicVideos();

  container.innerHTML = '';

  if (videos.length === 0) {
    container.innerHTML = '<p>No videos available yet. Please check back soon.</p>';
    return;
  }

  var renderedCount = 0;

  videos.forEach(function(video) {
    var card = createVideoCard(video);
    if (card) {
      container.appendChild(card);
      renderedCount += 1;
    }
  });

  if (renderedCount === 0) {
    container.innerHTML = '<p>No videos available yet. Please check back soon.</p>';
    return;
  }

  setTimeout(initScrollAnimations, 100);
}

// ============================================
// GALLERY MODAL
// ============================================
function openGalleryModal(imgSrc, alt) {
  var modal = document.getElementById('gallery-modal');
  var modalImg = document.getElementById('gallery-modal-img');
  
  if (modal && modalImg) {
    modalImg.src = imgSrc;
    modalImg.alt = alt || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeGalleryModal() {
  var modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ============================================
// UTILITY: FORMAT DATE
// ============================================
function formatDate(dateValue) {
  if (!dateValue) return '';

  let date;

  if (dateValue.seconds) {
    date = new Date(dateValue.seconds * 1000);
  } else {
    date = new Date(dateValue);
  }

  var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return date.toLocaleDateString(
    currentLang === 'kn' ? 'kn-IN' : 'en-IN',
    options
  );
}

// ============================================
// ACTIVE PAGE HIGHLIGHT
// ============================================
function setActivePage() {
  var path = window.location.pathname;
  var page = path.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-links a, .mobile-nav a:not(.lang-toggle-mobile a)').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================
// BACK TO TOP
// ============================================
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Set active page
  setActivePage();
  
  // Set language
  setLanguage(currentLang);
  
  // Scroll handler
  window.addEventListener('scroll', handleScroll);
  handleScroll();
  
  // Scroll animations
  initScrollAnimations();
  
  // Render dynamic content
  renderAnnouncements();
  renderRecentAnnouncements();
  renderDonors();
  renderStaff();
  renderVideos();
  
  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav a').forEach(function(link) {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close gallery modal on overlay click
  var modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeGalleryModal();
      }
    });
  }
  
  // Keyboard escape to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeGalleryModal();
      closeMobileMenu();
    }
  });
});
