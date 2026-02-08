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
        <div className="poke-card" style={{ '--bg-image': `url(${pokemon.image})` }}>
            
            {/* 1. LE HAUT (Header) */}
            <div className={`poke-card-header poke-type-${pokemon.type?.[0]}`}>
                <PokeTitle name={pokemon.name.french} />
            </div>

            {/* 2. LE MILIEU (Spacer) */}
            {/* IMPORTANT : Garde cette div même vide. 
                C'est elle qui pousse les stats vers le bas grâce au CSS flex-grow */}
            <div className="poke-image-background">
                {/* Tu pourras remettre <PokeImage /> ici plus tard si besoin pour les cartes non-Full Art */}
            </div>

            {/* 3. LE BAS (Stats) */}
            <div className="poke-stats-wrapper">
                {statsArray.map((stat) => {
                    const statName = stat[0];
                    const statValue = stat[1];

                    return (
                        <div className="poke-stat-row" key={statName}>
                            {/* J'ai ajouté une classe pour colorer le texte (optionnel) */}
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