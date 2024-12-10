import { useEffect } from "react";
import { useFileContext } from "../../../Contexts/FileContext";
// import AudioVisualizer from "../../../Components/AudioVisualizer";

function Register() {
  const { handleBlobFile, handleList } = useFileContext();

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
    handleList(estatic);
    fetchAudio();
  }, []);

  const estatic = [
    "Cope - The Neverending Explosion of Red Liquid Fire",
    "cope + martin - mother-of-pearl",
    "martin - mandelbox explorer - high speed demo version",
    "martin - castle in the air",
    "martin - frosty caves 2",
    "fiShbRaiN + Flexi - witchcraft 2.0",
    "Flexi - truly soft piece of software - this is generic texturing (Jelly)",
    "Flexi, fishbrain, Geiss + Martin - tokamak witchery",
    "flexi + amandio c - organic12-3d-2.milk",
    "Flexi - area 51",
  ];

  return <div>{/* <AudioVisualizer claves={estatic} />; */}</div>;
}
export default Register;
