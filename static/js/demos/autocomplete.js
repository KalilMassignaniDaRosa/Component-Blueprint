// Autocomplete: combobox com lista de sugestões (WAI-ARIA APG, "list autocomplete").
// O foco fica sempre no input; a sugestão ativa é indicada por aria-activedescendant.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-auto]');
const registrar = registrador(bancada);
const entrada = bancada.querySelector('[data-entrada]');
const lista = bancada.querySelector('[data-lista]');
const contagem = bancada.querySelector('[data-contagem]');

const CIDADES = [
  ['São Paulo', 'SP'], ['São José dos Campos', 'SP'], ['São Luís', 'MA'], ['São Carlos', 'SP'],
  ['Salvador', 'BA'], ['Santos', 'SP'], ['Belo Horizonte', 'MG'], ['Belém', 'PA'],
  ['Rio de Janeiro', 'RJ'], ['Rio Branco', 'AC'], ['Ribeirão Preto', 'SP'], ['Recife', 'PE'],
  ['Porto Alegre', 'RS'], ['Florianópolis', 'SC'], ['Fortaleza', 'CE'], ['Curitiba', 'PR'],
  ['Campinas', 'SP'], ['Campo Grande', 'MS'], ['Manaus', 'AM'], ['Goiânia', 'GO'],
];
const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

let sugestoes = [];
let ativa = -1;
let timerAnuncio;

const aberta = () => entrada.getAttribute('aria-expanded') === 'true';

function fechar() {
  lista.hidden = true;
  entrada.setAttribute('aria-expanded', 'false');
  entrada.removeAttribute('aria-activedescendant');
  ativa = -1;
}

// Monta "<mark>São</mark> Paulo" com nós DOM (o texto digitado nunca vira HTML)
function rotuloComDestaque(nome, termo) {
  const i = normalizar(nome).indexOf(termo);
  const span = document.createElement('span');
  if (i < 0) {
    span.textContent = nome;
    return span;
  }
  const mark = document.createElement('mark');
  mark.textContent = nome.slice(i, i + termo.length);
  span.append(nome.slice(0, i), mark, nome.slice(i + termo.length));
  return span;
}

function filtrar() {
  const termo = normalizar(entrada.value.trim());
  if (termo.length < 2) {
    fechar();
    contagem.textContent = '';
    return;
  }
  sugestoes = CIDADES.filter(([nome]) => normalizar(nome).includes(termo)).slice(0, 8);
  ativa = -1;
  entrada.removeAttribute('aria-activedescendant');

  if (!sugestoes.length) {
    const li = document.createElement('li');
    li.className = 'opcao opcao--vazia';
    li.textContent = `Nenhuma cidade encontrada para “${entrada.value.trim()}”.`;
    lista.replaceChildren(li);
  } else {
    lista.replaceChildren(
      ...sugestoes.map(([nome, uf], i) => {
        const li = document.createElement('li');
        li.className = 'opcao';
        li.id = `auto-op-${i}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        const detalhe = document.createElement('span');
        detalhe.className = 'opcao__detalhe';
        detalhe.textContent = uf;
        li.append(rotuloComDestaque(nome, termo), detalhe);
        li.addEventListener('mousedown', (e) => e.preventDefault()); // não tira o foco do input
        li.addEventListener('click', () => escolher(i));
        return li;
      })
    );
  }
  lista.hidden = false;
  entrada.setAttribute('aria-expanded', 'true');

  // Anuncia a contagem só quando a pessoa para de digitar
  clearTimeout(timerAnuncio);
  timerAnuncio = setTimeout(() => {
    contagem.textContent = sugestoes.length
      ? `${sugestoes.length} ${sugestoes.length === 1 ? 'sugestão' : 'sugestões'}. Use a seta para baixo.`
      : 'Nenhuma sugestão.';
  }, 600);
}

function destacar(i) {
  if (!sugestoes.length) return;
  ativa = (i + sugestoes.length) % sugestoes.length;
  [...lista.children].forEach((li, k) => {
    li.classList.toggle('is-ativa', k === ativa);
    li.setAttribute('aria-selected', String(k === ativa));
  });
  entrada.setAttribute('aria-activedescendant', `auto-op-${ativa}`);
  lista.children[ativa].scrollIntoView({ block: 'nearest' });
}

function escolher(i) {
  const [nome, uf] = sugestoes[i];
  entrada.value = nome;
  fechar();
  registrar(`Escolheu ${nome} (${uf}). O texto só foi trocado porque você confirmou.`);
}

entrada.addEventListener('input', filtrar);

entrada.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!aberta()) filtrar();
    destacar(ativa + 1);
    if (ativa >= 0) registrar(`Sugestão ativa: ${sugestoes[ativa][0]}.`);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    destacar(ativa - 1);
  } else if (e.key === 'Enter' && aberta() && ativa >= 0) {
    e.preventDefault();
    escolher(ativa);
  } else if (e.key === 'Escape' && aberta()) {
    e.preventDefault();
    fechar();
    registrar('Esc fechou a lista; o que você digitou continua no campo.');
  }
});

entrada.addEventListener('blur', fechar);
