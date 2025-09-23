import React from 'react';

const FilterBar = ({ filters, setFilters, sortKey, setSortKey, allCategories, resetFilters }) => {
  const handleNumericFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const handleCheckboxFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => {
      const selectedCategories = checked
        ? [...prev.selectedCategories, value]
        : prev.selectedCategories.filter(cat => cat !== value);
      return { ...prev, selectedCategories };
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-slate-200 sticky top-6">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6 border-b pb-4">Filters & Sort</h2>

      {/* Sort By */}
      <div className="mb-6">
        <label htmlFor="sort-key" className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
        <select
          id="sort-key"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-sm"
        >
          <option value="">None</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="stock-asc">Stock (Low to High)</option>
          <option value="stock-desc">Stock (High to Low)</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Price Range</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="min-price" className="block text-xs font-medium text-slate-600 mb-1">Min Price</label>
            <input
              type="number"
              id="min-price"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleNumericFilterChange}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="block text-xs font-medium text-slate-600 mb-1">Max Price</label>
            <input
              type="number"
              id="max-price"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleNumericFilterChange}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Stock Range */}
      <div className="mb-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Stock Range</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="min-stock" className="block text-xs font-medium text-slate-600 mb-1">Min Stock</label>
            <input
              type="number"
              id="min-stock"
              name="minStock"
              value={filters.minStock}
              onChange={handleNumericFilterChange}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="max-stock" className="block text-xs font-medium text-slate-600 mb-1">Max Stock</label>
            <input
              type="number"
              id="max-stock"
              name="maxStock"
              value={filters.maxStock}
              onChange={handleNumericFilterChange}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Stock Status Checkboxes */}
      <div className="mb-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Stock Status</h3>
        <div className="space-y-2">
          <label className="flex items-center text-sm text-slate-700">
            <input
              type="checkbox"
              name="showLowStock"
              checked={filters.showLowStock}
              onChange={handleCheckboxFilterChange}
              className="mr-2 rounded text-indigo-600 focus:ring-indigo-500"
            />
            Low Stock ( &lt; 10)
          </label>
          <label className="flex items-center text-sm text-slate-700">
            <input
              type="checkbox"
              name="showOutOfStock"
              checked={filters.showOutOfStock}
              onChange={handleCheckboxFilterChange}
              className="mr-2 rounded text-indigo-600 focus:ring-indigo-500"
            />
            Out of Stock (0)
          </label>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {allCategories.map(category => (
            <label key={category} className="flex items-center text-sm text-slate-700">
              <input
                type="checkbox"
                value={category}
                checked={filters.selectedCategories.includes(category)}
                onChange={handleCategoryChange}
                className="mr-2 rounded text-indigo-600 focus:ring-indigo-500"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="border-t pt-6">
        <button
          onClick={resetFilters}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold shadow hover:bg-gray-300 transition text-sm"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;