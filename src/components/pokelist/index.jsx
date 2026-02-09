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
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('type', JSON.stringify(formData.type.split(',').map(t => t.trim())));
            fd.append('base', JSON.stringify({
                HP: formData.hp,
                Attack: formData.attack,
                Defense: formData.defense,
                SpecialAttack: formData.spAttack,
                SpecialDefense: formData.spDef,
                Speed: formData.speed
            }));

            if (formData.image instanceof File) {
                fd.append('image', formData.image);
            }

            const response = await fetch('http://localhost:3000/pokemons/update', {
                method: 'PUT',
                body: fd
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

    const handleFileChange = (e) => {
    const file = e.target.files[0];

        if (file) {
            setFormData({
                ...formData,
                image: file,
                imagePreview: URL.createObjectURL(file)
            });
        }
    };

    // --- LOGIQUE PAGINATION ---
    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const goToLastPage = () => {
        setPage(totalPages);
    };

    const goToFirstPage = () => {
        setPage(1);
    };


    return (
        <div className="poke-list-container">
            <h2>Pokedex</h2>

            <div className="pagination-controls">
                <button onClick={goToFirstPage} disabled={page === 1}>
                    Première Page
                </button>

                <button onClick={handlePrev} disabled={page === 1}>
                    Précédent
                </button>
                
                <span>Page {page} / {totalPages}</span>

                <button onClick={handleNext} disabled={page >= totalPages}>
                    Suivant
                </button>

                <button onClick={goToLastPage} disabled={page >= totalPages}>
                    Dernière Page
                </button>
            </div>

            <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className={`btn-create-pokemon ${isFormOpen ? 'open' : 'closed'}`}
            >
                {isFormOpen ? "Fermer le formulaire" : "+ Créer un nouveau Pokémon"}
            </button>


            {isFormOpen && (
                <form onSubmit={handleFormSubmit} className="pokemon-form">
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nom :</label>
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} required placeholder="Ex: Quentin" />
                        </div>
                        <div className="form-group">
                            <label>Type (séparé par virgule) :</label>
                            <input type="text" name="type" value={formData.type} onChange={handleFormChange} placeholder="Ex: Tft, Noob" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image (Fichier) :</label>
                        <input 
                            type="file" 
                            name="image" 
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                        />
                        {formData.imagePreview && (
                            <img 
                                src={formData.imagePreview} 
                                alt="Prévisualisation" 
                                style={{ marginTop: '10px', height: '100px', objectFit: 'contain' }} 
                            />
                        )}
                    </div>

                    <h4>Statistiques de base</h4>
                    <div className="stats-grid">
                        <label>HP: <input type="number" name="hp" value={formData.hp} onChange={handleFormChange} /></label>
                        <label>Atk: <input type="number" name="attack" value={formData.attack} onChange={handleFormChange} /></label>
                        <label>Def: <input type="number" name="defense" value={formData.defense} onChange={handleFormChange} /></label>
                        <label>Sp.Atk: <input type="number" name="spAttack" value={formData.spAttack} onChange={handleFormChange} /></label>
                        <label>Sp.Def: <input type="number" name="spDef" value={formData.spDef} onChange={handleFormChange} /></label>
                        <label>Vit: <input type="number" name="speed" value={formData.speed} onChange={handleFormChange} /></label>
                    </div>

                    <button type="submit" className="btn-submit">
                        Valider la création
                    </button>
                </form>
            )}

            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Chargement des Pokémon...</p>
                </div>
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