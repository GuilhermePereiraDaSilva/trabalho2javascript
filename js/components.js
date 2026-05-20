// ─────────────────────────────────────────────────
// SITE-HEADER  (Custom Element - aula do professor)
// ─────────────────────────────────────────────────
class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <h1>Interface Web</h1>
                <p>Trabalhos da Disciplina</p>
            </header>
        `;
    }
}
customElements.define('site-header', SiteHeader);


// ─────────────────────────────────────────────────
// SITE-NAV  (Custom Element com link ativo)
// ─────────────────────────────────────────────────
class SiteNav extends HTMLElement {
    connectedCallback() {
        // Pega o nome do arquivo atual para marcar link ativo
        let paginaAtual = window.location.pathname.split('/').pop();
        if (paginaAtual === '') {
            paginaAtual = 'index.html';
        }

        this.innerHTML = `
            <nav>
                <a href="index.html">Início</a>
                <a href="editor.html">Trabalho 1 - Editor</a>
                <a href="prova.html">Trabalho 2 - Prova</a>
            </nav>
        `;

        // Destaca o link da página atual
        let links = this.querySelectorAll('a');
        links.forEach(function(link) {
            if (link.getAttribute('href') === paginaAtual) {
                link.style.background = '#444466';
                link.style.outline = '2px solid white';
            }
        });
    }
}
customElements.define('site-nav', SiteNav);


// ─────────────────────────────────────────────────
// SITE-FOOTER  (Custom Element com Shadow DOM + Template + Slot)
// como ensinado na aula de Web Components
// ─────────────────────────────────────────────────

// Template com slot (recurso da aula)
let templateFooter = document.createElement('template');
templateFooter.innerHTML = `
    <style>
        footer {
            background: #1e1e2e;
            color: #aaa;
            text-align: center;
            padding: 16px;
            margin-top: 40px;
            font-size: 0.85rem;
            font-family: Arial, sans-serif;
        }
    </style>
    <footer>
        <slot>Projeto Web - Interface Web 2025</slot>
    </footer>
`;

class SiteFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.appendChild(templateFooter.content.cloneNode(true));
    }
}
customElements.define('site-footer', SiteFooter);
