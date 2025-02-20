'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ManageCategory = () => {
  const [formData, setFormData] = useState({ name: '', link: '' });
  const [editFormData, setEditFormData] = useState({ id: '', name: '', link: '' });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/social', { method: 'GET' });
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

  // Handle form submission (Add new category)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Post added successfully!');
      setFormData({ name: '', link: '' });
      fetchCategories();
      router.push('/social');
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };

  // Handle edit category
  const handleEdit = (category) => {
    setEditMode(true);
    setEditFormData({
      id: category.id,
      name: category.name,
      link: category.link,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/social?id=${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editFormData.name,
          link: editFormData.link,
        }),
      });

      if (res.ok) {
        setMessage('Post updated successfully!');
        setEditFormData({ id: '', name: '', link: '' });
        setEditMode(false);
        fetchCategories();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the post.');
    }
  };

  // Handle delete category
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const res = await fetch(`/api/social?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setMessage('Post deleted successfully!');
          fetchCategories();
        } else {
          const errorData = await res.json();
          setMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit Post' : 'Add Post'}</h1>

      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="space-y-4">
        {/* Name Dropdown */}
        <div>
          <label className="block mb-1">Platform</label>
          <select
            className="border p-2 w-full"
            value={editMode ? editFormData.name : formData.name}
            onChange={(e) =>
              editMode
                ? setEditFormData({ ...editFormData, name: e.target.value })
                : setFormData({ ...formData, name: e.target.value })
            }
            required
          >
            <option value="" disabled>Select Platform</option>
            <option value="Tiktok">Tiktok</option>
            <option value="Insta">Instagram</option>
            <option value="Facebook">Facebook</option>
          </select>
        </div>

        {/* Link Input */}
        <div>
          <label className="block mb-1">Post Link</label>
          <input
            type="url"
            className="border p-2 w-full"
            value={editMode ? editFormData.link : formData.link}
            onChange={(e) =>
              editMode
                ? setEditFormData({ ...editFormData, link: e.target.value })
                : setFormData({ ...formData, link: e.target.value })
            }
            required
            placeholder="Enter post link"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {editMode ? 'Update Post' : 'Add Post'}
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-xl font-bold mt-8">All Posts</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Platform</th> 
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="border border-gray-300 p-2">{category.name}</td> 
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border border-gray-300 p-2 text-center" colSpan="3">
                No posts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategory;
