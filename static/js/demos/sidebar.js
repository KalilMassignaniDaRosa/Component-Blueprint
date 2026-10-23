// Demo de sidebar: grupos que abrem e fecham, item atual e modo recolhido.
import { registrador, linksFalsos } from './_comum.js';

const bancada = document.querySelector('[data-demo-sidebar]');
const registrar = registrador(bancada);
const lateral = bancada.querySelector('[data-lateral]');
const titulo = bancada.querySelector('[data-titulo]');

// Grupos: botões com aria-expanded que mostram/escondem a sublista
lateral.querySelectorAll('.app-grupo[aria-controls]').forEach((grupo) => {
  grupo.addEventListener('click', () => {
    const abrir = grupo.getAttribute('aria-expanded') !== 'true';
    grupo.setAttribute('aria-expanded', String(abrir));
    document.getElementById(grupo.getAttribute('aria-controls')).hidden = !abrir;
    registrar(`Grupo “${grupo.textContent.trim()}” ${abrir ? 'aberto' : 'fechado'} (aria-expanded="${abrir}").`);
  });
});

linksFalsos(lateral, registrar, (link) => {
  lateral.querySelectorAll('.app-link').forEach((a) => a.removeAttribute('aria-current'));
  link.setAttribute('aria-current', 'page');
  titulo.textContent = link.textContent.trim();
});

// Recolher: botão de alternância (aria-pressed). Os rótulos ficam só para o leitor de tela.
const recolher = lateral.querySelector('[data-recolher]');
recolher.addEventListener('click', () => {
  const recolhida = recolher.getAttribute('aria-pressed') !== 'true';
  recolher.setAttribute('aria-pressed', String(recolhida));
  lateral.classList.toggle('is-recolhida', recolhida);
  registrar(recolhida
    ? 'Barra recolhida: só ícones na tela, mas cada link mantém o nome para o leitor de tela.'
    : 'Barra expandida.');
});
