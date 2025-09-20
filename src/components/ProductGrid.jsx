import React from 'react';
import ProductCard from './ProductCard'; // Correct casing ensures no errors

const ProductGrid = ({ products, onEdit, onCancelEdit, onSave, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={(id) => {
            onEdit(id, true);
          }}
          onCancelEdit={(id) => {
            onCancelEdit(id, false);
          }}
          onSave={onSave}
          onDelete={onDelete}
          showStock={true}
        />
      ))}
    </div>
  );
};

export default ProductGrid;