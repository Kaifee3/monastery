import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { reviewAPI } from "../services/reviewAPI";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useContext(AuthContext);
  
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [activeTab, setActiveTab] = useState('users');
  
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFilters, setReviewFilters] = useState({
    status: '',
    difficulty: '',
    page: 1,
    limit: 10
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersPerPage] = useState(10);
  const [isServerPaginated, setIsServerPaginated] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    status: "active"
  });

  const baseURL = "https://form-backend-gold.vercel.app/api";

  useEffect(() => {
    if (isLoading) return;
    
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchDashboardStats();
    fetchUsers();
  }, [user, navigate, currentPage, isLoading]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    console.log("Getting auth headers, token:", token);
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/dashboard/stats`, getAuthHeaders());
      setDashboardStats(response.data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}/admin/users?page=${currentPage}&limit=${usersPerPage}`, 
        getAuthHeaders()
      );
      console.log("Fetched users response:", response.data);
      const data = response.data;

      if (data && Array.isArray(data.users)) {
        const serverTotalPages = Number(data.totalPages);
        const serverTotalUsers = Number(data.totalUsers || data.total || data.count);

        setIsServerPaginated(true);
        setUsers(data.users);

        if (Number.isFinite(serverTotalPages) && serverTotalPages > 0) {
          setTotalPages(serverTotalPages);
        } else if (Number.isFinite(serverTotalUsers) && serverTotalUsers > 0) {
          setTotalPages(Math.max(1, Math.ceil(serverTotalUsers / usersPerPage)));
        } else if (dashboardStats?.totalUsers) {
          setTotalPages(Math.max(1, Math.ceil(dashboardStats.totalUsers / usersPerPage)));
        } else {
          setTotalPages(1);
        }

        return;
      }

      if (Array.isArray(data)) {
        setIsServerPaginated(false);
        setUsers(data);
        setTotalPages(Math.max(1, Math.ceil(data.length / usersPerPage)));
        return;
      }

      const allUsersResponse = await axios.get(`${baseURL}/admin/users`, getAuthHeaders());
      const allUsers = Array.isArray(allUsersResponse.data)
        ? allUsersResponse.data
        : Array.isArray(allUsersResponse.data?.users)
          ? allUsersResponse.data.users
          : [];

      setIsServerPaginated(false);
      setUsers(allUsers);
      setTotalPages(Math.max(1, Math.ceil(allUsers.length / usersPerPage)));
    } catch (err) {
      console.error("Error fetching users:", err);
      console.error("Fetch users error response:", err.response?.data);
      setError("Failed to load users");
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/admin/users`, formData, getAuthHeaders());
      setSuccess("User created successfully");
      setShowAddModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      if (!updateData.password || updateData.password.trim() === "") {
        delete updateData.password; 
      }
      
      console.log("Updating user with data:", updateData);
      console.log("User ID:", selectedUser._id);
      
      const response = await axios.patch(`${baseURL}/admin/users/${selectedUser._id}`, updateData, getAuthHeaders());
      console.log("Update response:", response.data);
      
      setSuccess("User updated successfully");
      setShowEditModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Update error:", err);
      console.error("Update error response:", err.response?.data);
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${baseURL}/admin/users/${selectedUser._id}`, getAuthHeaders());
      setSuccess("User deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const openEditModal = (user) => {
    console.log("Opening edit modal for user:", user);
    setSelectedUser(user);
    const editData = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "user",
      status: user.status || "active",
      password: "" 
    };
    console.log("Setting form data:", editData);
    setFormData(editData);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
      status: "active"
    });
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    setShowReviewModal(false);
    setSelectedReview(null);
    resetForm();
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        ...reviewFilters,
        page: reviewFilters.page,
        limit: reviewFilters.limit
      };
      
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await reviewAPI.getAllReviewsForAdmin(params);
      setReviews(response.reviews || []);
      setError('');
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await reviewAPI.getReviewDashboardStats();
      setReviewStats(response.stats);
    } catch (err) {
      console.error('Error fetching review stats:', err);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await reviewAPI.deleteReviewByAdmin(reviewId);
      setSuccess('Review deleted successfully');
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleReviewFilterChange = (key, value) => {
    setReviewFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
      fetchReviewStats();
    }
  }, [activeTab, reviewFilters]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const visibleUsers = isServerPaginated
    ? users
    : users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const showPagination = (() => {
    if (totalPages > 1) return true;
    if (isServerPaginated) return users.length === usersPerPage || currentPage > 1;
    return users.length > usersPerPage;
  })();

  const prevDisabled = currentPage === 1;
  const nextDisabled = (() => {
    if (totalPages > 1) return currentPage === totalPages;
    if (isServerPaginated) return users.length < usersPerPage;
    return currentPage === totalPages;
  })();

  if (isLoading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  if (loading && !users.length) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          {activeTab === 'users' && (
            <button 
              className="btn-primary" 
              onClick={() => setShowAddModal(true)}
            >
              Add New User
            </button>
          )}
          <button 
            className="btn-secondary" 
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Review Management
        </button>
      </div>

      {error && <div className="message error-message">{error}</div>}
      {success && <div className="message success-message">{success}</div>}

      
      {activeTab === 'users' && dashboardStats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{dashboardStats.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{dashboardStats.activeUsers || 0}</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-card">
            <h3>{dashboardStats.adminUsers || 0}</h3>
            <p>Admin Users</p>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && reviewStats && (
        <div className="dashboard-stats">
          {reviewStats.overallStats && reviewStats.overallStats[0] && (
            <>
              <div className="stat-card">
                <h3>{reviewStats.overallStats[0].totalReviews || 0}</h3>
                <p>Total Reviews</p>
              </div>
            
              <div className="stat-card">
                <h3>{reviewStats.overallStats[0].averageRating?.toFixed(1) || 'N/A'}</h3>
                <p>Average Rating</p>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'users' ? (
        <div className="admin-content user-management">
          <h2>User Management</h2>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((tableUser) => (
                  <tr key={tableUser._id}>
                    <td data-label="Name">{`${tableUser.firstName} ${tableUser.lastName}`}</td>
                    <td data-label="Email">{tableUser.email}</td>
                    <td data-label="Role">
                      <span className={`role-badge ${tableUser.role}`}>
                        {tableUser.role}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span className={`status-badge ${tableUser.status || 'active'}`}>
                        {tableUser.status || 'active'}
                      </span>
                    </td>
                    <td data-label="Created Date">{new Date(tableUser.createdAt).toLocaleDateString()}</td>
                    <td data-label="Actions" className="actions actions-cell">
                      
                      {tableUser._id !== user?._id && tableUser.email !== user?.email && (
                        <>
                          <button 
                            className="btn-edit" 
                            onClick={() => openEditModal(tableUser)}
                          >
                            Edit
                          </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => openDeleteModal(tableUser)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    
                    {(tableUser._id === user?._id || tableUser.email === user?.email) && (
                      <span className="current-user-label">Current User</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        {showPagination && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={prevDisabled}
            >
              Previous
            </button>
            <span>{totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : `Page ${currentPage}`}</span>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={nextDisabled}
            >
              Next
            </button>
          </div>
        )}
        </div>
      ) : (
        
        <div className="admin-content review-management">
          <h2>Review Management</h2>
          
          
          <div className="review-filters">
          
            
            <select 
              value={reviewFilters.difficulty}
              onChange={(e) => handleReviewFilterChange('difficulty', e.target.value)}
            >
              <option value="">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          
          <div className="table-container">
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Difficulty</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td data-label="User">{review.userName}</td>
                    <td data-label="Rating">
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`star ${star <= review.rating ? 'filled' : ''}`}
                          >
                            ⭐
                          </span>
                        ))}
                        ({review.rating})
                      </div>
                    </td>
                    <td data-label="Difficulty">
                      <span className={`difficulty-badge ${review.difficulty}`}>
                        {review.difficulty}
                      </span>
                    </td>
                    <td data-label="Comment" className="review-comment">
                      {review.comment.length > 50 
                        ? `${review.comment.substring(0, 50)}...` 
                        : review.comment}
                    </td>
                    <td data-label="Status">
                      <span className={`status-badge ${review.status}`}>
                        {review.status}
                      </span>
                    </td>
                    <td data-label="Date">{formatDate(review.createdAt)}</td>
                    <td data-label="Actions" className="actions actions-cell">
                      <button 
                        className="btn-view" 
                        onClick={() => {
                          setSelectedReview(review);
                          setShowReviewModal(true);
                        }}
                      >
                        View
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => deleteReview(review._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reviews.length === 0 && !loading && (
            <div className="no-reviews">
              <p>No reviews found matching the current filters.</p>
            </div>
          )}
        </div>
      )}

      
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={closeModals}>Cancel</button>
                <button type="submit">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="New Password (leave blank to keep current)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={closeModals}>Cancel</button>
                <button type="submit">Update User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete user <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>?</p>
            <div className="modal-actions">
              <button type="button" onClick={closeModals}>Cancel</button>
              <button type="button" className="btn-delete" onClick={handleDeleteUser}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      
      {showReviewModal && selectedReview && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Review Details</h2>
            <div className="review-details">
              <div className="review-info">
                <div className="info-row">
                  <label>User:</label>
                  <span>{selectedReview.userName}</span>
                </div>
                <div className="info-row">
                  <label>Rating:</label>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`star ${star <= selectedReview.rating ? 'filled' : ''}`}
                      >
                        ⭐
                      </span>
                    ))}
                    ({selectedReview.rating}/5)
                  </div>
                </div>
                <div className="info-row">
                  <label>Difficulty:</label>
                  <span className={`difficulty-badge ${selectedReview.difficulty}`}>
                    {selectedReview.difficulty}
                  </span>
                </div>
                <div className="info-row">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedReview.status}`}>
                    {selectedReview.status}
                  </span>
                </div>
                <div className="info-row">
                  <label>Date:</label>
                  <span>{formatDate(selectedReview.createdAt)}</span>
                </div>
              </div>
              
              <div className="review-comment-full">
                <label>Comment:</label>
                <p>{selectedReview.comment}</p>
              </div>
              
              {selectedReview.adminNote && (
                <div className="admin-note">
                  <label>Admin Note:</label>
                  <p>{selectedReview.adminNote}</p>
                </div>
              )}
            </div>
            
            <div className="modal-actions review-actions">
              <button type="button" onClick={closeModals}>Close</button>
              {selectedReview.status === 'pending' && (
                <>
                  <button 
                    className="btn-approve" 
                    onClick={() => updateReviewStatus(selectedReview._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn-reject" 
                    onClick={() => updateReviewStatus(selectedReview._id, 'rejected')}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}