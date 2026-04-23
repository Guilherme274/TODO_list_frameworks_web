const express = require('express');
const mongoose = require('mongoose'); // Movi para o topo por organização
const app = express();

// Configuração do Banco de Dados via Variável de Ambiente
// No Render, você criará uma variável chamada DATABASE_URL
const mongoURL = process.env.DATABASE_URL;

mongoose.connect(mongoURL);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', (error) => console.log("Erro no MongoDB:", error));
db.once('connected', () => console.log('Database Connected'));

// Middlewares
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE, OPTIONS');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Rotas
const routes = require('./routes/routes');
app.use('/api', routes);

// Porta (O Render define a porta automaticamente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});