import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types';
import './CheckoutPage.css';

export function CheckoutPage() {
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const saved = sessionStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
    }, []);

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("No hay productos en el carrito");
            return;
        }

        if (!address.trim()) {
            alert("Por favor, introduce una dirección de envío");
            return;
        }
        
        fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: cart.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    unitPrice: item.product.price
                })),
                address: address,
            })
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Error al procesar el pedido");
            }
            return data;
        })
        .then((data) => {
            console.log("Pedido completado", data);
            alert(`Pedido completado correctamente. Número de pedido: ${data.order?.id || 'Desconocido'}`);
            setCart([]);
            setAddress("");
            sessionStorage.removeItem("cart");
            navigate("/");
        })
        .catch(err => {
            alert(err.message);
        });
    }

    return (
        <div className="checkout-wrapper">
            <h1>Finalizar Compra</h1>

            <div className="checkout-container">
                <div className="cart-section">
                    <h2 className="checkout-section-title">Tu Carrito</h2>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '1.2rem' }}>El carrito está vacío</p>
                            <button className="btn-back" onClick={() => navigate("/")}>&larr; Volver a la tienda</button>
                        </div>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div key={item.product.id} className="cart-item">
                                    <span className="cart-item-name">{item.product.name} <span style={{color: '#888'}}>x {item.quantity}</span></span>
                                    <span className="cart-item-price">Subtotal: {(item.product.price * item.quantity).toFixed(2)}€</span>
                                </div>
                            ))}
                            <div className="cart-total">Total: {total.toFixed(2)}€</div>
                        </>
                    )}
                </div>
                
                <div className="address-section">
                    <h2 className="checkout-section-title">Dirección de Envío</h2>
                    <input 
                        type="text" 
                        className="address-input"
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                        placeholder="Ej: Calle Mayor 12, Madrid"
                    />
                </div>
                
                <div className="checkout-actions">
                    <button className="btn-back" onClick={() => navigate("/")}>&larr; Seguir Comprando</button>
                    <button 
                        className="btn-complete-order"
                        onClick={handleCheckout} 
                        disabled={!address.trim() || cart.length === 0}
                    >
                        Confirmar y Pagar
                    </button>
                </div>
            </div>
        </div>
    );
}