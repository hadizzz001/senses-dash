"use client"


import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Upload from '../components/Upload';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AddProduct() {
  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState('');  
  const [price, setPrice] = useState(''); 
  const [img, setImg] = useState(['']); 
  const [categoryOptions, setCategoryOptions] = useState([]);  
  const [selectedCategory, setSelectedCategory] = useState('');   
  const [brandOptions, setBrandOptions] = useState([]);  
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false); // New Arrival State

  // Fetch categories based on selected type
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/category`);
        if (response.ok) {
          const data = await response.json();
          setCategoryOptions(data);
          setSelectedCategory('');
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch(`/api/brand`);
        if (response.ok) {
          const data = await response.json();
          setBrandOptions(data);  
        } else {
          console.error('Failed to fetch brands');
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    }
    fetchBrands();
  }, []);

 

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (img.length === 1 && img[0] === '') {
      alert('Please choose at least 1 image');
      return;
    }

    const payload = {
      title, 
      description,
      brand: selectedBrand, 
      price, 
      img, 
      category: selectedCategory,
      ...(isNewArrival && { arrival: "yes" }) // Add arrival only if checked
    };

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert('Product added successfully!');
      window.location.href = '/dashboard';
    } else {
      alert('Failed to add product');
    }
  };

  const handleImgChange = (url) => {
    if (url) {
      setImg(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      /> 

      {/* Brand Dropdown */}
      <label className="block text-lg font-bold mb-2">Brand</label>
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="" disabled>Select a Brand</option>
        {brandOptions.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <label className="block text-lg font-bold mb-2">Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="" disabled>Select a category</option>
        {categoryOptions.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

 

      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      /> 

      <label className="block text-lg font-bold mb-2">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write your product description here..."
      />

      <Upload onImagesUpload={handleImgChange} /> 

      {/* New Arrival Checkbox */}
      <div className="flex items-center my-4">
        <input
          type="checkbox"
          id="newArrival"
          checked={isNewArrival}
          onChange={(e) => setIsNewArrival(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="newArrival" className="text-lg font-bold">New Arrival</label>
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Save Product
      </button>
    </form>
  );
}
