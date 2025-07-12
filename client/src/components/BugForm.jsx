// src/components/BugForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BugForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!title) {
      setError('Title is required');
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/bugs', { title, description });
      setTitle('');
      setDescription('');
      setSuccess('Bug reported successfully!');
      toast.success('Bug reported successfully!');
    } catch (error) {
      setError('Failed to report bug.');
      toast.error('Failed to report bug.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-xl mx-auto" data-testid="bug-form">
      <h2 className="text-2xl font-bold mb-4">Report a Bug</h2>
      <div className="mb-4">
        <label htmlFor="bug-title" className="block mb-1 font-semibold">Title<span className="text-red-500">*</span></label>
        <input
          id="bug-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bug Title"
          className="border rounded w-full p-2"
          required
          aria-label="Bug Title"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="bug-description" className="block mb-1 font-semibold">Description</label>
        <textarea
          id="bug-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Bug Description"
          className="border rounded w-full p-2"
          rows={3}
          aria-label="Bug Description"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        {loading ? 'Reporting...' : 'Report Bug'}
      </button>
      {success && <p className="mt-3 text-green-600 dark:text-green-400 font-medium">{success}</p>}
      {error && <p className="mt-3 text-red-600 dark:text-red-400 font-medium" data-testid="form-error">{error}</p>}
    </form>
  );
};

export default BugForm;
