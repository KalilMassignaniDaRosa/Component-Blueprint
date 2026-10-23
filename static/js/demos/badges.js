// Demo de badges/tags: contador com nome acessível completo e tags removíveis
// com foco indo para a próxima tag.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-badges]');
const registrar = registrador(bancada);
const sino = bancada.querySelector('[data-sino]');
const contador = bancada.querySelector('[data-contador]');
const tags = bancada.querySelector('[data-tags]');
const semFiltros = bancada.querySelector('[data-sem-filtros]');
let naoLidas = 3;

function atualizarContador() {
  contador.textContent = naoLidas > 9 ? '9+' : String(naoLidas);
  contador.hidden = naoLidas === 0;
  // o número visual é aria-hidden; o botão carrega a frase completa
  sino.setAttribute('aria-label', naoLidas ? `Notificações, ${naoLidas} não lidas` : 'Notificações, nenhuma não lida');
}

bancada.querySelector('[data-nova]').addEventListener('click', () => {
  naoLidas += 1;
  atualizarContador();
  registrar(`Nova notificação: o botão agora se chama “${sino.getAttribute('aria-label')}”.`);
});

sino.addEventListener('click', () => {
  naoLidas = 0;
  atualizarContador();
  registrar('Notificações lidas: o contador sumiu.');
});

tags.addEventListener('click', (e) => {
  const botao = e.target.closest('[data-remover]');
  if (!botao) return;
  const li = botao.closest('li');
  const destino = li.nextElementSibling || li.previousElementSibling;
  const nome = li.firstChild.textContent.trim();
  li.remove();
  if (destino) {
    destino.querySelector('[data-remover]').focus();
  } else {
    semFiltros.hidden = false;
    semFiltros.focus();
  }
  registrar(`Filtro “${nome}” removido.${destino ? ' O foco foi para a próxima tag.' : ' Nenhum filtro restante.'}`);
});
