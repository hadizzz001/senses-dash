'use client';

import { useState, useEffect } from 'react'; 
import { redirect, useRouter } from 'next/navigation';

const ManageCategory = () => {
  const [editFormData, setEditFormData] = useState({ id: '', name: '' });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]); 
  const [editMode, setEditMode] = useState(false); 

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/offer', { method: 'GET' });
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
      name: category.name,  
    }); 
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/offer?id=${editFormData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editFormData.name,  
        }),
      });

      if (res.ok) {
        setMessage('updated successfully!');
        setEditFormData({ id: '', name: '' });
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

  console.log("data: ", categories);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit' : 'Headline'}</h1>

      {editMode && (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Description</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Update Category
          </button>
        </form>
      )}
      
      {message && <p className="mt-4">{message}</p>}
 
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Description</th> 
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
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="border border-gray-300 p-2 text-center">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategory;
