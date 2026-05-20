import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contacto({ paquete, setPaquete }) {
    const [horas, setHoras] = useState(5);
    const [invitados, setInvitados] = useState('base');
    const navigate = useNavigate();

    // Función matemática para el total
    const calcularTotal = () => {
        let total = paquete === 'premium' ? 7500 : 5500;

        if (horas > 5) {
            total += (horas - 5) * 1200;
        }

        if (invitados === '100-200') total += 3000;
        if (invitados === '200-300') total += 5500;
        if (invitados === '300+') total += 7500;

        return total;
    };

    const totalFormateado = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(calcularTotal());

    // Función que se ejecuta al darle al botón de Solicitar Reserva
    const irAReserva = (e) => {
        e.preventDefault();
        // Viajamos a /reserva y le pasamos los datos exactos del formulario
        navigate('/reserva', { state: { paquete, invitados, horas } });
    };

    return (
        <section id="cotizar" className="py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-24">

                {/* Lado Izquierdo: Formulario Dinámico */}
                <div className="glass-card p-8 md:p-12 rounded-2xl border-t-4 border-t-secondary neon-glow-secondary">
                    <h2 className="font-headline-lg text-3xl font-black mb-4">Cotiza tu evento</h2>
                    <p className="text-on-surface-variant mb-8">Calcula el costo en tiempo real.</p>

                    <form className="space-y-6" onSubmit={irAReserva}>

                        {/* Input: Paquete */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Tipo de Paquete</label>
                            <select
                                className="w-full bg-surface-container border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg px-4 py-4 outline-none text-on-surface cursor-pointer"
                                value={paquete}
                                onChange={(e) => setPaquete(e.target.value)}
                            >
                                <option value="basico">Paquete Básico ($5,500)</option>
                                <option value="premium">Paquete Premium ($7,500)</option>
                            </select>
                        </div>

                        {/* Input: Personas */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Número de Personas</label>
                            <select
                                className="w-full bg-surface-container border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg px-4 py-4 outline-none text-on-surface cursor-pointer"
                                value={invitados}
                                onChange={(e) => setInvitados(e.target.value)}
                            >
                                <option value="base">10 - 100 personas (Precio Base)</option>
                                <option value="100-200">100 - 200 personas (+$3,000)</option>
                                <option value="200-300">200 - 300 personas (+$5,500)</option>
                                <option value="300+">300 o más (+$7,500)</option>
                            </select>
                        </div>

                        {/* Input: Horas */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Duración del Evento (Horas)</label>
                            <input
                                type="number"
                                min="5"
                                max="24"
                                className="w-full bg-surface-container border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg px-4 py-4 outline-none text-on-surface"
                                value={horas}
                                onChange={(e) => {
                                    const valor = e.target.value;
                                    // Si el usuario borra todo, lo dejamos vacío para evitar el 0 fantasma
                                    setHoras(valor === '' ? '' : Number(valor));
                                }}
                            />
                            <p className="text-xs text-primary font-bold mt-2">Mínimo 5 horas. Hora extra: $1,200</p>
                        </div>

                        {/* Display del Total */}
                        <div className="p-6 bg-surface-container-lowest rounded-xl border border-secondary/30 my-8 text-center shadow-[0_0_30px_rgba(0,238,252,0.1)]">
                            <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Total Estimado</span>
                            <div className="text-secondary text-5xl md:text-6xl font-black mt-2">{totalFormateado}</div>
                        </div>

                        {/* Botón de Enviar */}
                        <button type="submit" className="w-full py-5 bg-secondary text-on-secondary rounded-lg font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all duration-300">
                            Solicitar Reserva
                        </button>
                    </form>
                </div>

                {/* Lado Derecho: FAQ */}
                <div className="flex flex-col justify-center">
                    <h2 className="font-headline-md text-4xl font-bold mb-12">Preguntas Frecuentes</h2>
                    <div className="space-y-8">
                        <div className="border-b border-white/10 pb-6">
                            <h4 className="text-secondary mb-2 font-bold uppercase text-lg">¿Capacidad de personas?</h4>
                            <p className="text-on-surface-variant text-lg">Nuestros paquetes base cubren hasta 100 personas. El cotizador ajustará automáticamente el precio para eventos masivos o festivales.</p>
                        </div>
                        <div className="border-b border-white/10 pb-6">
                            <h4 className="text-secondary mb-2 font-bold uppercase text-lg">¿Espacio abierto o cerrado?</h4>
                            <p className="text-on-surface-variant text-lg">Operamos en ambos. En espacios abiertos recomendamos el refuerzo de graves y estructuras de truss para asegurar la cobertura sonora.</p>
                        </div>
                        <div className="border-b border-white/10 pb-6">
                            <h4 className="text-secondary mb-2 font-bold uppercase text-lg">¿Costo de flete?</h4>
                            <p className="text-on-surface-variant text-lg">Entregamos sin costo a 5km a la redonda del Estadio Azteca. Fuera de esa zona, aplica un cargo de $200 dentro de CDMX.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}