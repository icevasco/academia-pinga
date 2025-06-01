const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// Configuração do CORS
app.use(cors());

// Chave da API do Clash Royale
const CLASH_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjM4MDFlOGM5LWRhYjctNDdmMi1hYzA0LTgxNTdiODVhYmZiMSIsImlhdCI6MTc0ODc5ODA4MCwic3ViIjoiZGV2ZWxvcGVyLzJjMjhkZjZiLTY0N2ItN2IxNi04NjZlLWFhODVlMGU0ZjdkYiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI3OC4xMzcuMjEzLjMwIl0sInR5cGUiOiJjbGllbnQifV19.SCuXaJ1GgDzBhvDyqQrNblIp6NU3xKA2nBnc-7KnyzysVQfbJLLf1jQd3SLdTKX6IP1T7qLTHrB81D0cnjUnvA';

// Rota para a API do Clash Royale
app.get('/api/clash/:tag', async (req, res) => {
    try {
        const tag = req.params.tag;
        
        const response = await axios.get(`https://api.clashroyale.com/v1/players/%23${tag}`, {
            headers: {
                'Authorization': `Bearer ${CLASH_API_KEY}`,
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

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 