import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
    // Función auxiliar para no repetir tanto código en las clases de Tailwind
    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary border-b-2 border-primary pb-1 font-label-md text-label-md transition-all"
            : "text-on-surface-variant hover:text-on-surface border-b-2 border-transparent pb-1 transition-all font-label-md text-label-md";

    return (
        <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_40px_rgba(232,179,255,0.1)]">
            <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 mx-auto">
                {/* Regresar al inicio */}
                <Link to="/" className="font-headline-md text-2xl md:text-3xl font-black tracking-tighter text-on-surface dark:text-on-surface">
                    GDL PRODUCTION
                </Link>

                <div className="hidden md:flex items-center space-x-8">

                    <NavLink className={navLinkClass} to="/">
                        Servicios
                    </NavLink>

                    <NavLink className={navLinkClass} to="/equipo">
                        Equipo
                    </NavLink>


                    <NavLink className={navLinkClass} to="/login">
                        Admin
                    </NavLink>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="hidden md:block px-6 py-2 rounded-full border border-primary text-primary font-label-md text-label-md hover:bg-white/5 transition-all">
                        WhatsApp
                    </button>
                    <Link to="/reserva" className="bg-primary text-on-primary-container px-6 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-all duration-200 ease-in-out font-bold">
                        Agenda tu cita
                    </Link>
                </div>
            </div>
        </nav>
    );
}
