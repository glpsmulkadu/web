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

const staffCollection = collection(db, "staff");

export async function createStaffMember(name, designation, photoURL) {
  try {
    const newStaff = {
      name,
      designation,
      photoURL,
      createdAt: serverTimestamp(),
    };

    const staffRef = await addDoc(staffCollection, newStaff);

    return {
      id: staffRef.id,
      name,
      designation,
      photoURL,
      createdAt: null,
    };
  } catch (error) {
    console.error("Failed to create staff member:", error);
    throw new Error("Could not create staff member. Please try again.");
  }
}

export async function fetchStaffMembers() {
  try {
    const staffQuery = query(staffCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(staffQuery);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || "",
        designation: data.designation || "",
        photoURL: data.photoURL || "",
        createdAt:
          data.createdAt && typeof data.createdAt.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch staff members:", error);
    throw new Error("Could not load staff members. Please try again.");
  }
}

export async function deleteStaffMember(id) {
  try {
    const staffDoc = doc(db, "staff", id);
    await deleteDoc(staffDoc);
    return { id };
  } catch (error) {
    console.error("Failed to delete staff member:", error);
    throw new Error("Could not delete staff member. Please try again.");
  }
}
