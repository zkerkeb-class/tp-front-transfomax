import { useEffect, useState } from "react";
import { Link } from "react-router";
import usePokemon from "../../hook/usePokemon";

import './index.css';
import PokeTitle from "./pokeTitle";
import PokeImage from "./pokeImage";

const PokeCard = ({ pokemon }) => {
    console.log('pokemon prop', pokemon);

    // if (loading) {
    //     return <p>Chargement du Pokémon...</p>;
    // }


    return (
        // <Link to={`/pokemonDetails/${encodeURIComponent(pokemon.url)}`}>
        <div className="poke-card">
            <div className={`poke-card-header poke-type-${pokemon.type?.[0]}`}>
                <PokeTitle name={pokemon.name.french} />
            </div>
            <div className="poke-image-background">
                <PokeImage imageUrl={pokemon.image} />
            </div>
            <div>

                {/* {pokemon.base?.map((stat) => {
                    return(
                        <div className="poke-stat-row" key={stat.stat.name}>
                            <span className={`poke-type-font poke-type-${stat.stat.name}`}>{stat.stat.name}</span>

                            <span className="poke-type-font poke-stat-value">{stat.base_stat}</span>
                        </div>
                    ) 
                })}     */}

            </div>
        </div>
        // </Link>
    );
}

export default PokeCard;