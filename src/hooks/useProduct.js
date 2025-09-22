import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct, uploadCSV } from '../api/products';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  return {
    products,
    loading,
    addProduct: async (product) => { await addProduct(product); loadProducts(); },
    updateProduct: async (id, data) => { await updateProduct(id, data); loadProducts(); },
    deleteProduct: async (id) => { await deleteProduct(id); loadProducts(); },
    uploadCSV: async (file) => { await uploadCSV(file); loadProducts(); },
    reload: loadProducts
  };
}