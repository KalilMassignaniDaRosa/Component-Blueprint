// Monta botão, modal e tabs do Ant Design (React, sem JSX nem build) nos três
// espaços do frame. Os textos vêm do JSON #textos, gerado pelo template.
//
// O Ant Design gera o CSS em JS e o injeta em tags <style>. O nonce desta
// página vai para o ConfigProvider, que o coloca em cada <style>; assim a CSP
// do frame aceita esses estilos sem precisar de 'unsafe-inline'.
(() => {
  const nonce = document.currentScript.nonce;
  const t = JSON.parse(document.getElementById('textos').textContent);
  const { createElement: h, Fragment, useState } = React;
  const { Button, ConfigProvider, Modal, Space, Tabs } = antd;

  const montar = (onde, elemento) =>
    ReactDOM.createRoot(document.querySelector(`[data-antd="${onde}"]`)).render(
      h(ConfigProvider, { csp: { nonce } }, elemento)
    );

  montar(
    'botoes',
    h(
      Space,
      { wrap: true },
      h(Button, { type: 'primary' }, t.primario),
      h(Button, null, t.secundario),
      h(Button, { type: 'primary', danger: true }, t.destrutivo),
      h(Button, { type: 'primary', disabled: true }, t.desabilitado)
    )
  );

  function ExemploModal() {
    const [aberto, setAberto] = useState(false);
    const fechar = () => setAberto(false);
    return h(
      Fragment,
      null,
      h(Button, { type: 'primary', danger: true, onClick: () => setAberto(true) }, t.abrir_modal),
      h(
        Modal,
        {
          open: aberto,
          title: t.modal_titulo,
          centered: true,
          onCancel: fechar,
          footer: [
            h(Button, { key: 'cancelar', onClick: fechar }, t.modal_cancelar),
            h(Button, { key: 'confirmar', type: 'primary', danger: true, onClick: fechar }, t.modal_confirmar),
          ],
        },
        h('p', null, t.modal_texto)
      )
    );
  }
  montar('modal', h(ExemploModal));

  montar(
    'tabs',
    h(Tabs, {
      'aria-label': t.abas_rotulo,
      items: t.abas.map(([key, label, children]) => ({ key, label, children })),
    })
  );
})();
