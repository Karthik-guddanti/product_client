import React, { useState, useMemo, useEffect } from 'react';
// ✅ FIX: Changed from './hooks/useProducts' to './hooks/useProduct'
import useProducts from './hooks/useProduct'; 
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import AddProductModal from './components/AddProductModal';
import UploadCSVModal from './components/UploadCSVModal';

const itemsPerPage = 9;

export default function App() {
  // ... rest of the component remains the same
  const { products, addProduct, updateProduct, deleteProduct, uploadCSV } = useProducts();
  const initialFilters = useMemo(() => ({
    minPrice: '', maxPrice: '',
    minStock: '', maxStock: '',
    showLowStock: false, showOutOfStock: false,
    selectedCategories: [],
  }), []);

  const [filters, setFilters] = useState(initialFilters);
  const [sortKey, setSortKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const [editingProductId, setEditingProductId] = useState(null);

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
  
  const productsWithEditState = useMemo(() => {
    return filteredAndSortedProducts.map(p => ({
        ...p,
        isEditing: p._id === editingProductId
    }));
  }, [filteredAndSortedProducts, editingProductId]);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return productsWithEditState.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, productsWithEditState]);

  const handleSetEditing = (productId) => {
    setEditingProductId(productId);
  };
  
  const handleCancelEdit = () => {
    setEditingProductId(null);
  };
  
  const handleSaveProduct = async (productId, data) => {
    await updateProduct(productId, data);
    setEditingProductId(null); 
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
          <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition" onClick={() => setShowAddProduct(true)}>
            Add Product
          </button>
          <button className="px-5 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition" onClick={() => setShowUploadModal(true)}>
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
          {currentProducts.length > 0 ? (
            <>
              <ProductGrid
                products={currentProducts}
                onEdit={handleSetEditing}
                onCancelEdit={handleCancelEdit}
                onSave={handleSaveProduct}
                onDelete={deleteProduct}
              />
              <div className="flex flex-col items-center mt-16 mb-8">
                <span className="text-sm text-slate-600 mb-2">Total Items: <span className="font-semibold text-indigo-700">{filteredAndSortedProducts.length}</span></span>
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
        </main>
      </div>
      <AddProductModal show={showAddProduct} onClose={() => setShowAddProduct(false)} onAdd={addProduct} />
      <UploadCSVModal show={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={uploadCSV} />
    </div>
  );
}