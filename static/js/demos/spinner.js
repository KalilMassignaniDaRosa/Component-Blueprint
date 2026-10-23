// Demo de spinner: só aparece se a espera passar de 300 ms (evita "piscar"),
// cobre apenas a área que carrega, e o texto vai para o leitor de tela.
import { registrador, esperar } from './_comum.js';

const bancada = document.querySelector('[data-demo-spinner]');
const registrar = registrador(bancada);
const area = bancada.querySelector('[data-area]');
const veu = bancada.querySelector('[data-veu]');
const lista = bancada.querySelector('[data-lista]');
const status = bancada.querySelector('[data-status]');
const botao = bancada.querySelector('[data-carregar]');
const rapido = bancada.querySelector('[data-rapido]');

const ATRASO_SPINNER = 300;
const PEDIDOS = ['Nº 48213 · R$ 189,90 · enviado', 'Nº 48207 · R$ 54,00 · entregue', 'Nº 48190 · R$ 320,50 · entregue'];

botao.addEventListener('click', async () => {
  botao.setAttribute('aria-disabled', 'true');
  area.setAttribute('aria-busy', 'true');
  const inicio = performance.now();

  // O spinner só é mostrado se a resposta demorar mais que 300 ms
  const timer = setTimeout(() => {
    veu.hidden = false;
    status.textContent = 'Carregando pedidos…';
  }, ATRASO_SPINNER);

  await esperar(rapido.checked ? 200 : 1800); // "rede"
  clearTimeout(timer);
  const apareceu = !veu.hidden;

  lista.replaceChildren(
    ...PEDIDOS.map((p) => {
      const li = document.createElement('li');
      li.textContent = p;
      return li;
    })
  );
  veu.hidden = true;
  area.setAttribute('aria-busy', 'false');
  botao.removeAttribute('aria-disabled');
  status.textContent = `${PEDIDOS.length} pedidos carregados.`;
  const ms = Math.round(performance.now() - inicio);
  registrar(apareceu
    ? `Levou ${ms} ms: o spinner apareceu e o fim foi anunciado.`
    : `Levou ${ms} ms: rápido demais para valer um spinner, então ele nem apareceu.`);
});
