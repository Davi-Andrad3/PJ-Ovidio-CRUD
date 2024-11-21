// Import necessary modules
const express = require('express');
const cors = require('cors');
const db = require('./db-receitas'); 
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();
const secretKey = process.env.SECRET_KEY;

// Ensure 'uploads' directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Set up Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes and Endpoints
// Receita-related endpoints (CRUD)

// Listar todas as receitas
app.get('/receitas', (req, res) => {
    db.all('SELECT * FROM Receitas', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ receitas: rows });
    });
});

// Cadastrar uma nova receita
app.post('/receitas', upload.single('imagem'), (req, res) => {
    const { titulo, descricao, ingredientesMassa, ingredientesCobertura, modoPreparoMassa, modoPreparoCobertura, tempoPreparo, categoria } = req.body;
    const imagemPath = req.file ? req.file.path : null;

    if (!titulo || !descricao || !ingredientesMassa || !ingredientesCobertura || !modoPreparoMassa || !modoPreparoCobertura || !tempoPreparo || !categoria || !imagemPath) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    db.run(
        'INSERT INTO Receitas (titulo, descricao, ingredientesMassa, ingredientesCobertura, modoPreparoMassa, modoPreparoCobertura, tempoPreparo, categoria, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [titulo, descricao, ingredientesMassa, ingredientesCobertura, modoPreparoMassa, modoPreparoCobertura, tempoPreparo, categoria, imagemPath],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({
                id: this.lastID,
                titulo,
                descricao,
                ingredientesMassa,
                ingredientesCobertura,
                modoPreparoMassa,
                modoPreparoCobertura,
                tempoPreparo,
                categoria,
                imagem: imagemPath
            });
        }
    );
});

// Atualizar uma receita existente
app.put('/receitas/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, ingredientesMassa, ingredientesCobertura, modoPreparoMassa, modoPreparoCobertura, tempoPreparo, categoria } = req.body;

    if (!titulo || !descricao || !ingredientesMassa || !ingredientesCobertura || !modoPreparoMassa || !modoPreparoCobertura || !tempoPreparo || !categoria) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    db.run(
        'UPDATE Receitas SET titulo = ?, descricao = ?, ingredientesMassa = ?, ingredientesCobertura = ?, modoPreparoMassa = ?, modoPreparoCobertura = ?, tempoPreparo = ?, categoria = ? WHERE id = ?',
        [titulo, descricao, ingredientesMassa, ingredientesCobertura, modoPreparoMassa, modoPreparoCobertura, tempoPreparo, categoria, id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Receita não encontrada' });
            res.json({ message: `Receita atualizada com ID ${id}` });
        }
    );
});

// Excluir uma receita
app.delete('/receitas/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM Receitas WHERE id = ?', [id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Receita não encontrada' });
        res.json({ message: `Receita excluída com ID ${id}` });
    });
});

// User endpoints remain similar to pet shop
// Login, cadastro, atualização e autenticação de usuários
// [Essas partes permanecem inalteradas, exceto pelo contexto adaptado ao sistema de receitas]

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
