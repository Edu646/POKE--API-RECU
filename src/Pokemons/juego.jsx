import React, { useEffect, useState } from 'react';
import './juego.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Game = () => {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [username, setUsername] = useState('');
  const auth = getAuth();

  // Obtener el usuario actualmente autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // El usuario está autenticado
        setUsername(user.displayName || user.email || 'Usuario');
      } else {
        // No hay usuario autenticado
        setUsername('Invitado');
      }
    });
    
    // Cleanup de la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, [auth]);

  // Obtener 8 Pokémon aleatorios sin repetir
  const getShuffledPairs = () => {
    const max = 898;
    const indices = [...new Set(Array.from({ length: 8 }, () => Math.floor(Math.random() * max) + 1))];

    Promise.all(
      indices.map(id =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
      )
    )
      .then(data => {
        const names = data.map(p => p.name);
        const doubled = [...names, ...names];
        const shuffled = doubled
          .map(p => ({ name: p, id: Math.random(), matched: false }))
          .sort(() => Math.random() - 0.5);
        setCards(shuffled);
      })
      .catch(error => {
        console.error("Error fetching Pokémon data:", error);
      });
  };

  useEffect(() => {
    getShuffledPairs();
  }, []);

  useEffect(() => {
    let interval;
    if (!gameOver) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameOver]);

  const handleSelect = (card) => {
    if (selected.length === 2 || card.matched || selected.includes(card)) return;

    const newSelected = [...selected, card];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      if (newSelected[0].name === newSelected[1].name) {
        setCards(c => c.map(c =>
          c.name === newSelected[0].name ? { ...c, matched: true } : c
        ));
        setSelected([]);
      } else {
        setTimeout(() => setSelected([]), 800);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setGameOver(true);
      const score = { 
        username: username, 
        time: timer, 
        moves: moves, 
        date: new Date().toLocaleString() 
      };
      const saved = JSON.parse(localStorage.getItem('ranking')) || [];
      saved.push(score);
      localStorage.setItem('ranking', JSON.stringify(saved.sort((a, b) => a.time - b.time)));
      setRanking(saved);
    }
  }, [cards, timer, moves, username]);

  const resetGame = () => {
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    setSelected([]);
    getShuffledPairs();
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('ranking')) || [];
    setRanking(saved);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">🧠 Juego de Parejas Pokémon</h1>
      <div className="mb-4 flex gap-4 items-center">
        <p>👤 Jugador: {username}</p>
        <p>⏱️ Tiempo: {timer}s</p>
        <p>🎯 Movimientos: {moves}</p>
        <button
          onClick={resetGame}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-xl mx-auto">
        {cards.map(card => (
          <div
            key={card.id}
            className={`cursor-pointer p-2 rounded shadow-md text-center ${
              card.matched || selected.includes(card) ? 'bg-yellow-100' : 'bg-gray-200'
            }`}
            onClick={() => handleSelect(card)}
          >
            {card.matched || selected.includes(card) ? (
              <img
                src={`https://img.pokemondb.net/sprites/home/normal/${card.name}.png`}
                alt={card.name}
                className="h-16 mx-auto"
              />
            ) : (
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="back"
                className="h-12 mx-auto"
              />
            )}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">🏆 ¡Juego completado!</h2>
          <p>Jugador: {username}</p>
          <p>Tu tiempo: {timer}s, Movimientos: {moves}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">📊 Ranking</h2>
        <ul className="list-disc pl-5">
          {ranking.slice(0, 5).map((r, i) => (
            <li key={i}>
              #{i + 1}: {r.username || 'Anónimo'} - {r.time}s / {r.moves} movimientos ({r.date})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Game;