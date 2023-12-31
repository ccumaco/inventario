import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore/lite";
import { db } from "../firebaseConfig";
import { defineStore } from "pinia";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../firebaseConfig";
import { nanoid } from "nanoid";

import router from "../router";

export const useDatabaseStore = defineStore("database", {
    state: () => ({
        documents: [],
        loadingDoc: false,
        loading: false,
        products: [],
    }),
    actions: {
        async getURL(id) {
            try {
                const docRef = doc(db, "categories", id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    return false;
                }

                return docSnap.data().name;
            } catch (error) {
                console.log(error.message);
                return false;
            } finally {
            }
        },
        async getAllProducts() {
            this.products = [];

            this.loadingDoc = true;
            try {
                const q = query(
                    collection(db, "products")
                );
                const querySnapshot = await getDocs(q);
                this.products = [];
                querySnapshot.forEach((doc) => {
                    this.products.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false;
            }
        },
        async addProduct(objProduct, image) {
            this.loading = true;
            objProduct.short = nanoid(10);
            try {
                let photoURL = null;
                if (image) {
                    const storageRef = ref(
                        storage,
                        `productos/${objProduct.name}-${objProduct.short}`
                    );
                    await uploadBytes(storageRef, image.originFileObj);
                    photoURL= await getDownloadURL(storageRef);
                }
                await setDoc(
                    doc(db, "products",
                    `${objProduct.name}`),
                    {...objProduct, image: photoURL}
                );
                await this.getAllProducts();
            } catch (error) {
                console.log(error);
                return error;
            } finally {
                this.loading = false;
            }
        },
        async readProduct(id) {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error("no existe el doc");
                }

                return docSnap.data();
            } catch (error) {
                console.log(error.message);
            } finally {
            }
        },
        async updateProduct(id, objProduct, image) {
            this.loading = true;
            try {
                const docRef = doc(db, "products", id);

                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    throw new Error("no existe el producto");
                }
                let photoURL = null;
                if (image) {
                    const storageRef = ref(
                        storage,
                        `productos/${objProduct.name}-${objProduct.short}`
                    );
                    await uploadBytes(storageRef, image.originFileObj);
                    photoURL= await getDownloadURL(storageRef);
                }

                await updateDoc(docRef, {...objProduct, image: photoURL});

                this.products = this.products.map((item) =>
                    item.id === id ? { ...item, ...objProduct } : item
                );
                router.push("/productos");
            } catch (error) {
                console.log(error.message);
                return error.message;
            } finally {
                this.loading = false;
            }
        },
        async deleteProduct(id) {
            this.loading = true;
            try {
                const docRef = doc(db, "products", id);

                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    throw new Error("no existe el doc");
                }

                await deleteDoc(docRef);
                this.products = this.products.filter(
                    (item) => item.id !== id
                );
            } catch (error) {
                // console.log(error);
                return error.message;
            } finally {
                this.loading = false;
            }
        },
        async getCategories() {
            this.documents = [];
            this.loadingDoc = true;
            try {
                const q = query(
                    collection(db, "categories")
                );
                const querySnapshot = await getDocs(q);
                this.documents = [];
                querySnapshot.forEach((doc) => {
                    this.documents.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false;
            }
        },
        async addCategorie(name) {
            this.loading = true;
            try {
                const objCategorie = {
                    name: name,
                    short: nanoid(10),
                    available: true,
                };
                await setDoc(doc(db, "categories", objCategorie.short), objCategorie);
                this.documents.push({
                    ...objCategorie,
                    id: objCategorie.short,
                });
            } catch (error) {
                console.log(error);
                return error;
            } finally {
                this.loading = false;
            }
        },
        async readCategorie(id) {
            try {
                const docRef = doc(db, "categories", id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error("no existe el doc");
                }

                return docSnap.data();
            } catch (error) {
                console.log(error.message);
            } finally {
            }
        },
        async updateCategorie(id, name) {
            this.loading = true;
            try {
                const docRef = doc(db, "categories", id);

                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    throw new Error("no existe el doc");
                }

                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("no le pertenece ese documento");
                }

                await updateDoc(docRef, {
                    name: name,
                });

                this.documents = this.documents.map((item) =>
                    item.id === id ? { ...item, name: name } : item
                );
                router.push("/");
            } catch (error) {
                console.log(error.message);
                return error.message;
            } finally {
                this.loading = false;
            }
        },
        async deleteCategorie(id) {
            this.loading = true;
            try {
                const docRef = doc(db, "categories", id);

                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    throw new Error("no existe el doc");
                }

                await deleteDoc(docRef);
                this.documents = this.documents.filter(
                    (item) => item.id !== id
                );
            } catch (error) {
                // console.log(error);
                return error.message;
            } finally {
                this.loading = false;
            }
        },
    },
});
