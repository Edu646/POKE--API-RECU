import React, { useEffect, useState } from 'react';
import './juego.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const TOTAL_PAIRS = 8;
const POKEMON_COUNT = 898;

function useAuthUsername() {
  const [username, setUsername] = useState('Invitado');
  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, user => {
      setUsername(user ? user.displayName || user.email || 'Usuario' : 'Invitado');
    });
  }, []);
  return username;
}

function useTimer(active) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  return [time, () => setTime(0)];
}

function Game() {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [ranking, setRanking] = useState([]);
  const username = useAuthUsername();
  const [timer, resetTimer] = useTimer(!gameOver);

  useEffect(() => {
    fetchPairs();
    const saved = JSON.parse(localStorage.getItem('ranking')) || [];
    setRanking(saved);
  }, []);

  const fetchPairs = () => {
    const ids = [...new Set(Array.from({ length: TOTAL_PAIRS }, () => Math.floor(Math.random() * POKEMON_COUNT) + 1))];
    Promise.all(ids.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json())))
      .then(data => {
        const names = data.map(p => p.name);
        const deck = [...names, ...names]
          .map(name => ({ id: crypto.randomUUID(), name, matched: false }))
          .sort(() => Math.random() - 0.5);
        setCards(deck);
      })
      .catch(console.error);
  };

  const selectCard = card => {
    if (selected.length === 2 || card.matched || selected.includes(card)) return;
    const next = [...selected, card];
    setSelected(next);

    if (next.length !== 2) return;

    setMoves(m => m + 1);
    const [a, b] = next;
    if (a.name === b.name) {
      setCards(c => c.map(x => (x.name === a.name ? { ...x, matched: true } : x)));
      setSelected([]);
    } else {
      setTimeout(() => setSelected([]), 800);
    }
  };

  useEffect(() => {
    if (cards.length && cards.every(c => c.matched)) {
      setGameOver(true);
      const score = { username, time: timer, moves, date: new Date().toLocaleString() };
      const updated = [...(JSON.parse(localStorage.getItem('ranking')) || []), score].sort((a, b) => a.time - b.time);
      localStorage.setItem('ranking', JSON.stringify(updated));
      setRanking(updated);
    }
  }, [cards]);

  const resetGame = () => {
    setMoves(0);
    resetTimer();
    setGameOver(false);
    setSelected([]);
    fetchPairs();
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">🧠 Juego de Parejas Pokémon</h1>

      <div className="mb-4 flex gap-4 items-center">
        <p>👤 Jugador: {username}</p>
        <p>⏱️ Tiempo: {timer}s</p>
        <p>🎯 Movimientos: {moves}</p>
        <button onClick={resetGame} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          🔄 Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-xl mx-auto">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => selectCard(card)}
            className={`cursor-pointer p-2 rounded shadow-md text-center ${
              card.matched || selected.includes(card) ? 'bg-yellow-100' : 'bg-gray-200'
            }`}
          >
            {(card.matched || selected.includes(card)) ? (
              <img src={`https://img.pokemondb.net/sprites/home/normal/${card.name}.png`} alt={card.name} className="h-16 mx-auto" />
            ) : (
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="back" className="h-12 mx-auto" />
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
            <li key={i}>#{i + 1}: {r.username || 'Anónimo'} - {r.time}s / {r.moves} movimientos ({r.date})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Game;
