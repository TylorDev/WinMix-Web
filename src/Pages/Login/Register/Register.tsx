import { useEffect, useState } from "react";
import { useFileContext } from "../../../Contexts/FileContext";
import AudioVisualizer from "../../../Components/AudioVisualizer";

interface Props {
  preset: string;
}
function Register({ preset }: Props) {
  const { handleBlobFile } = useFileContext();
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

  return <AudioVisualizer currentpreset={preset} />;
}
export default Register;
