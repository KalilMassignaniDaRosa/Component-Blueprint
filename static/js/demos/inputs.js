// Demo de inputs com validação.
// - valida ao SAIR do campo (blur), não a cada tecla; depois do 1º erro, revalida ao digitar
// - erro ligado ao campo por aria-describedby + aria-invalid
// - ao "Criar conta" com erros: resumo no topo com links e foco no resumo
// Num site real, o servidor valida tudo de novo: a validação no navegador pode ser burlada.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-inputs]');
const registrar = registrador(bancada);
const campos = [...bancada.querySelectorAll('[data-campo]')];
const resumo = bancada.querySelector('[data-resumo]');
const resumoTitulo = bancada.querySelector('[data-resumo-titulo]');
const resumoLista = bancada.querySelector('[data-resumo-lista]');
const iconeErro = bancada.querySelector('template[data-icone-erro]');

// Cada regra devolve a mensagem de erro (como corrigir) ou "" se estiver ok.
const REGRAS = {
  nome: (v) => (v.trim().split(/\s+/).length < 2 ? 'Informe nome e sobrenome.' : ''),
  email: (v) => {
    if (!v.trim()) return 'Informe seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Inclua o domínio, por exemplo: ana@exemplo.com';
    return '';
  },
  senha: (v) => {
    if (v.length < 8) return `Faltam ${8 - v.length} caracteres (mínimo de 8).`;
    if (!/\d/.test(v)) return 'Inclua pelo menos um número.';
    return '';
  },
  // Lei de Postel: aceita qualquer pontuação e confere só os dígitos.
  telefone: (v) => {
    if (!v.trim()) return ''; // opcional
    const digitos = v.replace(/\D/g, '');
    return digitos.length === 10 || digitos.length === 11 ? '' : 'Use DDD + número, por exemplo: 11 91234-5678';
  },
};

function validar(campo) {
  const msg = REGRAS[campo.dataset.regra](campo.value);
  const erro = campo.closest('.campo-form').querySelector('[data-erro]');
  campo.setAttribute('aria-invalid', String(Boolean(msg)));
  campo.classList.toggle('is-valida', !msg && campo.value.trim() !== '');
  erro.hidden = !msg;
  // Montado com nós DOM (ícone clonado de um <template> + texto), sem innerHTML
  erro.replaceChildren();
  if (msg) erro.append(iconeErro.content.cloneNode(true), document.createTextNode(` ${msg}`));
  return msg;
}

campos.forEach((campo) => {
  // Só valida no blur depois que a pessoa digitou algo: não acusa erro antes da hora.
  // Se o foco está indo para "Criar conta", não valida aqui: a mensagem mudaria o
  // layout no meio do clique e o botão "fugiria" do cursor. O botão valida tudo.
  campo.addEventListener('blur', (e) => {
    if (!campo.dataset.tocado || e.relatedTarget?.matches('[data-enviar]')) return;
    const msg = validar(campo);
    registrar(msg ? `Erro em “${campo.labels[0].textContent.trim()}”: ${msg}` : 'Campo ok.');
  });
  // Depois de mostrar um erro, revalida ao digitar para o erro sumir assim que for corrigido.
  campo.addEventListener('input', () => {
    campo.dataset.tocado = '1';
    if (campo.getAttribute('aria-invalid') === 'true') validar(campo);
  });
});

bancada.querySelector('[data-enviar]').addEventListener('click', () => {
  const erros = campos
    .map((campo) => ({ campo, msg: validar(campo) }))
    .filter((e) => e.msg);

  if (!erros.length) {
    resumo.hidden = true;
    registrar('Tudo válido no navegador. Num site real, agora o servidor validaria de novo.');
    return;
  }

  resumoTitulo.textContent = erros.length === 1 ? 'Corrija 1 campo:' : `Corrija ${erros.length} campos:`;
  resumoLista.replaceChildren(
    ...erros.map(({ campo }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${campo.id}`;
      a.textContent = campo.labels[0].textContent.trim();
      a.addEventListener('click', (e) => {
        e.preventDefault();
        campo.focus();
      });
      li.append(a);
      return li;
    })
  );
  resumo.hidden = false;
  resumo.focus(); // o leitor de tela lê o resumo inteiro
  registrar(`${erros.length} erro(s). O foco foi para o resumo; cada item leva ao campo.`);
});

bancada.querySelector('[data-limpar]').addEventListener('click', () => {
  campos.forEach((campo) => {
    campo.value = '';
    delete campo.dataset.tocado;
    campo.removeAttribute('aria-invalid');
    campo.classList.remove('is-valida');
    campo.closest('.campo-form').querySelector('[data-erro]').hidden = true;
  });
  resumo.hidden = true;
  campos[0].focus();
  registrar('Campos limpos.');
});
