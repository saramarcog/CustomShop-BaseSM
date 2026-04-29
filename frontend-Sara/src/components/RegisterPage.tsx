import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: nombre, 
                    full_name: nombre, 
                    email, 
                    password 
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('¡Usuario creado correctamente! Redirigiendo al login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Error al registrar usuario');
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Crear Cuenta</h2>
            
            {error && (
                <div className="register-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="register-success">
                    {success}
                </div>
            )}

            <form onSubmit={handleRegister} className="register-form">
                <div>
                    <label htmlFor="nombre" className="register-label">Nombre</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="register-input" 
                    />
                </div>
                <div>
                    <label htmlFor="email" className="register-label">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="register-input" 
                    />
                </div>
                <div>
                    <label htmlFor="password" className="register-label">Contraseña</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="register-input" 
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="register-label">Confirmar Contraseña</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="register-input" 
                    />
                </div>
                <button type="submit" className="register-button">
                    Crear cuenta
                </button>
            </form>

            <div className="register-footer">
                ¿Ya tienes cuenta? <Link to="/login" className="register-link">Inicia sesión aquí</Link>
            </div>
        </div>
    );
}
