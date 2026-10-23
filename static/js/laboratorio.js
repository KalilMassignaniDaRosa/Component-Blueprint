// Ajusta a altura de cada iframe do laboratório ao conteúdo dele, para o frame
// não ter barra de rolagem própria.
//
// Os frames rodam em origem opaca (sandbox sem allow-same-origin), então a
// mensagem chega com origin "null" e não dá para confiar nela. A checagem que
// vale é event.source: só aceitamos mensagens vindas de um dos nossos iframes,
// e só um número dentro de limites razoáveis.
const frames = [...document.querySelectorAll('iframe[data-lab]')];
// O mínimo garante espaço para o modal, que abre dentro do frame.
const MIN = 340;
const MAX = 2000;

// Com link direto (/laboratorio#lib-pico), os frames acima do alvo crescem
// depois de carregar e empurram a seção para baixo. Até a pessoa interagir,
// a página volta para o alvo a cada ajuste de altura.
const alvo = location.hash && document.getElementById(location.hash.slice(1));
let seguirAlvo = Boolean(alvo);
for (const tipo of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
  window.addEventListener(tipo, () => { seguirAlvo = false; }, { once: true, passive: true });
}

window.addEventListener('message', (evento) => {
  const frame = frames.find((f) => f.contentWindow === evento.source);
  if (!frame || evento.data?.tipo !== 'lab-altura') return;
  const altura = Number(evento.data.altura);
  if (!Number.isFinite(altura)) return;
  frame.style.height = `${Math.min(Math.max(altura, MIN), MAX)}px`;
  if (seguirAlvo) alvo.scrollIntoView();
});
