import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import Visualizer from "./Visualizer";

import { useFileContext } from "./../Contexts/FileContext";
import { useEffect, useRef, useState } from "react";
import mypreset from "../Presets/mypreset.json";
import other from "../Presets/other.json";
interface Props {
  claves: string[];
}

const AudioVisualizer: React.FC<Props> = ({ claves }) => {
  const { canvasRef, blobFile, handleSetAudioSource } = useFileContext();
  const [sourceG, setSourceG] = useState<MediaElementAudioSourceNode>();
  const WavesObjetList = butterchurnPresets.getPresets();

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

      randomPresets(visualizer);

      visualizerRef.current = visualizer;

      // Start rendering the new visual
      render(visualizer);
    }
  };

  const randomProperty = (obj: Record<string, Preset>): Preset => {
    const keys = Object.keys(obj);
    return obj[keys[(keys.length * Math.random()) << 0]];
  };

  const randomPresets = (visualizer: Visualizer): void => {
    const clavesAConservar: string[] = claves; // Asegúrate de que `claves` esté definido y tipado correctamente
    const perrosFiltrados = Object.keys(WavesObjetList)
      .filter((clave) => clavesAConservar.includes(clave))
      .reduce((obj: Record<string, Preset>, clave: string) => {
        obj[clave] = WavesObjetList[clave];
        return obj;
      }, {});

    // console.log(randomProperty(perrosFiltrados));
    visualizer.loadPreset(other, 2); // Carga un preset aleatorio
    setTimeout(() => {
      randomPresets(visualizer);
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
