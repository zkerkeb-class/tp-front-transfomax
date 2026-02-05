import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import './index.css';

const PokeList = () => {
    // --- ÉTATS GLOBAUX ---
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- ÉTATS DU FORMULAIRE (Fusionnés ici) ---
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        hp: 0, attack: 0, defense: 0, spAttack: 0, spDef: 0, speed: 0
    });

    // --- FONCTION DE FETCH ---
    const fetchPokemons = (pageNumber) => {
        setLoading(true);
        console.log(`Fetching pokemons for page ${pageNumber}...`);
        
        fetch(`http://localhost:3000/pokemons?page=${pageNumber}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemons(data.data || []); 
                setTotalPages(data.meta?.totalPages || 1);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPokemons(page);
    }, [page]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "name" || name === "type" ? value : parseInt(value) || 0
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: formData.name,
                type: formData.type.split(',').map(t => t.trim()),
                base: {
                    HP: formData.hp,
                    Attack: formData.attack,
                    Defense: formData.defense,
                    SpecialAttack: formData.spAttack,
                    SpecialDefense: formData.spDef,
                    Speed: formData.speed
                },
                image: "unknown.png"
            };

            const response = await fetch('http://localhost:3000/pokemons/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Succès : ${data.name.french || formData.name} a été créé !`);
                setIsFormOpen(false);
                setFormData({ name: "", type: "", hp: 0, attack: 0, defense: 0, spAttack: 0, spDef: 0, speed: 0 }); 
                
                fetchPokemons(page); 
            } else {
                alert("Erreur : " + data.error);
            }

        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    };

    // --- LOGIQUE PAGINATION ---
    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };


    return (
        <div className="poke-list-container">
            <h2>Pokedex</h2>

            <div className="pagination-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button onClick={handlePrev} disabled={page === 1}>
                    Précédent
                </button>
                
                <span>Page {page} / {totalPages}</span>

                <button onClick={handleNext} disabled={page >= totalPages}>
                    Suivant
                </button>
            </div>

            <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: isFormOpen ? '#ff4d4d' : '#4CAF50', color: 'white', border: 'none' }}
            >
                {isFormOpen ? "Fermer le formulaire" : "+ Créer un nouveau Pokémon"}
            </button>


            {isFormOpen && (
                <form onSubmit={handleFormSubmit} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label>Nom :</label>
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} required placeholder="Ex: Quentin" style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label>Type (séparé par virgule) :</label>
                            <input type="text" name="type" value={formData.type} onChange={handleFormChange} placeholder="Ex: tft, noob" style={{ width: '100%' }} />
                        </div>
                    </div>

                    <h4>Statistiques de base</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <label>HP: <input type="number" name="hp" value={formData.hp} onChange={handleFormChange} style={{ width: '60px' }} /></label>
                        <label>Atk: <input type="number" name="attack" value={formData.attack} onChange={handleFormChange} style={{ width: '60px' }} /></label>
                        <label>Def: <input type="number" name="defense" value={formData.defense} onChange={handleFormChange} style={{ width: '60px' }} /></label>
                        <label>Sp.Atk: <input type="number" name="spAttack" value={formData.spAttack} onChange={handleFormChange} style={{ width: '60px' }} /></label>
                        <label>Sp.Def: <input type="number" name="spDef" value={formData.spDef} onChange={handleFormChange} style={{ width: '60px' }} /></label>
                        <label>Vit: <input type="number" name="speed" value={formData.speed} onChange={handleFormChange} style={{ width: '60px' }} /></label>
                    </div>

                    <button type="submit" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#008CBA', color: 'white', border: 'none' }}>
                        Valider la création
                    </button>
                </form>
            )}

            {loading ? (
                <p>Chargement des données...</p>
            ) : (
                <ul className="poke-list">
                    {pokemons.map((pokemon, index) => (
                        <PokeCard key={pokemon.id || index} pokemon={pokemon} />
                    ))}
                </ul>
            )}

            
        </div>
    );
};

export default PokeList;