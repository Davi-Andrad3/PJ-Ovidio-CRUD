import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import './CompCss/ListUsers.css';

const url = 'http://localhost:3000/users';

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const token = localStorage.getItem('token');
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    useEffect(() => {
        if (!token) {
            setRedirectToLogin(true);
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    setRedirectToLogin(true);
                    return;
                }
                if (!response.ok) throw new Error('Failed to fetch users');

                const data = await response.json();
                setUsers(data.users);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    if (redirectToLogin) return <Navigate to="/login" replace />;
    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({ ...user });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                setRedirectToLogin(true);
                return;
            }
            if (!response.ok) throw new Error('Failed to delete user');

            setUsers(users.filter((user) => user.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const updateUser = async () => {
        try {
            const response = await fetch(`${url}/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                setRedirectToLogin(true);
                return;
            }
            if (!response.ok) throw new Error('Failed to update user');

            setUsers(users.map((user) => (user.id === selectedUser.id ? formData : user)));
            setSelectedUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="user-list-container">
            <h2>Lista de Usuários</h2>
            {users.length === 0 ? (
                <p>No users found</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td className="button-group">
                                    <button onClick={() => handleEditClick(user)}>Edit</button>
                                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedUser && (
                <div className="edit-form">
                    <h3>Edit User</h3>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                    />
                    <div className="button-group">
                        <button onClick={updateUser}>Save</button>
                        <button onClick={() => setSelectedUser(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListUser;
