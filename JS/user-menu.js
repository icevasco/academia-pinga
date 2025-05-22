// Adicionar Font Awesome se não existir
if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
}

// Inicializar Supabase apenas se ainda não foi inicializado
if (!window.supabaseClient) {
    const supabaseUrl = 'https://vhswdfifhhcqmtpnhoso.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3dkZmlmaGhjcW10cG5ob3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTUzMDksImV4cCI6MjA2MDQzMTMwOX0.Q50xEMRQLTjuOKtn0f92GX5NKY9GgWWYVfHlmE5yhUs';

    // Verificar se o objeto supabase existe antes de criar o cliente
    if (typeof window.supabase !== 'undefined') {
        window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log('Cliente Supabase inicializado com sucesso!');
    } else {
        console.error('Biblioteca Supabase não carregada');
    }
}

// Função para obter o caminho base
function getBasePath() {
    const path = window.location.pathname;
    const isIndex = path.endsWith('index.html') || path.endsWith('/');
    return isIndex ? './' : '../';
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Verificar se o usuário está logado
async function checkUser() {
    try {
        if (!window.supabaseClient) {
            console.error('Cliente Supabase não inicializado')
            return
        }

        const { data: { session }, error } = await window.supabaseClient.auth.getSession()
        if (error) throw error

        // Se não estiver logado, redirecionar para a página de login
        if (!session) {
            const currentPath = window.location.pathname
            const isLoginPage = currentPath.includes('login.html')
            const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/')
            
            // Se não estiver na página de login, redirecionar para ela
            if (!isLoginPage) {
                const redirectPath = isIndexPage ? 'login.html' : '../login.html'
                window.location.href = redirectPath
                return
            }
            return
        }

        // Se estiver logado, atualizar o menu do usuário
        const { data: userData, error: userError } = await window.supabaseClient
            .from('utilizadores')
            .select('nome, tipo_conta')
            .eq('id', session.user.id)
            .single()

        if (userError) throw userError

        // Atualizar o menu do usuário
        const loginLink = document.getElementById('loginLink')
        if (loginLink) {
            const userMenu = document.createElement('div')
            userMenu.className = 'user-menu'
            userMenu.innerHTML = `
                <div class="user-info">
                    <span class="user-name">${userData.nome}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="user-dropdown">
                    <div class="account-type">${userData.tipo_conta === 'admin' ? 'Administrador' : userData.tipo_conta === 'treinador' ? 'Treinador' : 'Aluno'}</div>
                    ${userData.tipo_conta === 'admin' ? `
                        <a href="${getBasePath()}HTML/admin.html" class="dropdown-item">
                            <i class="fas fa-user-shield"></i> Painel Admin
                        </a>
                    ` : userData.tipo_conta === 'treinador' ? `
                        <a href="${getBasePath()}HTML/dashboard-treinador.html" class="dropdown-item">
                            <i class="fas fa-chalkboard-teacher"></i> Dashboard Treinador
                        </a>
                    ` : ''}
                    <a href="${getBasePath()}HTML/perfil.html" class="dropdown-item">
                        <i class="fas fa-user"></i> Meu Perfil
                    </a>
                    <a href="${getBasePath()}HTML/configuracoes.html" class="dropdown-item">
                        <i class="fas fa-cog"></i> Configurações
                    </a>
                    <div class="dropdown-item logout" onclick="handleLogout()">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </div>
                </div>
            `
            loginLink.parentNode.replaceChild(userMenu, loginLink)

            // Adicionar eventos do dropdown
            const userInfo = userMenu.querySelector('.user-info')
            const dropdown = userMenu.querySelector('.user-dropdown')

            let isDropdownOpen = false

            userInfo.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede propagação para o menu mobile
                isDropdownOpen = !isDropdownOpen
                dropdown.classList.toggle('active')
                userInfo.querySelector('i').style.transform = isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
            })

            // Impedir que clique dentro do dropdown feche o menu mobile
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target) && isDropdownOpen) {
                    isDropdownOpen = false
                    dropdown.classList.remove('active')
                    userInfo.querySelector('i').style.transform = 'rotate(0)'
                }
            })
        }
    } catch (error) {
        console.error('Erro ao verificar usuário:', error)
    }
}

// Função para fazer logout
async function handleLogout() {
    try {
        if (!window.supabaseClient) {
            console.error('Cliente Supabase não inicializado')
            return
        }
        const { error } = await window.supabaseClient.auth.signOut()
        if (error) throw error
        window.location.href = `${getBasePath()}login.html`
    } catch (error) {
        console.error('Erro ao fazer logout:', error)
    }
}

// Chamar a função de verificação quando a página carregar
window.addEventListener('load', checkUser) 