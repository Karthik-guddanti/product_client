import React, { useState, useMemo, useEffect, useCallback } from 'react';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';

const API_URL = 'https://product-server-67hw.onrender.com/api/products';
const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [products, setProducts] = useState([]);

  const initialFilters = useMemo(() => ({
    minPrice: '', maxPrice: '',
    minStock: '', maxStock: '',
    showLowStock: false, showOutOfStock: false,
    selectedCategories: [],
  }), []);

  const [filters, setFilters] = useState(initialFilters);
  const [sortKey, setSortKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });
  const [addError, setAddError] = useState('');

  const fetchProducts = useCallback(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortKey]);

  const allCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories).sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (filters.minPrice !== '') filtered = filtered.filter(p => p.price >= filters.minPrice);
    if (filters.maxPrice !== '') filtered = filtered.filter(p => p.price <= filters.maxPrice);
    if (filters.minStock !== '') filtered = filtered.filter(p => p.stock >= filters.minStock);
    if (filters.maxStock !== '') filtered = filtered.filter(p => p.stock <= filters.maxStock);
    if (filters.showLowStock) filtered = filtered.filter(p => p.stock > 0 && p.stock < 10);
    if (filters.showOutOfStock) filtered = filtered.filter(p => p.stock === 0);
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(p => filters.selectedCategories.includes(p.category));
    }
    switch (sortKey) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'stock-asc': filtered.sort((a, b) => a.stock - b.stock); break;
      case 'stock-desc': filtered.sort((a, b) => b.stock - a.stock); break;
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }
    return filtered;
  }, [products, filters, sortKey]);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredAndSortedProducts, itemsPerPage]);

  const handleSetEditing = useCallback((productId, isEditing) => {
    setProducts(prev => prev.map(p => p._id === productId ? { ...p, isEditing } : { ...p, isEditing: false }));
  }, []);

  const handleSaveProduct = useCallback((productId, updatedData) => {
    fetch(`${API_URL}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(updatedData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save');
        return res.json();
      })
      .then(() => fetchProducts())
      .catch(() => {});
  }, [fetchProducts]);

  const handleDeleteProduct = useCallback((productId) => {
    fetch(`${API_URL}/${productId}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_KEY }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        fetchProducts();
      })
      .catch(() => {});
  }, [fetchProducts]);

  const handleAddProduct = useCallback(async () => {
    setAddError('');
    if (!newProduct.name.trim() || !newProduct.category.trim() || Number(newProduct.price) < 0.01 || Number(newProduct.stock) < 0) {
      setAddError('Please enter valid details. Price must be > 0, stock must be >= 0.');
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setShowAddProduct(false);
        setNewProduct({ name: '', price: '', stock: '', category: '' });
        fetchProducts();
      } else {
        const errorData = await res.json();
        setAddError((errorData?.message) || 'Failed to add product.');
      }
    } catch {
      setAddError('A network error occurred. Failed to add product.');
    }
  }, [newProduct, fetchProducts]);

  // ✅ CSV Upload Handler
  const handleUploadCSV = async () => {
    if (!uploadFile) {
      setUploadError('Please select a file first.');
      return;
    }
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'x-api-key': API_KEY },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Upload failed.');
      }

      setUploadSuccess('Upload successful! Refreshing product list...');
      setUploadFile(null);
      await fetchProducts();
      setShowUploadModal(false);
    } catch (err) {
      setUploadError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <header className="mb-4 relative bg-gradient-to-r from-indigo-100 to-blue-100 py-6 rounded-b-2xl shadow px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-900">Smart Product Dashboard</h1>
        <p className="mt-1 text-md text-indigo-700">Manage your inventory with advanced editing and filtering.</p>
        <div className="absolute top-4 right-0 flex gap-3 items-center" style={{ marginRight: '1.5rem' }}>
          <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg shadow font-semibold text-md mr-2">
            Products: {products.length}
          </div>
          <button
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
            onClick={() => { setShowAddProduct(true); setAddError(''); }}
          >
            Add Product
          </button>
          <button
            className="px-5 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition"
            onClick={() => { setShowUploadModal(true); setUploadError(''); setUploadSuccess(''); }}
          >
            Upload CSV
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 gap-0 px-4 sm:px-6">
        <aside className="w-full lg:max-w-xs xl:max-w-sm">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            sortKey={sortKey}
            setSortKey={setSortKey}
            allCategories={allCategories}
            resetFilters={() => { setFilters(initialFilters); setSortKey(''); }}
          />
        </aside>
        <main className="flex-1 w-full max-w-screen-xl">
          {filteredAndSortedProducts.length > 0 ? (
            <>
              <ProductGrid
                products={currentProducts}
                onEdit={handleSetEditing}
                onCancelEdit={(id) => handleSetEditing(id, false)}
                onSave={handleSaveProduct}
                onDelete={handleDeleteProduct}
              />
              <div className="flex flex-col items-center mt-16 mb-8">
                <span className="text-sm text-slate-600 mb-2">
                  Total Items: <span className="font-semibold text-indigo-700">{filteredAndSortedProducts.length}</span>
                </span>
                <div className="w-full flex justify-center mt-2 mb-2">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredAndSortedProducts.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-lg border border-slate-200">
              <h3 className="text-2xl font-semibold text-slate-800">No Products Found</h3>
              <p className="mt-2 text-slate-500">Try adjusting your filters or add a new product.</p>
            </div>
          )}

          {/* Add Product Modal */}
          {showAddProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-indigo-700">Add New Product</h2>
                <div className="space-y-3">
                  <input type="text" placeholder="Name" className="w-full p-2 border rounded" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                  <input type="number" placeholder="Price" className="w-full p-2 border rounded" min="0" step="0.01" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                  <input type="number" placeholder="Stock" className="w-full p-2 border rounded" min="0" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                  <input type="text" placeholder="Category" className="w-full p-2 border rounded" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                </div>
                {addError && <p className="text-red-500 text-sm mt-3">{addError}</p>}
                <div className="flex gap-4 mt-6">
                  <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={handleAddProduct}>Add Product</button>
                  <button className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" onClick={() => setShowAddProduct(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-blue-700">Upload Product List (CSV/XLSX)</h2>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={e => {
                      setUploadFile(e.target.files[0] || null);
                      setUploadError('');
                      setUploadSuccess('');
                    }}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={isUploading}
                  />
                  {uploadError && <p className="text-red-500 text-xs mt-2">{uploadError}</p>}
                  {uploadSuccess && <p className="text-green-600 text-xs mt-2">{uploadSuccess}</p>}
                  <p className="text-xs text-slate-500 mt-1">
                    Accepted: <span className="font-semibold text-blue-600">.csv</span> or <span className="font-semibold text-blue-600">.xlsx</span> files.<br />
                    Columns: <span className="font-semibold">name, price, stock, category</span>
                  </p>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    className={`flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleUploadCSV}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" onClick={() => setShowUploadModal(false)} disabled={isUploading}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
