// AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus páginas o componentes
import Poke from '../Pokemons/VerPokemons';
import Home from '../Pages/Home';
import NotFound from '../Pages/NotFound'; 
import Juegos from '../Pokemons/juego';
import Login from './login';
import { rutas_privdas } from './Router_private';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Poke" element={<Poke />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<rutas_privdas/>}>
           <Route path="/juego" element={<Juegos/>}/>
        </Route>
        <Route path='/Login' element={<Login/>}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
