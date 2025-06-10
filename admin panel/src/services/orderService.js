import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

import { db } from './firebase';

// Reference to 'orders' collection
const ordersRef = collection(db, 'orders');

// GET all orders
export const getOrders = () => {
  const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return getDocs(ordersQuery);
};
// UPDATE order status
export const updateOrderStatus = (id, newStatus) => {
  const orderDoc = doc(db, 'orders', id);
  return updateDoc(orderDoc, { status: newStatus });
};
