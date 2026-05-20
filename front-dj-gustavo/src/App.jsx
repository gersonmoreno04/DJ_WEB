import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Equipo from "./pages/Equipo.jsx";
import Reserva from "./pages/Reserva.jsx";

function App() {
  return (
      <BrowserRouter>

        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<Home />} />

          {/* Ruta de inicio de sesión */}
          <Route path="/login" element={<Login />} />

          {/* Ruta del panel VIP */}
          <Route path="/admin" element={<Admin />} />

            {/* Ruta de Equipo */}
            <Route path="/equipo" element={<Equipo />} />
            {/* Ruta de Reserva */}
            <Route path="/reserva" element={<Reserva />} />/

        </Routes>
      </BrowserRouter>
  );
}

export default App;