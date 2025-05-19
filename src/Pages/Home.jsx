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
    // Check if user is logged in with Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUsername(user.displayName || user.email || 'Usuario');
        setIsLoggedIn(true);
      } else {
        // User is signed out
        setUsername('');
        setIsLoggedIn(false);
      }
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, [auth]);
  
  const handleLogout = () => {
    // Sign out from Firebase
    signOut(auth).then(() => {
      // Sign-out successful
      setIsLoggedIn(false);
      setUsername('');
      navigate('/Login');
    }).catch((error) => {
      // An error happened during sign out
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