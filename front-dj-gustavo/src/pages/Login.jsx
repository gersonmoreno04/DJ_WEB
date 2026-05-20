import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({ correo: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Nota: Aquí apuntamos a la ruta real de tu compañero
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // El backend nos devuelve un { token: "..." }
                localStorage.setItem('token', data.token);
                alert('¡Bienvenido al Panel VIP!');
                navigate('/admin');
            } else {
                alert(data.mensaje || 'Correo o contraseña incorrectos.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('No hay conexión con el servidor. Verifica que esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="glass-card p-10 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-8 text-center tracking-tighter">ZONA VIP</h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Correo</label>
                        <input
                            name="correo"
                            type="email"
                            onChange={handleChange}
                            required
                            className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface focus:border-secondary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            required
                            className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface focus:border-secondary outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-secondary text-on-secondary rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {loading ? 'Validando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}