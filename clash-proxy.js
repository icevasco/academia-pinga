const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

// Cole seu token da API Clash Royale aqui:
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjcyNWFhOWJmLWI1N2ItNDA1NS05NjgyLTEyYTQ0ZTJkZTA1ZSIsImlhdCI6MTc0NzkwNjg3OSwic3ViIjoiZGV2ZWxvcGVyLzJjMjhkZjZiLTY0N2ItN2IxNi04NjZlLWFhODVlMGU0ZjdkYiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIwLjAuMC4wIl0sInR5cGUiOiJjbGllbnQifV19.MiCL4HeoBFGMUR09XzPKEoLHS7slMWDHly2dE5XMKuMmaDRiXo8Z7iC4yFbjnB-_nRf6tEAbHqDXRaWogwqBOg';

app.get('/clashroyale/:tag', async (req, res) => {
  const tag = req.params.tag.replace('#', '%23');
  const url = `https://api.clashroyale.com/v1/players/${tag}`;
  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*'); // Permite CORS para testes
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`)); 