import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Home from './components/Home';
import Contact from './components/Contact';
import FormReceita from './components/FormReceita';
import FormUsers from './components/FormUsers';
import ListReceita from './components/ListReceita';
import ListUsers from './components/ListUsers';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';

import './App.css';
function App() {
  const [, setToken] = useState(localStorage.getItem('token') || null);

  const handleLogin = (newToken) => {
      setToken(newToken);
  };

  const handleLogout = () => {
      setToken(null);
      localStorage.removeItem('token');
  };

  return (
      <BrowserRouter>
          <div className='app-container'>
              <Header onLogout={handleLogout} />
              <main>
              <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form-receitas" element={<FormReceita />} />
          <Route path="/form-users" element={<FormUsers />} />
          <Route path="/list-receitas" element={<ListReceita />} />
          <Route path="/list-users" element={<ListUsers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
      </Routes>
              </main>
              <Footer />
          </div>
      </BrowserRouter>
  );
}

export default App;