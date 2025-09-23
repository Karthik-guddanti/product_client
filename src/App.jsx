import React, { useState, useMemo, useEffect } from 'react';
import useProducts from './hooks/useProduct';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import AddProductModal from './components/AddProductModal';
import UploadCSVModal from './components/UploadCSVModal';

const itemsPerPage = 9;

export default function App() {
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
  // State to control filter bar visibility on mobile
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    // Close filter bar on page change if on mobile
    if (window.innerWidth < 1024) { // Tailwind's 'lg' breakpoint
        setIsFilterBarOpen(false);
    }
  }, [filters, sortKey, currentPage]); // Added currentPage as dependency

  const allCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories).sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (filters.minPrice !== '') filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice !== '') filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.minStock !== '') filtered = filtered.filter(p => p.stock >= Number(filters.minStock));
    if (filters.maxStock !== '') filtered = filtered.filter(p => p.stock <= Number(filters.maxStock));
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
      {/* --- RESPONSIVE HEADER --- */}
      <header className="bg-gradient-to-r from-indigo-100 to-blue-100 py-6 px-4 sm:px-6 rounded-b-2xl shadow mb-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left Side: Title and Subtitle */}
            <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-900">Smart Product Dashboard</h1>
                <p className="mt-1 text-md text-indigo-700">Manage your inventory with advanced features.</p>
            </div>
            
            {/* Right Side: Stats and Buttons */}
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 mt-4 sm:mt-0">
                <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow font-semibold text-sm sm:text-base">
                    Products: {products.length}
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition text-sm sm:text-base" onClick={() => setShowAddProduct(true)}>
                    Add Product
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition text-sm sm:text-base" onClick={() => setShowUploadModal(true)}>
                    Upload CSV
                </button>
            </div>
        </div>
      </header>
      
      {/* --- RESPONSIVE MAIN LAYOUT --- */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Filter Bar Toggle for Mobile */}
        <div className="lg:hidden mb-4">
            <button 
                onClick={() => setIsFilterBarOpen(!isFilterBarOpen)}
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-600 transition"
            >
                {isFilterBarOpen ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Hide Filters
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                        Show Filters
                    </>
                )}
            </button>
        </div>

        {/* Filter Bar (Aside) - Conditionally rendered on mobile */}
        <aside className={`w-full lg:w-1/3 xl:w-1/4 pb-6 ${isFilterBarOpen ? 'block' : 'hidden lg:block'}`}>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            sortKey={sortKey}
            setSortKey={setSortKey}
            allCategories={allCategories}
            resetFilters={() => { setFilters(initialFilters); setSortKey(''); }}
          />
        </aside>
        
        {/* Main Content (Product Grid & Pagination) */}
        <main className="flex-1 w-full lg:w-2/3 xl:w-3/4">
          {currentProducts.length > 0 ? (
            <>
              <ProductGrid
                products={currentProducts}
                onEdit={handleSetEditing}
                onCancelEdit={handleCancelEdit}
                onSave={handleSaveProduct}
                onDelete={deleteProduct}
              />
              <div className="flex flex-col items-center mt-8 mb-8">
                <span className="text-sm text-slate-600 mb-2 text-center">
                  Showing <span className="font-semibold text-indigo-700">{currentProducts.length}</span> of <span className="font-semibold text-indigo-700">{filteredAndSortedProducts.length}</span> items
                </span>
                <div className="w-full flex justify-center mt-2">
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