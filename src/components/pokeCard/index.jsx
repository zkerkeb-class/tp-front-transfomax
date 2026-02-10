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

    const rawStats = pokemon.base || {};
    const statsArray = Object.entries(rawStats);
    console.log("Mon tableau prêt à être mappé :", statsArray);


    return (
    <Link to={`/pokemonDetails/${encodeURIComponent(pokemon.name.french)}`}>
        {/* <div className="poke-card" style={{ '--bg-image': pokemon.isFullArt ? `url(${pokemon.image})` : undefined }}> */}
        <div className="poke-card" style={{ '--bg-image': `url(${pokemon.image})`}}>
            

            {/* <div className="poke-image-background">
                { !pokemon.isFullArt && (
                    <PokeImage imageUrl={pokemon.image} />
                )}
            </div> */}

            <div className="poke-stats-wrapper">
                {statsArray.map((stat) => {
                    let statName = stat[0];

                    console.log("Stat avant transformation:", statName);
                    if (statName === "Attack") {
                        statName = "ATK";
                    }
                    if (statName === "Defense") {
                        statName = "DEF";
                    }
                    if (statName === "SpecialAttack") {
                        statName = "ATK.SP";
                    }
                    if (statName === "SpecialDefense") {
                        statName = "DEF.SP";
                    }
                    if (statName === "Speed") {
                        statName = "SPD";
                    }   

                    const statValue = stat[1];

                    return (
                        <div className="poke-stat-row" key={statName}>
                            <span className={`poke-type-font`}>{statName}</span>
                            <span className="poke-type-font poke-stat-value">{statValue}</span>
                        </div>
                    );
                })}    
            </div>

        </div>
    </Link>
);
}

export default PokeCard;