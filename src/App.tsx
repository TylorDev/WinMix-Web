import { useEffect, useState } from "react";

import "./App.scss";
import AudioVisualizer from "./Components/AudioVisualizer";
import { useFileContext } from "./Contexts/FileContext";
import { decodeBase64ToBlob } from "./Utils/Utils";

function App() {
  const [fileName, setFileName] = useState<string | null>(null);

  const { handleBlobFile, blobFile, audioSource } = useFileContext();

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

  const playAudio = () => {
    if (audioSource) audioSource.play();
  };

  const stopAudio = () => {
    if (audioSource) audioSource.pause();
    window.location.reload();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleBlobFile(file);
    }
  };

  return (
    <>
      <div>
        <h1>Archivo Recibido desde C#</h1>
        <p>{fileName}</p>
        <label></label>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={playAudio}>Play Audio</button>
        <button onClick={stopAudio}>Stop Audio</button>
        <AudioVisualizer />
      </div>
    </>
  );
}

export default App;
