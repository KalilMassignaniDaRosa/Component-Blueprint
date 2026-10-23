// Demo de progress bar: fase indeterminada, progresso real com texto,
// anúncio só dos marcos, cancelar e falha no meio.
import { registrador, esperar } from './_comum.js';

const bancada = document.querySelector('[data-demo-progress]');
const registrar = registrador(bancada);
const caixa = bancada.querySelector('[data-progresso]');
const barra = bancada.querySelector('[data-barra]');
const valor = bancada.querySelector('[data-valor]');
const detalhe = bancada.querySelector('[data-detalhe]');
const anuncio = bancada.querySelector('[data-anuncio]');
const iniciar = bancada.querySelector('[data-iniciar]');
const cancelar = bancada.querySelector('[data-cancelar]');
const falhar = bancada.querySelector('[data-falhar]');

const FOTOS = 8;
let execucao = 0; // muda a cada envio; permite cancelar o loop em andamento

function definir(pct, texto) {
  barra.value = pct;
  valor.textContent = `${pct}%`;
  detalhe.textContent = texto;
}

iniciar.addEventListener('click', async () => {
  const minha = ++execucao;
  caixa.classList.remove('progresso--sucesso', 'progresso--erro');
  iniciar.disabled = true;
  cancelar.disabled = false;

  // 1) Indeterminado: sem value, enquanto não sabemos quanto falta
  barra.removeAttribute('value');
  valor.textContent = '';
  detalhe.textContent = 'Preparando as fotos…';
  anuncio.textContent = 'Envio iniciado.';
  await esperar(900);

  // 2) Determinado
  let ultimoMarco = 0;
  for (let pct = 0; pct <= 100; pct += 2) {
    if (minha !== execucao) return; // cancelado
    const enviadas = Math.floor((pct / 100) * FOTOS);
    const restante = Math.ceil(((100 - pct) / 100) * 8);
    definir(pct, `${enviadas} de ${FOTOS} fotos · cerca de ${restante} s restantes`);

    if (falhar.checked && pct >= 38) {
      caixa.classList.add('progresso--erro');
      detalhe.textContent = `Falhou na foto ${enviadas + 1}. As ${enviadas} primeiras foram salvas.`;
      anuncio.textContent = `Erro no envio. ${enviadas} fotos foram salvas.`;
      registrar('Falha: a barra para onde estava e diz o que já foi salvo.');
      iniciar.disabled = false;
      iniciar.textContent = 'Tentar de novo';
      cancelar.disabled = true;
      return;
    }
    // Anuncia só a cada 25%: um leitor de tela falando a cada 1% seria insuportável
    const marco = Math.floor(pct / 25) * 25;
    if (marco > ultimoMarco && marco < 100) {
      ultimoMarco = marco;
      anuncio.textContent = `${marco}% enviado.`;
    }
    await esperar(80);
  }

  caixa.classList.add('progresso--sucesso');
  definir(100, `${FOTOS} fotos enviadas.`);
  anuncio.textContent = 'Envio concluído.';
  registrar('Concluído: cor de sucesso + texto + anúncio final.');
  iniciar.disabled = false;
  iniciar.textContent = 'Enviar fotos';
  cancelar.disabled = true;
});

cancelar.addEventListener('click', () => {
  execucao++; // interrompe o loop
  definir(0, 'Envio cancelado. Nenhuma foto foi enviada.');
  anuncio.textContent = 'Envio cancelado.';
  iniciar.disabled = false;
  iniciar.textContent = 'Enviar fotos';
  cancelar.disabled = true;
  iniciar.focus();
  registrar('Cancelado (Nielsen #3: controle e liberdade).');
});
