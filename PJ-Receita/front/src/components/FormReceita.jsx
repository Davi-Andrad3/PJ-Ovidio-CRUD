import React, { useState } from 'react';
import './CompCss/FormReceita.css';

const url = 'http://localhost:3000/receitas';

const FormReceita = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        modoPreparo: '',
        ingredientes: '',
        tempoPreparo: '',
        imagem: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, imagem: file }));
    };

    const clearForm = () => {
        setFormData({ titulo: '', modoPreparo: '', ingredientes: '', tempoPreparo: '', imagem: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('titulo', formData.titulo);
        formDataToSend.append('modoPreparo', formData.modoPreparo);
        formDataToSend.append('ingredientes', formData.ingredientes);
        formDataToSend.append('tempoPreparo', formData.tempoPreparo);
        if (formData.imagem) {
            formDataToSend.append('imagem', formData.imagem);
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Falha ao adicionar receita');
            }

            const data = await response.json();

            alert(`Receita adicionada com sucesso! ID: ${data.id}`);

            clearForm();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao adicionar receita');
        }
    };

    return (
        <div className="form-container">
            <div className="form-panel">
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Título da Receita:</label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="field">
                        <label>Modo de Preparo:</label>
                        <textarea
                            name="modoPreparo"
                            value={formData.modoPreparo}
                            onChange={handleChange}
                            rows="6"
                        />
                    </div>
                    <div className="field">
                        <label>Ingredientes:</label>
                        <textarea
                            name="ingredientes"
                            value={formData.ingredientes}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>
                    <div className="field">
                        <label>Tempo de Preparo (em minutos):</label>
                        <input
                            type="number"
                            name="tempoPreparo"
                            value={formData.tempoPreparo}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <label>Imagem:</label>
                        <input
                            type="file"
                            name="imagem"
                            accept="image/*"
                            onChange={handleImageChange} 
                        />
                    </div>
                    <button type="submit">Adicionar Receita</button>
                </form>
            </div>
            <div className="image-panel">
                {formData.imagem && (
                    <div className="image-preview">
                        <h3>Imagem Selecionada:</h3>
                        <img
                            src={URL.createObjectURL(formData.imagem)}
                            alt="Preview"
                            className="preview-image"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormReceita;
