import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, banUser, unbanUser } from '../../store/userSlice';

const ManageUsers = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const { users, loading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  const handleBan = (userId) => {
    dispatch(banUser(userId))
      .unwrap()
      .then(() => {
        dispatch(fetchUsers()); // Refetch to update list
      })
      .catch((error) => {
        alert('Failed to ban user: ' + error);
      });
  };

  const handleUnban = (userId) => {
    dispatch(unbanUser(userId))
      .unwrap()
      .then(() => {
        dispatch(fetchUsers()); // Refetch to update list
      })
      .catch((error) => {
        alert('Failed to unban user: ' + error);
      });
  };

  if (loading) return <div className="text-center py-10">Loading users...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
      <div className="space-y-4">
        {users.map(user => (
          <div key={user.$id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{user.name || 'No name'}</h3>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              <p className={`text-sm ${user.banned ? 'text-red-500' : 'text-green-500'}`}>
                {user.banned ? 'Banned' : 'Active'}
              </p>
            </div>
            <div className="flex space-x-2">
              {user.banned ? (
                <button
                  onClick={() => handleUnban(user.$id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Unban
                </button>
              ) : (
                <button
                  onClick={() => handleBan(user.$id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Ban
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
