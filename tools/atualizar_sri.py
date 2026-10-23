"""Gera data/sri.lock.json a partir de data/libraries.py.

    python tools/atualizar_sri.py              baixa os arquivos e regrava o lock
    python tools/atualizar_sri.py --verificar  baixa de novo e compara com o lock
                                               (sai com erro se algo mudou)
    python tools/atualizar_sri.py --icones     confere se cada SVG de ICONES existe

Para cada arquivo listado em css, js e js_modulo, calcula o hash sha384.
Para "modulos" (e os alvos de "importar"), segue também os imports relativos
de cada módulo, recursivamente, porque o navegador vai buscar todos eles e o
import map precisa do hash de cada um. Import sem caminho relativo ("lit",
"react") interrompe o script: isso significa que o pacote precisa de bundler.

Os arquivos de versão fixa no jsDelivr não mudam; se --verificar acusar
diferença, trate como incidente e não apenas regrave o lock.
"""

import base64
import hashlib
import json
import posixpath
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ))

from data.libraries import (  # noqa: E402
    BIBLIOTECAS,
    COLECOES_ICONES,
    ICONES,
    base_pacote,
    chave_lock,
    url_icone,
)

LOCK = RAIZ / "data" / "sri.lock.json"

# import x from "./a.js" · import "./a.js" · export * from "./a.js" · import("./a.js")
_IMPORT = re.compile(
    r"""(?:\bimport|\bexport)\s*(?:[\w$*{}\s,]*?\bfrom\s*)?["']([^"']+)["']"""
    r"""|\bimport\(\s*["']([^"']+)["']\s*\)"""
)


def baixar(url: str) -> bytes:
    pedido = urllib.request.Request(url, headers={"User-Agent": "guia-ihc-sri/1.0"})
    with urllib.request.urlopen(pedido, timeout=30) as resposta:
        return resposta.read()


def sri(conteudo: bytes) -> str:
    return "sha384-" + base64.b64encode(hashlib.sha384(conteudo).digest()).decode()


def grafo_de_modulos(pacote: str, entradas: list[str]) -> dict[str, bytes]:
    """Baixa as entradas e todos os módulos que elas importam (só caminhos relativos)."""
    vistos: dict[str, bytes] = {}
    pendentes = list(entradas)
    while pendentes:
        arquivo = pendentes.pop()
        if arquivo in vistos:
            continue
        conteudo = baixar(base_pacote(pacote) + arquivo)
        vistos[arquivo] = conteudo
        for relativo, dinamico in _IMPORT.findall(conteudo.decode("utf-8", "replace")):
            alvo = relativo or dinamico
            if alvo.startswith("./") or alvo.startswith("../"):
                caminho = posixpath.normpath(posixpath.join(posixpath.dirname(arquivo), alvo))
                if caminho.startswith(".."):
                    raise SystemExit(f"{pacote}/{arquivo} importa fora do pacote: {alvo}")
                pendentes.append(caminho)
            elif not alvo.startswith(("http:", "https:", "data:")):
                raise SystemExit(
                    f"{pacote}/{arquivo} importa {alvo!r} sem caminho: este pacote precisa de bundler."
                )
    return vistos


def arquivos_do_lab() -> dict[str, bytes]:
    """{chave do lock: conteúdo} de tudo que o laboratório carrega do CDN."""
    soltos: set[tuple[str, str]] = set()
    modulos: dict[str, set[str]] = {}
    for lib in BIBLIOTECAS:
        if lib.get("pendencia"):
            continue
        for campo in ("css", "js", "js_modulo"):
            soltos.update(lib.get(campo, []))
        for pacote, arquivo in [*lib.get("modulos", []), *lib.get("importar", {}).values()]:
            modulos.setdefault(pacote, set()).add(arquivo)

    resultado: dict[str, bytes] = {}
    with ThreadPoolExecutor(max_workers=8) as pool:
        for (pacote, arquivo), conteudo in zip(
            soltos, pool.map(lambda pa: baixar(base_pacote(pa[0]) + pa[1]), soltos)
        ):
            resultado[chave_lock(pacote, arquivo)] = conteudo
    for pacote, entradas in modulos.items():
        for arquivo, conteudo in grafo_de_modulos(pacote, sorted(entradas)).items():
            resultado[chave_lock(pacote, arquivo)] = conteudo
    return resultado


def gerar() -> dict:
    arquivos = arquivos_do_lab()
    return {
        chave: {"sri": sri(conteudo), "bytes": len(conteudo)}
        for chave, conteudo in sorted(arquivos.items())
    }


def conferir_icones() -> int:
    urls = [
        (rotulo, colecao["nome"], url_icone(colecao, nome))
        for rotulo, _extra, nomes in ICONES
        for colecao, nome in zip(COLECOES_ICONES, nomes)
        if nome is not None
    ]

    def status(url: str) -> int | str:
        pedido = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "guia-ihc-sri/1.0"})
        for tentativa in range(3):
            try:
                with urllib.request.urlopen(pedido, timeout=30) as resposta:
                    return resposta.status
            except urllib.error.HTTPError as erro:
                return erro.code
            except (urllib.error.URLError, TimeoutError) as erro:
                if tentativa == 2:
                    return f"rede: {erro}"
        return "?"

    with ThreadPoolExecutor(max_workers=6) as pool:
        codigos = list(pool.map(status, [u for _, _, u in urls]))
    falhas = [(r, c, u, s) for (r, c, u), s in zip(urls, codigos) if s != 200]
    for rotulo, colecao, url, codigo in falhas:
        print(f"FALHA {codigo}  {rotulo} / {colecao}  {url}")
    print(f"{len(urls) - len(falhas)} de {len(urls)} ícones encontrados no CDN.")
    return 1 if falhas else 0


def main() -> int:
    if "--icones" in sys.argv:
        return conferir_icones()

    novo = gerar()
    if "--verificar" in sys.argv:
        atual = json.loads(LOCK.read_text(encoding="utf-8"))
        diferentes = sorted(k for k in novo.keys() | atual.keys() if novo.get(k) != atual.get(k))
        for chave in diferentes:
            print(f"DIFERENTE  {chave}\n  lock: {atual.get(chave)}\n  cdn:  {novo.get(chave)}")
        print(f"{len(novo) - len(diferentes)} de {len(novo)} arquivos conferem com o lock.")
        return 1 if diferentes else 0

    LOCK.write_text(json.dumps(novo, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{LOCK.relative_to(RAIZ)}: {len(novo)} arquivos.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
