// Função para carregar dados do treinador
async function loadTreinadorDashboard(treinadorId) {
    try {
        console.log('Loading trainer dashboard for ID:', treinadorId);
        
        // Primeiro, buscar o ID do treinador na tabela treinadores
        console.log('Buscando ID do treinador na tabela treinadores...');
        const { data: treinadorData, error: treinadorError } = await supabase
            .from('treinadores')
            .select('id')
            .eq('user_id', treinadorId)
            .single();

        console.log('Dados do treinador:', treinadorData);
        
        if (treinadorError || !treinadorData) {
            console.error('Erro ao buscar dados do treinador:', treinadorError);
            return;
        }

        const treinadorIdCorreto = treinadorData.id;
        console.log('ID correto do treinador:', treinadorIdCorreto);

        // Buscar todas as aulas agendadas usando o ID correto do treinador
        console.log('Buscando todas as aulas para o treinador ID:', treinadorIdCorreto);

        // Primeiro, verificar se existem aulas na tabela
        const { data: todasAulas, error: todasAulasError } = await supabase
            .from('agendamentos')
            .select('*')
            .limit(1);

        console.log('Verificando se existem aulas na tabela:', todasAulas);
        console.log('Erro na verificação:', todasAulasError);

        // Agora buscar as aulas do treinador
        const { data: aulas, error: aulasError } = await supabase
            .from('agendamentos')
            .select(`
                *,
                aluno:aluno_id (
                    id,
                    nome,
                    email
                )
            `)
            .eq('treinador_id', treinadorIdCorreto)
            .order('data', { ascending: true })
            .order('hora', { ascending: true });

        console.log('Aulas encontradas:', aulas);
        console.log('Erro na busca de aulas:', aulasError);

        // Atualizar a interface com as aulas
        const proximasAulas = document.getElementById('proximasAulas');
        console.log('Elemento proximasAulas:', proximasAulas);
        
        if (proximasAulas) {
            if (aulas && aulas.length > 0) {
                console.log('Gerando HTML para', aulas.length, 'aulas');
                const aulasHTML = aulas.map(aula => {
                    console.log('Processando aula:', aula);
                    const dataAula = new Date(aula.data);
                    const horaAula = aula.hora;
                    return `
                        <div class="aula-card">
                            <div class="aula-info">
                                <h4>${aula.aluno?.nome || 'Aluno não especificado'}</h4>
                                <p><i class="fas fa-calendar"></i> Data: ${dataAula.toLocaleDateString()}</p>
                                <p><i class="fas fa-clock"></i> Hora: ${horaAula}</p>
                                <p><i class="fas fa-bullseye"></i> Objetivos: ${aula.objetivos || 'Não especificado'}</p>
                                <p><i class="fas fa-info-circle"></i> Status: ${aula.status || 'Pendente'}</p>
                            </div>
                        </div>
                    `;
                }).join('');
                console.log('HTML gerado:', aulasHTML);
                proximasAulas.innerHTML = aulasHTML;
                console.log('HTML inserido no elemento');
            } else {
                console.log('Nenhuma aula encontrada, mostrando mensagem padrão');
                proximasAulas.innerHTML = '<div class="no-data">Nenhuma aula agendada.</div>';
            }
        } else {
            console.error('Elemento proximasAulas não encontrado no DOM');
        }

        // Atualizar estatísticas
        const totalAulas = document.getElementById('totalAulas');
        if (totalAulas) {
            totalAulas.textContent = aulas ? aulas.length : 0;
        }

        // Buscar avaliações do treinador
        const { data: avaliacoes, error: avaliacoesError } = await supabase
            .from('avaliacoes_treinadores')
            .select('*')
            .eq('treinador_id', treinadorIdCorreto);
            
        console.log('Avaliações encontradas:', avaliacoes);

        if (avaliacoesError) {
            console.error('Erro ao buscar avaliações:', avaliacoesError);
        }

        // Atualizar lista de avaliações
        const listaAvaliacoes = document.getElementById('listaAvaliacoes');
        if (listaAvaliacoes) {
            if (avaliacoes && avaliacoes.length > 0) {
                const avaliacoesHTML = avaliacoes.map(avaliacao => `
                    <div class="avaliacao-card">
                        <div class="avaliacao-info">
                            <h4>${avaliacao.nome_usuario || 'Usuário não especificado'}</h4>
                            <p>Data: ${new Date(avaliacao.data).toLocaleDateString()}</p>
                            <p>Nota: ${avaliacao.estrelas}/5</p>
                            <p>Comentário: ${avaliacao.texto}</p>
                        </div>
                    </div>
                `).join('');
                listaAvaliacoes.innerHTML = avaliacoesHTML;
            } else {
                listaAvaliacoes.innerHTML = '<p>Nenhuma avaliação encontrada.</p>';
            }
        }

        console.log('Dashboard do treinador carregada com sucesso');
    } catch (error) {
        console.error('Erro ao carregar dashboard do treinador:', error);
        alert('Erro ao carregar dashboard do treinador. Por favor, tente novamente.');
    }
} 