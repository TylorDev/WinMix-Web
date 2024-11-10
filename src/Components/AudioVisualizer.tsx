import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import Visualizer from "./Visualizer";

import { useFileContext } from "./../Contexts/FileContext";

interface Props {
  blobFile: Blob;
  handleSetAudioSource: (audioElement: HTMLAudioElement | null) => void;
}

const AudioVisualizer: React.FC<Props> = ({ handleSetAudioSource }) => {
  const { canvasRef, blobFile } = useFileContext();
  const CreateVisualizer = () => {
    if (blobFile) {
      const audioSource = new Audio(URL.createObjectURL(blobFile));
      audioSource.load();
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audioSource);

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
        randomPresets(visualizer);
        renderFrames(visualizer);
      }

      source.connect(audioContext.destination);
      audioSource.play();
      handleSetAudioSource(audioSource);
    } else {
      handleSetAudioSource(null);
    }
  };

  //Visual

  const randomProperty = (obj: Record<string, Preset>) => {
    const keys = Object.keys(obj);
    return obj[keys[Math.floor(keys.length * Math.random())]];
  };
  const randomPresets = (visualizer: Visualizer) => {
    visualizer.loadPreset(randomProperty(butterchurnPresets.getPresets()), 2);
    setTimeout(() => {
      randomPresets(visualizer);
    }, 10000);
  };
  const renderFrames = (visualizer: Visualizer) => {
    visualizer.render();
    setTimeout(() => {
      renderFrames(visualizer);
    }, 1000 / 60);
  };

  return <Visualizer CreateVisualizer={CreateVisualizer} />;
};

export default AudioVisualizer;
