"""Montagem do laboratório: arquivos com SRI, import map e CSP de cada frame.

Os dados (versões, links, textos) vêm de data/libraries.py; os hashes, de
data/sri.lock.json, gerado por tools/atualizar_sri.py. Aqui só se combina
uma coisa com a outra.
"""

import base64
import hashlib
import json
from pathlib import Path

from markupsafe import Markup

from data.libraries import (
    BIBLIOTECAS,
    CDN,
    PACOTES,
    COLECOES_ICONES,
    base_colecao,
    base_pacote,
    chave_lock,
    pacotes_da_biblioteca,
)

_LOCK = json.loads((Path(__file__).parent / "data" / "sri.lock.json").read_text(encoding="utf-8"))


def _arquivo(pacote: str, arquivo: str) -> dict:
    chave = chave_lock(pacote, arquivo)
    if chave not in _LOCK:
        raise RuntimeError(f"{chave} sem hash em data/sri.lock.json. Rode: python tools/atualizar_sri.py")
    return {"url": f"{CDN}/{chave}", "sri": _LOCK[chave]["sri"]}


def _pacotes_de_modulo(lib: dict) -> list[str]:
    campos = [*lib.get("js_modulo", []), *lib.get("modulos", []), *lib.get("importar", {}).values()]
    return list(dict.fromkeys(pacote for pacote, _ in campos))


def _chaves_de_modulo(lib: dict) -> list[str]:
    """Chaves do lock de todos os módulos JS que a biblioteca pode importar."""
    prefixos = tuple(chave_lock(p, "") for p in _pacotes_de_modulo(lib))
    return [c for c in _LOCK if c.startswith(prefixos) and c.endswith(".js")] if prefixos else []


def _montar_importmap(lib: dict) -> str | None:
    chaves = _chaves_de_modulo(lib)
    if not chaves:
        return None
    mapa = {}
    if lib.get("importar"):
        mapa["imports"] = {
            apelido: _arquivo(pacote, arquivo)["url"]
            for apelido, (pacote, arquivo) in lib["importar"].items()
        }
    mapa["integrity"] = {f"{CDN}/{c}": _LOCK[c]["sri"] for c in sorted(chaves)}
    texto = json.dumps(mapa, separators=(",", ":"))
    # Vai dentro de <script>: não pode conter nada que feche a tag.
    if any(ch in texto for ch in "<>&"):
        raise RuntimeError(f"Import map de {lib['id']} com caractere inesperado.")
    return texto


def _peso(lib: dict) -> tuple[int, int]:
    """(quantidade de arquivos, bytes sem compressão) que o frame baixa do CDN."""
    chaves = {chave_lock(p, a) for campo in ("css", "js", "js_modulo") for p, a in lib.get(campo, [])}
    chaves.update(_chaves_de_modulo(lib))
    return len(chaves), sum(_LOCK[c]["bytes"] for c in chaves)


def _csp(lib: dict, importmap: str | None) -> dict:
    origens = [base_pacote(p) for p in pacotes_da_biblioteca(lib)]
    relaxar = lib.get("csp", {})
    scripts = ["'self'", *origens]
    if importmap:
        digest = base64.b64encode(hashlib.sha256(importmap.encode()).digest()).decode()
        scripts.append(f"'sha256-{digest}'")
    estilos = ["'self'", *origens]
    if relaxar.get("estilo_inline"):
        estilos.append("'unsafe-inline'")
    return {
        "default-src": "'none'",
        "script-src": scripts,
        "style-src": estilos,
        "img-src": ["'self'", "data:"],
        "font-src": [*origens, "data:"],
        "connect-src": "data:" if relaxar.get("fetch_data") else "'none'",
        "object-src": "'none'",
        "base-uri": "'none'",
        "form-action": "'none'",
        "frame-ancestors": "'self'",
        # Mesmo aberto fora do iframe, o frame continua isolado em origem opaca.
        "sandbox": "allow-scripts",
    }


def _preparar(lib: dict) -> dict:
    pronta = {"csp": {}, "observacao": "", "pendencia": "", "scripts_locais": [], **lib}
    # Uma biblioteca pendente não lista arquivos; a versão exibida vem do pacote de mesmo id.
    pronta["versoes"] = [PACOTES[p] for p in pacotes_da_biblioteca(lib) or [lib["id"]]]
    if pronta["pendencia"]:
        return pronta
    importmap = _montar_importmap(lib)
    arquivos, bytes_ = _peso(lib)
    pronta.update(
        importmap=Markup(importmap) if importmap else None,
        folhas=[_arquivo(*a) for a in lib.get("css", [])],
        scripts=[_arquivo(*a) for a in lib.get("js", [])],
        scripts_modulo=[_arquivo(*a) for a in [*lib.get("js_modulo", []), *lib.get("modulos", [])]],
        arquivos=arquivos,
        kb=round(bytes_ / 1024),
        talisman={
            "content_security_policy": _csp(lib, importmap),
            "content_security_policy_nonce_in": ["style-src"] if pronta["csp"].get("nonce_estilo") else [],
        },
    )
    return pronta


LAB = [_preparar(lib) for lib in BIBLIOTECAS]


def csp_icones(csp_padrao: dict) -> dict:
    """CSP do site + as pastas das coleções de ícones, só para imagens."""
    return {**csp_padrao, "img-src": [*csp_padrao["img-src"], *(base_colecao(c) for c in COLECOES_ICONES)]}
