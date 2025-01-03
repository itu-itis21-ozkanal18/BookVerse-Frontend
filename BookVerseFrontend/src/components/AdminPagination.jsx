// src/components/AdminPagination.jsx
import React from 'react';
import '../css/AdminComponents.css';

export const AdminPagination = ({ page, totalPages, onPageChange }) => {
    return (
        <div className="admin-pagination">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                Previous
            </button>
            <span className="admin-pagination-info">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default AdminPagination;