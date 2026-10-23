// Date picker: campo de texto (dd/mm/aaaa) + calendário em <dialog> com grade navegável.
// Teclado na grade: setas (dia/semana), Page Up/Down (mês), Home/End (início/fim da semana),
// Enter/Espaço (escolher), Esc (fechar, nativo do <dialog>).
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-data]');
const registrar = registrador(bancada);
const texto = bancada.querySelector('[data-texto]');
const erro = bancada.querySelector('[data-erro]');
const abrir = bancada.querySelector('[data-abrir]');
const dialogo = bancada.querySelector('[data-calendario]');
const tituloMes = bancada.querySelector('[data-titulo-mes]');
const corpo = bancada.querySelector('[data-dias]');

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);

let selecionada = null; // Date escolhida
let foco = new Date(hoje); // dia sob o cursor do teclado

const mesmoDia = (a, b) => a && b && a.toDateString() === b.toDateString();
const fimDeSemana = (d) => d.getDay() === 0 || d.getDay() === 6;
const formatar = (d) => d.toLocaleDateString('pt-BR');
const porExtenso = (d) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function somarDias(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function somarMeses(d, n) {
  const r = new Date(d);
  const dia = r.getDate();
  r.setDate(1);
  r.setMonth(r.getMonth() + n);
  // 31/jan + 1 mês = último dia de fevereiro, não 3 de março
  r.setDate(Math.min(dia, new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate()));
  return r;
}

function desenhar() {
  tituloMes.textContent = `${MESES[foco.getMonth()]} de ${foco.getFullYear()}`;
  const primeiro = new Date(foco.getFullYear(), foco.getMonth(), 1);
  let dia = somarDias(primeiro, -primeiro.getDay()); // começa no domingo da 1ª semana
  const linhas = [];
  for (let semana = 0; semana < 6; semana++) {
    const tr = document.createElement('tr');
    for (let d = 0; d < 7; d++) {
      const td = document.createElement('td');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dia';
      b.textContent = dia.getDate();
      b.dataset.data = dia.toISOString();
      b.setAttribute('aria-label', porExtenso(dia) + (mesmoDia(dia, hoje) ? ', hoje' : ''));
      b.tabIndex = mesmoDia(dia, foco) ? 0 : -1;
      if (dia.getMonth() !== foco.getMonth()) b.classList.add('dia--fora');
      if (mesmoDia(dia, hoje)) b.classList.add('dia--hoje');
      if (mesmoDia(dia, selecionada)) b.setAttribute('aria-selected', 'true');
      if (fimDeSemana(dia)) b.setAttribute('aria-disabled', 'true');
      td.append(b);
      tr.append(td);
      dia = somarDias(dia, 1);
    }
    linhas.push(tr);
  }
  corpo.replaceChildren(...linhas);
}

function focarDia(d) {
  const mudouMes = d.getMonth() !== foco.getMonth() || d.getFullYear() !== foco.getFullYear();
  foco = d;
  if (mudouMes) desenhar();
  corpo.querySelectorAll('.dia').forEach((b) => {
    const atual = mesmoDia(new Date(b.dataset.data), foco);
    b.tabIndex = atual ? 0 : -1;
    if (atual) b.focus();
  });
}

function escolher(d) {
  if (fimDeSemana(d)) {
    registrar(`${porExtenso(d)} está indisponível (fim de semana).`);
    return;
  }
  selecionada = d;
  texto.value = formatar(d);
  definirErro('');
  dialogo.close();
  registrar(`Escolhida: ${porExtenso(d)}. O foco voltou para o botão do calendário.`);
}

function definirErro(msg) {
  erro.hidden = !msg;
  erro.textContent = msg;
  texto.setAttribute('aria-invalid', String(Boolean(msg)));
}

abrir.addEventListener('click', () => {
  foco = new Date(selecionada || hoje);
  desenhar();
  dialogo.showModal();
  focarDia(foco); // o foco vai para o dia selecionado (ou hoje)
});

dialogo.addEventListener('close', () => abrir.focus());
dialogo.querySelector('[data-fechar]').addEventListener('click', () => dialogo.close());
dialogo.addEventListener('click', (e) => {
  if (e.target === dialogo) dialogo.close(); // clique no fundo
});
dialogo.querySelectorAll('[data-mes]').forEach((b) =>
  b.addEventListener('click', () => {
    foco = somarMeses(foco, Number(b.dataset.mes));
    desenhar();
  })
);

corpo.addEventListener('click', (e) => {
  const b = e.target.closest('.dia');
  if (b) escolher(new Date(b.dataset.data));
});

corpo.addEventListener('keydown', (e) => {
  const mover = {
    ArrowRight: () => somarDias(foco, 1),
    ArrowLeft: () => somarDias(foco, -1),
    ArrowDown: () => somarDias(foco, 7),
    ArrowUp: () => somarDias(foco, -7),
    PageDown: () => somarMeses(foco, e.shiftKey ? 12 : 1),
    PageUp: () => somarMeses(foco, e.shiftKey ? -12 : -1),
    Home: () => somarDias(foco, -foco.getDay()),
    End: () => somarDias(foco, 6 - foco.getDay()),
  }[e.key];
  if (mover) {
    e.preventDefault();
    focarDia(mover());
  }
});

// Digitar também vale: valida ao sair do campo
texto.addEventListener('blur', () => {
  const v = texto.value.trim();
  if (!v) return definirErro('');
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const d = m && new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  if (!d || d.getDate() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1) {
    definirErro('Data inválida. Use dd/mm/aaaa, por exemplo 15/03/2027.');
  } else if (fimDeSemana(d)) {
    definirErro('Escolha um dia útil: não fazemos visitas no fim de semana.');
  } else {
    selecionada = d;
    definirErro('');
    registrar(`Data digitada aceita: ${porExtenso(d)}.`);
  }
});
