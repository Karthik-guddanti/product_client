import React, { useState, useMemo, useEffect } from 'react';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';

const API_URL = 'http://localhost:3000/api/products';
// Correct way to access environment variables in Vite
const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  const [products, setProducts] = useState([]);
  const initialFilters = {
    minPrice: '', maxPrice: '',
    minStock: '', maxStock: '',
    showLowStock: false, showOutOfStock: false,
    selectedCategories: [],
  };
  const [filters, setFilters] = useState(initialFilters);
  const [sortKey, setSortKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Add Product Modal State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });
  const [addError, setAddError] = useState('');

  // Function to fetch all products from the server
  const fetchProducts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      });
  };

  // Fetch products only once on initial component mount
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Reset page to 1 whenever filters change
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

  const handleSetEditing = (productId, isEditing) => {
    setProducts(prev => prev.map(p => p._id === productId ? { ...p, isEditing } : { ...p, isEditing: false }));
  };

  const handleSaveProduct = (productId, updatedData) => {
    fetch(`${API_URL}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY // Add API Key for authorization
      },
      body: JSON.stringify(updatedData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save');
        return res.json();
      })
      .then(() => {
        fetchProducts(); // Refresh product list
      })
      .catch(err => console.error("Save error:", err));
  };

  const handleDeleteProduct = (productId) => {
    fetch(`${API_URL}/${productId}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': API_KEY // Add API Key for authorization
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        fetchProducts(); // Refresh product list
      })
      .catch(err => console.error("Delete error:", err));
  };

  const handleAddProduct = async () => {
    setAddError('');
    if (!newProduct.name.trim() || !newProduct.category.trim() || Number(newProduct.price) < 0.01 || Number(newProduct.stock) < 0) {
      setAddError('Please enter valid details. Price must be > 0, stock must be >= 0.');
      return;
    }
    try {
      console.log('API_KEY being sent:', API_KEY);
      console.log('POST body:', newProduct);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY // Add API Key for authorization
        },
        body: JSON.stringify(newProduct)
      });
      console.log('Response status:', res.status);
      let errorData = null;
      if (!res.ok) {
        errorData = await res.json();
        console.log('Error response:', errorData);
      }
      if (res.ok) {
        setShowAddProduct(false);
        setNewProduct({ name: '', price: '', stock: '', category: '' });
        fetchProducts(); // Refresh product list
      } else {
        setAddError((errorData && (errorData.error || errorData.message)) || 'Failed to add product.');
      }
    } catch (err) {
      console.log('Fetch error:', err);
      setAddError('A network error occurred. Failed to add product.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="mb-8 text-center bg-gradient-to-r from-indigo-100 to-blue-100 py-8 rounded-b-2xl shadow">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-900">Smart Product Dashboard</h1>
            <p className="mt-2 text-lg text-indigo-700">Manage your inventory with advanced editing and filtering.</p>
        </header>
        <div className="flex flex-col lg:flex-row flex-1 gap-8 px-4 sm:px-8">
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
            <main className="flex-1">
                <div className="mb-6 flex justify-end">
                    <button
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
                        onClick={() => { setShowAddProduct(true); setAddError(''); }}
                    >
                        Add Product
                    </button>
                </div>
                {filteredAndSortedProducts.length > 0 ? (
                    <>
                        <ProductGrid
                            products={currentProducts}
                            onEdit={handleSetEditing}
                            onCancelEdit={(id) => handleSetEditing(id, false)}
                            onSave={handleSaveProduct}
                            onDelete={handleDeleteProduct}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredAndSortedProducts.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                        <h3 className="text-2xl font-semibold text-slate-800">No Products Found</h3>
                        <p className="mt-2 text-slate-500">Try adjusting your filters or add a new product.</p>
                    </div>
                )}
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
            </main>
        </div>
    </div>
  );
};

export default App;