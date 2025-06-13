import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Suppliers from './components/Suppliers';
import Clients from './components/Clients';
import Furniture from './components/Furniture';
import Orders from './components/Orders';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1>Мебельный склад</h1>
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>
            Главная
          </Link>
          <Link to="/suppliers" className={isActive('/suppliers')}>
            Поставщики
          </Link>
          <Link to="/clients" className={isActive('/clients')}>
            Клиенты
          </Link>
          <Link to="/furniture" className={isActive('/furniture')}>
            Мебель
          </Link>
          <Link to="/orders" className={isActive('/orders')}>
            Заказы
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/furniture" element={<Furniture />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App; 