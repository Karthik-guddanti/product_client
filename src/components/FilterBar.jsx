import React from 'react';

const FilterBar = ({ filters, setFilters, sortKey, setSortKey, allCategories = [], resetFilters, handleFileUpload }) => {
    
  const handleNumericFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const handleCheckboxFilterChange = (e) => {
    const { id, checked } = e.target;
    setFilters(prev => ({ ...prev, [id]: checked }));
  };
    
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => {
        const newCategories = new Set(prev.selectedCategories);
        if (checked) {
            newCategories.add(value);
        } else {
            newCategories.delete(value);
        }
        return { ...prev, selectedCategories: Array.from(newCategories) };
    });
  };

    return (
    <aside className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col gap-6 min-h-full w-[260px] sm:w-[280px] lg:w-[320px]">
            <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Filters</h2>
            <div className="space-y-6">
                {/* Price & Stock Range */}
                <section className="pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Range</h3>
                    <div className="space-y-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Price Range</label>
                            <div className="flex gap-2">
                                <input type="number" name="minPrice" value={filters.minPrice} onChange={handleNumericFilterChange} placeholder="Min" className="w-1/2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-slate-50"/>
                                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleNumericFilterChange} placeholder="Max" className="w-1/2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-slate-50"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Stock Range</label>
                            <div className="flex gap-2">
                                <input type="number" name="minStock" value={filters.minStock} onChange={handleNumericFilterChange} placeholder="Min" className="w-1/2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-slate-50"/>
                                <input type="number" name="maxStock" value={filters.maxStock} onChange={handleNumericFilterChange} placeholder="Max" className="w-1/2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-slate-50"/>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Categories</h3>
                                <div className="p-2 h-40 overflow-y-auto border border-slate-200 rounded-lg space-y-2 bg-slate-50">
                                    {["Electronics","Groceries","Books","Home Goods","Fitness","Clothing","Accessories","Kitchen","Footwear","Stationery","Furniture","Health"].map(category => (
                                        <div key={category} className="flex items-center transition-all duration-200 hover:bg-blue-50 rounded-lg px-2 py-1">
                                            <input type="checkbox" id={`cat-${category}`} value={category} checked={filters.selectedCategories.includes(category)} onChange={handleCategoryChange} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-400"/>
                                            <label htmlFor={`cat-${category}`} className="ml-2 text-slate-700 text-sm font-semibold tracking-wide">{category}</label>
                                        </div>
                                    ))}
                                </div>
                </section>

                {/* Quick Filters & Sort */}
                <section className="pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Quick Filters</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input type="checkbox" id="showLowStock" checked={filters.showLowStock} onChange={handleCheckboxFilterChange} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-400"/>
                            <label htmlFor="showLowStock" className="ml-2 text-slate-700 text-sm">Only Show Low Stock</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showOutOfStock" checked={filters.showOutOfStock} onChange={handleCheckboxFilterChange} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-400"/>
                            <label htmlFor="showOutOfStock" className="ml-2 text-slate-700 text-sm">Only Show Out of Stock</label>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="sort" className="block text-sm font-medium text-slate-600 mb-1">Sort By</label>
                        <select id="sort" value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-slate-50">
                            <option value="">Default</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="stock-asc">Stock: Low to High</option>
                            <option value="stock-desc">Stock: High to Low</option>
                            <option value="name-asc">Name: A-Z</option>
                            <option value="name-desc">Name: Z-A</option>
                        </select>
                    </div>
                </section>

                {/* Reset Only */}
                <section>
                    <button onClick={resetFilters} className="w-full p-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-colors">
                        Reset All Filters
                    </button>
                </section>
            </div>
        </aside>
  );
};

export default FilterBar;