import React from 'react';
import './Home.css'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">¡Bienvenido a la Pokédex!</h1>
      <Link to="/Poke" className="text-white bg-red-500 px-4 py-2 rounded">
        Ver Pokémon
      </Link>

      <Link to="/" className="text-white bg-red-500 px-4 py-2 rounded">
        Iniciar Sesion
      </Link>

      <Link to="/juego" className="text-white bg-red-500 px-4 py-2 rounded">
        Juego
      </Link>
    </div>
  );
};

export default Home;
