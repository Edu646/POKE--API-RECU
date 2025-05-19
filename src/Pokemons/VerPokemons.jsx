import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import './Pokemon.css';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=12');
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const observer = useRef();
  const lastPokemonElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextUrl) {
        loadMorePokemons();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, nextUrl]);

  const loadMorePokemons = () => {
    if (!nextUrl || loadingMore) return;

    setLoadingMore(true);
    fetch(nextUrl)
      .then(res => res.json())
      .then(data => {
        setPokemons(prevPokemons => [...prevPokemons, ...data.results]);
        setNextUrl(data.next);
      })
      .catch(error => {
        console.error('Error al cargar más Pokémon:', error);
      })
      .finally(() => {
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    fetch(nextUrl)
      .then((res) => res.json())
      .then((data) => {
        setPokemons(data.results);
        setNextUrl(data.next);
      })
      .catch((error) => {
        console.error('Error al obtener los Pokémon:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePokemonClick = (url) => {
    setDetailLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSelectedPokemon(data);
      })
      .catch((error) => {
        console.error('Error al obtener los datos del Pokémon:', error);
      })
      .finally(() => {
        setDetailLoading(false);
      });
  };

  const renderRadarChart = (pokemon) => {
    const stats = pokemon.stats.map(stat => stat.base_stat);
    const statNames = pokemon.stats.map(stat => stat.stat.name);

    const chartOptions = {
      chart: {
        height: 350,
        type: 'radar',
      },
      title: {
        text: `Estadísticas de ${pokemon.name}`,
      },
      xaxis: {
        categories: statNames,
      },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        radar: {
          size: 140,
          polygons: {
            strokeColors: '#000000',
            fill: {
              colors: ['#fa370b', '#d1d1d1'],
            },
          },
        },
      },
      colors: ['#feb500'],
      markers: {
        size: 4,
        colors: ['#fff'],
        strokeColor: '#00BFFF',
        strokeWidth: 2,
      },
      tooltip: {
        y: {
          formatter: (val) => val,
        },
      },
      yaxis: {
        labels: {
          formatter: (val, i) => (i % 2 === 0 ? val : ''),
        },
      },
    };

    const chartSeries = [
      {
        name: 'Estadísticas',
        data: stats,
      },
    ];

    return (
      <div className="my-6">
        <ReactApexChart options={chartOptions} series={chartSeries} type="radar" height={350} />
      </div>
    );
  };

  if (loading) return <div className="pokemon-list"><p>Cargando Pokémon...</p></div>;

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="pokemon-list p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pokédex</h1>
        <Link to="/" className="text-white bg-red-500 px-4 py-2 rounded">
          Volver al inicio
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
        />
      </div>

      {selectedPokemon ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <button
            onClick={() => setSelectedPokemon(null)}
            className="mb-4 text-blue-500 hover:underline"
          >
            ← Volver a la lista
          </button>
          <h2 className="text-2xl font-bold capitalize">{selectedPokemon.name}</h2>
          {detailLoading ? (
            <p>Cargando detalles...</p>
          ) : (
            <div>
              <img
                src={selectedPokemon.sprites.front_default}
                alt={selectedPokemon.name}
                className="my-4 mx-auto"
              />
              <p><strong>Altura:</strong> {selectedPokemon.height}</p>
              <p><strong>Peso:</strong> {selectedPokemon.weight}</p>
              <p><strong>Tipos:</strong> {selectedPokemon.types.map(t => t.type.name).join(', ')}</p>
              <p><strong>Habilidades:</strong> {selectedPokemon.abilities.map(a => a.ability.name).join(', ')}</p>

              {renderRadarChart(selectedPokemon)}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredPokemons.map((pokemon, index) => {
              if (index === filteredPokemons.length - 1) {
                return (
                  <div
                    key={pokemon.name}
                    ref={lastPokemonElementRef}
                    onClick={() => handlePokemonClick(pokemon.url)}
                    className="bg-white rounded-xl shadow-md p-4 text-center cursor-pointer hover:bg-gray-100"
                  >
                    <p className="font-bold capitalize">{pokemon.name}</p>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(pokemon.url)}.png`}
                      alt={pokemon.name}
                      className="mx-auto"
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    key={pokemon.name}
                    onClick={() => handlePokemonClick(pokemon.url)}
                    className="bg-white rounded-xl shadow-md p-4 text-center cursor-pointer hover:bg-gray-100"
                  >
                    <p className="font-bold capitalize">{pokemon.name}</p>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(pokemon.url)}.png`}
                      alt={pokemon.name}
                      className="mx-auto"
                    />
                  </div>
                );
              }
            })}
          </div>

          {loadingMore && (
            <div className="text-center my-4">
              <p>Cargando más Pokémon...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const getPokemonIdFromUrl = (url) => {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
};

export default PokemonList;
