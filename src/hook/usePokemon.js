import { useState, useEffect } from 'react';

const usePokemon = (pokemon) => {
    // const [pokemonData, setPokemonData] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchPokemon = async () => {
            
    //     };

    //     fetchPokemon();
    // }, []);

    

    return { pokemonData, loading, error };
};

export default usePokemon;