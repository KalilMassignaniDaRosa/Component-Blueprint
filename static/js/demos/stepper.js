// Demo de stepper: avançar com validação, voltar sem perder dados,
// aria-current="step" e foco no título de cada etapa.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-stepper]');
const registrar = registrador(bancada);
const etapas = [...bancada.querySelectorAll('.stepper__etapa')];
const titulo = bancada.querySelector('[data-etapa-titulo]');
const corpos = [...bancada.querySelectorAll('[data-etapa]')];
const voltar = bancada.querySelector('[data-voltar]');
const avancar = bancada.querySelector('[data-avancar]');
const email = bancada.querySelector('[data-email]');
const erro = bancada.querySelector('[data-erro]');

const NOMES = etapas.map((e) => e.querySelector('.stepper__nome').textContent);
let atual = 0;

function mostrar(indice, { focar = true } = {}) {
  atual = indice;
  etapas.forEach((etapa, i) => {
    const feita = i < atual;
    etapa.classList.toggle('is-feita', feita);
    if (i === atual) etapa.setAttribute('aria-current', 'step');
    else etapa.removeAttribute('aria-current');
    etapa.querySelector('.stepper__marca').textContent = feita ? '✓' : String(i + 1);
    etapa.querySelector('.stepper__estado').textContent = feita ? 'concluída' : i === atual ? 'atual' : 'pendente';
  });
  corpos.forEach((c) => (c.hidden = Number(c.dataset.etapa) !== atual));
  titulo.textContent = `Etapa ${atual + 1} de ${NOMES.length}: ${NOMES[atual]}`;
  voltar.disabled = atual === 0;
  avancar.querySelector('[data-rotulo]').textContent = atual === NOMES.length - 1 ? 'Concluir pedido' : 'Avançar';
  if (focar) titulo.focus(); // o leitor de tela lê "Etapa 2 de 4: Entrega"
}

function validarEmail() {
  const ok = /^\S+@\S+\.\S+$/.test(email.value.trim());
  email.setAttribute('aria-invalid', String(!ok));
  erro.hidden = ok;
  return ok;
}

avancar.addEventListener('click', () => {
  if (atual === 0 && !validarEmail()) {
    etapas[0].classList.add('is-erro');
    email.focus();
    registrar('Não avançou: o e-mail está vazio ou inválido. O foco foi para o campo.');
    return;
  }
  etapas[0].classList.remove('is-erro');
  if (atual === NOMES.length - 1) {
    registrar('Pedido concluído! (simulação)');
    return;
  }
  mostrar(atual + 1);
  registrar(`Avançou para a etapa ${atual + 1}.`);
});

voltar.addEventListener('click', () => {
  mostrar(atual - 1);
  registrar(`Voltou para a etapa ${atual + 1}. O que já foi preenchido continua lá.`);
});

// Revalida enquanto a pessoa digita (e não no blur): se o erro sumisse no blur,
// o layout subiria no meio do clique em "Avançar" e o clique se perderia.
email.addEventListener('input', () => {
  if (email.getAttribute('aria-invalid') === 'true') validarEmail();
});

mostrar(0, { focar: false });
