'use client';

import { useState, useEffect } from 'react';

const ManageCategory = () => {
  const [editFormData, setEditFormData] = useState({ id: '', title: '' });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/hot', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Edit category
  const handleEdit = (category) => {
    setEditMode(true);
    setEditFormData({
      id: category.id,
      title: category.title,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/hot/67b1029f9c8f5a0e41ca658e`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFormData.title,
        }),
      });

      if (res.ok) {
        setMessage('Title updated successfully!');
        setEditFormData({ id: '', title: '' });
        setEditMode(false);
        fetchCategories();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the category.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Title</h1>
      {editMode && (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={editFormData.title}
              onChange={(e) =>
                setEditFormData({ ...editFormData, title: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Update Title
          </button>
        </form>
      )}
      {message && <p className="mt-4">{message}</p>}

      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="border border-gray-300 p-2">{category.title}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border border-gray-300 p-2 text-center" colSpan={2}>
                No Title found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategory;
