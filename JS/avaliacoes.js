// Usar o cliente Supabase já inicializado
const supabaseClient = window.supabaseClient

// Variável global para armazenar o ID da avaliação a ser excluída
let avaliacaoParaExcluir = null;

// Função para verificar e criar tabela de avaliações
async function verificarTabelaAvaliacoes() {
    try {
        console.log('Verificando tabela de avaliações...');
        
        // Verificar se a tabela existe
        const { data: avaliacoes, error } = await supabaseClient
            .from('avaliacoes')
            .select('*')
            .limit(1);

        if (error && error.code === '42P01') { // Tabela não existe
            console.log('Tabela de avaliações não existe. Criando...');
            
            // Criar tabela de avaliações
            const { error: createError } = await supabaseClient.rpc('create_avaliacoes_table');
            
            if (createError) {
                console.error('Erro ao criar tabela de avaliações:', createError);
                return;
            }
            
            console.log('Tabela de avaliações criada com sucesso!');
        } else if (error) {
            console.error('Erro ao verificar tabela de avaliações:', error);
        } else {
            console.log('Tabela de avaliações já existe.');
        }
    } catch (error) {
        console.error('Erro ao verificar/criar tabela de avaliações:', error);
    }
}

// Função para atualizar estatísticas
async function atualizarEstatisticas() {
    try {
        // Buscar todas as avaliações
        const { data: avaliacoes, error } = await supabaseClient
            .from('avaliacoes')
            .select('*');

        if (error) {
            console.error('Erro ao buscar avaliações:', error);
            return;
        }

        // Calcular média de estrelas
        const mediaEstrelas = avaliacoes.reduce((acc, curr) => acc + curr.estrelas, 0) / avaliacoes.length;
        
        // Calcular percentual de recomendação (estrelas >= 4)
        const recomendacoes = avaliacoes.filter(a => a.estrelas >= 4).length;
        const percentualRecomendacao = (recomendacoes / avaliacoes.length) * 100;
        
        // Calcular total de troféus
        const totalTrofeus = avaliacoes.reduce((acc, curr) => acc + (curr.trofeus || 0), 0);

        // Atualizar o HTML
        const statsBar = document.querySelector('.stats-bar');
        if (statsBar) {
            statsBar.innerHTML = `
                <div class="stat-item">
                    <div class="stat-treinadores" style="color: #FFD700;">${mediaEstrelas.toFixed(1)}</div>
                    <div class="stat-treinadores2" style="color: #fff;">Avaliação Média</div>
                </div>
                <div class="stat-item">
                    <div class="stat-treinadores" style="color: #FFD700;">${percentualRecomendacao.toFixed(0)}%</div>
                    <div class="stat-treinadores2" style="color: #fff;">Recomendam</div>
                </div>
                <div class="stat-item">
                    <div class="stat-treinadores" style="color: #FFD700;">${avaliacoes.length}</div>
                    <div class="stat-treinadores2" style="color: #fff;">Avaliações</div>
                </div>
                <div class="stat-item">
                    <div class="stat-treinadores" style="color: #FFD700;">${totalTrofeus}</div>
                    <div class="stat-treinadores2" style="color: #fff;">Troféus Ganhos</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erro ao atualizar estatísticas:', error);
    }
}

// Função para carregar avaliações
async function carregarAvaliacoes() {
    // Verificar se a tabela existe
    await verificarTabelaAvaliacoes();

    // Atualizar estatísticas
    await atualizarEstatisticas();

    // Buscar tipo de conta do usuário logado
    let tipoConta = null;
    let userId = null;
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        userId = user.id;
        const { data: userData } = await supabaseClient
            .from('utilizadores')
            .select('tipo_conta')
            .eq('id', user.id)
            .single();
        if (userData) tipoConta = userData.tipo_conta;
    }

    // Primeiro, buscar todas as avaliações
    const { data: avaliacoes, error } = await supabaseClient
        .from('avaliacoes')
        .select('*')
        .order('data', { ascending: false });

    if (error) {
        console.error('Erro ao carregar avaliações:', error);
        return;
    }

    // Para cada avaliação, buscar o tipo de conta e o nome do usuário
    const avaliacoesComTipoConta = await Promise.all(avaliacoes.map(async (avaliacao) => {
        const { data: userData } = await supabaseClient
            .from('utilizadores')
            .select('tipo_conta, nome')
            .eq('id', avaliacao.user_id)
            .single();
        
        return {
            ...avaliacao,
            tipo_conta: userData?.tipo_conta || 'gratuito',
            nome: userData?.nome || 'Usuário'
        };
    }));

    const reviewsGrid = document.querySelector('.reviews-grid');
    reviewsGrid.innerHTML = '';

    avaliacoesComTipoConta.forEach(avaliacao => {
        const reviewCard = criarCardAvaliacao(avaliacao, tipoConta);
        reviewsGrid.appendChild(reviewCard);
    });
}

// Função para abrir o modal de exclusão
function abrirModalExclusao(id) {
    avaliacaoParaExcluir = id;
    const modal = document.getElementById('deleteReviewModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Função para fechar o modal de exclusão
function fecharModalExclusao() {
    const modal = document.getElementById('deleteReviewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    avaliacaoParaExcluir = null;
}

// Função para confirmar a exclusão da avaliação
async function confirmarExclusaoAvaliacao() {
    if (avaliacaoParaExcluir) {
        await eliminarAvaliacao(avaliacaoParaExcluir);
        fecharModalExclusao();
    }
}

// Função para criar card de avaliação
function criarCardAvaliacao(avaliacao, tipoConta) {
    const card = document.createElement('div')
    card.className = 'review-card animate__animated animate__fadeInUp'
    card.style.cssText = `
        background: #1a1a1a;
        border: 1px solid #333;
        padding: 1.5rem;
        border-radius: 10px;
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    const data = new Date(avaliacao.data)
    const diferencaMs = new Date() - data
    const diasAtras = Math.floor(diferencaMs / (1000 * 60 * 60 * 24))
    const horasAtras = Math.floor(diferencaMs / (1000 * 60 * 60))
    const minutosAtras = Math.floor(diferencaMs / (1000 * 60))
    
    // Formatar o texto de tempo
    let tempoAtras
    if (diasAtras === 0) {
        if (horasAtras === 0) {
            tempoAtras = `Há ${minutosAtras} ${minutosAtras === 1 ? 'minuto' : 'minutos'}`
        } else {
            tempoAtras = `Há ${horasAtras} ${horasAtras === 1 ? 'hora' : 'horas'}`
        }
    } else {
        tempoAtras = `Há ${diasAtras} ${diasAtras === 1 ? 'dia' : 'dias'}`
    }

    // Botão de eliminar (ícone caixote vermelho)
    let deleteBtnHTML = ''
    if (tipoConta === 'admin' || tipoConta === 'treinador') {
        deleteBtnHTML = `
            <button class="delete-review-btn" title="Eliminar avaliação" data-id="${avaliacao.id}" style="background: none; border: none; cursor: pointer;">
                <i class="fas fa-trash-alt" style="color: #e53935; font-size: 1.2em;"></i>
            </button>
        `
    }

    // Função para formatar o tipo de conta
    const formatarTipoConta = (tipo) => {
        switch(tipo) {
            case 'admin':
                return 'Administrador';
            case 'treinador':
                return 'Treinador';
            case 'premium':
                return 'Premium';
            case 'premium_plus':
                return 'Premium Plus';
            case 'premium_pro':
                return 'Premium Pro';
            case 'premium_iniciante':
                return 'Premium Iniciante';
            case 'premium_avancado':
                return 'Premium Avançado';
            default:
                return 'Gratuito';
        }
    }
    
    card.innerHTML = `
        <div class="review-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <div class="reviewer-info" style="display: flex; align-items: center; gap: 8px;">
                <h3 style="margin: 0; color: #FFD700;">${avaliacao.nome}</h3>
                ${deleteBtnHTML}
                <span class="date" style="color: #888;">${tempoAtras}</span>
            </div>
        </div>
        <div class="stars" style="color: #FFD700; font-size: 1.2rem; margin-bottom: 1rem;">${'★'.repeat(avaliacao.estrelas)}${'☆'.repeat(5-avaliacao.estrelas)}</div>
        <p class="review-text" style="color: #fff; margin-bottom: 1rem;">"${avaliacao.texto}"</p>
        <div class="review-meta" style="display: flex; justify-content: space-between; align-items: center;">
            <span class="trophies" style="color: #FFD700;">
                <span class="trophy-icon">🏆</span>
                ${(avaliacao.trofeus !== undefined && avaliacao.trofeus !== null) ? avaliacao.trofeus : 0} Troféus
            </span>
            <span class="verified-badge" style="background: #333; color: #FFD700; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">${formatarTipoConta(avaliacao.tipo_conta)}</span>
        </div>
    `
    // Adicionar evento ao botão de eliminar
    if (tipoConta === 'admin' || tipoConta === 'treinador') {
        const btn = card.querySelector('.delete-review-btn')
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                abrirModalExclusao(avaliacao.id);
            })
        }
    }
    return card
}

// Função para eliminar avaliação
async function eliminarAvaliacao(id) {
    const { error } = await supabaseClient
        .from('avaliacoes')
        .delete()
        .eq('id', id)
    if (error) {
        alert('Erro ao eliminar avaliação.')
    } else {
        carregarAvaliacoes()
    }
}

// Função para verificar se usuário pode adicionar avaliação
async function verificarPermissaoAvaliacao() {
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
        alert('Por favor, faça login para adicionar uma avaliação.')
        return false
    }

    const { data: userData } = await supabaseClient
        .from('utilizadores')
        .select('tipo_conta')
        .eq('id', user.id)
        .single()

    if (!userData || userData.tipo_conta === 'gratuito') {
        alert('Apenas usuários com plano premium ou superior podem adicionar avaliações.')
        return false
    }

    return true
}

// Função para abrir o modal de adicionar avaliação
function abrirModalAdicionar() {
    const modal = document.getElementById('addReviewModal');
    if (modal) {
        // Adicionar estilos ao modal
        modal.style.cssText = `
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Adicionar estilos ao conteúdo do modal
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.cssText = `
                position: relative;
                background: #1a1a1a;
                margin: 5% auto;
                padding: 2rem;
                width: 90%;
                max-width: 800px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                transform: translateY(-20px);
                opacity: 0;
                transition: all 0.3s ease;
                color: #fff;
            `;
        }

        // Adicionar estilos ao formulário
        const form = modal.querySelector('form');
        if (form) {
            form.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                width: 100%;
            `;
        }

        // Adicionar estilos aos grupos do formulário
        const formGroups = modal.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                width: 100%;
            `;
        });

        // Adicionar estilos aos labels
        const labels = modal.querySelectorAll('label');
        labels.forEach(label => {
            label.style.cssText = `
                font-weight: 600;
                color: #fff;
                font-size: 1.1rem;
                width: 100%;
            `;
        });

        // Adicionar estilos ao textarea
        const textarea = modal.querySelector('textarea');
        if (textarea) {
            textarea.style.cssText = `
                width: 100%;
                min-height: 150px;
                padding: 1rem;
                border: 2px solid #333;
                border-radius: 8px;
                font-size: 1rem;
                resize: vertical;
                transition: border-color 0.3s ease;
                background: #2a2a2a;
                color: #fff;
                box-sizing: border-box;
            `;
            textarea.addEventListener('focus', () => {
                textarea.style.borderColor = '#4CAF50';
            });
            textarea.addEventListener('blur', () => {
                textarea.style.borderColor = '#333';
            });
        }

        // Adicionar estilos ao input de troféus
        const trofeusInput = modal.querySelector('#trofeus');
        if (trofeusInput) {
            trofeusInput.style.cssText = `
                width: 100%;
                padding: 0.8rem;
                border: 2px solid #333;
                border-radius: 8px;
                font-size: 1rem;
                background: #2a2a2a;
                color: #fff;
                box-sizing: border-box;
            `;
            trofeusInput.setAttribute('max', '9000');
            trofeusInput.setAttribute('maxlength', '4');
            trofeusInput.addEventListener('input', () => {
                if (trofeusInput.value.length > 4 || parseInt(trofeusInput.value) > 9000) {
                    trofeusInput.value = '9000';
                }
                if (parseInt(trofeusInput.value) < 0) {
                    trofeusInput.value = '0';
                }
            });
            trofeusInput.addEventListener('focus', () => {
                trofeusInput.style.borderColor = '#4CAF50';
            });
            trofeusInput.addEventListener('blur', () => {
                trofeusInput.style.borderColor = '#333';
            });
        }

        // Adicionar estilos aos botões de ação
        const modalFooter = modal.querySelector('.modal-footer');
        if (modalFooter) {
            modalFooter.style.cssText = `
                display: flex;
                justify-content: space-between;
                gap: 1rem;
                margin-top: 0.5rem;
                width: 100%;
                align-items: center;
            `;
        }

        const cancelButton = modal.querySelector('.cancel-button');
        if (cancelButton) {
            cancelButton.style.cssText = `
                background: #333;
                color: #fff;
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 48%;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
            `;
            cancelButton.addEventListener('mouseover', () => {
                cancelButton.style.background = '#444';
                cancelButton.style.transform = 'translateY(-2px)';
            });
            cancelButton.addEventListener('mouseout', () => {
                cancelButton.style.background = '#333';
                cancelButton.style.transform = 'translateY(0)';
            });
        }

        const submitButton = modal.querySelector('.submit-button');
        if (submitButton) {
            submitButton.style.cssText = `
                background: #ffd700;
                color: #000;
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 48%;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
            `;
            submitButton.addEventListener('mouseover', () => {
                submitButton.style.background = '#ffed4a';
                submitButton.style.transform = 'translateY(-2px)';
            });
            submitButton.addEventListener('mouseout', () => {
                submitButton.style.background = '#ffd700';
                submitButton.style.transform = 'translateY(0)';
            });
        }

        // Adicionar estilos às estrelas
        const starsContainer = modal.querySelector('.stars-input');
        if (starsContainer) {
            starsContainer.style.cssText = `
                display: flex;
                gap: 0.5rem;
                font-size: 2rem;
                margin: 1rem 0;
                width: 100%;
                justify-content: center;
            `;
        }

        const stars = modal.querySelectorAll('.stars-input i');
        stars.forEach(star => {
            star.style.cssText = `
                color: #333;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.dataset.rating);
                stars.forEach(s => {
                    s.style.color = parseInt(s.dataset.rating) <= rating ? '#ffd700' : '#333';
                });
            });
            star.addEventListener('mouseout', () => {
                const rating = document.getElementById('rating').value;
                stars.forEach(s => {
                    s.style.color = parseInt(s.dataset.rating) <= rating ? '#ffd700' : '#333';
                });
            });
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                document.getElementById('rating').value = rating;
                stars.forEach(s => {
                    s.style.color = parseInt(s.dataset.rating) <= rating ? '#ffd700' : '#333';
                });
            });
        });

        // Animar a abertura do modal
        setTimeout(() => {
            modal.style.opacity = '1';
            if (modalContent) {
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'translateY(0)';
            }
        }, 10);

        document.body.style.overflow = 'hidden';
    }
}

// Função para fechar o modal de adicionar avaliação
function fecharModalAdicionar() {
    const modal = document.getElementById('addReviewModal');
    if (modal) {
        // Animar o fechamento do modal
        modal.style.opacity = '0';
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translateY(-20px)';
            modalContent.style.opacity = '0';
        }

        // Esperar a animação terminar antes de esconder o modal
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Limpar o formulário
            document.getElementById('addReviewForm').reset();
            document.getElementById('rating').value = '';
            // Resetar as estrelas
            const stars = modal.querySelectorAll('.stars-input i');
            stars.forEach(star => {
                star.style.color = '#333';
            });
        }, 300);
    }
}

// Função para abrir o modal de sucesso
function abrirModalSucesso() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.cssText = `
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.cssText = `
                position: relative;
                background: #1a1a1a;
                margin: 5% auto;
                padding: 2rem;
                width: 90%;
                max-width: 800px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                transform: translateY(-20px);
                opacity: 0;
                transition: all 0.3s ease;
                color: #fff;
            `;
        }

        const header = modal.querySelector('.modal-header h3');
        if (header) {
            header.style.cssText = `
                color: #4CAF50;
                font-size: 1.5rem;
                margin: 0 0 1rem 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            `;
        }

        const body = modal.querySelector('.modal-body p');
        if (body) {
            body.style.cssText = `
                font-size: 1.2rem;
                margin: 0;
                color: #fff;
                text-align: center;
            `;
        }

        // Adicionar evento de clique fora do modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModalSucesso();
            }
        });

        // Animar a abertura do modal
        setTimeout(() => {
            modal.style.opacity = '1';
            if (modalContent) {
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'translateY(0)';
            }
        }, 10);

        // Fechar automaticamente após 2.5 segundos
        setTimeout(() => {
            fecharModalSucesso();
        }, 2500);
    }
}

// Função para fechar o modal de sucesso
function fecharModalSucesso() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.opacity = '0';
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translateY(-20px)';
            modalContent.style.opacity = '0';
        }

        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Função para enviar a avaliação
async function enviarAvaliacao(event) {
    event.preventDefault();
    
    if (!await verificarPermissaoAvaliacao()) {
        return;
    }

    const form = event.target;
    const texto = form.texto.value.trim();
    const estrelas = parseInt(form.estrelas.value);
    const trofeus = parseInt(form.trofeus.value);

    if (!estrelas) {
        alert('Por favor, selecione uma avaliação com estrelas.');
        return;
    }

    if (!texto) {
        alert('Por favor, escreva uma avaliação.');
        return;
    }

    try {
        const { data: { user }, error: userAuthError } = await supabaseClient.auth.getUser();
        
        if (userAuthError) {
            console.error('Erro ao obter usuário autenticado:', userAuthError);
            throw new Error('Erro ao obter usuário autenticado');
        }
        
        if (!user) {
            alert('Por favor, faça login para adicionar uma avaliação.');
            return;
        }

        console.log('Usuário autenticado:', user.id);

        // Verificar se o usuário já fez uma avaliação
        const { data: avaliacaoExistente, error: checkError } = await supabaseClient
            .from('avaliacoes')
            .select('*')
            .eq('user_id', user.id)
            .single();

        console.log('Verificação de avaliação existente:', { avaliacaoExistente, checkError });

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 é o código para "nenhum resultado encontrado"
            console.error('Erro ao verificar avaliação existente:', checkError);
            throw checkError;
        }

        // Buscar o nome do usuário na tabela utilizadores
        const { data: userData, error: userError } = await supabaseClient
            .from('utilizadores')
            .select('nome')
            .eq('id', user.id)
            .single();

        if (userError) {
            console.error('Erro ao buscar dados do usuário:', userError);
            throw new Error('Erro ao buscar dados do usuário');
        }

        if (!userData || !userData.nome) {
            console.error('Nome do usuário não encontrado');
            throw new Error('Nome do usuário não encontrado');
        }

        let operationResult;
        if (avaliacaoExistente) {
            console.log('Usuário já possui uma avaliação. Apagando a antiga e criando uma nova...');
            
            try {
                // Primeiro, apagar a avaliação antiga
                const { error: deleteError } = await supabaseClient
                    .from('avaliacoes')
                    .delete()
                    .eq('id', avaliacaoExistente.id);

                if (deleteError) {
                    console.error('Erro ao apagar avaliação antiga:', deleteError);
                    throw deleteError;
                }

                console.log('Avaliação antiga apagada com sucesso');

                // Agora, criar a nova avaliação
                const insertData = {
                    user_id: user.id,
                    nome: userData.nome,
                    texto: texto,
                    estrelas: estrelas,
                    trofeus: trofeus,
                    data: new Date().toISOString()
                };

                const { data: insertedData, error: insertError } = await supabaseClient
                    .from('avaliacoes')
                    .insert([insertData])
                    .select();

                if (insertError) {
                    console.error('Erro ao inserir nova avaliação:', insertError);
                    throw insertError;
                }

                console.log('Nova avaliação criada com sucesso:', insertedData);

                // Modificar a mensagem do modal de sucesso
                const modalBody = document.querySelector('#successModal .modal-body p');
                if (modalBody) {
                    modalBody.textContent = 'Avaliação atualizada com sucesso!';
                }

                // Recarregar as avaliações para mostrar as alterações
                await carregarAvaliacoes();
                fecharModalAdicionar();
                abrirModalSucesso();
            } catch (error) {
                console.error('Erro durante o processo:', error);
                alert('Erro ao atualizar avaliação. Por favor, tente novamente.');
                throw error;
            }
        } else {
            console.log('Criando nova avaliação');
            // Inserir nova avaliação
            const insertData = {
                user_id: user.id,
                nome: userData.nome,
                texto: texto,
                estrelas: estrelas,
                trofeus: trofeus,
                data: new Date().toISOString()
            };
            console.log('Dados para inserção:', insertData);

            const { data: insertedData, error: insertError } = await supabaseClient
                .from('avaliacoes')
                .insert([insertData])
                .select();
            
            if (insertError) {
                console.error('Erro ao inserir avaliação:', insertError);
                throw insertError;
            }

            console.log('Avaliação inserida com sucesso:', insertedData);

            // Manter a mensagem original do modal de sucesso
            const modalBody = document.querySelector('#successModal .modal-body p');
            if (modalBody) {
                modalBody.textContent = 'Avaliação enviada com sucesso!';
            }
        }

        fecharModalAdicionar();
        await carregarAvaliacoes(); // Garantir que a lista seja atualizada
        abrirModalSucesso();
    } catch (error) {
        console.error('Erro ao processar avaliação:', error);
        console.error('Stack trace:', error.stack);
        alert('Erro ao processar avaliação. Por favor, tente novamente.');
    }
}

// Função para atualizar avaliações existentes
async function atualizarAvaliacoesExistentes() {
    try {
        // Buscar todas as avaliações
        const { data: avaliacoes, error } = await supabaseClient
            .from('avaliacoes')
            .select('*');

        if (error) throw error;

        // Para cada avaliação, buscar o nome do usuário e logar
        for (const avaliacao of avaliacoes) {
            const { data: userData, error: userError } = await supabaseClient
                .from('utilizadores')
                .select('nome')
                .eq('id', avaliacao.user_id)
                .single();

            if (userError) {
                console.error(`Erro ao buscar dados do usuário ${avaliacao.user_id}:`, userError);
                continue;
            }

            // Apenas logar o nome do usuário
            console.log(`Usuário: ${userData.nome} para avaliação ${avaliacao.id}`);
        }

        console.log('Atualização de avaliações concluída');
    } catch (error) {
        console.error('Erro ao atualizar avaliações:', error);
    }
}

// Inicializar eventos das estrelas
document.addEventListener('DOMContentLoaded', async () => {
    carregarAvaliacoes();
    atualizarAvaliacoesExistentes(); // Atualizar avaliações existentes ao carregar a página
    
    // Adicionar evento ao botão de avaliação
    const addReviewButton = document.querySelector('.add-review-button');
    if (addReviewButton) {
        addReviewButton.addEventListener('click', async (e) => {
            e.preventDefault();
            if (await verificarPermissaoAvaliacao()) {
                abrirModalAdicionar();
            }
        });
    }

    // Configurar eventos das estrelas
    const stars = document.querySelectorAll('.stars-input i');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            document.getElementById('rating').value = rating;
            
            // Atualizar visual das estrelas
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.rating) <= rating);
            });
        });

        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.rating) <= rating);
            });
        });
    });

    // Resetar estrelas quando o mouse sair
    document.querySelector('.stars-input').addEventListener('mouseleave', () => {
        const rating = document.getElementById('rating').value;
        stars.forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.rating) <= rating);
        });
    });
}); 