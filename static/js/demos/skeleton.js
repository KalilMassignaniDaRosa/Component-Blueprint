// Demo de skeleton: os blocos reservam o espaço; o conteúdo real entra no mesmo
// lugar, com aria-busy no contêiner e anúncio de início e fim.
import { registrador, esperar } from './_comum.js';

const bancada = document.querySelector('[data-demo-skeleton]');
const registrar = registrador(bancada);
const lista = bancada.querySelector('[data-lista]');
const status = bancada.querySelector('[data-status]');
const modelo = bancada.querySelector('template[data-modelo-esqueleto]');
const botao = bancada.querySelector('[data-recarregar]');

const EQUIPE = [
  ['Ana Moura', 'Design'],
  ['Bruno Lima', 'Engenharia'],
  ['Carla Dias', 'Pesquisa'],
  ['Davi Rocha', 'Produto'],
];

function iniciais(nome) {
  return nome.split(' ').map((p) => p[0]).join('');
}

async function carregar() {
  botao.setAttribute('aria-disabled', 'true');
  lista.setAttribute('aria-busy', 'true');
  status.textContent = 'Carregando equipe…';
  lista.replaceChildren(...EQUIPE.map(() => modelo.content.cloneNode(true)));
  const altura = lista.offsetHeight;

  await esperar(1600);

  lista.replaceChildren(
    ...EQUIPE.map(([nome, cargo]) => {
      const li = document.createElement('li');
      li.className = 'perfil';
      const avatar = document.createElement('span');
      avatar.className = 'perfil__avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = iniciais(nome);
      const linhas = document.createElement('span');
      linhas.className = 'perfil__linhas';
      const n = document.createElement('span');
      n.className = 'perfil__nome';
      n.textContent = nome;
      const c = document.createElement('span');
      c.className = 'perfil__cargo';
      c.textContent = cargo;
      linhas.append(n, c);
      li.append(avatar, linhas);
      return li;
    })
  );
  lista.setAttribute('aria-busy', 'false');
  botao.removeAttribute('aria-disabled');
  status.textContent = `${EQUIPE.length} pessoas carregadas.`;
  const salto = lista.offsetHeight - altura;
  registrar(`Conteúdo carregado. Variação de altura: ${salto} px (o espaço já estava reservado).`);
}

botao.addEventListener('click', () => {
  if (botao.getAttribute('aria-disabled') !== 'true') carregar();
});
carregar();
