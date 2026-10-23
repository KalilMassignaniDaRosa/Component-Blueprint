// Demo de cards: o card clicável é só CSS. Aqui só seguramos os links de exemplo
// e registramos o que cada clique faria.
import { registrador, linksFalsos } from './_comum.js';

const bancada = document.querySelector('[data-demo-cards]');
const registrar = registrador(bancada);
linksFalsos(bancada, registrar);

bancada.querySelectorAll('[data-acao]').forEach((b) =>
  b.addEventListener('click', () => registrar(`Botão “${b.getAttribute('aria-label')}”.`))
);
