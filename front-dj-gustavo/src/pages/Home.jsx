import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Reviews from '../components/Reviews';
import Servicios from '../components/Servicios';
import Contacto from '../components/Contacto';
import Footer from '../components/Footer';

export default function Home() {
    // Se guarda el paquete elegido
    const [paquete, setPaquete] = useState('basico');

    return (
        <div className="selection:bg-primary selection:text-on-primary min-h-screen">
            <Navbar />
            <Hero />
            <Reviews />
            <Servicios paquete={paquete} setPaquete={setPaquete} />
            <Contacto paquete={paquete} setPaquete={setPaquete} />
            <Footer />
        </div>
    );
}
