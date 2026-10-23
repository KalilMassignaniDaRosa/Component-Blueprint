// Ponto de entrada comum a todas as páginas.
import { iniciarTema } from './tema.js';
import { iniciarMenu } from './menu.js';
import { iniciarTabs } from './tabs.js';
import { iniciarSidebar } from './sidebar.js';
import { iniciarIndice } from './indice.js';

iniciarTema();
iniciarMenu();
document.querySelectorAll('[data-tabs]').forEach(iniciarTabs);
iniciarSidebar();
iniciarIndice();

// "Pular para o conteúdo": garante que o foco vá mesmo para o <main>
document.querySelector('.pular')?.addEventListener('click', () => {
  document.getElementById('conteudo')?.focus();
});
