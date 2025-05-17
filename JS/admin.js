// Função para carregar dados do treinador
async function loadTreinadorDashboard() {
    try {
        console.log('Iniciando carregamento da dashboard do treinador');
        
        // Verificar se o usuário está autenticado
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        console.log('Usuário autenticado:', user);
        
        // Verificar se o treinador existe na tabela utilizadores
        console.log('Verificando se o treinador existe...');
        const { data: treinador, error: treinadorError } = await supabase
            .from('utilizadores')
            .select('*')
            .eq('id', user.id)
            .single();
            
        console.log('Dados do treinador:', treinador);
        
        if (treinadorError) {
            console.error('Erro ao buscar dados do treinador:', treinadorError);
            throw treinadorError;
        }

        if (!treinador) {
            console.error('Treinador não encontrado');
            throw new Error('Treinador não encontrado');
        }

        // Primeiro, verificar se existem aulas na tabela sem nenhum filtro
        console.log('Verificando todas as aulas na tabela (sem filtros)...');
        const { data: todasAulasSemFiltro, error: todasAulasSemFiltroError } = await supabase
            .from('agendamentos')
            .select('*');
            
        console.log('Todas as aulas na tabela (sem filtros):', todasAulasSemFiltro);
        if (todasAulasSemFiltroError) {
            console.error('Erro ao buscar todas as aulas:', todasAulasSemFiltroError);
        }

        // Depois, verificar aulas do treinador com join para ver os dados completos
        console.log('Buscando aulas do treinador com join...');
        console.log('Usando treinador_id:', treinador.id);
        const { data: aulasComJoin, error: aulasComJoinError } = await supabase
            .from('agendamentos')
            .select(`
                *,
                aluno:aluno_id (
                    id,
                    nome,
                    email
                )
            `)
            .eq('treinador_id', treinador.id);
            
        console.log('Aulas do treinador com join:', aulasComJoin);
        if (aulasComJoinError) {
            console.error('Erro ao buscar aulas com join:', aulasComJoinError);
        }

        // Buscar aulas futuras
        console.log('Buscando aulas futuras para o treinador ID:', treinador.id);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zerar as horas para comparar apenas a data
        const dataHoje = hoje.toISOString().split('T')[0];
        console.log('Data de hoje para comparação:', dataHoje);
        
        const { data: aulasFuturas, error: aulasFuturasError } = await supabase
            .from('agendamentos')
            .select(`
                *,
                aluno:aluno_id (
                    id,
                    nome,
                    email
                )
            `)
            .eq('treinador_id', treinador.id)
            .gte('data', dataHoje)
            .order('data', { ascending: true })
            .order('hora', { ascending: true });

        console.log('Resultado da busca de aulas futuras:', { 
            aulasFuturas, 
            error: aulasFuturasError,
            query: {
                treinador_id: treinador.id,
                data_minima: dataHoje
            }
        });

        // Atualizar a interface
        const proximasAulas = document.getElementById('proximasAulas');
        console.log('Elemento proximasAulas:', proximasAulas);
        
        if (proximasAulas) {
            // Usar aulasFuturas em vez de aulasComJoin para mostrar apenas aulas futuras
            const aulasParaExibir = aulasFuturas || [];
            console.log('Aulas para exibir:', aulasParaExibir);
            
            if (aulasParaExibir.length > 0) {
                console.log('Gerando HTML para', aulasParaExibir.length, 'aulas');
                const aulasHTML = aulasParaExibir.map(aula => {
                    console.log('Processando aula:', aula);
                    const dataAula = new Date(aula.data);
                    const horaAula = aula.hora;
                    return `
                        <div class="aula-card">
                            <div class="aula-info">
                                <h4>${aula.aluno?.nome || 'Aluno não especificado'}</h4>
                                <p>Data: ${dataAula.toLocaleDateString()}</p>
                                <p>Hora: ${horaAula}</p>
                                <p>Duração: ${aula.duracao}h</p>
                                <p>Objetivos: ${aula.objetivos}</p>
                                <p>Status: ${aula.status}</p>
                            </div>
                        </div>
                    `;
                }).join('');
                console.log('HTML gerado:', aulasHTML);
                proximasAulas.innerHTML = aulasHTML;
                console.log('HTML inserido no elemento');
            } else {
                console.log('Nenhuma aula encontrada, mostrando mensagem padrão');
                proximasAulas.innerHTML = '<p>Nenhuma aula agendada.</p>';
            }
        } else {
            console.error('Elemento proximasAulas não encontrado no DOM');
        }

        // Atualizar estatísticas
        const totalAulas = document.getElementById('totalAulas');
        if (totalAulas) {
            totalAulas.textContent = aulasParaExibir ? aulasParaExibir.length : 0;
        }

        // Buscar avaliações do treinador
        const { data: avaliacoes, error: avaliacoesError } = await supabase
            .from('avaliacoes')
            .select('*')
            .eq('treinador_id', treinador.id);
            
        console.log('Avaliações encontradas:', avaliacoes);

        if (avaliacoesError) {
            console.error('Erro ao buscar avaliações:', avaliacoesError);
            throw avaliacoesError;
        }

        // Buscar avaliações detalhadas
        const { data: avaliacoesDetalhadas, error: avaliacoesDetalhadasError } = await supabase
            .from('avaliacoes')
            .select(`
                *,
                aluno:aluno_id (
                    id,
                    nome,
                    email
                )
            `)
            .eq('treinador_id', treinador.id)
            .order('created_at', { ascending: false });

        console.log('Avaliações detalhadas encontradas:', avaliacoesDetalhadas);

        if (avaliacoesDetalhadasError) {
            console.error('Erro ao buscar avaliações detalhadas:', avaliacoesDetalhadasError);
            throw avaliacoesDetalhadasError;
        }

        // Atualizar lista de avaliações
        const listaAvaliacoes = document.getElementById('listaAvaliacoes');
        if (listaAvaliacoes) {
            if (avaliacoesDetalhadas && avaliacoesDetalhadas.length > 0) {
                const avaliacoesHTML = avaliacoesDetalhadas.map(avaliacao => `
                    <div class="avaliacao-card">
                        <div class="avaliacao-info">
                            <h4>${avaliacao.aluno?.nome || 'Aluno não especificado'}</h4>
                            <p>Data: ${new Date(avaliacao.created_at).toLocaleDateString()}</p>
                            <p>Nota: ${avaliacao.nota}/5</p>
                            <p>Comentário: ${avaliacao.comentario}</p>
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