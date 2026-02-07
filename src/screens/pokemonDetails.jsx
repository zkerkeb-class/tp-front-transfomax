import {Link, useParams, useLocation, useNavigate} from 'react-router';
import { useState, useEffect } from "react";
import usePokemon from '../hook/usePokemon';




const PokemonDetails = () => { 
    const navigate = useNavigate();
    const location = useLocation();
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const pokeName = decodeURIComponent(location.pathname.split("/pokemonDetails/")[1]);
    console.log("pokeName:", pokeName);

    const deletePokemon = async (nameToDelete) => {

        try {
            const confirmDelete = window.confirm(`Es-tu sûr de vouloir supprimer ${nameToDelete} de ton Pokédex ?`);
            if (!confirmDelete) return;

            const response = await fetch('http://localhost:3000/pokemons/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nameToDelete 
            })
            });

            const data = await response.json();

            if (response.ok) {
            console.log('Succès :', data.message);
            navigate("/"); // Redirige vers la liste des Pokémon après suppression
            } else {
            console.error('Erreur :', data.error);
            alert("Erreur : " + data.error);
            }

        } catch (error) {
            console.error('Erreur réseau :', error);
        }
        };

    const handleStatChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            base: {
                ...prev.base,
                [name]: parseInt(value) || 0 
            }
        }));
    };

    const updatePokemon = async () => {
        try {
            
            const payload = {
                name: pokemon.name.french, 
                base: formData.base,
                type: pokemon.type, 
                image: pokemon.image
            };

            const response = await fetch('http://localhost:3000/pokemons/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Update réussi :", data);
                setPokemon(data);
                setIsEditing(false);
            } else {
                alert("Erreur update : " + data.error);
            }

        } catch (error) {
            console.error("Erreur réseau update :", error);
        }
    };



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
        <div style={{ padding: '20px' }}>
            <h1>
                {isEditing ? "Mode Édition" : `Détails de ${pokemon.name.french}`}
            </h1>
            
            <img src={pokemon.image} alt={pokemon.name.french} width="150" />

            <h2>Stats de base</h2>
            
            {isEditing ? (
                // --- VUE FORMULAIRE (Inputs) ---
                <div className="edit-form">
                    {['HP', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'].map(statName => (
                        <div key={statName} style={{ marginBottom: '5px' }}>
                            <label style={{ display: 'inline-block', width: '120px' }}>{statName}: </label>
                            <input 
                                type="number"
                                name={statName}
                                value={formData.base?.[statName] || 0}
                                onChange={handleStatChange}
                            />
                        </div>
                    ))}
                    
                    <div style={{ marginTop: '15px' }}>
                        <button onClick={updatePokemon} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
                            Sauvegarder
                        </button>
                        <button onClick={() => setIsEditing(false)}>
                            Annuler
                        </button>
                    </div>
                </div>
            ) : (
                // --- VUE NORMALE (Texte) ---
                <div>
                    <ul>
                        <li>HP: {pokemon.base?.HP}</li>
                        <li>Attack: {pokemon.base?.Attack}</li>
                        <li>Defense: {pokemon.base?.Defense}</li>
                        <li>Sp. Atk: {pokemon.base?.SpecialAttack}</li>
                        <li>Sp. Def: {pokemon.base?.SpecialDefense}</li>
                        <li>Speed: {pokemon.base?.Speed}</li>
                    </ul>

                    <button onClick={() => setIsEditing(true)} style={{ marginBottom: '20px' }}>
                        Modifier les stats
                    </button>
                </div>
            )}

            <hr />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Link to="/">Retour liste</Link>
                
                {/* On cache le bouton supprimer si on est en train d'éditer */}
                {!isEditing && (
                    <button 
                        onClick={() => deletePokemon(pokemon.name.french)}
                        style={{ backgroundColor: 'red', color: 'white' }}
                    >
                        Supprimer
                    </button>
                )}
            </div>
        </div>
    );
};

export default PokemonDetails;