// Índice "Nesta prancha": marca a seção atual com aria-current="location".
// A seção atual é a última cujo topo já passou de uma linha a 30% da altura da tela.
export function iniciarIndice() {
  const indice = document.querySelector('[data-indice]');
  if (!indice) return;

  const itens = [...indice.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, secao: document.getElementById(link.hash.slice(1)) }))
    .filter((item) => item.secao);
  let agendado = false;

  function atualizar() {
    agendado = false;
    const linha = window.innerHeight * 0.3;
    let atual = itens[0];
    for (const item of itens) {
      if (item.secao.getBoundingClientRect().top <= linha) atual = item;
    }
    // No fim da página, a última seção pode nunca alcançar a linha
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      atual = itens[itens.length - 1];
    }
    for (const item of itens) {
      if (item === atual) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
  }

  // requestAnimationFrame: no máximo um cálculo por quadro durante a rolagem
  window.addEventListener('scroll', () => {
    if (!agendado) {
      agendado = true;
      requestAnimationFrame(atualizar);
    }
  }, { passive: true });
  atualizar();
}
