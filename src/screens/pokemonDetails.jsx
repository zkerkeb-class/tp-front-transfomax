import {Link, useParams, useLocation, useNavigate} from 'react-router';
import { useState, useEffect } from "react";
import usePokemon from '../hook/usePokemon';
import './index.css';




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

    const handleNameChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            name: value
        }));
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
            const trimmedName = (formData.name || '').trim();
            const payload = {
                name: pokemon.name.french,
                originalName: pokemon.name.french,
                newName: trimmedName || pokemon.name.french,
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
                setFormData({
                    name: data.name?.french || trimmedName || pokemon.name.french,
                    base: data.base || formData.base
                });
                if (data.name?.french && data.name.french !== pokeName) {
                    navigate(`/pokemonDetails/${encodeURIComponent(data.name.french)}`, { replace: true });
                }
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
                    setFormData({
                        name: data?.name?.french || '',
                        base: data?.base || {}
                    });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Erreur:", error);
                    setLoading(false);
                });
        }, []);


    if (loading) {
        return (
            <div className="loading-details">
                <div className="loading-spinner"></div>
                <p>Chargement des détails du Pokémon...</p>
            </div>
        );
    }
    
    return (
        <div className="pokemon-details-page">
            <div className={`pokemon-details-header ${isEditing ? 'editing' : ''}`}>
                {isEditing ? (
                    <div className="pokemon-name-edit">
                        <span className="editing-label">Mode Édition</span>
                        <input
                            className="pokemon-name-input"
                            type="text"
                            value={formData.name || ''}
                            onChange={handleNameChange}
                            placeholder="Nom du Pokémon"
                        />
                    </div>
                ) : (
                    <h1>{pokemon.name.french}</h1>
                )}
                
                {pokemon.type && (
                    <div className="pokemon-types">
                        {pokemon.type.map((type, index) => (
                            <span key={index} className={`type-badge ${type}`}>{type}</span>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="pokemon-image-container">
                <img 
                    src={pokemon.image} 
                    alt={pokemon.name.french} 
                    className="pokemon-details-image"
                />
            </div>

            <div className="pokemon-stats-section">
                <h2>Stats de base</h2>
                
                {isEditing ? (
                    <div className="edit-form">
                        {['HP', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'].map(statName => (
                            <div key={statName} className="edit-form-group">
                                <label>{statName}</label>
                                <input 
                                    type="number"
                                    name={statName}
                                    value={formData.base?.[statName] || 0}
                                    onChange={handleStatChange}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="stats-list">
                        <div className="stat-item">
                            <span className="stat-name">HP</span>
                            <span className="stat-value">{pokemon.base?.HP}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-name">Attack</span>
                            <span className="stat-value">{pokemon.base?.Attack}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-name">Defense</span>
                            <span className="stat-value">{pokemon.base?.Defense}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-name">Sp. Atk</span>
                            <span className="stat-value">{pokemon.base?.SpecialAttack}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-name">Sp. Def</span>
                            <span className="stat-value">{pokemon.base?.SpecialDefense}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-name">Speed</span>
                            <span className="stat-value">{pokemon.base?.Speed}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="pokemon-actions">
                {isEditing ? (
                    <>
                        <button onClick={updatePokemon} className="btn-save">
                            Sauvegarder
                        </button>
                        <button onClick={() => setIsEditing(false)} className="btn-cancel">
                            Annuler
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/" className="btn-back">
                            ← Retour à la liste
                        </Link>
                        <button onClick={() => {
                            setFormData({ name: pokemon.name.french, base: { ...pokemon.base } });
                            setIsEditing(true);
                        }} className="btn-edit">
                            Modifier
                        </button>
                        <button 
                            onClick={() => deletePokemon(pokemon.name.french)}
                            className="btn-delete"
                        >
                            Supprimer
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PokemonDetails;