# Guía para Desarrolladores: Butterchurn

## ¿Qué es Butterchurn?
Butterchurn es una implementación en WebGL del clásico visualizador de audio Milkdrop (popularizado por Winamp). Permite renderizar animaciones complejas y reactivas al sonido directamente en el navegador utilizando un elemento Canvas y la Web Audio API.

## Requisitos para la Reactividad al Audio
Para que Butterchurn pueda "escuchar" y reaccionar a una canción (como un archivo `.mp3`), se necesitan tres elementos fundamentales de la **Web Audio API**:

1. **Contexto de Audio (`AudioContext`)**: Es el grafo principal donde ocurren todas las operaciones de procesamiento de audio en el navegador.
2. **Nodo Fuente (`MediaElementAudioSourceNode` u otros)**: El nodo que provee los datos binarios de sonido al contexto. Normalmente se extrae de un elemento `<audio>` del DOM o de un objeto `new Audio('ruta')` de JavaScript.
3. **Conexión al Analizador**: Butterchurn se encarga internamente de analizar las frecuencias y las formas de onda, pero para que pueda hacerlo, debes conectar el *nodo fuente* al visualizador usando la función nativa de Butterchurn (`visualizer.connectAudio()`).

> [!IMPORTANT]
> El nodo fuente de audio no sólo debe conectarse a Butterchurn, sino que **también debe conectarse al destino del `AudioContext`** (`audioContext.destination`) para que la canción suene a través de los altavoces.

---

## Configuración Mínima en un Nuevo Proyecto (Ejemplo de 200x100 px)

A continuación, se muestra cómo implementar Butterchurn desde cero en un componente React con un lienzo (canvas) fijo de 200x100 píxeles.

### 1. Instalación de Dependencias
Necesitas instalar la librería principal y, opcionalmente, los *presets* (las fórmulas matemáticas que crean las animaciones visuales).

```bash
npm install butterchurn butterchurn-presets
```

### 2. Implementación del Componente

```tsx
import React, { useEffect, useRef } from 'react';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';

const MinimalVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Guardamos la referencia para detener la animación luego
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !audioRef.current) return;

    // 1. Inicializar la Web Audio API
    const audioContext = new AudioContext();
    
    // 2. Crear la fuente a partir del elemento <audio>
    const sourceNode = audioContext.createMediaElementSource(audioRef.current);
    
    // 3. Conectar la fuente a los altavoces para que se escuche
    sourceNode.connect(audioContext.destination);

    // 4. Inicializar Butterchurn en el Canvas y asignarle el tamaño 200x100
    const visualizer = butterchurn.createVisualizer(audioContext, canvasRef.current, {
      width: 200,
      height: 100
    });

    // 5. Conectar Butterchurn a la fuente de audio
    visualizer.connectAudio(sourceNode);

    // 6. Cargar un Preset (la visualización en sí)
    const presets = butterchurnPresets.getPresets();
    // Tomamos un preset de prueba como ejemplo (ej. Flexi, Martin, etc.)
    const firstPresetKey = Object.keys(presets)[0]; 
    visualizer.loadPreset(presets[firstPresetKey], 0); // 0 indica transición inmediata

    // 7. Crear el loop de renderizado a 60fps
    const renderLoop = () => {
      visualizer.render();
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // 8. Función de limpieza al desmontar
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      visualizer.disconnectAudio(sourceNode);
      audioContext.close();
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Mi Visualizador 200x100</h2>
      
      {/* Canvas configurado explícitamente a 200x100 px */}
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={100} 
        style={{ background: 'black', border: '2px solid #ccc' }} 
      />
      
      <br /><br />
      
      {/* Fuente de Audio (Tu MP3) */}
      <audio 
        ref={audioRef} 
        src="/ruta/a/tu/cancion.mp3" 
        crossOrigin="anonymous" 
        controls 
      />
    </div>
  );
};

export default MinimalVisualizer;
```

### Consideraciones Clave para Evitar Errores

> [!WARNING]
> **Políticas de Autoplay en Navegadores**
> Los navegadores modernos bloquean la reproducción automática de audio si no hay interacción previa del usuario. Asegúrate de que el usuario haga clic en un botón "Play" (o inicie la canción a través del control del `<audio>`) para evitar que el `AudioContext` se quede en estado suspendido (`suspended`).

> [!CAUTION]
> **CORS en el Audio (`crossOrigin="anonymous"`)**
> Si cargas un MP3 desde otro dominio (ej. un bucket de S3 o una API), el servidor de origen debe devolver cabeceras `Access-Control-Allow-Origin`. Si no es así, la Web Audio API bloqueará el acceso a los datos crudos del audio por seguridad y **Butterchurn no se moverá**, aunque sí se escuche la canción.
