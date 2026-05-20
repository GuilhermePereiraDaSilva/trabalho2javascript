// ─────────────────────────────────────────────────
// EDITOR DE CARTÕES
// Usa: querySelector, addEventListener, createElement,
//      appendChild, removeChild, style, innerHTML
//      — tudo da aula do professor
// ─────────────────────────────────────────────────

// Guarda os elementos do cartão (array de objetos - aula de OO)
let elementos = [];
let proximoId = 1;
let idSelecionado = null;

// Pega as referências do DOM
let cartao        = document.querySelector('#cartao');
let avisoVazio    = document.querySelector('#aviso-vazio');
let listaEl       = document.querySelector('#lista-elementos');

let inputTipo     = document.querySelector('#tipo');
let inputTexto    = document.querySelector('#texto');
let inputImgUrl   = document.querySelector('#img-url');
let grupoTexto    = document.querySelector('#grupo-texto');
let grupoImgUrl   = document.querySelector('#grupo-img-url');

let inputCorTexto = document.querySelector('#cor-texto');
let inputBgEl     = document.querySelector('#bg-elemento');
let inputTamanho  = document.querySelector('#tamanho');
let labelTamanho  = document.querySelector('#label-tamanho');

let inputBgCartao = document.querySelector('#bg-cartao');

let btnAdicionar  = document.querySelector('#btn-adicionar');
let btnRemover    = document.querySelector('#btn-remover');
let btnSubir      = document.querySelector('#btn-subir');
let btnDescer     = document.querySelector('#btn-descer');
let btnLimpar     = document.querySelector('#btn-limpar');


// ── Quando muda o tipo de elemento, mostra/esconde campos ──
inputTipo.addEventListener('change', function() {
    if (inputTipo.value === 'img') {
        grupoTexto.style.display  = 'none';
        grupoImgUrl.style.display = 'block';
    } else {
        grupoTexto.style.display  = 'block';
        grupoImgUrl.style.display = 'none';
    }
});


// ── Atualiza label do tamanho ao mover o range ──
inputTamanho.addEventListener('input', function() {
    labelTamanho.textContent = 'Tamanho da fonte: ' + inputTamanho.value + 'px';

    // Se tem elemento selecionado, atualiza na hora
    if (idSelecionado !== null) {
        let el = elementos.find(function(e) { return e.id === idSelecionado; });
        if (el && el.tipo !== 'img') {
            el.tamanho = parseInt(inputTamanho.value);
            renderCartao();
        }
    }
});


// ── Atualiza cores ao vivo quando tem elemento selecionado ──
inputCorTexto.addEventListener('input', function() {
    if (idSelecionado !== null) {
        let el = elementos.find(function(e) { return e.id === idSelecionado; });
        if (el) {
            el.cor = inputCorTexto.value;
            renderCartao();
        }
    }
});

inputBgEl.addEventListener('input', function() {
    if (idSelecionado !== null) {
        let el = elementos.find(function(e) { return e.id === idSelecionado; });
        if (el) {
            el.bg = inputBgEl.value;
            renderCartao();
        }
    }
});


// ── Cor de fundo do cartão ──
inputBgCartao.addEventListener('input', function() {
    cartao.style.background = inputBgCartao.value;
    cartao.style.border     = '1px solid #ccc';
});


// ── Adicionar elemento ──
btnAdicionar.addEventListener('click', function() {
    let tipo = inputTipo.value;

    if (tipo === 'img') {
        let url = inputImgUrl.value.trim();
        if (url === '') {
            inputImgUrl.focus();
            return;
        }
        elementos.push({
            id:      proximoId,
            tipo:    'img',
            conteudo: url,
            cor:     '#000000',
            bg:      'transparent',
            tamanho: 16
        });
        inputImgUrl.value = '';

    } else {
        let txt = inputTexto.value.trim();
        if (txt === '') {
            inputTexto.focus();
            return;
        }
        elementos.push({
            id:      proximoId,
            tipo:    tipo,
            conteudo: txt,
            cor:     inputCorTexto.value,
            bg:      inputBgEl.value,
            tamanho: parseInt(inputTamanho.value)
        });
        inputTexto.value = '';
    }

    proximoId++;
    renderCartao();
    renderLista();
    atualizarBotoes();
});


// ── Remover elemento selecionado ──
btnRemover.addEventListener('click', function() {
    if (idSelecionado === null) { return; }

    elementos = elementos.filter(function(e) { return e.id !== idSelecionado; });
    idSelecionado = null;

    renderCartao();
    renderLista();
    atualizarBotoes();
});


// ── Subir elemento ──
btnSubir.addEventListener('click', function() {
    mover(-1);
});

// ── Descer elemento ──
btnDescer.addEventListener('click', function() {
    mover(1);
});

function mover(direcao) {
    if (idSelecionado === null) { return; }

    let idx = elementos.findIndex(function(e) { return e.id === idSelecionado; });
    let novoIdx = idx + direcao;

    if (novoIdx < 0 || novoIdx >= elementos.length) { return; }

    // Troca os dois elementos no array
    let temp = elementos[idx];
    elementos[idx] = elementos[novoIdx];
    elementos[novoIdx] = temp;

    renderCartao();
    renderLista();
}


// ── Limpar tudo ──
btnLimpar.addEventListener('click', function() {
    if (elementos.length === 0) { return; }

    if (confirm('Deseja apagar todos os elementos do cartão?')) {
        elementos = [];
        idSelecionado = null;
        cartao.style.background = '';
        cartao.style.border     = '2px dashed #bbb';
        inputBgCartao.value     = '#ffffff';
        renderCartao();
        renderLista();
        atualizarBotoes();
    }
});


// ── Selecionar elemento clicando nele ──
function selecionar(id) {
    // Se clicar no mesmo, deseleciona
    if (idSelecionado === id) {
        idSelecionado = null;
    } else {
        idSelecionado = id;

        // Carrega os valores do elemento selecionado nos inputs
        let el = elementos.find(function(e) { return e.id === id; });
        if (el) {
            inputCorTexto.value  = el.cor;
            inputBgEl.value      = el.bg;
            inputTamanho.value   = el.tamanho;
            labelTamanho.textContent = 'Tamanho da fonte: ' + el.tamanho + 'px';
        }
    }

    renderCartao();
    renderLista();
    atualizarBotoes();
}


// ── Desenha o cartão ──
function renderCartao() {
    cartao.innerHTML = '';

    if (elementos.length === 0) {
        cartao.innerHTML = '<p id="aviso-vazio" style="color:#aaa; text-align:center; margin-top:80px; font-size:0.9rem;">Adicione elementos ao cartão</p>';
        return;
    }

    elementos.forEach(function(el) {
        let div = document.createElement('div');
        div.className = 'elemento-cartao' + (el.id === idSelecionado ? ' selecionado' : '');

        div.style.color      = el.cor;
        div.style.background = el.bg;
        div.style.fontSize   = el.tamanho + 'px';

        if (el.tipo === 'h1') {
            div.style.fontWeight = 'bold';
            div.style.fontSize   = el.tamanho + 'px';
        } else if (el.tipo === 'h2') {
            div.style.fontWeight = '600';
        }

        if (el.tipo === 'img') {
            let img = document.createElement('img');
            img.src       = el.conteudo;
            img.className = 'img-cartao';
            img.alt       = 'Imagem do cartão';
            img.onerror   = function() { div.textContent = '⚠ Imagem não encontrada'; };
            div.appendChild(img);
        } else {
            div.textContent = el.conteudo;
        }

        div.addEventListener('click', function() { selecionar(el.id); });

        cartao.appendChild(div);
    });
}


// ── Desenha a lista de elementos ──
function renderLista() {
    listaEl.innerHTML = '';

    elementos.forEach(function(el) {
        let item = document.createElement('div');
        item.className = 'item-lista' + (el.id === idSelecionado ? ' selecionado' : '');

        let rotulo = el.tipo === 'img' ? '🖼 imagem' : el.conteudo;
        item.textContent = '[' + el.tipo + '] ' + rotulo;

        item.addEventListener('click', function() { selecionar(el.id); });

        listaEl.appendChild(item);
    });
}


// ── Habilita/desabilita botões conforme estado ──
function atualizarBotoes() {
    let temSelecionado = idSelecionado !== null;
    btnRemover.disabled = !temSelecionado;
    btnSubir.disabled   = !temSelecionado;
    btnDescer.disabled  = !temSelecionado;
    btnLimpar.disabled  = elementos.length === 0;
}


// ── Inicia com botões desabilitados ──
atualizarBotoes();
