const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config({ path: './api.env' });

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS para aceitar todas as origens
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para logging de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware para limitar o tamanho do corpo das requisições
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rota de teste para verificar se a API está funcionando
app.get('/api/test', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});

// Rota para buscar membros do clã
app.get('/api/clash/clan/:tag', async (req, res) => {
    try {
        const tag = req.params.tag;
        console.log('Buscando dados do clã:', tag);
        console.log('API Key:', process.env.CLASH_API_KEY ? 'Presente' : 'Ausente');
        
        const url = `https://api.clashroyale.com/v1/clans/%23${tag}`;
        console.log('URL da requisição:', url);
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.CLASH_API_KEY}`,
                'Accept': 'application/json'
            }
        });

        console.log('Resposta da API:', response.status);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar dados do clã:', error.response?.data || error.message);
        console.error('Status do erro:', error.response?.status);
        console.error('Headers da resposta:', error.response?.headers);
        
        res.status(error.response?.status || 500).json({
            error: true,
            message: error.response?.data?.message || 'Erro ao buscar dados do clã',
            details: error.response?.data || error.message
        });
    }
});

// Rota para buscar dados do jogador
app.get('/api/clash/:tag', async (req, res) => {
    try {
        const tag = req.params.tag;
        
        const response = await axios.get(`https://api.clashroyale.com/v1/players/%23${tag}`, {
            headers: {
                'Authorization': `Bearer ${process.env.CLASH_API_KEY}`,
                'Accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Erro na API:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: true,
            message: error.response?.data?.message || 'Erro ao buscar dados do Clash Royale'
        });
    }
});

// Tratamento de erros 404
app.use((req, res) => {
    console.log('Rota não encontrada:', req.url);
    res.status(404).json({ error: true, message: 'Rota não encontrada' });
});

// Tratamento de erros globais
app.use((err, req, res, next) => {
    console.error('Erro global:', err);
    res.status(500).json({ error: true, message: 'Erro interno do servidor' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Acessível em: http://localhost:${port}`);
}); 