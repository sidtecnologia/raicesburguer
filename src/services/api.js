import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export const initSupabase = async () => {
  if (supabaseInstance) return supabaseInstance;

  try {
    const url = import.meta.env.VITE_SB_URL || import.meta.env.SB_URL;
    const anonKey = import.meta.env.VITE_SB_ANON_KEY || import.meta.env.SB_ANON_KEY;

    if (url && anonKey) {
      supabaseInstance = createClient(url, anonKey);
      return supabaseInstance;
    }

    const response = await fetch('/api/get-config');
    if (!response.ok) throw new Error('Error fetching config');

    const config = await response.json();
    if (!config.url || !config.anonKey) throw new Error('Missing credentials');

    supabaseInstance = createClient(config.url, config.anonKey);
    return supabaseInstance;
  } catch (error) {
    console.error('API Initialization Error:', error);
    throw error;
  }
};

const CACHE_KEY = 'rb_products_cache';

export const getCachedProducts = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCachedProducts = (products) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } catch {
    // localStorage lleno o bloqueado, se ignora
  }
};

export const getProducts = async () => {
  const supabase = await initSupabase();
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  setCachedProducts(data);
  return data;
};

export const placeOrderAPI = async (orderDetails, products) => {
  const response = await fetch('/api/place-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderDetails, products }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error procesando la orden');
  }
  return await response.json();
};

export const saveOrderToDB = async (orderData) => {
  const supabase = await initSupabase();
  const { data, error } = await supabase.from('orders').insert([orderData]).select();
  if (error) throw error;
  return data;
};