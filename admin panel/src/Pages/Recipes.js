import React, { useEffect, useState } from 'react';
import { getCategories } from '../services/db';
import {
  getRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe
} from '../services/recipeService';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Recipes.css'; // ✅ Import CSS file

const Recipes = () => {
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    ingredients: '',
    price: '',
    imageFile: null
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const catSnap = await getCategories();
    setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const recSnap = await getRecipes();
    setRecipes(recSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setForm({ ...form, imageFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.ingredients || !form.price || (!form.imageFile && !editingId)) {
      return alert('Please fill all fields and upload image.');
    }

    let imageUrl = '';

    if (form.imageFile) {
      const imageRef = ref(storage, `recipes/${form.imageFile.name}`);
      await uploadBytes(imageRef, form.imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const data = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      ingredients: form.ingredients.split(',').map(i => i.trim()),
      ...(imageUrl && { imageUrl })
    };

    if (editingId) {
      await updateRecipe(editingId, data);
      setEditingId(null);
    } else {
      await addRecipe(data);
    }

    setForm({ name: '', category: '', ingredients: '', price: '', imageFile: null });
    fetchData();
  };

  const handleEdit = (rec) => {
    setForm({
      name: rec.name,
      category: rec.category,
      ingredients: rec.ingredients.join(', '),
      price: rec.price,
      imageFile: null
    });
    setEditingId(rec.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recipe?')) {
      await deleteRecipe(id);
      fetchData();
    }
  };

  return (
    <div className="recipes-container">
      <h2 className="recipes-title">Manage Recipes</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <input
          name="name"
          placeholder="Recipe name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          name="ingredients"
          placeholder="Ingredients (comma-separated)"
          value={form.ingredients}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="imageFile"
          onChange={handleChange}
          accept="image/*"
          required={!editingId}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Recipe</button>
      </form>

      <ul className="recipe-list">
        {recipes.map(rec => (
          <li key={rec.id} className="recipe-item">
            {rec.imageUrl && (
              <img src={rec.imageUrl} alt={rec.name} />
            )}
            <div className="recipe-details">
              <strong>{rec.name}</strong> ({rec.category}) - ₹{rec.price}
              <br />
              <em>Ingredients:</em> {rec.ingredients.join(', ')}
            </div>
            <div className="recipe-buttons">
              <button onClick={() => handleEdit(rec)}>Edit</button>
              <button onClick={() => handleDelete(rec.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;
