// Demo de popover com o atributo nativo `popover`.
// O navegador já cuida de: abrir/fechar pelo botão (popovertarget), clique fora, Esc
// e aria-expanded no botão. Aqui só posicionamos o painel e cuidamos do foco.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-popover]');
const registrar = registrador(bancada);
const resumo = bancada.querySelector('[data-resumo-filtro]');

// Posiciona o popover logo abaixo do botão que o abriu, sem sair da tela
function posicionar(pop, gatilho) {
  const r = gatilho.getBoundingClientRect();
  const largura = pop.offsetWidth;
  const esquerda = Math.min(Math.max(8, r.right - largura), window.innerWidth - largura - 8);
  const cabeEmbaixo = r.bottom + pop.offsetHeight + 8 < window.innerHeight;
  pop.style.left = `${esquerda}px`;
  pop.style.top = `${cabeEmbaixo ? r.bottom + 6 : r.top - pop.offsetHeight - 6}px`;
}

bancada.querySelectorAll('[popover]').forEach((pop) => {
  const gatilho = bancada.querySelector(`[data-gatilho][popovertarget="${pop.id}"]`);

  pop.addEventListener('toggle', (e) => {
    if (e.newState === 'open') {
      posicionar(pop, gatilho);
      pop.querySelector('input, button')?.focus(); // foco vai para dentro
      registrar(`Popover “${gatilho.textContent.trim()}” aberto; o botão agora expõe aria-expanded="true".`);
    } else {
      // Se o foco ficou "perdido" (no body), devolve ao botão
      if (!document.activeElement || document.activeElement === document.body || pop.contains(document.activeElement)) {
        gatilho.focus();
      }
      registrar('Popover fechado; o foco voltou para o botão.');
    }
  });
});

// Reposiciona se a janela mudar de tamanho ou a página rolar
['resize', 'scroll'].forEach((evento) =>
  window.addEventListener(evento, () => {
    bancada.querySelectorAll('[popover]').forEach((pop) => {
      if (pop.matches(':popover-open')) {
        posicionar(pop, bancada.querySelector(`[data-gatilho][popovertarget="${pop.id}"]`));
      }
    });
  }, { passive: true })
);

bancada.querySelector('[data-aplicar]').addEventListener('click', () => {
  const cores = [...bancada.querySelectorAll('[data-cor]:checked')].map((c) => c.value);
  resumo.textContent = cores.length ? `Mostrando: ${cores.join(', ')}` : 'Mostrando: todas as cores';
  bancada.querySelector('#pop-filtros').hidePopover();
});

const copiarLink = bancada.querySelector('[data-copiar-link]');
copiarLink.addEventListener('click', async () => {
  const campo = bancada.querySelector('#pop-link');
  try {
    await navigator.clipboard.writeText(campo.value);
    copiarLink.lastChild.textContent = ' Copiado!';
    registrar('Link copiado.');
  } catch {
    campo.select(); // sem permissão: deixa selecionado para Ctrl+C
    registrar('Não foi possível copiar automaticamente; o link ficou selecionado.');
  }
});
