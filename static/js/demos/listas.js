// Demo de lista com ações: ao remover um item, o foco vai para o próximo
// (ou o anterior, se era o último). Há "Desfazer" e estado vazio.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-listas]');
const registrar = registrador(bancada);
const lista = bancada.querySelector('[data-lista]');
const vazio = bancada.querySelector('[data-vazio]');
const caixaDesfazer = bancada.querySelector('[data-desfazer-caixa]');
const textoDesfazer = bancada.querySelector('[data-desfazer-texto]');
const botaoDesfazer = bancada.querySelector('[data-desfazer]');
const originais = [...lista.children];

let ultimo = null; // { item, proximo } para poder desfazer

function nomeDe(li) {
  return li.querySelector('.lista-itens__nome').textContent;
}

function atualizarVazio() {
  const semItens = lista.children.length === 0;
  lista.hidden = semItens;
  vazio.hidden = !semItens;
  return semItens;
}

lista.addEventListener('click', (e) => {
  const botao = e.target.closest('[data-remover]');
  if (!botao) return;
  const li = botao.closest('li');
  const destino = li.nextElementSibling || li.previousElementSibling;
  ultimo = { item: li, proximo: li.nextElementSibling };
  li.remove();

  textoDesfazer.textContent = `“${nomeDe(li)}” removido.`;
  caixaDesfazer.hidden = false;

  if (atualizarVazio()) {
    vazio.focus();
    registrar(`“${nomeDe(li)}” removido. A lista ficou vazia; o foco foi para a mensagem.`);
  } else {
    destino.querySelector('[data-remover]').focus();
    registrar(`“${nomeDe(li)}” removido. Foco em “${destino.querySelector('[data-remover]').getAttribute('aria-label')}”.`);
  }
});

botaoDesfazer.addEventListener('click', () => {
  if (!ultimo) return;
  lista.insertBefore(ultimo.item, ultimo.proximo?.isConnected ? ultimo.proximo : null);
  atualizarVazio();
  ultimo.item.querySelector('[data-remover]').focus();
  registrar(`“${nomeDe(ultimo.item)}” restaurado.`);
  ultimo = null;
  caixaDesfazer.hidden = true;
});

bancada.querySelector('[data-restaurar]').addEventListener('click', () => {
  lista.replaceChildren(...originais);
  atualizarVazio();
  caixaDesfazer.hidden = true;
  lista.querySelector('[data-remover]').focus();
  registrar('Todos os arquivos restaurados.');
});
