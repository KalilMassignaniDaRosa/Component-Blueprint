// Menu dropdown seguindo o padrão "Menu Button" da WAI-ARIA APG.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-dropdown]');
const registrar = registrador(bancada);
const raiz = bancada.querySelector('[data-menu-botao]');
const botao = raiz.querySelector('[aria-haspopup="menu"]');
const menu = raiz.querySelector('[role="menu"]');
const itens = [...menu.querySelectorAll('[role="menuitem"]')];

const aberto = () => botao.getAttribute('aria-expanded') === 'true';

function focar(item) {
  itens.forEach((i) => (i.tabIndex = i === item ? 0 : -1)); // tabindex itinerante
  item.focus();
}

function abrir(foco = 'primeiro') {
  menu.hidden = false;
  botao.setAttribute('aria-expanded', 'true');
  focar(foco === 'ultimo' ? itens[itens.length - 1] : itens[0]);
}

function fechar({ devolverFoco = true } = {}) {
  menu.hidden = true;
  botao.setAttribute('aria-expanded', 'false');
  if (devolverFoco) botao.focus();
}

function escolher(item) {
  const nome = item.textContent.replace(/\s+/g, ' ').trim();
  if (item.getAttribute('aria-disabled') === 'true') {
    registrar(`“${nome}” está desabilitado: o item aparece para que você saiba que existe.`);
    return;
  }
  fechar();
  registrar(`Escolheu “${nome}”. O menu fechou e o foco voltou para “Ações”.`);
}

botao.addEventListener('click', () => (aberto() ? fechar() : abrir()));
botao.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    abrir('primeiro');
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    abrir('ultimo');
  }
});

menu.addEventListener('keydown', (e) => {
  const i = itens.indexOf(document.activeElement);
  const n = itens.length;
  const destino = {
    ArrowDown: itens[(i + 1) % n],
    ArrowUp: itens[(i - 1 + n) % n],
    Home: itens[0],
    End: itens[n - 1],
  }[e.key];

  if (destino) {
    e.preventDefault();
    focar(destino);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    fechar();
    registrar('Esc fechou o menu e devolveu o foco ao botão.');
  } else if (e.key === 'Tab') {
    fechar({ devolverFoco: false }); // Tab segue a ordem normal da página
  } else if (e.key.length === 1 && /\S/.test(e.key)) {
    // Busca por letra: pula para o próximo item que começa com ela
    const letra = e.key.toLowerCase();
    const ordem = [...itens.slice(i + 1), ...itens.slice(0, i + 1)];
    const alvo = ordem.find((item) => item.textContent.trim().toLowerCase().startsWith(letra));
    if (alvo) focar(alvo);
  }
});

itens.forEach((item) => item.addEventListener('click', () => escolher(item)));

// Clique fora fecha sem roubar o foco do que foi clicado
document.addEventListener('click', (e) => {
  if (aberto() && !raiz.contains(e.target)) fechar({ devolverFoco: false });
});
