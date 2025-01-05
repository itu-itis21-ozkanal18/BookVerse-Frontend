import React, { useState } from 'react';
import axios from 'axios';

function EditProfileModal({ isOpen, onClose, currentUsername, onUpdateSuccess }) {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newUsername && !newPassword) {
            setError('Please enter a new username or password');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccessMessage('');

            const response = await axios.post('/api/reset-password/', {
                new_username: newUsername || undefined,
                new_password: newPassword || undefined
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('AT')}`
                }
            });

            setSuccessMessage(response.data.message);

            // Update username in localStorage if changed
            if (newUsername) {
                localStorage.setItem('UN', newUsername);
            }

            onUpdateSuccess(newUsername);

            // Clear form
            setNewUsername('');
            setNewPassword('');

            // If password was changed, logout after 2 seconds
            if (newPassword) {
                setTimeout(() => {
                    localStorage.removeItem('AT');
                    localStorage.removeItem('RT');
                    localStorage.removeItem('UN');
                    window.location.href = '/login';
                }, 2000);
            }

            // Close modal after success (if no password change)
            if (!newPassword) {
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            setError(Array.isArray(error.response?.data?.error)
                ? error.response.data.error[0]
                : error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Profile</h2>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Username</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Enter new username"
                            className="form-input"
                        />
                        <p className="field-hint">Current username: {currentUsername}</p>
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="form-input"
                        />
                        <p className="field-hint">Leave blank to keep current password</p>
                    </div>

                    <div className="modal-buttons">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading || (!newUsername && !newPassword)}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;