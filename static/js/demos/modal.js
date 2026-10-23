// Demo de modal com <dialog> nativo: confirmação destrutiva, erro, desfazer
// e gestão de foco ao abrir e fechar.
const raiz = document.querySelector('[data-demo-modal]');
const dialogo = raiz.querySelector('[data-dialogo]');
const abrir = raiz.querySelector('[data-abrir]');
const projeto = raiz.querySelector('[data-projeto]');
const resultado = raiz.querySelector('[data-resultado]');
const desfazer = raiz.querySelector('[data-desfazer]');
const erro = dialogo.querySelector('[data-erro]');
const confirmar = dialogo.querySelector('[data-confirmar]');
const rotuloConfirmar = confirmar.querySelector('[data-rotulo]');
const simularFalha = raiz.querySelector('[data-simular-falha]');
const registro = raiz.querySelector('[data-registro]');

const COMO_FECHOU = {
  cancelar: 'botão Cancelar',
  fechar: 'botão ✕ (aria-label="Fechar")',
  esc: 'tecla Esc',
  fora: 'clique fora do diálogo',
  excluir: 'confirmação',
};

let ocupado = false;
let viaEsc = false;

function definirOcupado(valor) {
  ocupado = valor;
  // aria-busy precisa do valor "true" (só o atributo vazio não vale)
  if (valor) confirmar.setAttribute('aria-busy', 'true');
  else confirmar.removeAttribute('aria-busy');
  confirmar.setAttribute('aria-disabled', String(valor));
  dialogo.querySelectorAll('button:not([data-confirmar])').forEach((b) => (b.disabled = valor));
  rotuloConfirmar.textContent = valor ? 'Excluindo…' : erro.hidden ? 'Excluir projeto' : 'Tentar de novo';
}

abrir.addEventListener('click', () => {
  erro.hidden = true;
  definirOcupado(false);
  dialogo.showModal(); // foco vai para o botão com autofocus (Cancelar)
  registro.textContent = 'Diálogo aberto. O resto da página ficou inerte; Tab circula só aqui dentro.';
});

// Botões com value fecham informando a escolha; "excluir" simula a requisição
dialogo.querySelectorAll('button[value]').forEach((botao) =>
  botao.addEventListener('click', async () => {
    if (ocupado) return;
    if (botao.value !== 'excluir') {
      dialogo.close(botao.value);
      return;
    }
    definirOcupado(true);
    await new Promise((r) => setTimeout(r, 1000)); // simula a rede
    if (simularFalha.checked) {
      erro.hidden = false; // role="alert": o leitor de tela anuncia na hora
      definirOcupado(false);
      confirmar.focus();
      return;
    }
    definirOcupado(false);
    dialogo.close('excluir');
  })
);

// Esc dispara "cancel". Durante o processamento, não deixamos fechar.
dialogo.addEventListener('cancel', (e) => {
  if (ocupado) {
    e.preventDefault();
    return;
  }
  viaEsc = true;
});

// Clique no ::backdrop chega como clique no próprio <dialog>
dialogo.addEventListener('click', (e) => {
  if (e.target === dialogo && !ocupado) dialogo.close('fora');
});

dialogo.addEventListener('close', () => {
  const motivo = viaEsc ? 'esc' : dialogo.returnValue || 'esc';
  viaEsc = false;
  dialogo.returnValue = '';

  if (motivo === 'excluir') {
    // O botão que abriu vai sumir, então o foco precisa de um destino novo e útil.
    projeto.hidden = true;
    resultado.hidden = false;
    desfazer.focus();
    registro.textContent = 'Excluído. Como o botão de origem sumiu, o foco foi para “Desfazer”.';
  } else {
    abrir.focus(); // devolve o foco a quem abriu
    registro.textContent = `Fechado via ${COMO_FECHOU[motivo]}. Foco devolvido a “Excluir projeto…”.`;
  }
});

desfazer.addEventListener('click', () => {
  resultado.hidden = true;
  projeto.hidden = false;
  abrir.focus();
  registro.textContent = 'Exclusão desfeita (Nielsen #3: controle e liberdade).';
});
