// Inicializar Supabase
const supabaseUrl = 'https://vhswdfifhhcqmtpnhoso.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3dkZmlmaGhjcW10cG5ob3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTUzMDksImV4cCI6MjA2MDQzMTMwOX0.Q50xEMRQLTjuOKtn0f92GX5NKY9GgWWYVfHlmE5yhUs'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

// Função para converter imagem em base64
async function convertImageToBase64(imageUrl) {
    try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        console.error('Erro ao converter imagem:', error)
        return null
    }
}

// Função para inserir imagens na base de dados
async function insertGameImages() {
    const games = [
        {
            nome: 'Clash of Clans',
            imagem_url: '../IMG/clash-of-clans.jpg',
            descricao: 'Domine as estratégias de ataque e defesa, gerencie sua aldeia e lidere seu clã à vitória!',
            recursos: ['Estratégias de ataque', 'Gestão de recursos', 'Táticas de clã'],
            avaliacao: 4.8,
            alunos: '1M+',
            status: 'ativo',
            tag: 'Popular'
        },
        {
            nome: 'Brawl Stars',
            imagem_url: '../IMG/brawl-stars.jpg',
            descricao: 'Aprenda táticas avançadas, domine cada brawler e conquiste a arena!',
            recursos: ['Guias de brawlers', 'Táticas de equipe', 'Modos de jogo'],
            avaliacao: 4.7,
            alunos: '800k+',
            status: 'ativo',
            tag: 'Em Alta'
        },
        {
            nome: 'Hay Day',
            imagem_url: '../IMG/hay-day.jpg',
            descricao: 'Maximize sua produção, aprenda estratégias de mercado e construa a fazenda perfeita!',
            recursos: ['Gestão de fazenda', 'Estratégias de venda', 'Produção eficiente'],
            avaliacao: 4.6,
            alunos: '500k+',
            status: 'ativo'
        },
        {
            nome: 'Boom Beach',
            imagem_url: '../IMG/boom-beach.jpg',
            descricao: 'Domine as estratégias de combate, construa sua base e conquiste ilhas inimigas!',
            recursos: ['Táticas de ataque', 'Defesa de base', 'Gestão de recursos'],
            avaliacao: 0,
            alunos: '0',
            status: 'em_breve',
            tag: 'Em Breve'
        }
    ]

    for (const game of games) {
        try {
            // Converter imagem para base64
            const base64Image = await convertImageToBase64(game.imagem_url)
            
            if (base64Image) {
                // Inserir na tabela jogos
                const { data, error } = await supabase
                    .from('jogos')
                    .insert({
                        nome: game.nome,
                        imagem: base64Image,
                        descricao: game.descricao,
                        recursos: game.recursos,
                        avaliacao: game.avaliacao,
                        alunos: game.alunos,
                        status: game.status,
                        tag: game.tag
                    })

                if (error) throw error
                console.log(`Jogo ${game.nome} inserido com sucesso!`)
            }
        } catch (error) {
            console.error(`Erro ao inserir jogo ${game.nome}:`, error)
        }
    }
}

// Função para buscar imagens da base de dados
async function getGameImages() {
    try {
        const { data, error } = await supabase
            .from('jogos')
            .select('*')
            .order('nome')

        if (error) throw error
        return data
    } catch (error) {
        console.error('Erro ao buscar imagens:', error)
        return []
    }
}

// Exportar funções
window.gameImages = {
    insertGameImages,
    getGameImages
} 