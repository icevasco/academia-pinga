// Dados dos planos
const planos = {
    iniciante: {
        titulo: "Plano Iniciante",
        descricao: "Ideal para principiantes que querem aprender os fundamentos do jogo.",
        preco: 29.90,
        beneficios: [
            "Acesso a todos os decks básicos",
            "2 sessões de coaching por mês",
            "Acesso ao grupo de WhatsApp",
            "Suporte por email"
        ]
    },
    avancado: {
        titulo: "Plano Avançado",
        descricao: "Para jogadores que já dominam o básico e querem evoluir.",
        preco: 49.90,
        beneficios: [
            "Acesso a todos os decks avançados",
            "4 sessões de coaching por mês",
            "Acesso ao grupo de WhatsApp",
            "Suporte prioritário por email e WhatsApp",
            "Análise de replays"
        ]
    },
    pro: {
        titulo: "Plano Pro",
        descricao: "Para jogadores experientes que procuram a excelência.",
        preco: 79.90,
        beneficios: [
            "Acesso a todos os decks pro",
            "8 sessões de coaching por mês",
            "Acesso ao grupo de WhatsApp",
            "Suporte VIP 24/7",
            "Análise detalhada de replays",
            "Estratégias personalizadas",
            "Acesso antecipado a novos decks"
        ]
    }
};

// Elementos do DOM
const modal = document.getElementById('modal-plano');
const modalTitulo = document.getElementById('modal-titulo');
const modalSubtitulo = document.getElementById('modal-subtitulo');
const modalDescricao = document.getElementById('modal-descricao');
const modalBeneficios = document.getElementById('modal-beneficios');
const modalPreco = document.getElementById('modal-preco');
const modalClose = document.getElementById('modal-close');

// Função para mostrar detalhes do plano
function mostrarDetalhesPlano(plano) {
    const dadosPlano = planos[plano];
    
    modalTitulo.textContent = dadosPlano.titulo;
    modalSubtitulo.textContent = `${dadosPlano.preco.toFixed(2)}€/mês`;
    modalDescricao.textContent = dadosPlano.descricao;
    modalPreco.textContent = `${dadosPlano.preco.toFixed(2)}€/mês`;
    
    // Limpar e adicionar benefícios
    modalBeneficios.innerHTML = '';
    dadosPlano.beneficios.forEach(beneficio => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${beneficio}`;
        modalBeneficios.appendChild(li);
    });
    
    // Mostrar modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Função para fechar modal
function fecharModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Botões de detalhes
    document.querySelectorAll('.detalhes-botao').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const plano = e.target.closest('.plan-card').dataset.plano;
            mostrarDetalhesPlano(plano);
        });
    });

    // Botões de selecionar plano
    document.querySelectorAll('.selecionar-plano').forEach(botao => {
        botao.addEventListener('click', async (e) => {
            const plano = e.target.closest('.plan-card').dataset.plano;
            
            try {
                if (!window.supabaseClient) {
                    throw new Error('Cliente Supabase não inicializado');
                }

                // Verificar se o usuário está logado
                const { data: { session } } = await window.supabaseClient.auth.getSession();
                
                if (!session) {
                    // Se não estiver logado, redirecionar para login
                    window.location.href = `../login.html?redirect=HTML/inscricao.html&plano=${plano}`;
                } else {
                    // Se estiver logado, redirecionar para inscrição
                    window.location.href = `inscricao.html?plano=${plano}`;
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
                alert('Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.');
            }
        });
    });

    // Fechar modal
    modalClose.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });
});
