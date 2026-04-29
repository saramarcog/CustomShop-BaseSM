import { useState, useEffect } from "react";
import "./OrderHistory.css";

const STATUS_COLORS: Record<string, string> = {
  pending: "orange",
  processing: "blue",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

interface Order {
  id: number;
  status: string;
  total: number;
  address: string;
  created_at: string;
}

interface OrderItem {
  name: string;
  image_url: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderDetail extends Order {
  items: OrderItem[];
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userStr = sessionStorage.getItem("user");
        if (!userStr) {
          setError("Usuario no logueado");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const token = sessionStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/api/orders/customer/${user.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });
        
        if (res.status === 404) {
          setOrders([]);
        } else if (!res.ok) {
          throw new Error("Error al cargar los pedidos");
        } else {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar los pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Error al cargar el detalle del pedido");
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar el detalle");
    }
  };

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="order-history">
      <h2>Mi Historial de Pedidos</h2>
      {orders.length === 0 ? (
        <p>No hay pedidos todavía.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th># (ID)</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id} 
                onClick={() => handleOrderClick(order.id)}
              >
                <td>{order.id}</td>
                <td className="order-status" style={{ color: STATUS_COLORS[order.status] || "black" }}>
                  {order.status}
                </td>
                <td>${order.total}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div className="order-detail">
          <h3>Detalle del Pedido #{selectedOrder.id}</h3>
          
          <ul className="order-detail-list">
            {selectedOrder.items.map((item, idx) => (
              <li key={idx} className="order-detail-item">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} width="50" className="order-detail-img" />
                ) : (
                  <div className="order-detail-img-placeholder" />
                )}
                <div className="order-detail-info">
                  <strong>{item.name}</strong>
                  <div className="order-detail-meta">
                    Cantidad: {item.quantity} | Precio Unidad: ${Number(item.unit_price).toFixed(2)}
                  </div>
                </div>
                <div className="order-detail-price">
                  ${Number(item.subtotal).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
