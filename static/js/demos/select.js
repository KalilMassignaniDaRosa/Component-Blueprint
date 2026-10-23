// "Select-only combobox" (WAI-ARIA APG): o foco fica no combobox e a opção
// destacada é indicada por aria-activedescendant.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-select]');
const registrar = registrador(bancada);
const raiz = bancada.querySelector('[data-combo]');
const combo = raiz.querySelector('[role="combobox"]');
const lista = raiz.querySelector('[role="listbox"]');
const valor = raiz.querySelector('[data-valor]');
const opcoes = [...lista.querySelectorAll('[role="option"]')];

let ativa = opcoes.findIndex((o) => o.getAttribute('aria-selected') === 'true');
let busca = '';
let timerBusca;

const aberto = () => combo.getAttribute('aria-expanded') === 'true';
const nome = (o) => o.firstElementChild.textContent;

function destacar(i) {
  ativa = Math.max(0, Math.min(opcoes.length - 1, i));
  opcoes.forEach((o, k) => o.classList.toggle('is-ativa', k === ativa));
  combo.setAttribute('aria-activedescendant', opcoes[ativa].id);
  opcoes[ativa].scrollIntoView({ block: 'nearest' });
}

function abrir() {
  lista.hidden = false;
  combo.setAttribute('aria-expanded', 'true');
  destacar(opcoes.findIndex((o) => o.getAttribute('aria-selected') === 'true'));
}

function fechar() {
  lista.hidden = true;
  combo.setAttribute('aria-expanded', 'false');
  combo.removeAttribute('aria-activedescendant');
}

function escolher(i) {
  const opcao = opcoes[i];
  if (opcao.getAttribute('aria-disabled') === 'true') {
    registrar(`“${nome(opcao)}” está indisponível.`);
    return;
  }
  opcoes.forEach((o) => o.setAttribute('aria-selected', String(o === opcao)));
  valor.textContent = nome(opcao);
  fechar();
  registrar(`Plano escolhido: ${nome(opcao)}.`);
}

combo.addEventListener('click', () => (aberto() ? fechar() : abrir()));

combo.addEventListener('keydown', (e) => {
  const teclas = {
    ArrowDown: () => (aberto() ? destacar(ativa + 1) : abrir()),
    ArrowUp: () => (aberto() ? destacar(ativa - 1) : abrir()),
    Home: () => aberto() && destacar(0),
    End: () => aberto() && destacar(opcoes.length - 1),
    Enter: () => (aberto() ? escolher(ativa) : abrir()),
    ' ': () => (aberto() ? escolher(ativa) : abrir()),
    Escape: () => aberto() && fechar(),
    Tab: () => aberto() && escolher(ativa),
  };
  if (teclas[e.key]) {
    if (e.key !== 'Tab') e.preventDefault();
    teclas[e.key]();
    return;
  }
  // Digitar letras pula para a opção que começa com elas
  if (e.key.length === 1 && /\S/.test(e.key)) {
    busca += e.key.toLowerCase();
    clearTimeout(timerBusca);
    timerBusca = setTimeout(() => (busca = ''), 600);
    const alvo = opcoes.findIndex((o) => nome(o).toLowerCase().startsWith(busca));
    if (alvo >= 0) {
      if (!aberto()) abrir();
      destacar(alvo);
    }
  }
});

opcoes.forEach((o, i) => {
  o.addEventListener('click', () => escolher(i));
  o.addEventListener('mousemove', () => destacar(i));
});

// Clique fora fecha sem escolher
document.addEventListener('click', (e) => {
  if (aberto() && !raiz.contains(e.target)) fechar();
});

bancada.querySelector('[data-nativo]').addEventListener('change', (e) => {
  registrar(e.target.value ? `Estado escolhido no select nativo: ${e.target.value}.` : 'Nenhum estado escolhido.');
});
