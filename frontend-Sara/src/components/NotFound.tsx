import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="not-found">
            <h1 className="not-found_code">404</h1>
            <p className="not-found_message">Lo sentimos, el producto o la página que buscas no existe.</p>
            <button className="not-found_btn" onClick={() => navigate('/')}>Volver al catálogo</button>
        </div>
    );
}