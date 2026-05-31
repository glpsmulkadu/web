import { db } from "../../js/firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function createAnnouncement(title, content) {
  try {
    const announcementsRef = collection(db, "announcements");
    const newAnnouncement = {
      title,
      content,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(announcementsRef, newAnnouncement);

    return {
      id: docRef.id,
      title,
      content,
      createdAt: null,
    };
  } catch (error) {
    console.error("Failed to create announcement:", error);
    throw new Error("Could not create announcement. Please try again.");
  }
}

export async function fetchAnnouncements() {
  try {
    const announcementsRef = collection(db, "announcements");
    const announcementsQuery = query(announcementsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(announcementsQuery);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || "",
        content: data.content || "",
        createdAt:
          data.createdAt && typeof data.createdAt.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    throw new Error("Could not load announcements. Please try again.");
  }
}

export async function deleteAnnouncement(id) {
  try {
    const announcementDoc = doc(db, "announcements", id);
    await deleteDoc(announcementDoc);
    return { id };
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    throw new Error("Could not delete announcement. Please try again.");
  }
}
