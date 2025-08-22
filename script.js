// Accessibility Features
class AccessibilityManager {
    constructor() {
        this.fontSize = 16;
        this.isHighContrast = false;
        this.init();
    }

    init() {
        // Font size control
        document.getElementById('font-size-btn').addEventListener('click', () => {
            this.toggleFontSize();
        });

        // High contrast control
        document.getElementById('high-contrast-btn').addEventListener('click', () => {
            this.toggleHighContrast();
        });

        // VLibras control
        document.getElementById('vlibras-btn').addEventListener('click', () => {
            this.toggleVLibras();
        });

        // Load saved preferences
        this.loadPreferences();
    }

    toggleFontSize() {
        const body = document.body;
        if (body.classList.contains('large-font')) {
            body.classList.remove('large-font');
            document.getElementById('font-size-btn').classList.remove('active');
            this.fontSize = 16;
        } else {
            body.classList.add('large-font');
            document.getElementById('font-size-btn').classList.add('active');
            this.fontSize = 18;
        }
        this.savePreferences();
    }

    toggleHighContrast() {
        const body = document.body;
        if (body.classList.contains('high-contrast')) {
            body.classList.remove('high-contrast');
            document.getElementById('high-contrast-btn').classList.remove('active');
            this.isHighContrast = false;
        } else {
            body.classList.add('high-contrast');
            document.getElementById('high-contrast-btn').classList.add('active');
            this.isHighContrast = true;
        }
        this.savePreferences();
    }

    toggleVLibras() {
        const vlibrasWidget = document.querySelector('[vw]');
        if (vlibrasWidget) {
            const accessButton = vlibrasWidget.querySelector('[vw-access-button]');
            if (accessButton) {
                accessButton.click();
                document.getElementById('vlibras-btn').classList.toggle('active');
            }
        }
    }

    savePreferences() {
        const preferences = {
            fontSize: this.fontSize,
            isHighContrast: this.isHighContrast
        };
        localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
    }

    loadPreferences() {
        const saved = localStorage.getItem('accessibility-preferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            
            if (preferences.fontSize > 16) {
                document.body.classList.add('large-font');
                document.getElementById('font-size-btn').classList.add('active');
            }
            
            if (preferences.isHighContrast) {
                document.body.classList.add('high-contrast');
                document.getElementById('high-contrast-btn').classList.add('active');
            }
        }
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.updateActiveNav(link);
            });
        });

        // Update active navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavOnScroll();
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
}

// Interactive Elements Manager
class InteractiveManager {
    constructor() {
        this.init();
    }

    init() {
        // Concept cards interaction
        document.querySelectorAll('.concept-card').forEach(card => {
            card.addEventListener('click', () => {
                this.highlightCard(card);
            });
        });

        // Theme cards interaction
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const themeCard = e.target.closest('.theme-card');
                const theme = themeCard.dataset.theme;
                this.showThemeDetails(theme);
            });
        });

        // Tab system for examples
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.switchTab(tabId, btn);
            });
        });

        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    highlightCard(card) {
        // Remove highlight from other cards
        document.querySelectorAll('.concept-card').forEach(c => {
            c.style.transform = '';
            c.style.zIndex = '';
        });

        // Highlight selected card
        card.style.transform = 'scale(1.05)';
        card.style.zIndex = '10';

        // Reset after animation
        setTimeout(() => {
            card.style.transform = '';
            card.style.zIndex = '';
        }, 2000);
    }

    showThemeDetails(theme) {
        const examples = {
            comunicacao: {
                title: 'Comunicação Profissional',
                description: 'Exemplos: escrever e-mails educados, mensagens claras, apresentações eficazes',
                prompt: 'Como posso melhorar minha comunicação no trabalho usando IA?'
            },
            gestao: {
                title: 'Gestão e Análise',
                description: 'Exemplos: análise de dados, criação de relatórios, apoio na tomada de decisões',
                prompt: 'Como a IA pode me ajudar a analisar dados e criar relatórios?'
            },
            carreira: {
                title: 'Desenvolvimento de Carreira',
                description: 'Exemplos: otimizar currículo, preparar para entrevistas, planos de aprendizado',
                prompt: 'Como usar IA para impulsionar minha carreira profissional?'
            },
            educacao: {
                title: 'Educação e Capacitação',
                description: 'Exemplos: explicações simplificadas, planos de estudo, aprendizado personalizado',
                prompt: 'Como a IA pode me ajudar a aprender novos conceitos?'
            }
        };

        const details = examples[theme];
        if (details) {
            this.showModal(details);
        }
    }

    showModal(details) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('theme-modal');
        if (!modal) {
            modal = this.createModal();
        }

        // Update modal content
        modal.querySelector('.modal-title').textContent = details.title;
        modal.querySelector('.modal-description').textContent = details.description;
        modal.querySelector('.modal-prompt').textContent = `"${details.prompt}"`;

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        modal.querySelector('.modal-close').focus();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'theme-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="modal-close" aria-label="Fechar modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-description"></p>
                    <div class="modal-prompt-section">
                        <h4>Exemplo de pergunta:</h4>
                        <p class="modal-prompt"></p>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn primary">Experimentar</button>
                        <button class="modal-btn secondary">Fechar</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .modal-content {
                background: var(--bg-card);
                border-radius: var(--border-radius-lg);
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: var(--shadow-lg);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
            }
            .modal-title {
                margin: 0;
                color: var(--text-primary);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 8px;
                border-radius: 50%;
                transition: var(--transition);
            }
            .modal-close:hover {
                background: var(--bg-secondary);
                color: var(--text-primary);
            }
            .modal-body {
                padding: 1.5rem;
            }
            .modal-description {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
            }
            .modal-prompt-section h4 {
                color: var(--primary-color);
                margin-bottom: 0.5rem;
            }
            .modal-prompt {
                background: var(--bg-secondary);
                padding: 1rem;
                border-radius: var(--border-radius);
                font-style: italic;
                color: var(--text-primary);
                margin-bottom: 1.5rem;
            }
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            .modal-btn {
                padding: 12px 24px;
                border: none;
                border-radius: var(--border-radius);
                cursor: pointer;
                font-weight: 500;
                transition: var(--transition);
            }
            .modal-btn.primary {
                background: var(--primary-color);
                color: white;
            }
            .modal-btn.primary:hover {
                background: var(--secondary-color);
            }
            .modal-btn.secondary {
                background: var(--bg-secondary);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
            }
            .modal-btn.secondary:hover {
                background: var(--border-color);
            }
        `;

        // Add styles to document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);

        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        modal.querySelector('.modal-btn.secondary').addEventListener('click', () => {
            this.closeModal();
        });

        modal.querySelector('.modal-btn.primary').addEventListener('click', () => {
            this.closeModal();
            // Could integrate with ChatGPT API here
            alert('Esta funcionalidade pode ser integrada com APIs de IA para demonstrações ao vivo!');
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);
        return modal;
    }

    closeModal() {
        const modal = document.getElementById('theme-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    switchTab(tabId, activeBtn) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    setupKeyboardNavigation() {
        // Add keyboard support for interactive elements
        document.querySelectorAll('.concept-card, .theme-card, .inclusion-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // Add ARIA labels for better accessibility
        document.querySelectorAll('.accessibility-btn').forEach(btn => {
            btn.setAttribute('role', 'button');
            btn.setAttribute('aria-pressed', 'false');
        });
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const navManager = new NavigationManager();
    navManager.scrollToSection(sectionId);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    new AccessibilityManager();
    new NavigationManager();
    new InteractiveManager();

    // Add loading animation
    document.body.classList.add('loaded');

    // Add smooth reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.concept-card, .theme-card, .inclusion-card, .example-content').forEach(el => {
        observer.observe(el);
    });

    // Add animation styles
    const animationStyles = `
        .concept-card, .theme-card, .inclusion-card, .example-content {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        body.loaded {
            opacity: 1;
        }
    `;

    const animationStyleSheet = document.createElement('style');
    animationStyleSheet.textContent = animationStyles;
    document.head.appendChild(animationStyleSheet);

    console.log('Folder Interativo carregado com sucesso! 🚀');
    console.log('Recursos de acessibilidade ativados ♿');
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

