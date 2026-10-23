// Tabela ordenável (WAI-ARIA APG "Sortable Table") com filtro.
// - cabeçalho = <button> dentro do <th>; o <th> recebe aria-sort
// - filtro anuncia "N de M pedidos" com atraso; estado vazio com "Limpar filtro"
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-tabela]');
const registrar = registrador(bancada);
const corpo = bancada.querySelector('[data-corpo]');
const linhas = [...corpo.querySelectorAll('tr[data-numero]')];
const vazia = bancada.querySelector('[data-vazia]');
const filtro = bancada.querySelector('[data-filtro]');
const contagem = bancada.querySelector('[data-contagem]');
const anuncio = bancada.querySelector('[data-anuncio]');
const ordemSr = bancada.querySelector('[data-ordem-sr]');
const cabecalhos = [...bancada.querySelectorAll('th[data-coluna]')];

const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const valor = (tr, coluna, tipo) => (tipo === 'numero' ? Number(tr.dataset[coluna]) : tr.dataset[coluna]);

cabecalhos.forEach((th) => {
  th.querySelector('button').addEventListener('click', () => {
    const crescente = th.getAttribute('aria-sort') !== 'ascending';
    cabecalhos.forEach((outro) => outro.removeAttribute('aria-sort')); // só uma coluna ordenada
    th.setAttribute('aria-sort', crescente ? 'ascending' : 'descending');

    const { coluna, tipo } = th.dataset;
    const ordenadas = [...linhas].sort((a, b) => {
      const va = valor(a, coluna, tipo);
      const vb = valor(b, coluna, tipo);
      const r = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb), 'pt-BR');
      return crescente ? r : -r;
    });
    corpo.prepend(...ordenadas); // move as linhas (a linha "vazia" fica por último)

    const nome = th.textContent.trim();
    const sentido = crescente ? 'crescente' : 'decrescente';
    ordemSr.textContent = `, ordenada por ${nome}, ${sentido}`;
    registrar(`Ordenado por ${nome} (${sentido}): aria-sort="${crescente ? 'ascending' : 'descending'}".`);
  });
});

let timer;
function filtrar() {
  const termo = normalizar(filtro.value.trim());
  let visiveis = 0;
  linhas.forEach((tr) => {
    const casa = !termo || normalizar(`${tr.dataset.cliente} ${tr.dataset.status}`).includes(termo);
    tr.hidden = !casa;
    if (casa) visiveis += 1;
  });
  vazia.hidden = visiveis > 0;
  contagem.textContent = `${visiveis} de ${linhas.length}`;
  clearTimeout(timer);
  timer = setTimeout(() => {
    anuncio.textContent = visiveis ? `${visiveis} de ${linhas.length} pedidos.` : 'Nenhum pedido encontrado.';
  }, 500);
}

filtro.addEventListener('input', filtrar);
bancada.querySelector('[data-limpar]').addEventListener('click', () => {
  filtro.value = '';
  filtrar();
  filtro.focus();
  registrar('Filtro limpo; o foco voltou para o campo.');
});
