// Botão de tema: alterna sistema → claro → escuro e lembra a escolha.
import { anunciar } from './anunciar.js';

const ORDEM = ['system', 'light', 'dark'];
const ROTULOS = { system: 'sistema', light: 'claro', dark: 'escuro' };

function lerTema() {
  try {
    const salvo = localStorage.getItem('tema');
    return ORDEM.includes(salvo) ? salvo : 'system';
  } catch {
    return 'system';
  }
}

function aplicar(tema, botao) {
  const raiz = document.documentElement;
  if (tema === 'system') raiz.removeAttribute('data-theme');
  else raiz.setAttribute('data-theme', tema);

  botao.querySelector('[data-tema-rotulo]').textContent = ROTULOS[tema];
  botao.querySelectorAll('[data-tema-icone]').forEach((el) => {
    el.hidden = el.dataset.temaIcone !== tema;
  });
}

export function iniciarTema() {
  const botao = document.querySelector('[data-tema-btn]');
  if (!botao) return;
  let tema = lerTema();
  aplicar(tema, botao);

  botao.addEventListener('click', () => {
    tema = ORDEM[(ORDEM.indexOf(tema) + 1) % ORDEM.length];
    aplicar(tema, botao);
    try {
      if (tema === 'system') localStorage.removeItem('tema');
      else localStorage.setItem('tema', tema);
    } catch {
      /* sem armazenamento: vale só para esta visita */
    }
    anunciar(`Tema ${ROTULOS[tema]}`);
  });
}
