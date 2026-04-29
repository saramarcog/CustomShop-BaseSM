import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { NotFound } from "./NotFound";
import "./productDetail.css";
import type { CartItem } from '../types';
import type { Review } from '../types';

export function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const addToCartFromDetail = (product: Product): void => {
        const saved = sessionStorage.getItem("cart");
        let currentCart: CartItem[] = saved ? JSON.parse(saved) : [];
        
        const existing = currentCart.find(i => i.product.id === product.id);
        
        if (existing) {
            currentCart = currentCart.map(i => 
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            currentCart = [...currentCart, { product, quantity: 1 }];
        }
        
        // Guardar el nuevo carrito actualizado en sessionStorage
        sessionStorage.setItem("cart", JSON.stringify(currentCart));
        // Actualizar el estado local para mantener coherencia en este componente
        setCart(currentCart);
        
        alert("¡Producto añadido al carrito correctamente!");
    };

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Producto no encontrado");
                return res.json();
            })
            .then(data => {
                setProduct(data);
                setIsLoading(false);
            })
            .catch(() => {
                setHasError(true);
                setIsLoading(false);
            });
    }, [id]);

    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>("");

    const fetchReviews = () => {
        fetch(`http://localhost:3000/api/products/${id}/reviews`)
            .then(res => {
                if (res.ok) return res.json();
                return [];
            })
            .then(data => setReviews(Array.isArray(data) ? data : []))
            .catch(() => setReviews([]));
    };

    useEffect(() => {
        fetchReviews();
    }, [id]);

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        fetch(`http://localhost:3000/api/products/${id}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating, comment, customerId: 1 })
        })
        .then(res => res.json())
        .then(() => {
            fetchReviews();
            setComment("");
            setRating(5);
        });
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando detalles del producto...</div>;
    }

    if (hasError || !product) {
        return <NotFound />;
    }

    return (
        <div className="product-detail">
            <img className="product-image" src={product.imageUrl} alt={product.name} />
            <h2 className="product-name">{product.name}</h2>
            <span className="product-category">{product.category}</span>
            <p className="product-description">{product.description}</p>
            <p className="product-price">{product.price}€</p>
            <p className={`product-stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                {product.stock > 0 ? `En Stock - ${product.stock} unidades` : "Sin Stock - 0 unidades"}
            </p>
            <button className="addToCart" onClick={() => addToCartFromDetail(product)} disabled={product.stock === 0}>Añadir al carrito</button>
            <button className="product-detail_back" onClick={() => navigate('/')}>Volver al catálogo</button>

            <div className="reviews-section">
                <h3>Reseñas</h3>
                {reviews.length > 0 ? (
                    <ul className="reviews-list">
                        {reviews.map(r => (
                            <li key={r.id}>
                                <strong>{r.username || "Usuario"}</strong> - <span style={{color: "gold"}}>{"★".repeat(r.rating)}</span>{"☆".repeat(5 - r.rating)}
                                <p>{r.comment}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay reseñas todavía.</p>
                )}

                <form onSubmit={submitReview} className="review-form">
                    <h4>Deja tu reseña</h4>
                    <label>
                        Valoración:
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} estrella{n>1?'s':''}</option>)}
                        </select>
                    </label>
                    <label>
                        Comentario:
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
                    </label>
                    <button type="submit">Enviar reseña</button>
                </form>
            </div>
        </div>
    );
}
/*
import type { Product } from "../types";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./productDetail.css";

/*
interface ProductDetailProps {
    product: Product;
    onClose?: () => void;
}
   

export function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
    }, [id]);

    if (!product) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="product-detail">
            <img className="product-image" src={product.imageUrl} alt={product.name} />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">{product.price}</p>
            <p className={`product-stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                {product.stock > 0 ? `En Stock - ${product.stock} unidades` : "Sin Stock- 0 unidades"}
            </p>
            <button className="product-detail_back" onClick={() => navigate('/')}>Volver al catálogo</button>
        </div>
    );
}
*/