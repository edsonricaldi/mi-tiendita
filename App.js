import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import axios from 'axios';
import Footer from './components/footer';

function App() {
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);
  
  // Estado para almacenar los productos en el carrito
  const [cart, setCart] = useState([]);
  
  // Estado para controlar si el carrito está visible
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Estado para controlar si los productos están cargando
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState(null);
  
  // useEffect para cargar los productos al iniciar la aplicación
  useEffect(() => {
    // Función asíncrona para obtener los productos
    const fetchProducts = async () => {
      try {
        setLoading(true); // Indicamos que está cargando
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data); // Guardamos los productos en el estado
        setLoading(false); // Ya no está cargando
      } catch (err) {
        setError('Error al cargar los productos'); // Guardamos el error
        setLoading(false); // Ya no está cargando
        console.error('Error al cargar productos:', err);
      }
    };

    fetchProducts(); // Ejecutamos la función
  }, []); // Array vacío significa que solo se ejecuta al montar el componente

  // useEffect para actualizar los productos cada 10 minutos
  useEffect(() => {
    // Creamos un intervalo que se ejecuta cada 10 minutos
    const interval = setInterval(() => {
      console.log('Actualizando productos...');
      axios.get('https://fakestoreapi.com/products')
        .then(response => {
          setProducts(response.data); // Actualizamos los productos
          console.log('Productos actualizados');
        })
        .catch(err => {
          console.error('Error al actualizar productos:', err);
        });
    }, 600000); // 600000 ms = 10 minutos

    // Función de limpieza que se ejecuta cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []); // Array vacío significa que solo se crea el intervalo una vez

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    // Verificamos si el producto ya está en el carrito
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
      // Si ya existe, incrementamos la cantidad
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Si no existe, lo agregamos con cantidad 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Función para remover productos del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Si la cantidad es 0 o menor, removemos el producto
      removeFromCart(productId);
    } else {
      // Actualizamos la cantidad
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    }
  };

  // Función para alternar la visibilidad del carrito
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Función para calcular el total del carrito
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Función para simular el checkout
  const handleCheckout = () => {
    // Simulamos que el stock de algún producto se agotó
    setTimeout(() => {
      alert("¡Oops! Mientras navegabas se agotó el stock de algunos productos.");
      // No vaciamos el carrito para que el usuario pueda ver qué productos tenía
    }, 1000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tienda Online</h1>
        <button className="cart-toggle" onClick={toggleCart}>
          🛒 Carrito ({cart.reduce((total, item) => total + item.quantity, 0)})
        </button>
      </header>
      
      <main className="App-main">
        {/* Pasamos el estado de loading y error al componente ProductList */}
        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <ProductList 
            products={products} 
            addToCart={addToCart} 
          />
        )}
        
        {/* Pasamos todos los estados y funciones necesarias al componente Cart */}
        <Cart 
          isOpen={isCartOpen} 
          cart={cart} 
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          toggleCart={toggleCart}
          getCartTotal={getCartTotal}
          handleCheckout={handleCheckout}
        />
      </main>
      
      {/* Agregamos el componente Footer dentro del return */}
      <Footer />
    </div>
  );
}

export default App;