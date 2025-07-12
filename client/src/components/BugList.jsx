// src/components/BugList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrash, FaBug, FaSpinner, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import { MdHourglassEmpty } from 'react-icons/md';

const statusBadge = (status) => {
  const base = 'ml-2 px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 border-2';
  if (status === 'open') return <span className={`${base} bg-pink-100 text-pink-700 border-pink-300`} data-testid="bug-status"><FaBug />Open</span>;
  if (status === 'in-progress') return <span className={`${base} bg-yellow-100 text-yellow-800 border-yellow-300`} data-testid="bug-status"><MdHourglassEmpty />In Progress</span>;
  return <span className={`${base} bg-green-100 text-green-800 border-green-300`} data-testid="bug-status"><FaCheckCircle />Resolved</span>;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bugToDelete, setBugToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await axios.get('/api/bugs');
        const data = Array.isArray(response.data) ? response.data : [];
        setBugs(data);
      } catch (err) {
        setError('Failed to fetch bugs');
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  }, []);

  const handleDelete = async () => {
    if (!bugToDelete) return;
    try {
      await axios.delete(`/api/bugs/${bugToDelete._id}`);
      setBugs(bugs.filter(b => b._id !== bugToDelete._id));
      toast.success('Bug deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete bug.');
    } finally {
      setShowModal(false);
      setBugToDelete(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/bugs/${id}`, { status });
      setBugs(bugs.map(bug => bug._id === id ? { ...bug, status } : bug));
      toast.success('Bug status updated!');
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const filteredBugs = filter === 'all' ? bugs : bugs.filter(b => b.status === filter);

  if (loading) return <div className="flex justify-center h-32"><FaSpinner className="animate-spin h-8 w-8 text-blue-500" /></div>;
  if (error) return <p className="text-red-500" data-testid="error-state">Failed to load bugs</p>;

  return (
    <div data-testid="bug-list">
      <div className="flex gap-6 mb-6" data-testid="status-filter">
        {['all', 'open', 'in-progress', 'resolved'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-200 ${filter === status ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
            data-testid={`filter-${status}`}
          >
            {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : status === 'open' ? 'Open' : 'Resolved'}
          </button>
        ))}
      </div>

      {filteredBugs.length === 0 ? (
        <div className="text-gray-500 py-8 text-center" data-testid="empty-state">No bugs found</div>
      ) : (
        <ul className="space-y-4">
          {filteredBugs.map((bug) => (
            <li key={bug._id} className="bg-white p-4 rounded shadow flex justify-between items-start border-l-8"
              style={{
                borderColor: bug.status === 'open'
                  ? '#ec4899'
                  : bug.status === 'in-progress'
                    ? '#facc15'
                    : '#22c55e'
              }}
              data-testid="bug-item"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2" data-testid="bug-title">
                  {bug.title} {statusBadge(bug.status)}
                </h3>
                <p className="text-sm text-gray-600" data-testid="bug-description">{bug.description}</p>
                <p className="text-xs text-gray-400 mt-1" data-testid="bug-date">
                  {formatDate(bug.createdAt)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <select
                    id={`status-${bug._id}`}
                    value={bug.status}
                    onChange={(e) => handleStatusChange(bug._id, e.target.value)}
                    className="border rounded p-1 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                    aria-label="Change bug status"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button
                    onClick={() => {
                        setBugToDelete(bug);
                        setShowModal(true);
                    }}
                    className="text-red-500 text-sm flex items-center gap-1"
                    aria-label="Delete bug"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{bugToDelete?.title}</strong>?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugList;
