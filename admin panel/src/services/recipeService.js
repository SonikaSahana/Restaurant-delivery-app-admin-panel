import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase';

// Firestore collection reference
const recipesRef = collection(db, 'recipes');

// Fetch all recipes
export const getRecipes = () => {
  return getDocs(recipesRef);
};

// Add new recipe
export const addRecipe = (recipe) => {
  return addDoc(recipesRef, recipe);
};

// Update existing recipe
export const updateRecipe = (id, updatedData) => {
  const recipeDoc = doc(db, 'recipes', id);
  return updateDoc(recipeDoc, updatedData);
};

// Delete a recipe
export const deleteRecipe = (id) => {
  const recipeDoc = doc(db, 'recipes', id);
  return deleteDoc(recipeDoc);
};
