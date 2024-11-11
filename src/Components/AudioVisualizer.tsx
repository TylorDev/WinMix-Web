import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import Visualizer from "./Visualizer";

import { useFileContext } from "./../Contexts/FileContext";

interface Props {
  blobFile: Blob;
}

const AudioVisualizer: React.FC<Props> = () => {
  const { canvasRef, blobFile, handleSetAudioSource } = useFileContext();

  const InitializeAudio = () => {
    if (blobFile) {
      const audioSource = new Audio(URL.createObjectURL(blobFile));
      audioSource.load();
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audioSource);
      RenderVisuals(audioContext, source);
      source.connect(audioContext.destination);
      audioSource.play();
      handleSetAudioSource(audioSource);
    }
  };

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

      visualizer.loadPreset(preset, 0.0); // 2nd argument is the number of seconds to blend presets
      render(visualizer);
    }
  };

  const render = (visualizer: Visualizer) => {
    visualizer.render();
    setTimeout(() => {
      render(visualizer);
    }, 1000 / 60);
  };

  return <Visualizer CreateVisualizer={InitializeAudio} />;
};

export default AudioVisualizer;
