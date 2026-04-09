import { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, placeOrderAPI, saveOrderToDB } from '../services/api';

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
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
    addToast(`${product.name} añadido al pedido`);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const processOrder = async (orderData) => {
    try {
      const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      const orderToSave = {
        ...orderData,
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
        address: orderDetails.address,
        phone: String(orderDetails.phone || ''),
        payment_method: orderDetails.payment,
        total_amount: orderDetails.total,
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
        console.warn("Notificación externa falló:", apiErr);
      }

      await fetchProducts();
      clearCart();
      addToast('Pedido confirmado y enviado.', 'Pedido enviado');
      return true;
    } catch (err) {
      addToast('Error al confirmar: ' + err.message, 'Error');
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