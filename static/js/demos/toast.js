// Demo de toast: região viva fixa, tempo que pausa no hover/foco, botão de fechar,
// "Desfazer" e limite de toasts na tela.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-toast]');
const registrar = registrador(bancada);
const regiao = bancada.querySelector('[data-toasts]');
const modelo = bancada.querySelector('template[data-modelo-toast]');

const DURACAO = 6000; // ms: tempo suficiente para ler (mínimo recomendado ~5 s)
const MAXIMO = 3;

const TIPOS = {
  sucesso: { titulo: 'Conversa arquivada', texto: 'Ela está em Arquivados.', acao: 'Desfazer' },
  erro: { titulo: 'Não foi possível enviar', texto: 'Sem conexão. Vamos tentar de novo quando ela voltar.', acao: 'Tentar agora' },
  info: { titulo: 'Resposta automática ativada', texto: 'Vale até sexta-feira.' },
};

function mostrar(tipo) {
  const dados = TIPOS[tipo];
  const toast = modelo.content.firstElementChild.cloneNode(true);
  toast.classList.add(`toast--${tipo}`);
  toast.querySelector('[data-icone]').append(bancada.querySelector(`template[data-icone="${tipo}"]`).content.cloneNode(true));
  toast.querySelector('[data-titulo]').textContent = dados.titulo;
  toast.querySelector('[data-texto]').textContent = dados.texto;
  toast.style.setProperty('--duracao', `${DURACAO}ms`);

  if (dados.acao) {
    toast.querySelector('[data-acoes]').hidden = false;
    const acao = toast.querySelector('[data-acao]');
    acao.textContent = dados.acao;
    acao.addEventListener('click', () => {
      remover(toast);
      registrar(`“${dados.acao}” acionado.`);
    });
  }
  toast.querySelector('[data-fechar]').addEventListener('click', () => {
    remover(toast);
    registrar('Toast fechado pelo botão ✕.');
  });

  // Tempo de saída que PAUSA enquanto o mouse ou o foco estão no toast
  let restante = DURACAO;
  let inicio = Date.now();
  let timer = setTimeout(() => remover(toast), restante);
  const pausar = () => {
    clearTimeout(timer);
    restante -= Date.now() - inicio;
  };
  const retomar = () => {
    inicio = Date.now();
    timer = setTimeout(() => remover(toast), Math.max(restante, 1500));
  };
  toast.addEventListener('mouseenter', pausar);
  toast.addEventListener('mouseleave', retomar);
  toast.addEventListener('focusin', pausar);
  toast.addEventListener('focusout', (e) => {
    if (!toast.contains(e.relatedTarget)) retomar();
  });
  toast.limpar = () => clearTimeout(timer);

  // No máximo 3 na tela: o mais antigo sai
  while (regiao.children.length >= MAXIMO) remover(regiao.firstElementChild);
  regiao.append(toast); // inclusão na região viva = anúncio para o leitor de tela
  registrar(`Toast “${dados.titulo}” exibido por ${DURACAO / 1000} s (o foco continua onde estava).`);
}

function remover(toast) {
  if (!toast?.isConnected) return;
  toast.limpar?.();
  // Se o foco estava no toast, devolve-o para algo estável em vez de perdê-lo
  const tinhaFoco = toast.contains(document.activeElement);
  toast.remove();
  if (tinhaFoco) bancada.querySelector('[data-disparar]').focus();
}

bancada.querySelectorAll('[data-disparar]').forEach((b) =>
  b.addEventListener('click', () => mostrar(b.dataset.disparar))
);
