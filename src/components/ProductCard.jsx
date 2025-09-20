import React, { useState, useEffect } from 'react';
// Assuming StockStatusBadge is in the same folder or './components/StockStatusBadge'
import StockStatusBadge from './StockStausBadge';

const ProductCard = ({ product = {}, onSave, onCancelEdit, onEdit, onDelete }) => {
  const [editData, setEditData] = useState({
    name: product.name || '',
    price: product.price ?? '',
    stock: product.stock ?? '',
    category: product.category || ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditData({
      name: product.name || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      category: product.category || ''
    });
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'price' || name === 'stock') {
      processedValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
    }
    setEditData(prev => ({ ...prev, [name]: processedValue }));
  };

  const validateAndSave = () => {
    const newErrors = {};
    if (String(editData.name).trim() === '') newErrors.name = 'Name is required.';
    if (editData.price === '' || editData.price <= 0) newErrors.price = 'Price must be > 0.';
    if (editData.stock === '' || editData.stock < 0) newErrors.stock = 'Stock must be >= 0.';
    if (String(editData.category).trim() === '') newErrors.category = 'Category is required.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(product._id, { ...editData, price: Number(editData.price), stock: Number(editData.stock) });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between h-full">
      {product.isEditing ? (
        // --- EDIT MODE ---
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">Name</label>
            <input value={editData.name} onChange={handleInputChange} name="name" type="text" className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Price</label>
              <input value={editData.price} onChange={handleInputChange} name="price" type="number" min="0" step="0.01" className={`w-full p-2 border ${errors.price ? 'border-red-500' : 'border-slate-300'} rounded-lg`} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Stock</label>
              <input value={editData.stock} onChange={handleInputChange} name="stock" type="number" min="0" className={`w-full p-2 border ${errors.stock ? 'border-red-500' : 'border-slate-300'} rounded-lg`} />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Category</label>
            <input value={editData.category} onChange={handleInputChange} name="category" type="text" className={`w-full p-2 border ${errors.category ? 'border-red-500' : 'border-slate-300'} rounded-lg`} />
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div className="flex space-x-3 pt-2">
            <button onClick={() => onCancelEdit(product._id)} className="w-full p-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">Cancel</button>
            <button onClick={validateAndSave} className="w-full p-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">Save</button>
          </div>
        </div>
      ) : (
        // --- VIEW MODE ---
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900 pr-2 break-words">{product.name || ''}</h3>
            <StockStatusBadge stock={product.stock ?? 0} />
          </div>
          <p className="text-slate-500 mb-4 text-base font-medium">{product.category || ''}</p>
          <div>
            <p className="text-3xl font-mono font-semibold text-indigo-600 mb-4">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price ?? 0)}
            </p>
            <div className="flex space-x-3 mt-4">
              <button onClick={() => { onEdit(product._id); setErrors({}); }} className="flex-1 p-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">Edit</button>
              <button onClick={() => onDelete(product._id)} className="flex-1 p-2 bg-rose-500 text-white font-semibold rounded-lg shadow hover:bg-rose-600 transition">Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;