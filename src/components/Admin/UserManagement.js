import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quiz';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await quizService.getAllUsers();
      setUsers(data);
    } catch (error) {
      setError('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await quizService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setDeleteConfirm(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      ADMIN: 'role-admin',
      PLAYER: 'role-player'
    };
    
    return (
      <span className={`role-badge ${roleClasses[role]}`}>
        {role}
      </span>
    );
  };

  if (loading) return <LoadingSpinner text="Loading users..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadUsers} />;

  return (
    <div className="user-management">
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="user-actions">
                    {user.role === 'PLAYER' && (
                      <button 
                        className="delete-btn"
                        onClick={() => setDeleteConfirm(user.id)}
                        disabled={users.filter(u => u.role === 'ADMIN').length <= 1 && user.role === 'ADMIN'}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete User</h3>
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteUser(deleteConfirm)}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;