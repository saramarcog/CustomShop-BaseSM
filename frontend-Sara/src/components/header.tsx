import { type CartItem } from "../types";


export function Header() {
    const rawCart = sessionStorage.getItem("cart");
    const cart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const rawUser = sessionStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    return (
        <header className='site-header'>
            <h1>Custom Shop</h1>
            <p>El lugar con los mejores productos</p>

            {user && <span className="welcome-message">Hola, {user.username}</span>}
            {cartCount > 0 && (
            <p className="cart-count">Mi carrito: {cartCount}</p>
            )}
        </header>
    );
}

export default Header;