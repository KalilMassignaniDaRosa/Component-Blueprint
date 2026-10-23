// Busca e filtro da home. Tudo no navegador: nada é enviado ao servidor.
// O estado fica na URL (?q=modal&cat=feedback), então o link filtrado pode ser compartilhado.
import { anunciar } from './anunciar.js';

// "Navegação" e "navegacao" devem casar: minúsculas e sem acentos.
const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const entrada = document.querySelector('[data-busca]');
const chips = [...document.querySelectorAll('.chip[data-cat]')];
const cards = [...document.querySelectorAll('[data-card]')];
const grupos = [...document.querySelectorAll('[data-grupo]')];
const contagem = document.querySelector('[data-contagem]');
const vazio = document.querySelector('[data-vazio]');
const vazioTermo = document.querySelector('[data-vazio-termo]');
const indexados = cards.map((card) => ({ card, texto: normalizar(card.dataset.texto) }));

let categoria = '';
let timerAnuncio;

function filtrar({ anunciarResultado = true } = {}) {
  const termos = normalizar(entrada.value).split(/\s+/).filter(Boolean);
  let visiveis = 0;

  for (const { card, texto } of indexados) {
    const casaCategoria = !categoria || card.dataset.cat === categoria;
    const casaTexto = termos.every((t) => texto.includes(t));
    card.hidden = !(casaCategoria && casaTexto);
    if (!card.hidden) visiveis += 1;
  }

  // Esconde o grupo inteiro (com o título) quando nenhum card dele sobrou
  for (const grupo of grupos) {
    grupo.hidden = !grupo.querySelector('[data-card]:not([hidden])');
  }

  contagem.textContent = `${visiveis} de ${cards.length}`;
  vazio.hidden = visiveis > 0;
  vazioTermo.textContent = entrada.value.trim() || '(vazio)';

  // Mantém a URL em sincronia sem criar entradas novas no histórico
  const url = new URL(location.href);
  entrada.value.trim() ? url.searchParams.set('q', entrada.value.trim()) : url.searchParams.delete('q');
  categoria ? url.searchParams.set('cat', categoria) : url.searchParams.delete('cat');
  history.replaceState(null, '', url);

  // Anuncia o resultado só depois que a pessoa para de digitar (evita falatório)
  if (anunciarResultado) {
    clearTimeout(timerAnuncio);
    timerAnuncio = setTimeout(() => {
      const mensagens = {
        0: 'Nenhum componente encontrado.',
        1: '1 componente encontrado.',
      };
      anunciar(mensagens[visiveis] ?? `${visiveis} componentes encontrados.`);
    }, 500);
  }
}

function escolherCategoria(valor) {
  categoria = valor;
  chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.cat === valor)));
}

chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    escolherCategoria(chip.dataset.cat);
    filtrar();
  })
);

entrada.addEventListener('input', () => filtrar());

entrada.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && entrada.value) {
    e.preventDefault();
    entrada.value = '';
    filtrar();
  }
});

document.querySelector('[data-limpar]').addEventListener('click', () => {
  entrada.value = '';
  escolherCategoria('');
  filtrar();
  entrada.focus();
});

// Atalho "/" para focar a busca (comum em sites de documentação).
// Ignorado quando a pessoa já está digitando em algum campo.
document.addEventListener('keydown', (e) => {
  const digitando = e.target.closest('input, textarea, select, [contenteditable="true"]');
  if (e.key === '/' && !digitando && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    entrada.focus();
  }
});

// Estado inicial vindo da URL (ex.: link do breadcrumb "Navegação" → ?cat=navegacao)
const params = new URLSearchParams(location.search);
entrada.value = params.get('q') ?? '';
const catInicial = params.get('cat') ?? '';
escolherCategoria(chips.some((c) => c.dataset.cat === catInicial) ? catInicial : '');
filtrar({ anunciarResultado: false });
