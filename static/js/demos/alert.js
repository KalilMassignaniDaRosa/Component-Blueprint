// Demo de alert: um alerta presente desde o carregamento (fechável) e alertas
// criados depois de uma ação, com role="alert" (erro) ou role="status" (sucesso).
import { registrador, esperar } from './_comum.js';

const bancada = document.querySelector('[data-demo-alert]');
const registrar = registrador(bancada);
const alvo = bancada.querySelector('[data-alvo]');
const pagar = bancada.querySelector('[data-pagar]');
const recusar = bancada.querySelector('[data-recusar]');

bancada.querySelector('[data-fechar]').addEventListener('click', (e) => {
  e.currentTarget.closest('[data-aviso-info]').remove();
  pagar.focus(); // o botão sumiu: o foco vai para o próximo elemento útil
  registrar('Aviso fechado. O foco foi para o botão de pagamento.');
});

pagar.addEventListener('click', async () => {
  if (pagar.getAttribute('aria-disabled') === 'true') return; // já está processando
  pagar.setAttribute('aria-disabled', 'true');
  pagar.setAttribute('aria-busy', 'true');
  alvo.replaceChildren();
  await esperar(700);
  pagar.removeAttribute('aria-disabled');
  pagar.removeAttribute('aria-busy');

  const modelo = recusar.checked ? 'erro' : 'sucesso';
  const alerta = bancada.querySelector(`template[data-modelo-${modelo}]`).content.cloneNode(true);
  alvo.append(alerta); // inserir um role="alert" já faz o leitor de tela anunciar
  if (modelo === 'erro') {
    alvo.querySelector('[data-outro]').addEventListener('click', () => {
      recusar.checked = false;
      alvo.replaceChildren();
      pagar.focus();
      registrar('Trocou de cartão (simulação). Tente pagar de novo.');
    });
    registrar('Erro inserido com role="alert": anunciado na hora, sem mover o foco.');
  } else {
    registrar('Sucesso inserido com role="status": anunciado de forma discreta.');
  }
});
