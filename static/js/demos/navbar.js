// Demo de navbar: item atual com aria-current e menu recolhido no "celular".
import { registrador, linksFalsos } from './_comum.js';

const bancada = document.querySelector('[data-demo-navbar]');
const registrar = registrador(bancada);
const site = bancada.querySelector('[data-mini-site]');
const nav = bancada.querySelector('[data-mini-nav]');
const menu = bancada.querySelector('[data-mini-menu]');
const titulo = bancada.querySelector('[data-mini-titulo]');

function definirMenu(aberto) {
  menu.setAttribute('aria-expanded', String(aberto));
  nav.classList.toggle('is-aberto', aberto);
}

menu.addEventListener('click', () => definirMenu(menu.getAttribute('aria-expanded') !== 'true'));

nav.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    definirMenu(false);
    menu.focus();
    registrar('Esc fechou o menu e o foco voltou para o botão.');
  }
});

linksFalsos(bancada, registrar, (link) => {
  if (!link.closest('.mini-nav__lista')) return;
  nav.querySelectorAll('.mini-nav__lista a').forEach((a) => a.removeAttribute('aria-current'));
  link.setAttribute('aria-current', 'page');
  titulo.textContent = link.textContent;
  definirMenu(false);
  registrar(`Agora em “${link.textContent}”: o item recebeu aria-current="page".`);
});

bancada.querySelector('[data-estreito]').addEventListener('change', (e) => {
  site.classList.toggle('is-estreito', e.target.checked);
  definirMenu(false);
  registrar(e.target.checked
    ? 'Largura de celular: os links foram para trás do botão “Menu” (aria-expanded="false").'
    : 'Largura de desktop: todos os links à vista.');
});
