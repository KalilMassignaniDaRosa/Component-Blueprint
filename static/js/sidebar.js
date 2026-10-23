// Sidebar: é um <details> (fechado no celular); no desktop fica sempre aberto.
export function iniciarSidebar() {
  const sidebar = document.querySelector('[data-sidebar]');
  if (!sidebar) return;
  const desktop = window.matchMedia('(min-width: 64rem)');
  const ajustar = () => {
    sidebar.open = desktop.matches;
  };
  ajustar();
  desktop.addEventListener('change', ajustar);
}
