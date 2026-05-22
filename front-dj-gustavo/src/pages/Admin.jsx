import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('eventos');

    // Estados para almacenar los datos reales del backend
    const [eventos, setEventos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Estados para el Modal de creación de productos
    const [showProductModal, setShowProductModal] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [productForm, setProductForm] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        medidas: '',
        color: '',
        linkAmazon: '',
        fotos: ''
    });

    // 1. CONTROL DE ACCESO Y DESCARGA DE DATOS REALES
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }



        const cargarDatosDelServidor = async () => {
            try {
                setLoadingData(true);

                // A. Petición para obtener las reservas de eventos (Ruta protegida)
                const resEventos = await fetch('http://localhost:5000/api/eventos', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const dataEventos = await resEventos.json();

                if (resEventos.ok) {
                    // El backend responde con un objeto { total, eventos: [...] }
                    setEventos(dataEventos.eventos || []);
                }

                // B. Petición para obtener el catálogo de productos (Ruta pública)
                const resProductos = await fetch('http://localhost:5000/api/productos');
                const dataProductos = await resProductos.json();

                if (resProductos.ok) {
                    // El backend responde directamente con el arreglo de productos [...]
                    setProductos(dataProductos || []);
                }

            } catch (error) {
                console.error('Error al conectar con la API:', error);
            } finally {
                setLoadingData(false);
            }
        };

        cargarDatosDelServidor();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // 2. MANEJO DEL FORMULARIO DE CREACIÓN
    const handleInputChange = (e) => {
        setProductForm({ ...productForm, [e.target.name]: e.target.value });
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);

        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:5000/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...productForm,
                    precio: Number(productForm.precio),
                    fotos: productForm.fotos ? [productForm.fotos] : [] // Se envía como arreglo String de URLs
                })
            });

            const nuevoProducto = await res.json();

            if (res.ok) {
                alert('¡Equipo agregado con éxito a la base de datos!');
                setShowProductModal(false);

                // Actualizamos el estado local para mostrar el nuevo producto de inmediato en la tabla
                setProductos((prevProductos) => [nuevoProducto, ...prevProductos]);

                // Limpiamos los campos del formulario
                setProductForm({ nombre: '', precio: '', descripcion: '', medidas: '', color: '', linkAmazon: '', fotos: '' });
            } else {
                alert(nuevoProducto.mensaje || 'Hubo un error al guardar el producto.');
            }
        } catch (error) {
            console.error('Error al enviar el producto:', error);
            alert('No hay respuesta del servidor.');
        } finally {
            setLoadingSubmit(false);
        }

    };

    const eliminarItem = async (id, tipo) => {
        if (!window.confirm("¿Estás seguro? Esta acción no se puede deshacer.")) return;

        const token = localStorage.getItem('token');
        const endpoint = tipo === 'producto' ? `http://localhost:5000/api/productos/${id}` : `http://localhost:5000/api/eventos/${id}`;

        try {
            const res = await fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                alert('Elemento eliminado correctamente');
                // Actualizamos la lista local sin recargar la página
                if (tipo === 'producto') setProductos(productos.filter(p => p._id !== id));
                else setEventos(eventos.filter(e => e._id !== id));
            } else {
                alert('Error al intentar eliminar');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Funciones de utilidad visual
    const formatearDinero = (num) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);

    const getBadgeColor = (estado) => {
        switch (estado) {
            case 'Anticipo Pagado': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'Pendiente': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'Completado': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'Cancelado': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-surface-variant text-on-surface-variant';
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface flex flex-col relative">
            <Navbar />

            <main className="pt-32 pb-24 px-4 md:px-16 max-w-7xl mx-auto flex-grow w-full relative z-10">

                {/* Header del Panel */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="font-headline-2xl text-4xl md:text-5xl font-black text-white mb-2 flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary text-5xl">admin_panel_settings</span>
                            PANEL VIP
                        </h1>
                        <p className="text-on-surface-variant font-body-lg">Control en tiempo real de reservas y catálogo.</p>
                    </div>
                    <button onClick={handleLogout} className="px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg font-bold flex items-center gap-2 transition-all w-fit">
                        <span className="material-symbols-outlined">logout</span>
                        Cerrar Sesión
                    </button>
                </header>

                {/* Pestañas (Tabs) */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                    <button onClick={() => setActiveTab('eventos')} className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'eventos' ? 'bg-primary text-on-primary neon-glow-primary' : 'bg-surface-container text-on-surface hover:bg-white/5'}`}>
                        <span className="material-symbols-outlined">calendar_month</span>
                        Reservas de Eventos ({eventos.length})
                    </button>
                    <button onClick={() => setActiveTab('productos')} className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'productos' ? 'bg-secondary text-on-secondary neon-glow-secondary' : 'bg-surface-container text-on-surface hover:bg-white/5'}`}>
                        <span className="material-symbols-outlined">inventory_2</span>
                        Catálogo de Cabinas ({productos.length})
                    </button>
                </div>

                {/* Estado de carga de la Base de Datos */}
                {loadingData ? (
                    <div className="text-center py-20 glass-card rounded-xl border border-white/10">
                        <p className="text-secondary font-bold text-lg animate-pulse">Consultando base de datos activa...</p>
                    </div>
                ) : (
                    /* Contenedor de Tablas */
                    <div className="glass-card p-1 rounded-xl overflow-hidden border border-white/10">
                        <div className="overflow-x-auto">

                            {/* TABLA DE EVENTOS REALES */}
                            {activeTab === 'eventos' && (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="bg-surface-variant/50 border-b border-white/10">
                                        <th className="p-4 font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Cliente</th>
                                        <th className="p-4 font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Fecha</th>
                                        <th className="p-4 font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Ubicación / Tipo</th>
                                        <th className="p-4 font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Paquete / Horas</th>
                                        <th className="p-4 font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Total</th>
                                        <th className="p-4 font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Estado</th>
                                        <th className="p-4 font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {eventos.length === 0 ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-on-surface-variant">No hay eventos registrados en el servidor.</td></tr>
                                    ) : (
                                        eventos.map((evento) => (
                                            <tr key={evento._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{evento.nombre}</div>
                                                    <div className="text-xs text-on-surface-variant font-mono">{evento.telefono}</div>
                                                    <div className="text-xs text-on-surface-variant">{evento.correo}</div>
                                                </td>
                                                <td className="p-4 text-sm text-white">
                                                    {new Date(evento.fechaEvento).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <div className="text-white max-w-xs truncate">{evento.direccion}</div>
                                                    <div className="text-xs text-secondary">{evento.tipoEvento}</div>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <div className="text-white">{evento.paquete}</div>
                                                    <div className="text-xs text-on-surface-variant">{evento.cantidadHoras} horas contratadas</div>
                                                </td>
                                                <td className="p-4 text-sm font-bold text-primary">{formatearDinero(evento.totalCotizado)}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(evento.estadoReserva)}`}>
                                                        {evento.estadoReserva}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <button onClick={() => eliminarItem(evento._id, 'evento')} className="text-red-400 hover:text-red-300">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            )}

                            {/* TABLA DE PRODUCTOS REALES */}
                            {activeTab === 'productos' && (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="bg-surface-variant/50 border-b border-white/10">
                                        <th className="p-4 font-label-md text-xs uppercase text-on-surface-variant font-bold">Foto</th>
                                        <th className="p-4 font-label-md text-xs uppercase text-on-surface-variant font-bold">Modelo</th>
                                        <th className="p-4 font-label-md text-xs uppercase text-on-surface-variant font-bold">Características / Medidas</th>
                                        <th className="p-4 font-label-md text-xs uppercase text-on-surface-variant font-bold">Precio</th>
                                        <th className="p-4 font-label-md text-xs uppercase text-on-surface-variant font-bold">Marketplace</th>
                                        <th className="p-4 font-label-md text-xs uppercase text-on-surface-variant font-bold">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {productos.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">No hay productos en el catálogo.</td></tr>
                                    ) : (
                                        productos.map((producto) => (
                                            <tr key={producto._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    {producto.fotos && producto.fotos[0] ? (
                                                        <img src={producto.fotos[0]} alt={producto.nombre} className="w-14 h-14 object-cover rounded-lg border border-white/20" />
                                                    ) : (
                                                        <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center border border-white/10"><span className="material-symbols-outlined text-on-surface-variant">image</span></div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{producto.nombre}</div>
                                                    <div className="text-xs text-on-surface-variant">Color: {producto.color || 'No especificado'}</div>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <div className="text-on-surface-variant max-w-xs truncate">{producto.descripcion}</div>
                                                    <div className="text-xs text-secondary font-mono">{producto.medidas}</div>
                                                </td>
                                                <td className="p-4 font-bold text-secondary text-sm">{formatearDinero(producto.precio)}</td>
                                                <td className="p-4 text-sm">
                                                    {producto.linkAmazon ? (
                                                        <a href={producto.linkAmazon} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-xs">shopping_bag</span> Ver en Amazon
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-on-surface-variant">Venta directa</span>
                                                    )}
                                                </td>
                                                <td className="p-4 flex gap-2">
                                                    <button onClick={() => eliminarItem(producto._id, 'producto')} className="text-red-400 hover:text-red-300">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Botón flotante para añadir producto */}
                {activeTab === 'productos' && !loadingData && (
                    <div className="mt-6 flex justify-end">
                        <button onClick={() => setShowProductModal(true)} className="px-6 py-3 bg-secondary text-on-secondary rounded-xl font-bold flex items-center gap-2 neon-glow-secondary active:scale-95 transition-all">
                            <span className="material-symbols-outlined">add</span>
                            Nuevo Equipo
                        </button>
                    </div>
                )}
            </main>

            {/*MODAL DE NUEVA CABINA*/}
            {showProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="glass-card p-8 rounded-2xl w-full max-w-2xl relative border border-white/20 shadow-2xl my-8">
                        <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className="font-headline-md text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">inventory</span>
                            Agregar Nueva Cabina
                        </h3>

                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Nombre del Modelo</label>
                                    <input required name="nombre" value={productForm.nombre} onChange={handleInputChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-secondary" placeholder="Ej. X-RAY SERIES II" type="text" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Precio (MXN)</label>
                                    <input required name="precio" value={productForm.precio} onChange={handleInputChange} min="1" className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-secondary" placeholder="Ej. 14500" type="number" />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Descripción</label>
                                <textarea required name="descripcion" value={productForm.descripcion} onChange={handleInputChange} rows="3" className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-secondary resize-none" placeholder="Características de aislamiento acústico, acabados..."></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Medidas</label>
                                    <input required name="medidas" value={productForm.medidas} onChange={handleInputChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-secondary" placeholder="Ej. 160cm x 80cm x 95cm" type="text" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Color</label>
                                    <input name="color" value={productForm.color} onChange={handleInputChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-secondary" placeholder="Ej. Madera Nogal / Negro" type="text" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">URL de la Imagen (Foto)</label>
                                    <input required name="fotos" value={productForm.fotos} onChange={handleInputChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-secondary" placeholder="https://images.unsplash.com/..." type="url" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Link de Amazon (Opcional)</label>
                                    <input name="linkAmazon" value={productForm.linkAmazon} onChange={handleInputChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-secondary" placeholder="https://amazon.com.mx/..." type="url" />
                                </div>
                            </div>

                            <button type="submit" disabled={loadingSubmit} className="w-full mt-6 bg-secondary text-on-secondary py-4 rounded-xl font-bold active:scale-95 transition-all text-lg flex justify-center items-center gap-2">
                                {loadingSubmit ? 'Guardando en Base de Datos...' : 'Guardar Equipo'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
