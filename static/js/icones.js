// Busca e avisos do comparador de ícones. Tudo no navegador: nada é enviado
// ao servidor. O termo fica na URL (?q=lixeira) para o link ser compartilhável.
import { anunciar } from './anunciar.js';

const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const entrada = document.querySelector('[data-busca-icone]');
const linhas = [...document.querySelectorAll('[data-icone]')].map((linha) => ({
  linha,
  texto: normalizar(linha.dataset.texto),
}));
const contagem = document.querySelector('[data-contagem]');
const rolagem = document.querySelector('.icones__rolagem');
const vazio = document.querySelector('[data-vazio]');
const vazioTermo = document.querySelector('[data-vazio-termo]');

const avisoFalta = document.querySelector('[data-aviso-falta]');
const avisoFaltaTitulo = document.querySelector('[data-aviso-falta-titulo]');
const avisoFaltaLista = document.querySelector('[data-aviso-falta-lista]');
const avisoErro = document.querySelector('[data-aviso-erro]');
const avisoErroTexto = document.querySelector('[data-aviso-erro-texto]');

let timerAnuncio;

// Aviso de lacunas: só dos conceitos que estão visíveis agora.
function atualizarAvisoFalta(visiveis) {
  const comFalta = visiveis.filter((l) => l.dataset.faltam);
  avisoFalta.hidden = comFalta.length === 0;
  if (!comFalta.length) return;
  avisoFaltaTitulo.textContent =
    comFalta.length === 1
      ? '1 conceito exibido não existe em todas as coleções:'
      : `${comFalta.length} conceitos exibidos não existem em todas as coleções:`;
  avisoFaltaLista.replaceChildren(
    ...comFalta.map((l) => {
      const item = document.createElement('li');
      item.textContent = `${l.dataset.rotulo}: falta em ${l.dataset.faltam}.`;
      return item;
    })
  );
}

function filtrar({ anunciarResultado = true } = {}) {
  const termos = normalizar(entrada.value).split(/\s+/).filter(Boolean);
  const visiveis = [];
  for (const { linha, texto } of linhas) {
    linha.hidden = !termos.every((t) => texto.includes(t));
    if (!linha.hidden) visiveis.push(linha);
  }

  contagem.textContent = `${visiveis.length} de ${linhas.length}`;
  rolagem.hidden = visiveis.length === 0;
  vazio.hidden = visiveis.length > 0;
  vazioTermo.textContent = entrada.value.trim();
  atualizarAvisoFalta(visiveis);

  const url = new URL(location.href);
  entrada.value.trim() ? url.searchParams.set('q', entrada.value.trim()) : url.searchParams.delete('q');
  history.replaceState(null, '', url);

  if (anunciarResultado) {
    clearTimeout(timerAnuncio);
    timerAnuncio = setTimeout(() => {
      const n = visiveis.length;
      const faltando = visiveis.filter((l) => l.dataset.faltam).length;
      let msg = n === 0 ? 'Nenhum ícone encontrado.' : n === 1 ? '1 conceito encontrado.' : `${n} conceitos encontrados.`;
      if (faltando) msg += ` ${faltando} com lacuna em alguma coleção.`;
      anunciar(msg);
    }, 500);
  }
}

// Falha de carregamento (CDN fora do ar, arquivo removido): a célula troca a
// imagem quebrada por um texto e o aviso vermelho conta quantas falharam.
const falhas = new Set();
function marcarFalha(img) {
  const celula = img.closest('[data-celula]');
  if (!celula || falhas.has(celula)) return;
  falhas.add(celula);
  const marca = document.createElement('span');
  marca.className = 'icones__falta';
  marca.textContent = '⚠ falhou ao carregar';
  img.replaceWith(marca);
  const colecoes = [...new Set([...falhas].map((c) => c.dataset.colecao))].join(', ');
  const quantos = falhas.size === 1 ? '1 ícone não carregou' : `${falhas.size} ícones não carregaram`;
  avisoErroTexto.textContent =
    `${quantos} (${colecoes}). O CDN pode estar fora do ar ou bloqueado nesta rede.`;
  avisoErro.hidden = false;
}

for (const img of document.querySelectorAll('.icones__img')) {
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) marcarFalha(img);
  else img.addEventListener('error', () => marcarFalha(img), { once: true });
}

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
  filtrar();
  entrada.focus();
});
document.addEventListener('keydown', (e) => {
  const digitando = e.target.closest('input, textarea, select, [contenteditable="true"]');
  if (e.key === '/' && !digitando && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    entrada.focus();
  }
});

entrada.value = new URLSearchParams(location.search).get('q') ?? '';
filtrar({ anunciarResultado: false });
