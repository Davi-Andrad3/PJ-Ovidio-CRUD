import React, { useState } from 'react';
import './CompCss/FormReceita.css';

const url = 'http://localhost:3000/receitas';

const FormReceita = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        ingredientesMassa: '',
        ingredientesCobertura: '',
        modoPreparoMassa: '',
        modoPreparoCobertura: '',
        tempoPreparo: '',
        imagem: ''
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, imagem: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('titulo', formData.titulo);
            formDataToSend.append('descricao', formData.descricao);
            formDataToSend.append('ingredientesMassa', formData.ingredientesMassa);
            formDataToSend.append('ingredientesCobertura', formData.ingredientesCobertura);
            formDataToSend.append('modoPreparoMassa', formData.modoPreparoMassa);
            formDataToSend.append('modoPreparoCobertura', formData.modoPreparoCobertura);
            formDataToSend.append('tempoPreparo', formData.tempoPreparo);
            if (formData.imagem) {
                formDataToSend.append('imagem', formData.imagem);
            }

            const response = await fetch(url, {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Falha ao salvar a receita');
            }

            // Resetar o formulário após o envio
            setFormData({
                titulo: '',
                descricao: '',
                ingredientesMassa: '',
                ingredientesCobertura: '',
                modoPreparoMassa: '',
                modoPreparoCobertura: '',
                tempoPreparo: '',
                imagem: ''
            });
            alert('Receita salva com sucesso!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-receita-container">
            <h2>Cadastrar Nova Receita</h2>
            <form onSubmit={handleSubmit} className="form-receita">
                <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Título da Receita"
                    required
                />
                <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descrição"
                    rows="4"
                />
                <textarea
                    name="ingredientesMassa"
                    value={formData.ingredientesMassa}
                    onChange={handleInputChange}
                    placeholder="Ingredientes para a Massa"
                    rows="4"
                    required
                />
                <textarea
                    name="ingredientesCobertura"
                    value={formData.ingredientesCobertura}
                    onChange={handleInputChange}
                    placeholder="Ingredientes para a Cobertura"
                    rows="4"
                />
                <textarea
                    name="modoPreparoMassa"
                    value={formData.modoPreparoMassa}
                    onChange={handleInputChange}
                    placeholder="Modo de Preparo da Massa"
                    rows="6"
                    required
                />
                <textarea
                    name="modoPreparoCobertura"
                    value={formData.modoPreparoCobertura}
                    onChange={handleInputChange}
                    placeholder="Modo de Preparo da Cobertura"
                    rows="6"
                />
                <input
                    type="number"
                    name="tempoPreparo"
                    value={formData.tempoPreparo}
                    onChange={handleInputChange}
                    placeholder="Tempo de Preparo (minutos)"
                    required
                />
                <input
                    type="file"
                    name="imagem"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Salvar Receita</button>
            </form>
        </div>
    );
};

export default FormReceita;
