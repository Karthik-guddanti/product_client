const API_URL = 'https://product-server-67hw.onrender.com/api/products';
const API_KEY = import.meta.env.VITE_API_KEY;

export async function fetchProducts() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function addProduct(product) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify(product)
  });
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'x-api-key': API_KEY }
  });
  return res.json();
}

export async function uploadCSV(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { 'x-api-key': API_KEY },
    body: formData
  });
  return res.json();
}