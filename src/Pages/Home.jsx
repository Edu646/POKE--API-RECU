import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Home = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || user.email || 'Usuario');
        setIsLoggedIn(true);
      } else {
        setUsername('');
        setIsLoggedIn(false);
      }
    });
    
    return () => unsubscribe();
  }, [auth]);
  
  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      setUsername('');
      navigate('/Login');
    }).catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
  };
  
  return (
    <div className="text-center p-10">
   
      <h1 className="text-4xl font-bold mb-4">¡Bienvenido a la Pokédex!</h1>
      
      {isLoggedIn && (
        <div className="mb-4">
          <p className="text-lg">Hola, <span className="font-bold">{username}</span>!</p>
        </div>
      )}
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">¿Qué hace este programa?</h2>
        <div className="text-left space-y-3 text-gray-700">
          <p>
            <strong>📱 Pokédex Interactiva:</strong> Esta aplicación web te permite explorar el mundo Pokémon 
            de manera completa e interactiva. Puedes buscar, visualizar y obtener información detallada 
            sobre todos los Pokémon disponibles.
          </p>
          <p>
            <strong>🔐 Sistema de Autenticación:</strong> Utiliza Firebase Authentication para gestionar 
            usuarios de forma segura. Puedes crear una cuenta, iniciar sesión y mantener tu progreso 
            guardado en la nube.
          </p>
          <p>
            <strong>🎮 Funcionalidades Principales:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Ver Pokémon:</strong> Explora la base de datos completa con información detallada de cada Pokémon</li>
            <li><strong>Juego Interactivo:</strong> Disfruta de mini-juegos y actividades relacionadas con Pokémon</li>
            <li><strong>Perfil de Usuario:</strong> Tu progreso y preferencias se guardan automáticamente</li>
          </ul>
          <p>
            <strong>💾 Tecnologías:</strong> Desarrollada con React, Firebase, y APIs de Pokémon para 
            ofrecerte una experiencia moderna y responsive en cualquier dispositivo.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <Link to="/Poke" className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          Ver Pokémon
        </Link>
        
        {!isLoggedIn ? (
          <Link to="/Login" className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Iniciar Sesión
          </Link>
        ) : (
          <button 
            onClick={handleLogout}
            className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        )}
        
        <Link to="/juego" className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          Juego
        </Link>
      </div>
    </div>
  );
};

export default Home;