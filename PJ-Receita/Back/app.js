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

// *** Receita Routes ***

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

// *** User Routes ***

// Rota de login (POST)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    try {
        // Busca o usuário pelo nome de usuário
        const user = users.find(user => user.username === username); // 'users' pode ser seu banco ou uma lista
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        // Verifica a senha
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        // Se as credenciais forem válidas, você pode retornar um token de sessão ou mensagem de sucesso
        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
