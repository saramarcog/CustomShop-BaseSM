import { Outlet, NavLink } from 'react-router-dom';
import './IntranetLayout.css';

export default function IntranetLayout() {
    const raw = sessionStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;

    return (
        <div className="intranet-layout">
            <header className="intranet-header">
                <h2>Intranet</h2>
                <span>Hola, {user?.username ?? "empleado"}</span>
            </header>
            <nav className="intranet-nav">
                <NavLink to="/intranet" end>
                    Bienvenida
                </NavLink>
                <NavLink to="/intranet/fichajes">
                    Fichajes
                </NavLink>
            </nav>
            <main className="intranet-main">
                <div className="intranet-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}