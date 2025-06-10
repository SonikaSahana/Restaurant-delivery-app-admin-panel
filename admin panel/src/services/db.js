import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase';

// COLLECTION REFERENCE
const categoriesRef = collection(db, 'categories');

// GET all categories
export const getCategories = () => {
  return getDocs(categoriesRef);
};

// ADD a new category
export const addCategory = (category) => {
  return addDoc(categoriesRef, category);
};

// UPDATE category by ID
export const updateCategory = (id, updatedData) => {
  const categoryDoc = doc(db, 'categories', id);
  return updateDoc(categoryDoc, updatedData);
};

// DELETE category by ID
export const deleteCategory = (id) => {
  const categoryDoc = doc(db, 'categories', id);
  return deleteDoc(categoryDoc);
};
