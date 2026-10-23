// Tema do Fluent UI Web Components: sem setTheme(), os componentes da v3 ficam
// sem cores nem tipografia. Os dois apelidos vêm do import map do frame, que
// também confere o hash (integrity) de cada módulo baixado.
(async () => {
  const [{ setTheme }, { webLightTheme }] = await Promise.all([
    import('@fluentui/web-components'),
    import('@fluentui/tokens'),
  ]);
  setTheme(webLightTheme);
})();
