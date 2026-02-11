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
const loveCollection = collection(db, "lovePages");


export const createLovePage = async (data) => {
    const docRef = await addDoc(loveCollection, {
        ...data,
        status: "draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
};


export const getLovePage = async (id) => {
    const ref = doc(db, "lovePages", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;
    return snap.data();
};


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


export const uploadMemoryImage = async (file, pageId) => {
    const storageRef = ref(storage, `memories/${pageId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};


export const getStoryCount = async () => {
    try {
        const snapshot = await getCountFromServer(loveCollection);
        return snapshot.data().count;
    } catch (error) {
        return 1240;
    }
};