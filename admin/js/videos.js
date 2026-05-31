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

/**
 * Extract the YouTube video ID from a supported URL.
 * Supports youtube.com/watch?v=, youtu.be/, and youtube.com/embed/ links.
 * @param {string} url
 * @returns {string|null}
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== "string") {
    console.log("extractYouTubeId running");
    console.log("extractYouTubeId - originalUrl:", url);
    console.log("extractYouTubeId - result: null (invalid input)");
    return null;
  }

  const trimmedUrl = url.trim();

  try {
    const parsed = new URL(trimmedUrl);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    if (
      hostname === "www.youtube.com" ||
      hostname === "youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      if (parsed.searchParams.has("v")) {
        const id = parsed.searchParams.get("v")?.trim();
        console.log("extractYouTubeId - originalUrl:", url);
        console.log("extractYouTubeId - hostname:", hostname);
        console.log("extractYouTubeId - pathname:", pathname);
        console.log("extractYouTubeId - searchParams:", parsed.searchParams.toString());
        console.log("extractYouTubeId - extractedId:", id);
        return id || null;
      }

      const embedMatch = pathname.match(/^\/(?:embed|v)\/([^/?&]+)/);
      if (embedMatch && embedMatch[1]) {
        const id = embedMatch[1].trim();
        console.log("extractYouTubeId - originalUrl:", url);
        console.log("extractYouTubeId - hostname:", hostname);
        console.log("extractYouTubeId - pathname:", pathname);
        console.log("extractYouTubeId - searchParams:", parsed.searchParams.toString());
        console.log("extractYouTubeId - extractedId:", id);
        return id;
      }
    }

    if (hostname === "youtu.be" || hostname === "www.youtu.be") {
      const id = pathname.slice(1).split(/[/?&]/)[0]?.trim();
      console.log("extractYouTubeId - originalUrl:", url);
      console.log("extractYouTubeId - hostname:", hostname);
      console.log("extractYouTubeId - pathname:", pathname);
      console.log("extractYouTubeId - searchParams:", parsed.searchParams.toString());
      console.log("extractYouTubeId - extractedId:", id);
      return id || null;
    }

    console.log("extractYouTubeId - originalUrl:", url);
    console.log("extractYouTubeId - hostname:", parsed.hostname);
    console.log("extractYouTubeId - pathname:", parsed.pathname);
    console.log("extractYouTubeId - searchParams:", parsed.searchParams.toString());
    console.log("extractYouTubeId - extractedId: null (no match)");
    return null;
  } catch (error) {
    console.log("extractYouTubeId - originalUrl:", url);
    console.log("extractYouTubeId - error:", error && error.message);
    console.log("extractYouTubeId - result: null (parse error)");
    return null;
  }
}

/**
 * Generate a YouTube thumbnail URL from a video ID.
 * @param {string} videoId
 * @returns {string}
 */
export function generateThumbnailURL(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Create a new video document in Firestore.
 * @param {string} title
 * @param {string} description
 * @param {string} youtubeUrl
 * @returns {Promise<object>}
 */
export async function createVideo(title, description, youtubeUrl) {
  try {
    if (!title || !description || !youtubeUrl) {
      throw new Error("Title, description, and YouTube URL are required.");
    }

    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      throw new Error(
        "Invalid YouTube URL. Use youtube.com/watch?v=, youtu.be/, or youtube.com/embed/."
      );
    }

    const thumbnailUrl = generateThumbnailURL(videoId);
    const cleanedTitle = title.trim();
    const cleanedDescription = description.trim();
    const cleanedYoutubeUrl = youtubeUrl.trim();

    const videosRef = collection(db, "videos");
    const newVideo = {
      title: cleanedTitle,
      description: cleanedDescription,
      youtubeUrl: cleanedYoutubeUrl,
      thumbnailUrl,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(videosRef, newVideo);

    return {
      id: docRef.id,
      title: cleanedTitle,
      description: cleanedDescription,
      youtubeUrl: cleanedYoutubeUrl,
      thumbnailUrl,
      createdAt: null,
    };
  } catch (error) {
    console.error("Failed to create video:", error);
    throw new Error(error.message || "Could not create video. Please try again.");
  }
}

/**
 * Fetch videos from Firestore sorted by newest first.
 * @returns {Promise<Array<object>>}
 */
export async function fetchVideos() {
  try {
    const videosRef = collection(db, "videos");
    const videosQuery = query(videosRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(videosQuery);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || "",
        description: data.description || "",
        youtubeUrl: data.youtubeUrl || "",
        thumbnailUrl: data.thumbnailUrl || "",
        createdAt:
          data.createdAt && typeof data.createdAt.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    throw new Error("Could not load videos. Please try again.");
  }
}

/**
 * Delete a video document from Firestore.
 * @param {string} id
 * @returns {Promise<{id:string}>}
 */
export async function deleteVideo(id) {
  try {
    if (!id) {
      throw new Error("Invalid video ID.");
    }

    const videoDoc = doc(db, "videos", id);
    await deleteDoc(videoDoc);
    return { id };
  } catch (error) {
    console.error("Failed to delete video:", error);
    throw new Error(error.message || "Could not delete video. Please try again.");
  }
}
