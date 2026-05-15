import { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, placeOrderAPI, saveOrderToDB, getCachedProducts, setCachedProducts } from '../services/api';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBusinessModalOpen, setBusinessModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const cached = getCachedProducts();
    if (cached) {
      setProducts(cached);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, title = '') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 9);
    const toast = { id, title, message };
    setToasts((prev) => [toast, ...prev]);
    setTimeout(() => removeToast(id), 3200);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  const addToCart = (product, qty) => {
    const currentProduct = products.find(p => p.id === product.id);
    const availableStock = currentProduct?.stock ?? 0;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const newQty = existing ? existing.qty + qty : qty;

      if (newQty > availableStock) {
        addToast(`Solo quedan ${availableStock} unidades disponibles`, 'Sin Stock');
        return prev;
      }

      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: newQty } : item);
      }
      return [...prev, { ...product, qty }];
    });
  };

  const updateCartQty = (id, delta) => {
    const currentProduct = products.find(p => p.id === id);
    const availableStock = currentProduct?.stock ?? 0;

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        if (newQty > availableStock) {
          addToast('No hay más stock disponible', 'Inventario');
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const processOrder = async (formData) => {
    try {
      const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      const orderToSave = {
        ...formData,
        items: [...cart],
        total,
        status: 'Pendiente',
        created_at: new Date().toISOString()
      };
      return orderToSave;
    } catch (err) {
      addToast(err.message, 'Error');
      throw err;
    }
  };

  const confirmOrder = async (orderDetails) => {
    try {
      const dbOrder = {
        customer_name: orderDetails.name,
        customer_address: orderDetails.address,
        phone: String(orderDetails.phone || ''),
        payment_method: orderDetails.payment,
        total_amount: Math.round(orderDetails.total),
        order_items: orderDetails.items,
        observation: orderDetails.observation || '',
        order_status: 'Pendiente'
      };

      await saveOrderToDB(dbOrder);

      try {
        if (typeof placeOrderAPI === 'function') {
          await placeOrderAPI(orderDetails, products);
        }
      } catch (apiErr) {
        console.warn(apiErr);
      }

      const updatedProducts = products.map(p => {
        const ordered = orderDetails.items.find(i => i.id === p.id);
        if (!ordered) return p;
        return { ...p, stock: Math.max(0, (p.stock ?? 0) - ordered.qty) };
      });

      setProducts(updatedProducts);
      setCachedProducts(updatedProducts);

      clearCart();
      addToast('Pedido confirmado y enviado.', 'Éxito');
      return true;
    } catch (err) {
      addToast(err.message, 'Error');
      throw err;
    }
  };

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      processOrder,
      confirmOrder,
      isBusinessModalOpen,
      setBusinessModalOpen,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </ShopContext.Provider>
  );
};