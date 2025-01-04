import React from 'react';
import '../css/AdminComponents.css';

export const AdminPagination = ({ page, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pages = [];
        const maxButtons = 5; // Show 5 page buttons at a time

        let start = Math.max(1, page - Math.floor(maxButtons / 2));
        let end = Math.min(totalPages, start + maxButtons - 1);

        if (end - start + 1 < maxButtons) {
            start = Math.max(1, end - maxButtons + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-number ${page === i ? 'active' : ''}`}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="admin-pagination">
            <button
                className="page-nav"
                onClick={() => onPageChange(1)}
                disabled={page === 1}
            >
                First
            </button>
            <button
                className="page-nav"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                Previous
            </button>
            <div className="page-numbers">
                {renderPageNumbers()}
            </div>
            <button
                className="page-nav"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                Next
            </button>
            <button
                className="page-nav"
                onClick={() => onPageChange(totalPages)}
                disabled={page === totalPages}
            >
                Last
            </button>
        </div>
    );
};

export default AdminPagination;