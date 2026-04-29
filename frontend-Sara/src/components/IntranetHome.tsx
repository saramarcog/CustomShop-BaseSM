import { Link } from 'react-router-dom';
import './IntranetLayout.css';

export default function IntranetHome() {
    const raw = sessionStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;

    return (
        <div>
            <h2 className="intranet-page-title">Bienvenido a la Intranet</h2>
            <p className="intranet-welcome-text">
                Hola, <strong>{user?.username ?? "empleado"}</strong>. Desde aquí puedes gestionar tus tareas internas y registrar tu jornada.
            </p>
            <Link to="/intranet/fichajes" className="btn-intranet">
                Ir a mis Fichajes
            </Link>
        </div>
    );
}
