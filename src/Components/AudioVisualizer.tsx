import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import Visualizer from "./Visualizer";

import { useFileContext } from "./../Contexts/FileContext";
import { useEffect, useRef, useState, ChangeEvent } from "react";
// import { useNavigate } from "react-router-dom";
declare global {
  interface Window {
    goToNext: () => void;
    goToPrevious: () => void;
    togglePause: () => void;
  }
}
interface Props {
  claves: string[];
}
const shuffleArray = (array: string[]): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  console.log("Original", array);
  console.log("Mezcla", shuffled);
  return shuffled;
};

const AudioVisualizer: React.FC<Props> = ({ claves }) => {
  const { canvasRef, blobFile, handleSetAudioSource, handleBlobFile, audioSource } = useFileContext();
  const [sourceG, setSourceG] = useState<MediaElementAudioSourceNode>();
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleBlobFile(e.target.files[0]);
      setIsPlayingAudio(true);
    }
  };

  const toggleAudio = () => {
    if (audioSource) {
      if (isPlayingAudio) {
        audioSource.pause();
      } else {
        audioSource.play();
      }
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  useEffect(() => {
    let audioSource: HTMLAudioElement | null = null;
    let audioContext: AudioContext | null = null;
    let source: MediaElementAudioSourceNode | null = null;
    if (source) setSourceG(source);
    const InitializeAudio = () => {
      if (blobFile) {
        audioSource = new Audio(URL.createObjectURL(blobFile));
        audioSource.load();
        audioContext = new AudioContext();
        source = audioContext.createMediaElementSource(audioSource);
        source.connect(audioContext.destination);

        audioSource.play();
        handleSetAudioSource(audioSource);

        // Render visuals with new blobFile, one at a time
        RenderVisuals(audioContext, source);
      }
    };

    // Call InitializeAudio on blobFile change
    InitializeAudio();

    // Cleanup function to stop previous audio and visuals
    return () => {
      if (audioSource) {
        audioSource.pause();
        audioSource = null;
      }
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
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

      // randomPresets(visualizer);

      visualizerRef.current = visualizer;

      // Start rendering the new visual
      render(visualizer);
    }
  };

  ///RANDOM

  const { currentKey, goToNext, goToPrevious, togglePause, paused } =
    useShuffledPresets(claves, visualizerRef.current);

  window.goToNext = goToNext;
  window.goToPrevious = goToPrevious;
  window.togglePause = togglePause;
  //RANDOM ----------------------- FINAL

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

  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      <div style={{ padding: "10px", background: "rgba(0,0,0,0.5)", color: "white", marginBottom: "10px" }}>
        <p>Preset actual: {currentKey}</p>
        <button onClick={goToPrevious}>Anterior Preset</button>
        <button onClick={togglePause}>{paused ? "Reanudar Preset" : "Pausar Preset"}</button>
        <button onClick={goToNext}>Siguiente Preset</button>
      </div>
      <div style={{ padding: "10px", background: "rgba(0,0,0,0.5)", color: "white" }}>
        <p>Control de Canción:</p>
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
        <button onClick={toggleAudio}>{isPlayingAudio ? "Pausar Canción" : "Reproducir Canción"}</button>
      </div>
      <Visualizer />
    </div>
  );
};

export default AudioVisualizer;
const useShuffledPresets = (
  claves: string[],
  visualizer: Visualizer | null
) => {
  const [shuffledKeys, setShuffledKeys] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const WavesObjetList = butterchurnPresets.getPresets();
  useEffect(() => {
    setShuffledKeys(shuffleArray(claves));
    setCurrentIndex(0);
  }, [claves]);

  useEffect(() => {
    if (!paused && visualizer && shuffledKeys.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((prevIndex) => {
          let nextIndex = (prevIndex + 1) % shuffledKeys.length;
          let nextKey = shuffledKeys[nextIndex];

          // Buscar la siguiente clave válida
          while (!WavesObjetList[nextKey] && nextIndex !== prevIndex) {
            nextIndex = (nextIndex + 1) % shuffledKeys.length;
            nextKey = shuffledKeys[nextIndex];
          }

          if (!WavesObjetList[nextKey]) {
            console.error(`No hay claves válidas para avanzar.`);
            return prevIndex; // No avanza si no hay claves válidas
          }

          try {
            visualizer.loadPreset(WavesObjetList[nextKey], 2);
          } catch (error) {
            console.error(
              `Error al cargar el preset para la clave '${nextKey}':`,
              error
            );
          }

          return nextIndex;
        });
      }, 6000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [paused, visualizer, shuffledKeys]);

  const goToNext = () => {
    if (!visualizer) return;

    setCurrentIndex((prevIndex) => {
      let nextIndex = (prevIndex + 1) % shuffledKeys.length;
      let nextKey = shuffledKeys[nextIndex];

      // Buscar la siguiente clave válida
      while (!WavesObjetList[nextKey] && nextIndex !== prevIndex) {
        nextIndex = (nextIndex + 1) % shuffledKeys.length;
        nextKey = shuffledKeys[nextIndex];
      }

      if (!WavesObjetList[nextKey]) {
        console.error(`No hay claves válidas para avanzar.`);
        return prevIndex; // No avanza si no hay claves válidas
      }

      try {
        visualizer.loadPreset(WavesObjetList[nextKey], 2);
      } catch (error) {
        console.error(
          `Error al cargar el preset para la clave '${nextKey}':`,
          error
        );
      }

      return nextIndex;
    });
  };

  const goToPrevious = () => {
    if (!visualizer) return;

    setCurrentIndex((prevIndex) => {
      let prevIndexAdjusted =
        (prevIndex - 1 + shuffledKeys.length) % shuffledKeys.length;
      let prevKey = shuffledKeys[prevIndexAdjusted];

      // Buscar la clave anterior válida
      while (!WavesObjetList[prevKey] && prevIndexAdjusted !== prevIndex) {
        prevIndexAdjusted =
          (prevIndexAdjusted - 1 + shuffledKeys.length) % shuffledKeys.length;
        prevKey = shuffledKeys[prevIndexAdjusted];
      }

      if (!WavesObjetList[prevKey]) {
        console.error(`No hay claves válidas para retroceder.`);
        return prevIndex; // No retrocede si no hay claves válidas
      }

      try {
        visualizer.loadPreset(WavesObjetList[prevKey], 2);
      } catch (error) {
        console.error(
          `Error al cargar el preset para la clave '${prevKey}':`,
          error
        );
      }

      return prevIndexAdjusted;
    });
  };

  const togglePause = () => setPaused((prev) => !prev);

  return {
    currentKey: shuffledKeys[currentIndex] || null,
    goToNext,
    goToPrevious,
    togglePause,
    paused,
  };
};
