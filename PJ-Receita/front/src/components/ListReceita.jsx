import React, { useState, useEffect } from 'react';
import './CompCss/ListReceita.css';

const url = 'http://localhost:3000/receitas';

const ListReceita = () => {
    const [receitas, setReceitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReceita, setSelectedReceita] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        modoPreparo: '',
        ingredientes: '',
        tempoPreparo: '',
        imagem: ''
    });

    useEffect(() => {
        const fetchReceitas = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Falha ao tentar ler as receitas');
                }
                const data = await response.json();
                setReceitas(data.receitas);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchReceitas();
    }, []);

    const deleteReceita = async (id) => {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Falha ao excluir a receita');
            }
            setReceitas(receitas.filter((receita) => receita.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditClick = (receita) => {
        setSelectedReceita(receita);
        setFormData({ ...receita });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, imagem: file });
    };

    const updateReceita = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('titulo', formData.titulo);
            formDataToSend.append('modoPreparo', formData.modoPreparo);
            formDataToSend.append('ingredientes', formData.ingredientes);
            formDataToSend.append('tempoPreparo', formData.tempoPreparo);
            if (formData.imagem) {
                formDataToSend.append('imagem', formData.imagem);
            }

            const response = await fetch(`${url}/${selectedReceita.id}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Falha ao atualizar a receita');
            }

            setReceitas(receitas.map((receita) => (receita.id === selectedReceita.id ? formData : receita)));
            setSelectedReceita(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Carregando receitas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="receita-list-container">
            <h2>Lista de Receitas</h2>
            {receitas.length === 0 ? (
                <p>Nenhuma receita encontrada :(</p>
            ) : (
                <table className="receita-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Modo de Preparo</th>
                            <th>Ingredientes</th>
                            <th>Tempo de Preparo</th>
                            <th>Imagem</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receitas.map((receita) => (
                            <tr key={receita.id}>
                                <td>{receita.titulo}</td>
                                <td>{receita.modoPreparo}</td>
                                <td>{receita.ingredientes}</td>
                                <td>{receita.tempoPreparo} minutos</td>
                                <td>
                                    {receita.imagem && (
                                        <img
                                            src={`http://localhost:3000/${receita.imagem}`}
                                            alt={`Imagem de ${receita.titulo}`}
                                            className="receita-image"
                                        />
                                    )}
                                </td>
                                <td className="button-group">
                                    <button className="edit-button" onClick={() => handleEditClick(receita)}>Editar</button>
                                    <button className="delete-button" onClick={() => deleteReceita(receita.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedReceita && (
                <div className="edit-form">
                    <h3>Editar Receita</h3>
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        placeholder="Título da Receita"
                    />
                    <textarea
                        name="modoPreparo"
                        value={formData.modoPreparo}
                        onChange={handleInputChange}
                        placeholder="Modo de Preparo"
                        rows="6"
                    />
                    <textarea
                        name="ingredientes"
                        value={formData.ingredientes}
                        onChange={handleInputChange}
                        placeholder="Ingredientes"
                        rows="4"
                    />
                    <input
                        type="number"
                        name="tempoPreparo"
                        value={formData.tempoPreparo}
                        onChange={handleInputChange}
                        placeholder="Tempo de Preparo (minutos)"
                    />
                    <input
                        type="file"
                        name="imagem"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="button-group">
                        <button className="save-button" onClick={updateReceita}>Salvar</button>
                        <button className="cancel-button" onClick={() => setSelectedReceita(null)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListReceita;
