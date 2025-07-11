import axios from 'axios';

const API_BASE = '/api/products';

export async function getAllProducts() {
  const res = await axios.get(API_BASE, { withCredentials: true });
  return res.data;
}

export async function getProductById(productId) {
  const res = await axios.get(`${API_BASE}/${productId}`, { withCredentials: true });
  return res.data;
}

export async function getCategories() {
  const res = await axios.get(`${API_BASE}/categories`, { withCredentials: true });
  return res.data;
}

export async function getProductsByCategory(categoryId) {
  const res = await axios.get(`${API_BASE}/categories/${encodeURIComponent(categoryId)}/products`, { withCredentials: true });
  return res.data;
}

export async function searchProducts(query) {
  const res = await axios.get(`${API_BASE}?search=${encodeURIComponent(query)}`, { withCredentials: true });
  return res.data;
} 