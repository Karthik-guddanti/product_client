import React, { useState } from 'react';

export default function AddProductModal({ show, onClose, onAdd }) {
  const [product, setProduct] = useState({ name: '', price: '', stock: '', category: '' });
  const [error, setError] = useState('');

  const handleAdd = async () => {
    setError('');
    if (!product.name || !product.category || Number(product.price) < 0.01 || Number(product.stock) < 0) {
      setError('Please enter valid details.');
      return;
    }
    await onAdd(product);
    setProduct({ name: '', price: '', stock: '', category: '' });
    onClose();
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Add New Product</h2>
        <div className="space-y-3">
          <input type="text" placeholder="Name" className="w-full p-2 border rounded" value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} />
          <input type="number" placeholder="Price" className="w-full p-2 border rounded" min="0" step="0.01" value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} />
          <input type="number" placeholder="Stock" className="w-full p-2 border rounded" min="0" value={product.stock} onChange={e => setProduct({ ...product, stock: e.target.value })} />
          <input type="text" placeholder="Category" className="w-full p-2 border rounded" value={product.category} onChange={e => setProduct({ ...product, category: e.target.value })} />
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <div className="flex gap-4 mt-6">
          <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={handleAdd}>Add Product</button>
          <button className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}