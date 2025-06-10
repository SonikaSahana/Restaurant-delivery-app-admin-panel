import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card" onClick={() => navigate('/categories')}>
          <h3>Manage Categories</h3>
          <button className="card-button">Go</button>
        </div>
        <div className="card" onClick={() => navigate('/recipes')}>
          <h3>Manage Recipes</h3>
          <button className="card-button">Go</button>
        </div>
        <div className="card" onClick={() => navigate('/orders')}>
          <h3>View Orders</h3>
          <button className="card-button">Go</button>
        </div>
        <div className="card">
          <h3>Logout</h3>
          <button className="card-button logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
