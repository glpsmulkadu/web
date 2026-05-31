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

export async function createDonor(name, amount, purpose, date) {
  try {
    const donorsRef = collection(db, "donors");
    const newDonor = {
      name,
      amount,
      purpose,
      date,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(donorsRef, newDonor);

    return {
      id: docRef.id,
      name,
      amount,
      purpose,
      date,
      createdAt: null,
    };
  } catch (error) {
    console.error("Failed to create donor:", error);
    throw new Error("Could not create donor. Please try again.");
  }
}

export async function fetchDonors() {
  try {
    const donorsRef = collection(db, "donors");
    const donorsQuery = query(donorsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(donorsQuery);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || "",
        amount: Number(data.amount) || 0,
        purpose: data.purpose || "",
        date: data.date || "",
        createdAt:
          data.createdAt && typeof data.createdAt.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch donors:", error);
    throw new Error("Could not load donors. Please try again.");
  }
}

export async function deleteDonor(id) {
  try {
    const donorDoc = doc(db, "donors", id);
    await deleteDoc(donorDoc);
    return { id };
  } catch (error) {
    console.error("Failed to delete donor:", error);
    throw new Error("Could not delete donor. Please try again.");
  }
}
