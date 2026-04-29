import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Guardar los datos del usuario para que la intranet lo lea
                sessionStorage.setItem("user", JSON.stringify(data.user));
                navigate('/intranet');
            } else {
                setError(data.message || 'Error al iniciar sesión');
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Iniciar Sesión</h2>
            
            {error && (
                <div className="login-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
                <div>
                    <label htmlFor="email" className="login-label">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input" 
                    />
                </div>
                <div>
                    <label htmlFor="password" className="login-label">Contraseña</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input" 
                    />
                </div>
                <button type="submit" className="login-button">
                    Entrar
                </button>
            </form>

            <div className="login-footer">
                ¿No tienes cuenta? <Link to="/register" className="login-link">Regístrate aquí</Link>
            </div>
        </div>
    );
}