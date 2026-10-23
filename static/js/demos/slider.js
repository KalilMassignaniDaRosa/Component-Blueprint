// Demo de slider: valor em texto (<output>), aria-valuetext e um campo numérico
// sincronizado para quem quer o valor exato.
import { registrador } from './_comum.js';

const bancada = document.querySelector('[data-demo-slider]');
const registrar = registrador(bancada);

// Pinta a parte "preenchida" do trilho (Chrome/Edge/Safari usam esta variável)
function pintar(faixa) {
  const pct = ((faixa.value - faixa.min) / (faixa.max - faixa.min)) * 100;
  faixa.style.setProperty('--preenchido', `${pct}%`);
}

const volume = bancada.querySelector('[data-faixa="volume"]');
const saidaVolume = bancada.querySelector('[data-saida="volume"]');
const barras = [...bancada.querySelectorAll('[data-barras] span')];

function atualizarVolume() {
  const v = Number(volume.value);
  const nivel = v === 0 ? 'mudo' : v < 35 ? 'baixo' : v < 75 ? 'médio' : 'alto';
  saidaVolume.textContent = `${v}%`;
  volume.setAttribute('aria-valuetext', `${v}%, ${nivel}`); // o leitor de tela diz "60%, médio"
  barras.forEach((b, i) => b.classList.toggle('is-ligada', i < Math.round(v / 10)));
  pintar(volume);
}

const graves = bancada.querySelector('[data-faixa="graves"]');
const saidaGraves = bancada.querySelector('[data-saida="graves"]');
const numero = bancada.querySelector('[data-numero]');

function atualizarGraves(origem) {
  if (origem === numero) {
    const n = Math.max(-6, Math.min(6, Math.round(Number(numero.value) || 0)));
    graves.value = n;
  }
  const v = Number(graves.value);
  const texto = `${v > 0 ? '+' : ''}${v} dB`;
  saidaGraves.textContent = texto;
  graves.setAttribute('aria-valuetext', v === 0 ? '0 dB, neutro' : `${texto}, ${v > 0 ? 'reforçado' : 'reduzido'}`);
  if (origem !== numero) numero.value = v;
  pintar(graves);
}

volume.addEventListener('input', () => {
  atualizarVolume();
  registrar(`Volume ${volume.getAttribute('aria-valuetext')}.`);
});
graves.addEventListener('input', () => {
  atualizarGraves(graves);
  registrar(`Graves ${graves.getAttribute('aria-valuetext')}.`);
});
numero.addEventListener('change', () => {
  atualizarGraves(numero);
  registrar('Campo numérico e slider sincronizados.');
});

atualizarVolume();
atualizarGraves();
document.querySelectorAll('[data-especime-faixa]').forEach(pintar);
