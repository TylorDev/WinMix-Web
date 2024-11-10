import { useEffect, useState } from "react";

import "./App.scss";
import AudioVisualizer from "./Components/AudioVisualizer";
import { useFileContext } from "./Contexts/FileContext";

function App() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [audioSource, setAudioSource] = useState<HTMLAudioElement | null>(null);
  const { handleBlobFile, blobFile } = useFileContext();
  // const [audioFile, setAudioFile] = useState<Blob>();
  useEffect(() => {
    window.receiveFile = async (fileContent: string, fileName: string) => {
      handleSetFileName(fileName);
      const { file } = await decodeBase64ToBlob(fileContent, fileName);
      handleBlobFile(file);
    };

    return () => {
      delete window.receiveFile;
    };
  }, [blobFile]);

  // Función para configurar el nombre del archivo
  const handleSetFileName = (fileName: string) => {
    setFileName(`Archivo recibido: ${fileName}`);
  };

  // Función para decodificar Base64 y crear una URL blob
  const decodeBase64ToBlob = async (
    fileContent: string,
    fileName: string
  ): Promise<{ url: string; file: Blob; name: string }> => {
    const binaryString = atob(fileContent);
    const binaryLength = binaryString.length;
    const bytes = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);

    return {
      url,
      file: blob,
      name: fileName,
    };
  };

  const playAudio = () => {
    if (audioSource) audioSource.play();
  };

  const stopAudio = () => {
    if (audioSource) audioSource.pause();
    window.location.reload();
  };
  const handleSetAudioSource = (value: HTMLAudioElement) => {
    if (value) {
      setAudioSource(value);
    }
  };
  return (
    <>
      <div>
        <h1>Archivo Recibido desde C#</h1>
        <p>{fileName}</p>
        <label></label>
        <button onClick={playAudio}>Play Audio</button>
        <button onClick={stopAudio}>Stop Audio</button>
        <AudioVisualizer handleSetAudioSource={handleSetAudioSource} />
      </div>
    </>
  );
}

export default App;
