import { useState } from "react";
import type { CartItem } from "../types";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";


function Checkout(){
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [cart,setCart]=useState<CartItem[]>([]);
    const total = cart.reduce((sum, item)=>sum + item.price * item.quantity, 0);
    const handleCheckout = () => {
        if(cart.length ===0 ){
            alert("No hay productos en el carrito")
            return;
        }

        if(!address.trim()){
            alert("Por favor, introduce una dirección de envío")
            return;
        }
        
        fetch("http://localhost:3000/api/orders",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                items: cart.map((item)=>{
                    product_id: item.product.id,
                    quantity: item.quantity,
                }),
                address:address,
                
            })
        }).then((res)=>res.json)
        .then((data)=>{
            console.log("Pedido completado",data);
            alert("Pedido completado correctamente");
            setCart([]);
            setAddress("");
            sessionStorage.removeItem("cart");
            navigate("/orders");
        })
        
    }
    





    return (
        <div>
            <h2>Checkout</h2>
        </div>
    )
}