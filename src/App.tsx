import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Admin } from './pages/Admin';
import { MyAppointments } from './pages/MyAppointments';
import { Login } from './pages/Login';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

function App() {
  
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;