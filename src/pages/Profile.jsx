import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setSuccess('Profile updated successfully (not saved)');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>Profile</h2>
        <form onSubmit={handleUpdate}>
          <div>
            <label>First Name:</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {success && <div style={{ color: 'green' }}>{success}</div>}
          <button type="submit">Update</button>
        </form>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="logout-btn"
          style={{ marginTop: '1rem' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
