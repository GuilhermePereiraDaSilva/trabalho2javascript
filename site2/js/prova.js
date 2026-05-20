// ─────────────────────────────────────────────────
// MY-PROVA  (Web Component com Shadow DOM)
// Usa: class, constructor, connectedCallback,
//      attachShadow, innerHTML, addEventListener,
//      querySelector, forEach, template string
//      — tudo da aula do professor
// ─────────────────────────────────────────────────

class MyProva extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Monta o HTML de todas as questões usando forEach e template string
        let htmlQuestoes = '';

        questoes.forEach(function(q, i) {
            let htmlAlternativas = '';

            q.alternativas.forEach(function(alt, idx) {
                htmlAlternativas += `
                    <label>
                        <input type="radio" name="q${i}" value="${idx}">
                        ${alt}
                    </label>
                `;
            });

            htmlQuestoes += `
                <div class="questao" id="questao-${i}">
                    <p class="numero">Questão ${i + 1} de ${questoes.length}</p>
                    <p class="pergunta">${q.pergunta}</p>
                    <div class="alternativas">
                        ${htmlAlternativas}
                    </div>
                </div>
            `;
        });

        // CSS e HTML dentro do Shadow DOM (encapsulado)
        this.shadowRoot.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                    font-family: Arial, sans-serif;
                }

                .questao {
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 14px;
                }

                .numero {
                    font-size: 0.75rem;
                    color: #888;
                    margin-bottom: 6px;
                }

                .pergunta {
                    font-weight: bold;
                    margin-bottom: 12px;
                    color: #1e1e2e;
                    line-height: 1.5;
                }

                .alternativas {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #f5f5f5;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    padding: 8px 12px;
                    cursor: pointer;
                    font-size: 0.9rem;
                }

                label:hover {
                    background: #ebebff;
                }

                label.correta {
                    background: #d4edda;
                    border-color: #28a745;
                    color: #155724;
                }

                label.errada {
                    background: #f8d7da;
                    border-color: #dc3545;
                    color: #721c24;
                }

                input[type="radio"] {
                    cursor: pointer;
                }

                input[type="radio"]:disabled {
                    cursor: not-allowed;
                }

                button {
                    padding: 10px 22px;
                    background: #1e1e2e;
                    border: none;
                    color: white;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 0.9rem;
                    margin-right: 8px;
                    margin-top: 10px;
                }

                button:hover {
                    background: #444466;
                }

                button:disabled {
                    background: #aaa;
                    cursor: not-allowed;
                }

                #btn-refazer {
                    background: #555;
                    display: none;
                }

                #btn-refazer:hover {
                    background: #333;
                }

                #resultado {
                    margin-top: 20px;
                    display: none;
                }

                .resultado-nota {
                    background: #1e1e2e;
                    color: white;
                    text-align: center;
                    padding: 20px;
                    border-radius: 8px;
                    font-size: 1.4rem;
                    font-weight: bold;
                    margin-bottom: 14px;
                }

                .resumo-item {
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 12px;
                    margin-bottom: 8px;
                    font-size: 0.85rem;
                    line-height: 1.6;
                }

                .resumo-item.acertou {
                    border-left: 4px solid #28a745;
                }

                .resumo-item.errou {
                    border-left: 4px solid #dc3545;
                }

                .resumo-item strong {
                    display: block;
                    margin-bottom: 4px;
                    color: #1e1e2e;
                }

                .resumo-item .resp {
                    color: #555;
                }

                .resumo-item .certa {
                    color: #155724;
                }
            </style>

            <div id="questoes-container">
                ${htmlQuestoes}
            </div>

            <div>
                <button id="btn-corrigir">Corrigir prova</button>
                <button id="btn-refazer">Responder novamente</button>
            </div>

            <div id="resultado"></div>
        `;

        // Adiciona os event listeners depois de colocar o HTML
        this.shadowRoot.querySelector('#btn-corrigir')
            .addEventListener('click', () => { this.corrigir(); });

        this.shadowRoot.querySelector('#btn-refazer')
            .addEventListener('click', () => { this.render(); });
    }

    corrigir() {
        let acertos = 0;
        let htmlResumo = '';

        questoes.forEach((q, i) => {
            // Pega a alternativa marcada
            let marcado = this.shadowRoot.querySelector(`input[name="q${i}"]:checked`);
            let valor = -1;
            if (marcado) {
                valor = parseInt(marcado.value);
            }

            let acertou = (valor === q.correta);
            if (acertou) {
                acertos++;
            }

            // Desabilita os radios e coloca feedback de cor
            q.alternativas.forEach((alt, idx) => {
                let lbl = this.shadowRoot.querySelector(`#questao-${i} .alternativas label:nth-child(${idx + 1})`);
                let inp = lbl.querySelector('input');
                inp.disabled = true;

                if (idx === q.correta) {
                    lbl.classList.add('correta');
                } else if (idx === valor) {
                    lbl.classList.add('errada');
                }
            });

            // Monta o resumo desta questão
            let respondeu = valor >= 0 ? q.alternativas[valor] : 'Não respondida';
            htmlResumo += `
                <div class="resumo-item ${acertou ? 'acertou' : 'errou'}">
                    <strong>${acertou ? '✔' : '✘'} ${q.pergunta}</strong>
                    <span class="resp">Você respondeu: ${respondeu}</span><br>
                    <span class="certa">Resposta correta: ${q.alternativas[q.correta]}</span>
                </div>
            `;
        });

        // Mostra nota e resumo
        let divResultado = this.shadowRoot.querySelector('#resultado');
        divResultado.style.display = 'block';
        divResultado.innerHTML = `
            <div class="resultado-nota">
                Nota: ${acertos} / ${questoes.length}
            </div>
            ${htmlResumo}
        `;

        // Desabilita botão corrigir, mostra botão refazer
        this.shadowRoot.querySelector('#btn-corrigir').disabled = true;
        this.shadowRoot.querySelector('#btn-refazer').style.display = 'inline-block';

        divResultado.scrollIntoView({ behavior: 'smooth' });
    }
}

customElements.define('my-prova', MyProva);
