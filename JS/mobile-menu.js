// Menu Mobile
console.log('Script do menu móvel carregado');

function initializeMobileMenu() {
    console.log('Inicializando menu móvel');
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    console.log('Botão do menu:', mobileMenuBtn);
    console.log('Links do menu:', navLinks);

    if (!mobileMenuBtn || !navLinks) {
        console.error('Elementos do menu móvel não encontrados');
        return;
    }

    // Função para fechar o menu
    const closeMenu = () => {
        console.log('Fechando menu');
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
    };

    // Função para abrir o menu
    const openMenu = () => {
        console.log('Abrindo menu');
        mobileMenuBtn.classList.add('active');
        navLinks.classList.add('active');
        body.classList.add('menu-open');
    };

    // Função para alternar o menu
    const toggleMenu = (e) => {
        console.log('Botão clicado');
        e.preventDefault();
        e.stopPropagation();
        
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    // Remover event listeners antigos
    const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
    mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);

    // Evento de clique no botão
    newMobileMenuBtn.addEventListener('click', toggleMenu);
    console.log('Evento de clique adicionado ao botão');

    // Fechar menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            console.log('Link clicado, fechando menu');
            closeMenu();
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !newMobileMenuBtn.contains(e.target) && 
            !navLinks.contains(e.target)) {
            console.log('Clicou fora, fechando menu');
            closeMenu();
        }
    });

    // Fechar menu ao redimensionar a janela para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            console.log('Redimensionando para desktop, fechando menu');
            closeMenu();
        }
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeMobileMenu);

// Inicializar também quando a página for carregada
window.addEventListener('load', initializeMobileMenu); 