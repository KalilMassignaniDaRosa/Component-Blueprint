// Accordion (WAI-ARIA APG): cada título é um botão com aria-expanded/aria-controls.
// Opção "só um aberto por vez" fecha os outros ao abrir um.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-accordion]');
const registrar = registrador(bancada);
const botoes = [...bancada.querySelectorAll('.acordeao__botao')];
const umPorVez = bancada.querySelector('[data-um-por-vez]');

function definir(botao, aberto) {
  botao.setAttribute('aria-expanded', String(aberto));
  document.getElementById(botao.getAttribute('aria-controls')).hidden = !aberto;
}

botoes.forEach((botao) =>
  botao.addEventListener('click', () => {
    const abrir = botao.getAttribute('aria-expanded') !== 'true';
    if (abrir && umPorVez.checked) botoes.forEach((b) => b !== botao && definir(b, false));
    definir(botao, abrir);
    registrar(`“${botao.textContent.trim()}” ${abrir ? 'aberto' : 'fechado'}. O foco continua no título.`);
  })
);

umPorVez.addEventListener('change', () => {
  if (umPorVez.checked) {
    const abertos = botoes.filter((b) => b.getAttribute('aria-expanded') === 'true');
    abertos.slice(1).forEach((b) => definir(b, false));
  }
  registrar(umPorVez.checked ? 'Agora só um painel fica aberto por vez.' : 'Vários painéis podem ficar abertos.');
});

bancada.querySelector('details').addEventListener('toggle', (e) => {
  registrar(`<details> ${e.target.open ? 'aberto' : 'fechado'}: o navegador cuidou de tudo, sem JavaScript.`);
});
