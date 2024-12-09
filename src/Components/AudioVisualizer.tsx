import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import Visualizer from "./Visualizer";

import { useFileContext } from "./../Contexts/FileContext";
import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

interface Props {
  claves: string[];
}

const AudioVisualizer: React.FC<Props> = ({ claves }) => {
  const { canvasRef, blobFile, handleSetAudioSource } = useFileContext();

  const [audioSource, setAudioSource] = useState<HTMLAudioElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceG, setSourceG] = useState<MediaElementAudioSourceNode | null>(
    null
  );

  const WavesObjetList = butterchurnPresets.getPresets();

  // Inicializa el audio
  const initializeAudio = () => {
    if (blobFile) {
      // Crear y configurar elementos de audio
      const newAudioSource = new Audio(URL.createObjectURL(blobFile));
      const newAudioContext = new AudioContext();
      const newSource =
        newAudioContext.createMediaElementSource(newAudioSource);

      newSource.connect(newAudioContext.destination);

      // Reproducir audio
      newAudioSource.load();
      newAudioSource.play();

      // Guardar estados y manejar la fuente
      setAudioSource(newAudioSource);
      setAudioContext(newAudioContext);
      setSourceG(newSource);
      handleSetAudioSource(newAudioSource);

      // Renderizar visuales
      RenderVisuals(newAudioContext, newSource);
    }
  };

  // Limpia el estado de audio y contexto
  const cleanupAudio = () => {
    if (audioSource) {
      audioSource.pause();
      setAudioSource(null);
    }
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
  };

  // Efecto para ejecutar la inicialización y limpieza al cambiar `blobFile`
  useEffect(() => {
    initializeAudio();

    return () => {
      cleanupAudio();
    };
  }, [blobFile]);

  // Add a ref to store the current visualizer instance
  const visualizerRef = useRef<Visualizer | null>(null);
  // Add a ref to store the animation frame ID

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas && visualizerRef.current) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        visualizerRef.current.setRendererSize(
          window.innerWidth,
          window.innerHeight
        );
      }
    };

    resizeCanvas(); // Ajusta el tamaño al cargar.
    window.addEventListener("resize", resizeCanvas); // Escucha cambios de tamaño.

    return () => window.removeEventListener("resize", resizeCanvas); // Limpia el listener.
  }, [canvasRef]);

  const animationFrameRef = useRef<number | null>(null);

  const RenderVisuals = (
    audioContext: AudioContext,
    source: MediaElementAudioSourceNode
  ) => {
    // First, clean up any existing visualizer
    if (visualizerRef.current) {
      // Stop the current animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      // Disconnect the audio
      if (sourceG) visualizerRef.current.disconnectAudio(sourceG);
      visualizerRef.current = null;
    }

    if (canvasRef.current) {
      canvasRef.current.height = window.innerHeight;
      canvasRef.current.width = window.innerWidth;
      const visualizer = butterchurn.createVisualizer(
        audioContext,
        canvasRef.current,
        {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      );

      visualizer.connectAudio(source);

      randomPresets(visualizer);

      visualizerRef.current = visualizer;

      // Start rendering the new visual
      render(visualizer);
    }
  };
  const [lastPresetKey, setLastPresetKey] = useState<string | null>(null);

  const getRandomProperty = <T,>(
    obj: Record<string, T>,
    excludeKey: string | null
  ): T => {
    const keys = Object.keys(obj).filter((key) => key !== excludeKey);
    if (keys.length === 0) {
      throw new Error("No hay propiedades disponibles para seleccionar.");
    }
    const randomIndex = Math.floor(Math.random() * keys.length);
    return obj[keys[randomIndex]];
  };

  const randomPresets = (visualizer: Visualizer) => {
    const clavesAConservar: string[] = claves; // `claves` debe estar definido y tipado
    const PresetsFiltrados = Object.keys(WavesObjetList)
      .filter((clave) => clavesAConservar.includes(clave))
      .reduce<Record<string, Preset>>((obj, clave) => {
        obj[clave] = WavesObjetList[clave];
        return obj;
      }, {});

    if (Object.keys(PresetsFiltrados).length === 0) {
      console.warn("No hay presets disponibles para seleccionar.");
      return;
    }

    const selectedPreset = getRandomProperty(PresetsFiltrados, lastPresetKey);
    const selectedKey = Object.keys(PresetsFiltrados).find(
      (key) => PresetsFiltrados[key] === selectedPreset
    );

    if (selectedKey) setLastPresetKey(selectedKey);

    visualizer.loadPreset(selectedPreset, 2);

    setTimeout(() => {
      randomPresets(visualizer); // Recursión con el visualizador como parámetro
    }, 6000);
  };

  const render = (visualizer: Visualizer) => {
    visualizer.render();
    // Use requestAnimationFrame instead of setTimeout for smoother animation
    animationFrameRef.current = requestAnimationFrame(() => {
      render(visualizer);
    });
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (visualizerRef.current) {
        if (sourceG) visualizerRef.current.disconnectAudio(sourceG);
      }
    };
  }, []);

  return <Visualizer />;
};

export default AudioVisualizer;
