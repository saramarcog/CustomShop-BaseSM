import type { CartItem } from '../types';

interface CartSummaryProps {
    cart: CartItem[];
    onUpdateQuantity: (productId: number, delta: number) => void;
    onRemove: (productId: number) => void;
    onClear: () => void;
    onConfirm: () => void; // debe navegar a /checkout
}

export function CartSummary({cart, onUpdateQuantity, onRemove, onClear, onConfirm}: CartSummaryProps){
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <div className="cart-summary">
            <h2>Resumen del carrito</h2>
            {cart.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                <ul>
                    {cart.map((item) => (
                        <li key={item.product.id}>
                            <span>{item.product.name}</span>
                            <span>${item.product.price}</span>
                            <span>Cantidad: {item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.product.id, -1)}>-</button>
                            <button onClick={() => onUpdateQuantity(item.product.id, 1)}>+</button>
                            <button onClick={() => onRemove(item.product.id)}>×</button>
                        </li>
                    ))}
                </ul>
            )}
            <p>Total: ${total.toFixed(2)}</p>
            <button 
                onClick={onClear} 
                disabled={cart.length === 0}
                style={{ marginRight: '10px' }}
            >
                Vaciar carrito
            </button>
            <button 
                onClick={onConfirm} 
                disabled={cart.length === 0}
            >
                Ir a pagar
            </button>
        </div>
    );
}