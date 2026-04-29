import { useState, useEffect } from 'react';
import './IntranetLayout.css';

type User = {
    id: number;
    username: string;
    email: string;
    role: 'customer' | 'employee' | 'admin';
    active: boolean;
};

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
            }
        } catch (err) {
            console.error("Error updating role:", err);
        }
    };

    const handleStatusToggle = async (userId: number, currentActive: boolean) => {
        try {
            const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !currentActive })
            });
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, active: !currentActive } : u));
            }
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    if (loading) return <p className="admin-loading">Cargando usuarios...</p>;

    return (
        <div className="admin-container">
            <h2 className="admin-title">Panel de Administración de Usuarios</h2>
            
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol actual</th>
                            <th className="text-center">Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="admin-id-cell">{user.id}</td>
                                <td>{user.username}</td>
                                <td className="admin-email-cell">{user.email}</td>
                                <td>
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="admin-select-role"
                                    >
                                        <option value="customer">Cliente</option>
                                        <option value="employee">Empleado</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </td>
                                <td className="text-center">
                                    <span className={`admin-status-badge ${user.active !== false ? 'status-active' : 'status-suspended'}`}>
                                        {user.active !== false ? 'Activo' : 'Suspendido'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button 
                                        onClick={() => handleStatusToggle(user.id, user.active !== false)}
                                        className={`btn-admin-action ${user.active !== false ? 'btn-suspend' : 'btn-reactivate'}`}
                                    >
                                        {user.active !== false ? 'Suspender' : 'Reactivar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
