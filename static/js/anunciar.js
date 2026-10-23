// Envia uma mensagem curta para leitores de tela pela região #anuncios (role="status").
// Limpar antes e escrever no próximo quadro faz o leitor repetir mensagens iguais.
export function anunciar(mensagem) {
  const regiao = document.getElementById('anuncios');
  if (!regiao) return;
  regiao.textContent = '';
  requestAnimationFrame(() => {
    regiao.textContent = mensagem;
  });
}
