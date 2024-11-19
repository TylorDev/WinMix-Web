import { useEffect } from "react";
import { decodeBase64ToBlob } from "../../Utils/Utils";
import { useFileContext } from "../../Contexts/FileContext";
import AudioVisualizer from "../../Components/AudioVisualizer";

function Login() {
  const { handleBlobFile, blobFile, audioSource } = useFileContext();

  useEffect(() => {
    window.receiveFile = async (fileContent: string, fileName: string) => {
      const { file } = await decodeBase64ToBlob(fileContent, fileName);
      handleBlobFile(file);
    };

    return () => {
      delete window.receiveFile;
    };
  }, [blobFile]);

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

  useEffect(() => {
    async function fetchAudio() {
      try {
        const response = await fetch("/Don.mp3"); // Cambia la ruta según corresponda
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

        handleBlobFile(blob);
        // Crear una URL para usar el blob como fuente de audio
      } catch (error) {
        console.error("Error al cargar el audio:", error);
      }
    }

    fetchAudio();
  }, []);

  return (
    <>
      <div>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          placeholder="xd"
        />
        <button onClick={playAudio}>Play Audio</button>
        <button onClick={stopAudio}>Stop Audio</button>
        <AudioVisualizer />
      </div>
    </>
  );
}
export default Login;
