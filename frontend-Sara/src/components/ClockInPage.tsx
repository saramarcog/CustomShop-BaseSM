import { useState, useEffect } from 'react';
import './IntranetLayout.css';

export default function ClockInPage() {
    const raw = sessionStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    const employeeId = user?.id ?? 1;

    const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
    const [note, setNote] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/clock/status?employeeId=${employeeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setIsClockedIn(data.isClockedIn);
                }
            } catch (err) {
                console.error("Error checking status", err);
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, [employeeId]);

    const handleClockEvent = async () => {
        const type = isClockedIn ? 'out' : 'in';
        try {
            const res = await fetch(`http://localhost:3000/api/clock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId, type, note })
            });

            if (res.ok) {
                const data = await res.json();
                setIsClockedIn(!isClockedIn);
                setNote('');
                const date = new Date(data.event.recorded_at);
                setMessage(`Fichaje de ${type === 'in' ? 'entrada' : 'salida'} registrado a las ${date.toLocaleTimeString()}`);
            } else {
                setMessage("Error al registrar el fichaje.");
            }
        } catch (err) {
            console.error("Error clocking", err);
            setMessage("Error de conexión al fichar.");
        }
    };

    if (loading) return <p className="intranet-text">Cargando estado del fichaje...</p>;

    return (
        <div>
            <h2 className="intranet-page-title">Registro de Fichajes</h2>
            
            {message && (
                <div className="clock-message-success">
                    {message}
                </div>
            )}

            <div className="clock-form-group">
                <label className="clock-label">
                    Incidencia (opcional):
                </label>
                <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    className="clock-textarea"
                    placeholder="Escribe aquí si has llegado tarde, si hay algún problema, etc."
                />
            </div>

            <button 
                onClick={handleClockEvent}
                className={`btn-intranet ${isClockedIn ? 'btn-clock-out' : 'btn-clock-in'}`}
            >
                {isClockedIn ? 'Fichar salida' : 'Fichar entrada'}
            </button>
        </div>
    );
}
