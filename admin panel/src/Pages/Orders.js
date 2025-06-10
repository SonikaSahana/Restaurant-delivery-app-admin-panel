import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Orders.css'; // ✅ Import the CSS file

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const snapshot = await getOrders();
    const orderList = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let name = data.name;

        // Fetch user name from "users" collection if not in order data
        if (!name && data.userId) {
          try {
            const userRef = doc(db, "users", data.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              name = userSnap.data().name || "Unknown";
            }
          } catch (err) {
            console.error("Failed to fetch user name", err);
          }
        }

        return { id: docSnap.id, ...data, name };
      })
    );
    setOrders(orderList);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    fetchOrders();
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Customer Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <p><strong>Customer:</strong> {order.name || "Unknown"}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Status:</strong> {order.status}</p>

              <div className="order-items">
                <strong>Items:</strong>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.title} × {item.quantity} = ₹{item.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <p><strong>Total:</strong> ₹{order.total}</p>

              <div className="order-status-change">
                <label htmlFor={`status-${order.id}`}>Change Status: </label>
                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
