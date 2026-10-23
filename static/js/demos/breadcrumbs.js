// Demo de breadcrumbs: links de mentira e o botão "…" que revela os níveis ocultos.
import { registrador, linksFalsos } from './_comum.js';

const bancada = document.querySelector('[data-demo-breadcrumbs]');
const registrar = registrador(bancada);
linksFalsos(bancada, registrar);

const botao = bancada.querySelector('[data-recolher]');
botao.addEventListener('click', () => {
  const ocultos = bancada.querySelectorAll('[data-oculto]');
  ocultos.forEach((li) => (li.hidden = false));
  // O botão some; o foco vai para o primeiro nível revelado, para não se perder.
  bancada.querySelector('[data-recolher-item]').hidden = true;
  ocultos[0].querySelector('a').focus();
  registrar('3 níveis revelados. O foco foi para “Eletrônicos”.');
});
