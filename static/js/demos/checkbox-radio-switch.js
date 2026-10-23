// Demo de checkbox, radio e switch.
// - "Todas" fica indeterminado quando só alguns itens estão marcados
// - os switches aplicam o efeito na hora (sem botão Salvar)
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-escolhas]');
const registrar = registrador(bancada);
const todos = bancada.querySelector('[data-todos]');
const itens = [...bancada.querySelectorAll('[data-item]')];

function sincronizarTodos() {
  const marcados = itens.filter((i) => i.checked).length;
  todos.checked = marcados === itens.length;
  // indeterminate só existe via JS (não há atributo HTML para ele)
  todos.indeterminate = marcados > 0 && marcados < itens.length;
  return marcados;
}

todos.addEventListener('change', () => {
  itens.forEach((i) => (i.checked = todos.checked));
  sincronizarTodos();
  registrar(todos.checked ? 'Todas as notificações marcadas.' : 'Todas as notificações desmarcadas.');
});

itens.forEach((item) =>
  item.addEventListener('change', () => {
    const n = sincronizarTodos();
    registrar(`${n} de ${itens.length} marcadas${todos.indeterminate ? ': “Todas” está indeterminado (misto)' : ''}.`);
  })
);

bancada.querySelectorAll('input[name="frete"]').forEach((radio) =>
  radio.addEventListener('change', () => registrar(`Frete escolhido: ${radio.value}. Os outros radios do grupo foram desmarcados.`))
);

const compacto = bancada.querySelector('[data-compacto]');
const imagens = bancada.querySelector('[data-imagens]');
const previa = bancada.querySelector('[data-previa]');
function atualizarPrevia() {
  previa.textContent = `Prévia: espaçamento ${compacto.checked ? 'compacto' : 'normal'}, ${imagens.checked ? 'com' : 'sem'} imagens.`;
}
[compacto, imagens].forEach((s) =>
  s.addEventListener('change', () => {
    atualizarPrevia();
    registrar('Switch: o efeito foi aplicado na hora, sem precisar salvar.');
  })
);

sincronizarTodos();
// Especime "indeterminado" da seção Estados
const especime = document.querySelector('[data-indeterminado-especime]');
if (especime) especime.indeterminate = true;
