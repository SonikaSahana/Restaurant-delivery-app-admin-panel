import React, { useEffect, useState } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/db';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Categories.css'; // ← Import CSS

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    const snapshot = await getCategories();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || (!imageFile && !editingId)) return alert('Please fill all fields.');

    let imageUrl = '';

    if (imageFile) {
      const imageRef = ref(storage, `categories/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const categoryData = {
      name,
      imageUrl: imageUrl || categories.find(c => c.id === editingId)?.imageUrl || ''
    };

    if (editingId) {
      await updateCategory(editingId, categoryData);
      setEditingId(null);
    } else {
      await addCategory(categoryData);
    }

    setName('');
    setImageFile(null);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  return (
    <div className="categories-container">
      <h2 className="categories-title">Manage Categories</h2>

      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Category</button>
      </form>

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id} className="category-item">
            <img src={cat.imageUrl} alt={cat.name} />
            <strong>{cat.name}</strong>
            <button onClick={() => handleEdit(cat)}>Edit</button>
            <button onClick={() => handleDelete(cat.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
