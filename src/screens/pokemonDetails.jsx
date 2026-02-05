import {Link, useParams, useLocation} from 'react-router';
import { useState, useEffect } from "react";
import usePokemon from '../hook/usePokemon';

const PokemonDetails = () => { 
    const location = useLocation();
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);

    const pokeName = decodeURIComponent(location.pathname.split("/pokemonDetails/")[1]);
    console.log("pokeName:", pokeName);
    useEffect(() => {
            fetch("http://localhost:3000/pokemons/" + pokeName)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Données reçues:", data);
                    setPokemon(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Erreur:", error);
                    setLoading(false);
                });
        }, []);


    if (loading) {
        return <p>Chargement des détails du Pokémon...</p>;
    }
    
    return (
        <div>
            <h1>Détails du Pokémon {pokemon.name.french}</h1>
            <p>Ici seront affichés les détails du Pokémon sélectionné.</p>
            <Link to="/">Retour à la liste des Pokémon</Link>
        </div>
    );
};

export default PokemonDetails;