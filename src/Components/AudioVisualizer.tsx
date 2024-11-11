import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import Visualizer from "./Visualizer";

import { useFileContext } from "./../Contexts/FileContext";
import { useEffect, useState } from "react";

interface Props {
  blobFile: Blob;
}

const AudioVisualizer: React.FC<Props> = () => {
  const { canvasRef, blobFile, handleSetAudioSource } = useFileContext();

  useEffect(() => {
    let audioSource: HTMLAudioElement | null = null;
    let audioContext: AudioContext | null = null;
    let source: MediaElementAudioSourceNode | null = null;

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

  const RenderVisuals = (
    audioContext: AudioContext,
    source: MediaElementAudioSourceNode
  ) => {
    if (canvasRef.current) {
      const visualizer = butterchurn.createVisualizer(
        audioContext,
        canvasRef.current,
        {
          width: canvasRef.current.width,
          height: canvasRef.current.height,
        }
      );
      visualizer.connectAudio(source);

      const presets = butterchurnPresets.getPresets();
      const preset =
        presets["Flexi, martin + geiss - dedicated to the sherwin maxawow"];
      visualizer.loadPreset(preset, 0.0); // Blend time set to 0 for immediate loading

      // Start rendering the new visual
      render(visualizer);
    }
  };

  const render = (visualizer: Visualizer) => {
    visualizer.render();
    setTimeout(() => {
      render(visualizer);
    }, 1000 / 60);
  };

  return <Visualizer />;
};

export default AudioVisualizer;
