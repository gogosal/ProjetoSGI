## Overview

Projecto 100 % estático: basta abrir `index.html` e todo o layout já está estilizado com Tailwind (via CDN) e animado por JavaScript vanilla. O viewer 3D continua a usar Three.js, agora carregado através de um import map directly do CDN.

```
├─ assets/
│  ├─ images/        # logos & presets
│  ├─ javascript/    # módulos JS (viewer, UI, dados, helpers)
│  ├─ models/        # modelo GLB + origem
│  └─ textures/      # texturas PBR e HDRI
└─ index.html        # entrada única
```

## Como usar

1. Serve a pasta via HTTP para evitar erros CORS em módulos ES. Exemplos:
	```bash
	# Windows PowerShell / macOS / Linux
	cd E:/Github/ProjetoSGI
	python -m http.server 4173
	```
	Depois abre `http://localhost:4173/index.html`.
2. Mantém a pasta `assets/` na mesma hierarquia para garantir que o modelo 3D, texturas e imagens carregam correctamente.
3. Se preferires outra ferramenta, qualquer servidor estático (`npx serve`, `bunx serve`, extensões Live Server, etc.) funciona.

## Tecnologias

- [Tailwind CSS](https://tailwindcss.com/) via CDN para styling utilitário imediato.
- [Three.js](https://threejs.org/) importado através de import map, sem bundlers.
- JavaScript modular em `assets/javascript` para separar viewer, presets, dados e interacções.

## Desenvolvimento

- O ficheiro `assets/javascript/main.js` inicializa o viewer, renderiza presets, ratings e sliders.
- Helpers para texturas, HDRI, modelo, animações e ícones vivem em `assets/javascript/lib`.
- Os assets são resolvidos com `new URL(..., import.meta.url)`, por isso qualquer servidor estático respeita os caminhos.

Não há dependências React ou tooling adicional — HTML, JS e Tailwind são suficientes para trabalhar no projecto.
