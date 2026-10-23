// Demo de paginação: monta a lista de resultados e os controles de página.
// Num site real, cada página seria um link com ?pagina=N (para o Voltar funcionar);
// aqui usamos botões para não recarregar a prancha.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-paginacao]');
const registrar = registrador(bancada);
const lista = bancada.querySelector('[data-lista]');
const paginas = bancada.querySelector('[data-paginas]');
const resumo = bancada.querySelector('[data-resumo]');

const TOTAL = 58;
const POR_PAGINA = 5;
const ULTIMA = Math.ceil(TOTAL / POR_PAGINA);
const CIDADES = ['Recife', 'Belém', 'Curitiba', 'Natal', 'Manaus', 'Goiânia', 'Vitória', 'Maceió', 'Cuiabá', 'Palmas'];
let atual = 1;

// Quais números mostrar: primeira, última, a atual e suas vizinhas, com "…" nos buracos.
function numeros() {
  const set = new Set([1, ULTIMA, atual - 1, atual, atual + 1].filter((n) => n >= 1 && n <= ULTIMA));
  const ordenados = [...set].sort((a, b) => a - b);
  const saida = [];
  ordenados.forEach((n, i) => {
    if (i > 0 && n - ordenados[i - 1] > 1) saida.push('…');
    saida.push(n);
  });
  return saida;
}

function botao(rotulo, { pagina, aria, atualPagina = false, desabilitado = false, seta = '' }) {
  const li = document.createElement('li');
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'paginacao__item';
  if (aria) b.setAttribute('aria-label', aria);
  if (atualPagina) b.setAttribute('aria-current', 'page');
  if (desabilitado) b.disabled = true;
  b.dataset.pagina = pagina;
  if (seta) b.append(bancada.querySelector(`template[data-seta="${seta}"]`).content.cloneNode(true));
  else b.textContent = rotulo;
  li.append(b);
  return li;
}

function desenhar() {
  const inicio = (atual - 1) * POR_PAGINA + 1;
  const fim = Math.min(atual * POR_PAGINA, TOTAL);
  resumo.textContent = `Resultados ${inicio}–${fim} de ${TOTAL}`;

  lista.replaceChildren(
    ...Array.from({ length: fim - inicio + 1 }, (_, k) => {
      const n = inicio + k;
      const li = document.createElement('li');
      const nome = document.createElement('span');
      nome.textContent = `Loja ${CIDADES[n % CIDADES.length]} nº ${n}`;
      const num = document.createElement('span');
      num.className = 'rotulo-tec';
      num.textContent = `#${String(n).padStart(2, '0')}`;
      li.append(nome, num);
      return li;
    })
  );

  paginas.replaceChildren(
    botao('', { pagina: atual - 1, aria: 'Página anterior', desabilitado: atual === 1, seta: 'anterior' }),
    ...numeros().map((n) => {
      if (n === '…') {
        const li = document.createElement('li');
        li.className = 'paginacao__reticencias';
        li.setAttribute('aria-hidden', 'true');
        li.textContent = '…';
        return li;
      }
      return botao(String(n), { pagina: n, aria: `Página ${n}`, atualPagina: n === atual });
    }),
    botao('', { pagina: atual + 1, aria: 'Próxima página', desabilitado: atual === ULTIMA, seta: 'proxima' })
  );
}

paginas.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-pagina]');
  if (!b || b.disabled) return;
  atual = Number(b.dataset.pagina);
  desenhar();
  resumo.focus(); // leva o foco ao início da lista nova
  registrar(`Página ${atual} de ${ULTIMA}. O foco foi para o título da lista.`);
});

desenhar();
