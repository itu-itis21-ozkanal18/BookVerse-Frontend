import React from 'react';
import '../css/AdminComponents.css';

const AdminTable = ({ columns, data, onDelete, onRowClick }) => {
    const handleRowClick = (item) => {
        if (onRowClick) {
            onRowClick(item.id);
        }
    };

    console.log(data);

    return (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        {columns?.map(column => (
                            <th key={column.key}>{column.label}</th>
                        ))}
                        <th className="action-column">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(!data || data.length === 0) ? (
                        <tr>
                            <td colSpan={columns?.length + 1} className="no-data">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                className={`admin-table-row ${onRowClick ? 'clickable' : ''}`}
                                onClick={() => onRowClick && handleRowClick(item)}
                            >
                                {columns?.map(column => (
                                    <td key={column.key}>
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
                                <td className="action-column">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this item?')) {
                                                onDelete && onDelete(item.id);
                                            }
                                        }}
                                        className="admin-delete-button"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;