import type { Product } from "../types";

interface ProductCardProps {
    product: Product;
    onSelect?: (id: number) => void;
}

export function ProductCard({product, onSelect}: ProductCardProps){
    const ratingNum = product.avgRating ? Math.round(Number(product.avgRating)) : 0;
    const stars = ratingNum > 0 ? "★".repeat(ratingNum) : "Sin valoraciones";

    return (
        <div className="product-card" onClick={() => onSelect && onSelect(product.id)}>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="rating">{stars}</p>
            <p className="price">${product.price}</p>
            <p className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                {product.stock > 0 ? `En Stock - ${product.stock} unidades` : "Sin Stock - 0 unidades"}
            </p>
        </div>
    );
}
/*import type { Product } from "../types";

interface ProductCardProps {
    product: Product;
    onSelect?: (id: number) => void;
}

export function ProductCard({product, onSelect}: ProductCardProps){
    return (
        <div className="product-card" onClick={() => onSelect && onSelect(product.id)}>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{product.price} €</p>
            <p className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                {product.stock > 0 ? `En Stock - ${product.stock} unidades` : "Sin Stock- 0 unidades"}
            </p>
        </div>
    );
}*/