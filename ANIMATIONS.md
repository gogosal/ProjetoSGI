# Sistema de Animações

Este documento explica como usar o sistema de animações para o visualizador 3D do gira-discos.

## Estrutura

O sistema de animações está organizado em `src/lib/animations.js` e inclui:

- **AnimationManager**: Classe principal que gerencia todas as animações do modelo
- **animationMappings**: Objeto de configuração que mapeia objetos clicáveis para suas animações
- **handleObjectClick**: Função que manipula cliques e reproduz animações

## Como Funciona

### 1. AnimationManager

Esta classe é responsável por:
- Carregar e indexar todas as animações do modelo GLTF
- Reproduzir animações pelo nome
- Controlar o estado das animações (play, stop, pause)
- Atualizar as animações no loop de renderização

```javascript
// Criar instância do gerenciador
const animationManager = new AnimationManager(model, gltf);

// Reproduzir uma animação
animationManager.playAnimation('Open', {
    loop: false,
    timeScale: 1,
    clampWhenFinished: true
});

// Atualizar no loop de renderização
animationManager.update();
```

### 2. Mapeamento de Animações

O objeto `animationMappings` em `src/lib/animations.js` define qual animação deve ser reproduzida quando um objeto específico é clicado:

```javascript
export const animationMappings = {
    'DustCover': {
        animationName: 'Open',
        options: {
            loop: false,
            timeScale: 1,
            clampWhenFinished: true
        }
    },
    'PowerButton': {
        animationName: 'PowerOn',
        options: {
            loop: false,
            timeScale: 1.5,
            clampWhenFinished: true
        }
    },
    // Adicione mais aqui...
};
```

### 3. Adicionar Nova Animação

Para adicionar uma nova animação ao sistema:

**Passo 1**: Certifique-se de que seu modelo GLTF/GLB contém a animação desejada

**Passo 2**: Identifique o nome exato do objeto que quer tornar clicável (use o console do navegador)

**Passo 3**: Adicione um novo mapeamento em `animationMappings`:

```javascript
export const animationMappings = {
    // ... mapeamentos existentes
    
    'NomeDoObjeto': {
        animationName: 'NomeDaAnimacao',  // Nome exato da animação no GLTF
        options: {
            loop: false,              // true para repetir, false para uma vez
            timeScale: 1,             // Velocidade (1 = normal, 2 = 2x mais rápido)
            clampWhenFinished: true   // Manter último frame quando terminar
        }
    },
};
```

### 4. Opções de Animação

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `loop` | boolean | `false` | Se a animação deve repetir continuamente |
| `timeScale` | number | `1` | Velocidade da animação (0.5 = metade, 2 = dobro) |
| `clampWhenFinished` | boolean | `true` | Manter o último frame quando terminar |

## Métodos Úteis

### AnimationManager

```javascript
// Reproduzir animação
animationManager.playAnimation('NomeDaAnimacao', options);

// Parar animação específica
animationManager.stopAnimation('NomeDaAnimacao');

// Parar todas as animações
animationManager.stopAllAnimations();

// Verificar se está tocando
const isPlaying = animationManager.isPlaying('NomeDaAnimacao');

// Listar animações disponíveis
const animations = animationManager.getAvailableAnimations();
console.log('Animações:', animations);
```

## Debugging

Para ver as animações disponíveis no seu modelo, abra o console do navegador após carregar o modelo. O sistema automaticamente mostra:

```
Animações disponíveis: ['Open', 'Close', 'PowerOn', 'PowerOff', ...]
```

Quando você clica em um objeto:

```
Clicou em "DustCover", reproduzindo animação "Open"
```

ou

```
Objeto "OutroObjeto" clicado, mas sem animação mapeada
```

## Exemplo Completo

```javascript
// 1. Carregar modelo com animações
loadRecordPlayerModel(true).then((gltf) => {
    const model = gltf.scene;
    scene.add(model);
    
    // 2. Criar gerenciador de animações
    const animationManager = new AnimationManager(model, gltf);
    
    // 3. Configurar cliques
    raycastManager.onClick = (object) => {
        handleObjectClick(object, animationManager);
    };
    
    // 4. Atualizar no loop de renderização
    function render() {
        animationManager.update();
        renderer.render(scene, camera);
    }
});
```

## Notas

- Certifique-se de que o modelo GLTF/GLB foi exportado com animações
- Os nomes das animações devem corresponder exatamente aos nomes no arquivo GLTF
- Use o Blender ou outro editor 3D para verificar os nomes das animações
- O sistema suporta múltiplas animações simultâneas
- Sempre chame `animationManager.update()` no loop de renderização
