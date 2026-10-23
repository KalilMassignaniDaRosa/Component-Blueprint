// Tabs acessíveis seguindo o padrão WAI-ARIA APG.
// Uso: <div data-tabs> com [role=tablist] > [role=tab] e [role=tabpanel].
// Ativação manual: adicione data-ativacao="manual" na raiz (pode mudar em tempo real).

export function iniciarTabs(raiz) {
  const lista = raiz.querySelector('[role="tablist"]');
  // Só as abas diretas desta lista (permite tabs aninhadas sem conflito)
  const abas = [...lista.querySelectorAll(':scope > [role="tab"]')];
  const habilitada = (aba) => aba.getAttribute('aria-disabled') !== 'true';

  function selecionar(aba) {
    if (!habilitada(aba)) return;
    for (const a of abas) {
      const ativa = a === aba;
      a.setAttribute('aria-selected', String(ativa));
      a.tabIndex = ativa ? 0 : -1; // tabindex itinerante: só a ativa entra no Tab
      const painel = document.getElementById(a.getAttribute('aria-controls'));
      if (painel) painel.hidden = !ativa;
    }
  }

  lista.addEventListener('keydown', (e) => {
    const i = abas.indexOf(document.activeElement);
    if (i < 0) return;
    const n = abas.length;
    const destino = {
      ArrowRight: abas[(i + 1) % n],
      ArrowLeft: abas[(i - 1 + n) % n],
      Home: abas[0],
      End: abas[n - 1],
    }[e.key];
    if (!destino) return;

    e.preventDefault();
    // A aba desabilitada recebe foco (para ser descoberta), mas não é ativada.
    abas.forEach((a) => (a.tabIndex = a === destino ? 0 : -1));
    destino.focus();
    if (raiz.dataset.ativacao !== 'manual') selecionar(destino);
  });

  // Clique, Enter e Espaço disparam "click" porque cada aba é um <button>.
  abas.forEach((a) => a.addEventListener('click', () => selecionar(a)));

  // Se o foco sair da lista sem ativar (modo manual), o Tab volta a parar na aba ativa.
  lista.addEventListener('focusout', (e) => {
    if (lista.contains(e.relatedTarget)) return;
    abas.forEach((a) => (a.tabIndex = a.getAttribute('aria-selected') === 'true' ? 0 : -1));
  });
}
