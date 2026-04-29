import { useEffect, useState } from 'react'
import type { Product } from './types'
import { ProductCard } from './components/productCard'
import { CartSummary } from './components/CartSummary';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from './types';



function App() {

  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const loadProducts = () => {
    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then((data: Product[]) => setProducts(data))
      .catch((error) => console.error("Error loading products:", error));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    
    e.preventDefault();
    fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        Credentials:"include"
       },
      body: JSON.stringify({
        name: newName,
        price: parseFloat(newPrice),
        description: newDescription || undefined,
        category: newCategory || undefined,
        stock: newStock ? parseInt(newStock) : undefined,
        imageUrl: newImageUrl || undefined
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error " + res.status);
        return res.json();
      })
      .then(() => {
        setNewName("");
        setNewPrice("");
        setNewCategory("");
        setNewStock("");
        setNewDescription("");
        setNewImageUrl("");
        loadProducts();
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleUpdateStock = (id: number, currentStock: number): void => {
    const input = window.prompt(`Stock actual: ${currentStock}. Nuevo stock:`);
    if (input === null) return;
    const newStock = parseInt(input);
    if (isNaN(newStock) || newStock < 0) {
      alert("El stock debe ser un número mayor o igual a 0");
      return;
    }
    fetch(`http://localhost:3000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error del servidor: " + res.status);
        return res.json();
      })
      .then(() => loadProducts())
      .catch((error) => console.error("Error:", error));
  };
  const handleDelete = (id: number): void => {
    if (!window.confirm("¿Seguro que quieres borrar este producto?")) return;
    fetch(`http://localhost:3000/api/products/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Error del servidor: " + res.status);
        return res.json();
      })
      .then(() => loadProducts())
      .catch((error) => console.error("Error:", error));
  };

  const addToCart = (product: Product): void => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number): void => {
    setCart(prev => prev.filter(item => item.product.id !== id));
    //El filtro lo q hace es crear un array nuevo con todos los productos menos el que tenga el id que le pasamos
    //asi q se elimina el producto del carrito
  };

  const clearCart = (): void => {
    setCart([]);
    //lo q hace es vaciar el carrito
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  //se llama recursiva a si misma para sumar todos los productos
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);


  useEffect(() => { loadProducts(); }, []);
  useEffect(() =>{
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);




  return (
    <>
        <div className="carrito-container">
            <CartSummary 
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={removeFromCart}
              onClear={clearCart}
              onConfirm={() => navigate('/checkout')}
            />
        </div>
          <div className="formulario-producto">
            <h3>Añadir producto</h3>
            <form onSubmit={handleSubmit} className="topbar-form">
              <div className="form-group">
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" name="name" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="description">Descripción:</label>
                <input type="text" id="description" name="description" value={newDescription} onChange={e => setNewDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="price">Precio:</label>
                <input type="text" id="price" name="price" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="category">Categoría:</label>
                <input type="text" id="category" name="category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock:</label>
                <input type="text" id="stock" name="stock" value={newStock} onChange={e => setNewStock(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="imageUrl">Imagen:</label>
                <input type="text" id="imageUrl" name="imageUrl" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
              </div>
              <div className="form-group btn-group">
                <button type="submit">Añadir</button>
              </div>
            </form>
          </div>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-item-wrapper">
                <ProductCard product={product} onSelect={(id) => navigate(`/product/${id}`)} />

                <button title="Añadir al carrito" className="btn-add-to-cart" disabled={product.stock === 0 || product.active == false}
                  onClick={() => addToCart(product)}>
                  🛒
                </button>

                <div className="product-actions">
                  <button className='editarStock' title="Editar stock"
                    onClick={() => handleUpdateStock(product.id, product.stock)}>
                    ✏️
                  </button>
                  <button title="Borrar" className="btn-danger"
                    onClick={() => handleDelete(product.id)}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          
    </>
  );
}


export default App
