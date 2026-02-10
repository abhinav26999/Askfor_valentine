import {db, storage} from "./firebase";
import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
    getCountFromServer,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Collection reference
const loveCollection = collection(db, "lovePages");

/**
 * Create a new love page (DRAFT)
 */
export const createLovePage = async (data) => {
    const docRef = await addDoc(loveCollection, {
        ...data,
        status: "draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
};

/**
 * Fetch a love page by ID
 */
export const getLovePage = async (id) => {
    const ref = doc(db, "lovePages", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;
    return snap.data();
};

/**
 * Publish a love page (make it public)
 */
export const publishLovePage = async (id) => {
    const ref = doc(db, "lovePages", id);

    await updateDoc(ref, {
        status: "published",
        updatedAt: serverTimestamp(),
    });
};


export const updateLovePage = async (id, data) => {
    const ref = doc(db, "lovePages", id);

    await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Upload an image to Firebase Storage
 */
export const uploadMemoryImage = async (file, pageId) => {
    const storageRef = ref(storage, `memories/${pageId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

/**
 * Get Total Created Stories Count
 */
export const getStoryCount = async () => {
    try {
        const snapshot = await getCountFromServer(loveCollection);
        return snapshot.data().count;
    } catch (error) {
        return 1240; // Fallback fake number if offline
    }
};