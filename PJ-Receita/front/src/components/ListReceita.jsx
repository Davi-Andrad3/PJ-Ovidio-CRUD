import React, { useState, useEffect } from 'react';
import './CompCss/ListReceita.css';

const url = 'http://localhost:3000/receitas';

const ListReceita = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [formData, setFormData] = useState({ nome: '', nasc: '', peso: '', cor: '', image: '' });

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Falha ao tentar ler os pets');
                }
                const data = await response.json();
                setPets(data.pets);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    const deletePet = async (id) => {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Falha ao excluir o pet');
            }
            setPets(pets.filter((pet) => pet.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditClick = (pet) => {
        setSelectedPet(pet);
        setFormData({ ...pet });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const updatePet = async () => {
        try {
            const response = await fetch(`${url}/${selectedPet.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Falha ao atualizar o pet');
            }
            setPets(pets.map((pet) => (pet.id === selectedPet.id ? formData : pet)));
            setSelectedPet(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Carregando pets...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="pet-list-container">
            <h2>Lista de Pets</h2>
            {pets.length === 0 ? (
                <p>Nenhum pet encontrado :(</p>
            ) : (
                <table className="pet-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Data de Nascimento</th>
                            <th>Peso</th>
                            <th>Cor</th>
                            <th>Imagem</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.map((pet) => (
                            <tr key={pet.id}>
                                <td>{pet.nome}</td>
                                <td>{pet.nasc}</td>
                                <td>{pet.peso} kg</td>
                                <td>{pet.cor}</td>
                                <td>
                                    {pet.image && (
                                        <img
                                            src={`http://localhost:3000/${pet.image}`}
                                            alt={`Imagem de ${pet.nome}`}
                                            className="pet-image"
                                        />
                                    )}
                                </td>
                                <td className="button-group">
                                    <button className="edit-button" onClick={() => handleEditClick(pet)}>Editar</button>
                                    <button className="delete-button" onClick={() => deletePet(pet.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedPet && (
                <div className="edit-form">
                    <h3>Editar Pet</h3>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Nome"
                    />
                    <input
                        type="date"
                        name="nasc"
                        value={formData.nasc}
                        onChange={handleInputChange}
                        placeholder="Data de Nascimento"
                    />
                    <input
                        type="number"
                        name="peso"
                        value={formData.peso}
                        onChange={handleInputChange}
                        placeholder="Peso"
                    />
                    <input
                        type="text"
                        name="cor"
                        value={formData.cor}
                        onChange={handleInputChange}
                        placeholder="Cor"
                    />
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="button-group">
                        <button className="save-button" onClick={updatePet}>Salvar</button>
                        <button className="cancel-button" onClick={() => setSelectedPet(null)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListReceita;
