const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Configurar CORS
app.use(cors());
app.use(express.json());

// Chave da API do Clash Royale
const CLASH_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjM4MDFlOGM5LWRhYjctNDdmMi1hYzA0LTgxNTdiODVhYmZiMSIsImlhdCI6MTc0ODc5ODA4MCwic3ViIjoiZGV2ZWxvcGVyLzJjMjhkZjZiLTY0N2ItN2IxNi04NjZlLWFhODVlMGU0ZjdkYiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI3OC4xMzcuMjEzLjMwIl0sInR5cGUiOiJjbGllbnQifV19.SCuXaJ1GgDzBhvDyqQrNblIp6NU3xKA2nBnc-7KnyzysVQfbJLLf1jQd3SLdTKX6IP1T7qLTHrB81D0cnjUnvA';

// Rota para o proxy
app.get('/api/clash/:tag', async (req, res) => {
    try {
        const tag = req.params.tag.replace('#', '');
        
        const response = await fetch(`https://api.clashroyale.com/v1/players/%23${tag}`, {
            headers: {
                'Authorization': `Bearer ${CLASH_API_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json(error);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados do jogador:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do jogador' });
    }
});

// Endpoint para buscar amigos do jogador
app.get('/api/clash/:tag/friends', async (req, res) => {
    try {
        const tag = req.params.tag.replace('#', '');
        const response = await fetch(`https://api.clashroyale.com/v1/players/%23${tag}/friends`, {
            headers: {
                'Authorization': `Bearer ${CLASH_API_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json(error);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar amigos do jogador:', error);
        res.status(500).json({ error: 'Erro ao buscar amigos do jogador' });
    }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 