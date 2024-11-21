import React, { useState } from 'react';
import './CompCss/FormReceita.css';

const url = 'http://localhost:3000/receitas';

const FormReceita = () => {
    const [formData, setFormData] = useState({
        nome: '',
        nasc: '',
        peso: '',
        cor: '',
        image: '' 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, image: file }));
    };

    const clearForm = () => {
        setFormData({ nome: '', nasc: '', peso: '', cor: '', image: '' }); // Reset image to an empty string
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('nome', formData.nome);
        formDataToSend.append('nasc', formData.nasc);
        formDataToSend.append('peso', formData.peso);
        formDataToSend.append('cor', formData.cor);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to add pet');
            }

            const data = await response.json();

            alert(`Pet added successfully! ID: ${data.id}`);

            clearForm();
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding pet');
        }
    };

    return (
        <div className="form-container">
            <div className="form-panel">
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="field">
                        <label>Data de Nascimento:</label>
                        <input
                            type="date"
                            name="nasc"
                            value={formData.nasc}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <label>Peso:</label>
                        <input
                            type="number"
                            step="0.1"
                            name="peso"
                            value={formData.peso}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <label>Cor:</label>
                        <input
                            type="text"
                            name="cor"
                            value={formData.cor}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <label>Imagem:</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange} 
                        />
                    </div>
                    <button type="submit">Add Pet</button>
                </form>
            </div>
            <div className="image-panel">
                {formData.image && (
                    <div className="image-preview">
                        <h3>Imagem Selecionada:</h3>
                        <img
                            src={URL.createObjectURL(formData.image)}
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
