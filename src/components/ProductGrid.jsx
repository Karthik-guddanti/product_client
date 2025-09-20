import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onEdit, onCancelEdit, onSave, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-5xl mx-auto">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onCancelEdit={onCancelEdit}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductGrid;