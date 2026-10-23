// Utilidades compartilhadas pelas demos das pranchas.

// Devolve uma função que escreve no registro da bancada ([data-registro]).
export function registrador(bancada) {
  const registro = bancada.querySelector('[data-registro]');
  return (texto) => {
    if (registro) registro.textContent = texto;
  };
}

// Links de mentira das demos (href="#"): não saem da página, só registram o destino.
export function linksFalsos(raiz, registrar, aoClicar) {
  raiz.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-falso]');
    if (!link) return;
    e.preventDefault();
    registrar(`Navegaria para “${link.textContent.trim()}”.`);
    aoClicar?.(link);
  });
}

// Pequena espera, para simular a rede nas demos.
export const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
