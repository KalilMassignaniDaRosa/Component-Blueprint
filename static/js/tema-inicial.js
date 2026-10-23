/* Roda de forma síncrona no <head>, antes da pintura da página.
   1) Aplica o tema salvo (evita o "flash" do tema errado).
   2) Marca <html class="js">, para o CSS saber que o JavaScript está ativo
      (ex.: só esconde o menu móvel se houver JS para abri-lo). */
(function () {
  var raiz = document.documentElement;
  raiz.classList.add("js");
  try {
    var tema = localStorage.getItem("tema");
    if (tema === "light" || tema === "dark") raiz.setAttribute("data-theme", tema);
  } catch (e) {
    /* localStorage bloqueado (modo privado etc.): segue o tema do sistema */
  }
})();
