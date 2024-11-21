const sqlite3 = require('sqlite3'); // Importa o módulo sqlite3 para interagir com o banco de dados SQLite
const path = require('path'); // Importa o módulo path para manipular caminhos de arquivos

const folder = 'data'; // Nome da pasta onde o banco de dados será armazenado
const fileName = 'receitas.db'; // Nome do arquivo do banco de dados
const dbPath = path.resolve(__dirname, folder, fileName); // Caminho absoluto para o arquivo do banco de dados

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conexão com o banco de dados estabelecida!');
    }
});

db.serialize(() => {
    // Criação da tabela de receitas com os novos campos
    db.run(`
        CREATE TABLE IF NOT EXISTS Receitas (
            id                      INTEGER         PRIMARY KEY AUTOINCREMENT, 
            titulo                  VARCHAR(100)    NOT NULL, 
            descricao               TEXT            NOT NULL, 
            ingredientesMassa       TEXT            NOT NULL, 
            ingredientesCobertura   TEXT            NOT NULL, 
            modoPreparoMassa        TEXT            NOT NULL, 
            modoPreparoCobertura    TEXT            NOT NULL, 
            tempoPreparo            VARCHAR(50)     NOT NULL, 
            categoria               VARCHAR(50), 
            imagem                  VARCHAR(255)
        );
    `);

    // Criação da tabela de usuários (permanece igual)
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id          INTEGER         PRIMARY KEY AUTOINCREMENT,
            username    VARCHAR(60)     NOT NULL UNIQUE,
            password    VARCHAR(255)    NOT NULL,
            email       VARCHAR(255)    UNIQUE,
            created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP
        );
    `);
});

module.exports = db;
