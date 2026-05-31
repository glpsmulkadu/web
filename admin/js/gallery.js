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

export async function createGalleryCollection(title, description, coverImageUrl, images) {
  try {
    const galleryCollectionsRef = collection(db, "galleryCollections");
    const newGalleryCollection = {
      title,
      description,
      coverImageUrl,
      images,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(galleryCollectionsRef, newGalleryCollection);

    return {
      id: docRef.id,
      title,
      description,
      coverImageUrl,
      images,
      createdAt: null,
    };
  } catch (error) {
    console.error("Failed to create gallery collection:", error);
    throw new Error("Could not create gallery collection. Please try again.");
  }
}

export async function fetchGalleryCollections() {
  try {
    const galleryCollectionsRef = collection(db, "galleryCollections");
    const galleryCollectionsQuery = query(galleryCollectionsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(galleryCollectionsQuery);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || "",
        description: data.description || "",
        coverImageUrl: data.coverImageUrl || "",
        images: Array.isArray(data.images) ? data.images : [],
        createdAt:
          data.createdAt && typeof data.createdAt.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch gallery collections:", error);
    throw new Error("Could not load gallery collections. Please try again.");
  }
}

export async function deleteGalleryCollection(id) {
  try {
    const galleryCollectionDoc = doc(db, "galleryCollections", id);
    await deleteDoc(galleryCollectionDoc);
    return { id };
  } catch (error) {
    console.error("Failed to delete gallery collection:", error);
    throw new Error("Could not delete gallery collection. Please try again.");
  }
}
