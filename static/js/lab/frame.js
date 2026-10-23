// Script comum aos frames do laboratório. Roda dentro do iframe com sandbox,
// em origem opaca: não enxerga nada da página do guia.
//
// Faz três coisas que nem toda biblioteca traz:
//  1. avisa a página do laboratório da altura do conteúdo;
//  2. abre e fecha modais por atributo: [data-abrir="id"] e [data-fechar];
//  3. liga tabs feitas à mão: [data-lab-tabs] com role="tablist"/"tab"/"tabpanel".
(() => {
  // 1. ALTURA ---------------------------------------------------------------
  // Só um número sai do frame; por isso o destino pode ser '*'.
  const grade = document.querySelector('.lab-grade');
  const avisarAltura = () => {
    const estilo = getComputedStyle(document.body);
    const altura = grade.offsetTop + grade.offsetHeight + parseFloat(estilo.paddingBottom || 0);
    parent.postMessage({ tipo: 'lab-altura', altura: Math.ceil(altura) }, '*');
  };
  new ResizeObserver(avisarAltura).observe(grade);
  addEventListener('load', avisarAltura);

  // 2. MODAL ----------------------------------------------------------------
  const conteudo = document.querySelector('main');
  let quemAbriu = null;

  function abrir(alvo) {
    if (alvo instanceof HTMLDialogElement) alvo.showModal();
    else if (typeof alvo.show === 'function') alvo.show(); // Fluent
    else if ('open' in alvo) alvo.open = true; // Web Awesome
    else {
      // Bulma: só CSS. O resto da página fica inerte e o foco entra no modal.
      quemAbriu = document.activeElement;
      alvo.classList.add('is-active');
      conteudo.inert = true;
      alvo.querySelector('button')?.focus();
    }
  }

  function fechar(alvo) {
    if (alvo instanceof HTMLDialogElement) alvo.close();
    else if (typeof alvo.hide === 'function') alvo.hide();
    else if ('open' in alvo) alvo.open = false;
    else {
      alvo.classList.remove('is-active');
      conteudo.inert = false;
      quemAbriu?.focus();
    }
  }

  document.addEventListener('click', (e) => {
    const gatilho = e.target.closest('[data-abrir]');
    if (gatilho) {
      const alvo = document.getElementById(gatilho.dataset.abrir);
      if (alvo) abrir(alvo);
      return;
    }
    if (e.target.closest('[data-fechar]')) {
      const alvo = e.target.closest('dialog, wa-dialog, fluent-dialog, .modal');
      if (alvo) fechar(alvo);
    }
  });

  document.addEventListener('keydown', (e) => {
    const aberto = document.querySelector('.modal.is-active');
    if (e.key === 'Escape' && aberto) fechar(aberto);
  });

  // 3. TABS -----------------------------------------------------------------
  // Ativação automática: setas mudam a tab e o painel juntos.
  // data-ativa / data-inativa no tablist: classes da biblioteca para cada estado
  // (no Bulma a classe vai no <li> pai da tab).
  for (const raiz of document.querySelectorAll('[data-lab-tabs]')) {
    const lista = raiz.querySelector('[role="tablist"]');
    const abas = [...lista.querySelectorAll('[role="tab"]')];
    const { ativa, inativa } = lista.dataset;

    const selecionar = (aba) => {
      for (const a of abas) {
        const sim = a === aba;
        a.setAttribute('aria-selected', String(sim));
        a.tabIndex = sim ? 0 : -1;
        const portador = a.parentElement.tagName === 'LI' ? a.parentElement : a;
        if (ativa) portador.classList.toggle(ativa, sim);
        if (inativa) a.classList.toggle(inativa, !sim);
        document.getElementById(a.getAttribute('aria-controls')).hidden = !sim;
      }
    };

    lista.addEventListener('click', (e) => {
      const aba = e.target.closest('[role="tab"]');
      if (aba) selecionar(aba);
    });

    lista.addEventListener('keydown', (e) => {
      const atual = abas.indexOf(document.activeElement);
      if (atual < 0) return;
      const destino = {
        ArrowRight: (atual + 1) % abas.length,
        ArrowLeft: (atual - 1 + abas.length) % abas.length,
        Home: 0,
        End: abas.length - 1,
      }[e.key];
      if (destino === undefined) return;
      e.preventDefault();
      selecionar(abas[destino]);
      abas[destino].focus();
    });
  }
})();
