// Adicionar link para o Font Awesome apenas se não existir
if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesomeLink = document.createElement('link')
    fontAwesomeLink.rel = 'stylesheet'
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    document.head.appendChild(fontAwesomeLink)
}

// Inicialização do Supabase apenas se não existir
if (!window.supabaseClient) {
    const supabaseUrl = 'https://vhswdfifhhcqmtpnhoso.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3dkZmlmaGhjcW10cG5ob3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTUzMDksImV4cCI6MjA2MDQzMTMwOX0.Q50xEMRQLTjuOKtn0f92GX5NKY9GgWWYVfHlmE5yhUs'
    
    try {
        // Verificar se o objeto supabase já existe
        if (typeof supabase === 'undefined') {
            console.error('Biblioteca Supabase não carregada')
        } else {
            window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)
        }
    } catch (error) {
        console.error('Erro ao inicializar Supabase:', error)
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

        // Função para obter o texto do tipo de conta
        const getAccountTypeText = (tipoConta) => {
            switch(tipoConta) {
                case 'admin':
                    return 'Administrador';
                case 'treinador':
                    return 'Treinador';
                case 'premium_iniciante':
                    return 'Premium Iniciante';
                case 'premium_avancado':
                    return 'Premium Avançado';
                case 'premium_pro':
                    return 'Premium Pro';
                default:
                    return 'Conta Gratuita';
            }
        }

        // Função para obter o ícone do tipo de conta
        const getAccountTypeIcon = (tipoConta) => {
            switch(tipoConta) {
                case 'admin':
                    return 'user-shield';
                case 'treinador':
                    return 'chalkboard-teacher';
                case 'premium_iniciante':
                case 'premium_avancado':
                case 'premium_pro':
                    return 'crown';
                default:
                    return 'user';
            }
        }

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
                    <div class="account-type">
                        <i class="fas fa-${getAccountTypeIcon(userData.tipo_conta)}"></i>
                        ${getAccountTypeText(userData.tipo_conta)}
                    </div>
                    ${userData.tipo_conta === 'admin' || userData.tipo_conta === 'treinador' ? `
                        <a href="${getBasePath()}HTML/admin.html" class="dropdown-item">
                            <i class="fas fa-user-shield"></i> Painel Admin
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
            const chevron = userInfo.querySelector('.fa-chevron-down')
            
            let isDropdownOpen = false

            userInfo.addEventListener('click', (e) => {
                e.stopPropagation()
                isDropdownOpen = !isDropdownOpen
                dropdown.classList.toggle('active')
                chevron.style.transform = isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
            })

            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target) && isDropdownOpen) {
                    isDropdownOpen = false
                    dropdown.classList.remove('active')
                    chevron.style.transform = 'rotate(0)'
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