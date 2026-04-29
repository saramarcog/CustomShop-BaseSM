export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
    avgRating?: number | string | null;
    active:boolean;
}

export interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    username: string;
}
export interface CartItem{
    product: Product;
    quantity: number;
}
export interface Order{
    id: number;
    status: string;
    total: string;
    address: string;
    created_at:string;
}