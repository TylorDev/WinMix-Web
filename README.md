# ¡Hola! Bienvenido a mi proyecto con Butterchurn 🎵

Si acabas de clonar o descargar este repositorio, ¡bienvenido! He preparado esta pequeña guía para contarte qué es lo que vas a encontrar aquí y cómo he configurado la visualización de audio.

## ¿Qué he construido aquí (y qué es Butterchurn)?
En este proyecto he integrado **Butterchurn**, que es básicamente una implementación moderna (en WebGL) del mítico visualizador de audio Milkdrop que todos usábamos en Winamp. Esto me permite renderizar animaciones espectaculares que reaccionan a la música directamente en un Canvas del navegador.

## ¿Cómo logré que el visualizador reaccione a la música?
Para que Butterchurn "escuche" tu archivo `.mp3` y los gráficos se muevan al ritmo de los bajos y agudos, tuve que conectar tres piezas usando la **Web Audio API**:

1. **Contexto de Audio (`AudioContext`)**: Es el motor principal que creé para manejar el audio en la página.
2. **Nodo Fuente (`MediaElementAudioSourceNode`)**: Tomé los datos binarios del elemento `<audio>` (o del archivo que subas) y los inyecté al contexto.
3. **Conexión al Analizador**: Utilicé la función `visualizer.connectAudio()` de Butterchurn para que él mismo analice las frecuencias.

> [!IMPORTANT]
> Un detalle súper importante con el que me topé: el nodo fuente no sólo debe conectarse a Butterchurn, sino que **también debes conectarlo a mis altavoces (`audioContext.destination`)**. Si olvidas esto, ¡el visualizador se moverá pero no escucharás nada!

---

## Si quieres hacer tu propia versión mínima (Ejemplo de 200x100 px)

Si alguna vez quieres replicar esto en otro componente o proyecto desde cero, aquí te dejo la receta mínima que uso para un canvas de 200x100 píxeles.

### 1. Las dependencias que instalé
```bash
npm install butterchurn butterchurn-presets
```

### 2. Mi Componente Base

```tsx
import React, { useEffect, useRef } from 'react';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';

const MinimalVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Guardo la referencia para poder detener la animación si el componente se desmonta
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !audioRef.current) return;

    // 1. Inicializo la Web Audio API
    const audioContext = new AudioContext();
    
    // 2. Extraigo el audio del elemento <audio>
    const sourceNode = audioContext.createMediaElementSource(audioRef.current);
    
    // 3. Lo conecto a la salida (para que suene)
    sourceNode.connect(audioContext.destination);

    // 4. Inicializo Butterchurn en mi Canvas de 200x100
    const visualizer = butterchurn.createVisualizer(audioContext, canvasRef.current, {
      width: 200,
      height: 100
    });

    // 5. Conecto Butterchurn a la fuente
    visualizer.connectAudio(sourceNode);

    // 6. Cargo un Preset (la fórmula de la animación)
    const presets = butterchurnPresets.getPresets();
    const firstPresetKey = Object.keys(presets)[0]; 
    visualizer.loadPreset(presets[firstPresetKey], 0); // 0 indica sin tiempo de transición

    // 7. Mi loop de animación a 60fps
    const renderLoop = () => {
      visualizer.render();
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // 8. Limpio todo cuando me voy
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
      
      {/* Mi Canvas */}
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={100} 
        style={{ background: 'black', border: '2px solid #ccc' }} 
      />
      
      <br /><br />
      
      {/* Mi Reproductor */}
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

### Algunos dolores de cabeza que te quiero ahorrar

> [!WARNING]
> **Políticas de Autoplay en Navegadores**
> Los navegadores van a bloquear el audio si intentas reproducirlo solo. Por eso siempre espero a que el usuario haga clic en un botón de "Play" para reactivar el `AudioContext`.

> [!CAUTION]
> **El temido CORS (`crossOrigin="anonymous"`)**
> Si vas a cargar canciones desde otra URL o servidor externo, asegúrate de que te envíen cabeceras CORS. Si no, vas a escuchar la canción perfectamente, pero **Butterchurn se quedará congelado** por motivos de seguridad del navegador al leer los datos.

---

## ¿Por qué vas a ver una carpeta `Types` en mi código?

Como configuré todo este proyecto con TypeScript (soy un fan del tipado fuerte), me encontré con un problema: `butterchurn` y sus presets son librerías súper antiguas hechas en JavaScript puro. Nadie les ha hecho un `@types/butterchurn`.

Cuando intenté importarlas, TypeScript me gritó un hermoso error:
> *Could not find a declaration file for module 'butterchurn'.*

**¿Cómo lo solucioné?**
Vas a notar que creé una carpeta `src/Types/` con archivos como `butterchurn.d.ts` y `butterchurnPresets.d.ts`. Estos archivos son mi manera de decirle a TypeScript: *"Oye, tranquilo, sé que estas librerías no tienen tipos, pero confía en mí, existen"*. 

También verás un archivo `global.d.ts` donde he declarado variables globales que inyecto manualmente en el objeto `window` (como `window.goToNext` o `window.Navigate`). Con esto, el editor no se queja y me sigue dando el autocompletado en todo el código.

---

## Mi Selección de Presets "VIP" 💎

Si revisas el código (específicamente en `src/Pages/Login/Login.tsx`), notarás que no estoy cargando a ciegas los miles de presets que incluye la librería. Sé que buscar los mejores efectos de Milkdrop entre tanta cantidad puede ser agotador, ¡así que ya hice el trabajo sucio por ti!

He creado una selección curada (mis **Presets VIP**) dividiendo mis favoritos en categorías de calidad (`Perfect`, `Mid`, `Basic`, `incontrolable`). Mi código actúa como un filtro: toma únicamente estos nombres y se los pasa al visualizador. De esta forma te aseguras de tener una experiencia visual increíble desde el primer segundo, sin tener que buscar aguja en un pajar.

---

¡Espero que disfrutes explorando el código! Y recuerda poner buena música mientras lo haces. 🎧
