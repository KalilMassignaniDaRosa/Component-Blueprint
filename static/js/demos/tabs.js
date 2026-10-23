// Demo de tabs: a lógica vem de ../tabs.js (iniciada em main.js).
// Aqui só alternamos o modo de ativação e registramos o que cada tecla fez.
// Estes listeners são registrados DEPOIS dos de tabs.js (main.js carrega antes),
// então quando rodam o foco e a seleção já foram atualizados.
const bancada = document.querySelector('[data-demo-tabs]');
const tabs = bancada.querySelector('[data-tabs]');
const lista = tabs.querySelector('[role="tablist"]');
const registro = bancada.querySelector('[data-registro]');

const SETAS = { ArrowRight: '→', ArrowLeft: '←', Home: 'Home', End: 'End' };
const manual = () => tabs.dataset.ativacao === 'manual';

bancada.querySelector('[data-modo-manual]').addEventListener('change', (e) => {
  tabs.dataset.ativacao = e.target.checked ? 'manual' : 'automatica';
  registro.textContent = e.target.checked
    ? 'Modo manual: as setas só movem o foco; Enter ou Espaço ativam a aba.'
    : 'Modo automático: focar uma aba já a ativa.';
});

lista.addEventListener('keydown', (e) => {
  const tecla = SETAS[e.key];
  if (!tecla) return;
  const aba = document.activeElement;
  const nome = aba.textContent.trim();
  let efeito = 'painel exibido';
  if (aba.getAttribute('aria-disabled') === 'true') efeito = 'desabilitada: recebe foco, mas não abre';
  else if (manual()) efeito = 'aperte Enter ou Espaço para abrir';
  registro.textContent = `${tecla} → foco em “${nome}” · ${efeito}`;
});

// Clique, Enter e Espaço chegam como "click"
lista.addEventListener('click', (e) => {
  const aba = e.target.closest('[role="tab"]');
  if (!aba) return;
  const nome = aba.textContent.trim();
  registro.textContent =
    aba.getAttribute('aria-disabled') === 'true'
      ? `“${nome}” está desabilitada: nada acontece, mas ela continua descobrível.`
      : `Ativou “${nome}” → painel exibido`;
});
