// Demo de tooltip que segue a WCAG 1.4.13 (conteúdo em hover ou foco):
// - aparece no hover (com atraso curto) E no foco
// - dá para mover o mouse para cima do balão sem ele sumir
// - Esc fecha sem mover o foco
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-tooltip]');
const registrar = registrador(bancada);
const ATRASO_ENTRADA = 300;
const ATRASO_SAIDA = 150;

let aberto = null;

bancada.querySelectorAll('[data-dica]').forEach((dica) => {
  const gatilho = dica.querySelector('button');
  const balao = dica.querySelector('[role="tooltip"]');
  let timerEntrada;
  let timerSaida;

  const mostrar = () => {
    clearTimeout(timerSaida);
    if (aberto && aberto !== balao) aberto.hidden = true;
    balao.hidden = false;
    aberto = balao;
  };
  const esconder = () => {
    clearTimeout(timerEntrada);
    balao.hidden = true;
    if (aberto === balao) aberto = null;
  };

  // Hover no gatilho OU no balão mantém aberto (o wrapper .dica envolve os dois)
  dica.addEventListener('mouseenter', () => {
    clearTimeout(timerSaida);
    timerEntrada = setTimeout(mostrar, ATRASO_ENTRADA);
  });
  dica.addEventListener('mouseleave', () => {
    clearTimeout(timerEntrada);
    if (document.activeElement !== gatilho) timerSaida = setTimeout(esconder, ATRASO_SAIDA);
  });
  gatilho.addEventListener('focus', () => {
    mostrar();
    registrar(`Foco: o tooltip “${balao.textContent.trim()}” apareceu sem precisar do mouse.`);
  });
  gatilho.addEventListener('blur', esconder);
  gatilho.addEventListener('click', () => registrar(`Clicou em “${balao.textContent.trim()}”.`));
});

// Esc fecha o tooltip aberto, de qualquer lugar, e o foco fica onde está
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aberto) {
    aberto.hidden = true;
    aberto = null;
    registrar('Esc fechou o tooltip; o foco continuou no botão.');
  }
});
