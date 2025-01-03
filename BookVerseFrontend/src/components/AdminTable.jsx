// src/components/AdminTable.jsx
import React from 'react';
import '../css/AdminComponents.css';

const AdminTable = ({ columns, data, onDelete, onRowClick }) => { // removed onEdit from props
    const handleRowClick = (item) => {
        if (onRowClick) {
            onRowClick(item.id);
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            {columns?.map(column => (
                                <th key={column.key}>
                                    {column.label}
                                </th>
                            ))}
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={columns?.length + 1} style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        {columns?.map(column => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => handleRowClick(item)}
                            className="admin-table-row"
                        >
                            {columns?.map(column => (
                                <td key={column.key}>
                                    {column.render ? column.render(item) : item[column.key]}
                                </td>
                            ))}
                            <td style={{ textAlign: 'right' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent row click
                                        if (onDelete) onDelete(item.id);
                                    }}
                                    className="admin-delete-button"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;