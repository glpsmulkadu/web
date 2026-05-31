import { db } from './firebase-config.js';

import {
  collection,
  getDocs,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

/* ============================================
   FETCH ANNOUNCEMENTS
   ============================================ */
export async function fetchPublicAnnouncements() {
  try {
    const announcementsRef = collection(db, 'announcements');

    const q = query(
      announcementsRef,
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

/* ============================================
   FETCH VIDEOS
   ============================================ */
export async function fetchPublicVideos() {
  try {
    const videosRef = collection(db, 'videos');

    const q = query(
      videosRef,
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        youtubeUrl: data.youtubeUrl || '',
        thumbnailUrl: data.thumbnailUrl || '',
        createdAt: data.createdAt || null
      };
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

/* ============================================
   FETCH DONORS
   ============================================ */
export async function fetchPublicDonors() {
  try {
    const donorsRef = collection(db, 'donors');

    const q = query(
      donorsRef,
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name || '',
        amount: Number(data.amount) || 0,
        purpose: data.purpose || '',
        date: data.date || '',
        createdAt: data.createdAt || null
      };
    });

  } catch (error) {
    console.error('Error fetching donors:', error);
    return [];
  }
}

/* ============================================
   FETCH STAFF
   ============================================ */
export async function fetchPublicStaff() {
  try {
    const staffRef = collection(db, 'staff');

    const q = query(
      staffRef,
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name || '',
        designation: data.designation || '',
        photoURL: data.photoURL || '',
        createdAt: data.createdAt || null
      };
    });

  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
}

/* ============================================
   FETCH GALLERY COLLECTIONS
   ============================================ */
export async function fetchPublicGalleryCollections() {
  try {
    const galleryCollectionsRef = collection(db, 'galleryCollections');

    const q = query(
      galleryCollectionsRef,
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        coverImageUrl: data.coverImageUrl || '',
        images: Array.isArray(data.images) ? data.images : [],
        createdAt: data.createdAt || null
      };
    });

  } catch (error) {
    console.error('Error fetching gallery collections:', error);
    return [];
  }
}
