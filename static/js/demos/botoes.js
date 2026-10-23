// Demo de botões: carregamento, aria-disabled e visualização dos alvos de toque.
const raiz = document.querySelector('[data-demo-botoes]');
const area = raiz.querySelector('[data-area]');
const registro = raiz.querySelector('[data-registro]');

function registrar(texto) {
  registro.textContent = texto;
}

// Liga/desliga o contorno dos alvos de toque (Lei de Fitts na prática)
raiz.querySelector('[data-alvos]').addEventListener('change', (e) => {
  area.classList.toggle('mostrar-alvos', e.target.checked);
});

// Salvar: estado de carregamento acessível
const salvar = raiz.querySelector('[data-salvar]');
const rotuloSalvar = salvar.querySelector('[data-rotulo]');
salvar.addEventListener('click', async (e) => {
  e.stopPropagation();
  if (salvar.getAttribute('aria-disabled') === 'true') return; // evita clique duplo

  salvar.setAttribute('aria-disabled', 'true');
  salvar.setAttribute('aria-busy', 'true');
  rotuloSalvar.textContent = 'Salvando…';
  registrar('Salvando… (o botão continua focável, mas ignora cliques repetidos)');

  await new Promise((r) => setTimeout(r, 1400));

  salvar.removeAttribute('aria-busy');
  salvar.removeAttribute('aria-disabled');
  rotuloSalvar.textContent = 'Salvar alterações';
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  registrar(`Alterações salvas às ${hora}.`);
});

// aria-disabled: o botão recebe foco e o clique explica o motivo
raiz.querySelector('[data-publicar]').addEventListener('click', (e) => {
  e.stopPropagation();
  registrar('“Publicar” está bloqueado: o projeto precisa de um título. (Um botão com disabled não daria essa chance.)');
});

raiz.querySelector('[data-excluir]').addEventListener('click', (e) => {
  e.stopPropagation();
  registrar('Ação destrutiva: aqui deveria abrir uma confirmação. Veja a prancha Modal / Dialog.');
});

// Demais botões: mostra o nome acessível de cada um (útil para os botões só de ícone)
area.addEventListener('click', (e) => {
  const botao = e.target.closest('button');
  if (!botao || botao.disabled) return;
  const nome = botao.getAttribute('aria-label') || botao.textContent.trim();
  registrar(`Clicou em “${nome}”. É assim que o leitor de tela chama este botão.`);
});
