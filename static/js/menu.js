// Menu móvel da navbar: botão com aria-expanded que mostra/esconde a navegação.
export function iniciarMenu() {
  const botao = document.querySelector('[data-menu-btn]');
  const nav = botao && document.getElementById(botao.getAttribute('aria-controls'));
  if (!nav) return;

  function definir(aberto) {
    botao.setAttribute('aria-expanded', String(aberto));
    nav.classList.toggle('is-aberto', aberto);
  }

  botao.addEventListener('click', () => {
    definir(botao.getAttribute('aria-expanded') !== 'true');
  });

  // Esc fecha o menu e devolve o foco ao botão
  nav.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
      definir(false);
      botao.focus();
    }
  });
}
