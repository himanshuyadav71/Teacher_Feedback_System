"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Loader2, AlertCircle, Edit, Trash2, ChevronLeft, ChevronRight, Search, X, Save } from 'lucide-react';
import API_BASE_URL from '@/config';
import { Toast, ToastType } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface Table {
    table_name: string;
    model_name: string;
    row_count: number;
}

interface TableData {
    model_name: string;
    table_name: string;
    pk_field: string;
    fields: string[];
    data: any[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export default function AdminDashboard() {
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [tableData, setTableData] = useState<TableData | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingRow, setEditingRow] = useState<any | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState<{ msg: string; type: ToastType; visible: boolean }>({
        msg: '',
        type: 'info',
        visible: false,
    });

    const showToast = (msg: string, type: ToastType) => {
        setToast({ msg, type, visible: true });
    };

    useEffect(() => {
        fetchTables();
    }, []);

    useEffect(() => {
        if (selectedTable) {
            fetchTableData(currentPage);
        }
    }, [selectedTable, currentPage]);

    const fetchTables = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/dashboard-admin/tables/`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (data.status === 'ok') {
                setTables(data.tables);
            } else {
                showToast('Failed to load tables', 'error');
            }
        } catch (error) {
            showToast('Error connecting to server', 'error');
        }
    };

    const fetchTableData = async (page: number) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/dashboard-admin/table/${selectedTable}/?page=${page}&page_size=20`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (data.status === 'ok') {
                setTableData(data);
            } else {
                showToast(data.error || 'Failed to load table data', 'error');
            }
        } catch (error) {
            showToast('Error loading table data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (row: any) => {
        setEditingRow({ ...row });
    };

    const handleSaveEdit = async () => {
        if (!editingRow || !tableData) return;

        try {
            const pkValue = editingRow[tableData.pk_field];
            const res = await fetch(`${API_BASE_URL}/dashboard-admin/table/${selectedTable}/${pkValue}/update/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editingRow),
            });
            const data = await res.json();
            if (data.status === 'ok') {
                showToast('Row updated successfully', 'success');
                setEditingRow(null);
                fetchTableData(currentPage);
            } else {
                showToast(data.error || 'Failed to update row', 'error');
            }
        } catch (error) {
            showToast('Error updating row', 'error');
        }
    };

    const handleDelete = async (row: any) => {
        if (!tableData) return;

        try {
            const pkValue = row[tableData.pk_field];
            const res = await fetch(`${API_BASE_URL}/dashboard-admin/table/${selectedTable}/${pkValue}/delete/`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.status === 'ok') {
                showToast('Row deleted successfully', 'success');
                setDeleteConfirm(null);
                fetchTableData(currentPage);
            } else {
                showToast(data.error || 'Failed to delete row', 'error');
            }
        } catch (error) {
            showToast('Error deleting row', 'error');
        }
    };

    const filteredTables = tables.filter(t =>
        t.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.table_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Toast
                message={toast.msg}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            {/* Header */}
            <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-bold text-white">Database Management</h2>
                <p className="text-gray-400 font-medium">View and manage all database tables</p>
            </div>

            {/* Table Selector */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-red-500/20 p-6 shadow-lg">
                <label className="block text-sm font-bold text-white mb-3">Select Table</label>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tables..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>
                <select
                    value={selectedTable}
                    onChange={(e) => {
                        setSelectedTable(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
                >
                    <option value="">-- Select a table --</option>
                    {filteredTables.map((table) => (
                        <option key={table.table_name} value={table.table_name}>
                            {table.model_name} ({table.row_count} rows)
                        </option>
                    ))}
                </select>
            </div>

            {/* Table Data */}
            {selectedTable && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-red-500/20 shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-10 h-10 animate-spin text-red-500 mb-4" />
                            <p className="text-gray-400">Loading table data...</p>
                        </div>
                    ) : tableData && tableData.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-900/80">
                                        <tr>
                                            {tableData.fields.map((field) => (
                                                <th key={field} className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-gray-700">
                                                    {field}
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-gray-700">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {tableData.data.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                                                {tableData.fields.map((field) => (
                                                    <td key={field} className="px-4 py-3 text-sm text-gray-300">
                                                        {String(row[field] ?? '-').substring(0, 100)}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(row)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-xs font-semibold"
                                                    >
                                                        <Edit size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(row)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-xs font-semibold"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-t border-gray-700">
                                <div className="text-sm text-gray-400">
                                    Showing {((currentPage - 1) * tableData.page_size) + 1} to {Math.min(currentPage * tableData.page_size, tableData.total)} of {tableData.total} rows
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="px-4 py-2 bg-slate-700 text-white rounded-lg">
                                        Page {currentPage} of {tableData.total_pages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(tableData.total_pages, p + 1))}
                                        disabled={currentPage === tableData.total_pages}
                                        className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
                            <p className="text-gray-400">No data found in this table</p>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {editingRow && tableData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-800 rounded-2xl border border-red-500/20 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Edit Row</h3>
                            <button onClick={() => setEditingRow(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="space-y-4">
                                {tableData.fields.map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">{field}</label>
                                        <input
                                            type="text"
                                            value={editingRow[field] ?? ''}
                                            onChange={(e) => setEditingRow({ ...editingRow, [field]: e.target.value })}
                                            disabled={field === tableData.pk_field}
                                            className="w-full px-4 py-2.5 bg-slate-900/50 border border-gray-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
                            <button
                                onClick={() => setEditingRow(null)}
                                className="px-4 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors font-semibold flex items-center gap-2"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && tableData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-800 rounded-2xl border border-red-500/20 shadow-2xl max-w-md w-full"
                    >
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-xl bg-red-600/20 flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Confirm Deletion</h3>
                                    <p className="text-sm text-gray-400">This action cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete this row?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors font-semibold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
