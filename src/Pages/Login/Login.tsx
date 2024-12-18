import { useEffect, useState } from "react";
import { decodeBase64ToBlob } from "../../Utils/Utils";
import { useFileContext } from "../../Contexts/FileContext";
// import AudioVisualizer from "../../Components/AudioVisualizer";
import butterchurnPresets from "butterchurn-presets";
import { useNavigate } from "react-router-dom";

declare global {
  interface Webview {
    postMessage: (message: unknown) => void;
  }

  interface Chrome {
    webview?: Webview;
  }

  interface Window {
    chrome?: Chrome;
    pauseAudio: () => void;
    Navigate: (path: string) => void;
    setVolume: (volume: number) => void;
    setCurrentTime: (time: number) => void;
    playAudio: () => void;
    ActivateBlur: (value: boolean) => void;
  }
}

function Login() {
  const { handleBlobFile, blobFile, audioSource, handleList } =
    useFileContext();
  const [isBlur, setIsBlur] = useState(false);

  const [shapMessage, setShapMessage] = useState(false);
  useEffect(() => {
    handleList(all);
    window.receiveFile = async (
      fileContent: string,
      fileName: string,
      mimeType: string
    ) => {
      try {
        const { file } = await decodeBase64ToBlob(
          fileContent,
          fileName,
          mimeType
        );
        handleBlobFile(file);
        setShapMessage(true);
      } catch (error) {
        console.error("Error al procesar el archivo:", error);
      }
    };

    return () => {
      delete window.receiveFile;
    };
  }, [blobFile]);

  const playAudio = () => {
    if (audioSource) audioSource.play();
    // window.location.reload();
  };

  const stopAudio = () => {
    if (audioSource) audioSource.pause();
    // window.location.reload();
  };

  useEffect(() => {
    console.log(butterchurnPresets.length);
    console.log(Object.getOwnPropertyNames(butterchurnPresets));

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (audioSource) {
      const updateTime = () => {
        const currentTime = audioSource.currentTime || 0;
        setCurrentTime(currentTime);

        const formatter = new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const formattedTime = formatter.format(currentTime);

        // Enviar el tiempo actual al WebView2
        if (window.chrome && window.chrome.webview) {
          if (shapMessage == true) {
            window.chrome.webview.postMessage({
              message: formattedTime,
            });
          }
        }
      };

      audioSource.addEventListener("timeupdate", updateTime);

      // Limpieza de event listeners
      return () => {
        audioSource.removeEventListener("timeupdate", updateTime);
      };
    }
  }, [audioSource]);

  const incontrolable = [
    "$$$ Royal - Mashup (197)",
    "martin - witchcraft reloaded",
    "_Aderrasi - Wanderer in Curved Space - mash0000 - faclempt kibitzing meshuggana schmaltz (Geiss color mix)",
    "gunthry is out back bloodying up the pine trees - adm atomising (v) the disintigrate (n)",
    "_Mig_049",
    "Halfbreak - Light of Breakers",
  ];

  const Perfect = [
    "Geiss - Reaction Diffusion 2",
    "TonyMilkdrop - Magellan's Nebula [Flexi - you enter first + multiverse]",
    "Hexcollie, Pieturp, Orb, Flexi, Geiss n Demon Lord - Premeditative Urination Clause",
    "Zylot - Paint Spill (Music Reactive Paint Mix)",
    "_Geiss - untitled",
    "MilkDrop2077.R033",
    "Flexi, martin + geiss - dedicated to the sherwin maxawow",
    "martin - bombyx mori",
    "martin - disco mix 4",
  ];

  const Mid = [
    "Unchained - Unified Drag 2",
    "martin - another kind of groove",
    "martin - chain breaker",
    "ORB - Waaa",
    "Zylot - True Visionary (Final Mix)",
    "An AdamFX n Martin Infusion 2 flexi - Why The Sky Looks Diffrent Today - AdamFx n Martin Infusion - Tack Tile Disfunction B",
    "Eo.S. - glowsticks v2 05 and proton lights (+Krash′s beat code) _Phat_remix02b",
    "$$$ Royal - Mashup (431)",
    "Rovastar + Loadus + Geiss - FractalDrop (Triple Mix)",
    "_Mig_085",
    "suksma - ed geining hateops - squeakers",
    "suksma - Rovastar - Sunflower Passion (Enlightment Mix)_Phat_edit + flexi und martin shaders - circumflex in character classes in regular expression",
    "yin - 191 - Temporal singularities",
    "martin - angel flight",
    "martin - reflections on black tiles",
  ];

  const Basic = [
    "martin [shadow harlequins shape code] - fata morgana",
    "$$$ Royal - Mashup (220)",
    "Aderrasi - Storm of the Eye (Thunder) - mash0000 - quasi pseudo meta concentrics",
    "Aderrasi + Geiss - Airhandler (Kali Mix) - Canvas Mix",
    "Eo.S. + Zylot - skylight (Stained Glass Majesty mix)",
    "flexi + geiss - pogo cubes vs. tokamak vs. game of life [stahls jelly 4.5 finish]",
    "Geiss - Cauldron - painterly 2 (saturation remix)",
    "cope + flexi - colorful marble (ghost mix)",
    "martin - stormy sea (2010 update)",
    "Aderrasi - Potion of Spirits",
    "Rovastar - Oozing Resistance",
    "shifter - escape (sigur ros)",
    "_Rovastar + Geiss - Hurricane Nightmare (Posterize Mix)",
    "flexi - mom, why the sky looks different today",
    "_Geiss - Artifact 01",
    "suksma - heretical crosscut playpen",
    "Geiss - Thumb Drum",
    "Martin - charisma",
    "suksma - uninitialized variabowl (hydroponic chronic)",
    "Martin - liquid arrows",
    "martin - mucus cervix",
  ];

  const Navigate = useNavigate();

  // Suponiendo que audioSource está disponible en el contexto o como prop
  function setSongTime(seconds: number) {
    // Verificar que audioSource está definido y es un elemento válido
    if (audioSource) {
      // Pausar el audio antes de cambiar el tiempo actual
      audioSource.pause();
      console.log(currentTime);
      // Asegurarse de que los segundos estén dentro de la duración de la canción
      if (seconds >= 0 && seconds <= audioSource.duration) {
        audioSource.currentTime = seconds; // Establecer el tiempo actual
        audioSource.play(); // Reanudar la reproducción
      } else {
        console.warn("Los segundos están fuera del rango de la canción.");
      }
    } else {
      console.error("audioSource no está definido.");
    }
  }

  function setVolume(volumeLevel: number) {
    // Verificar que audioSource está definido y es un elemento válido
    if (audioSource) {
      // Asegurarse de que el nivel de volumen esté en el rango de 0.0 a 1.0
      if (volumeLevel >= 0 && volumeLevel <= 1) {
        audioSource.volume = volumeLevel; // Establecer el volumen
      } else {
        console.warn("El nivel de volumen debe estar entre 0.0 y 1.0.");
      }
    } else {
      console.error("audioSource no está definido.");
    }
  }

  // Implementación
  window.pauseAudio = function () {
    stopAudio(); // Asegúrate de que `stopAudio` esté definida y tipada
  };

  window.Navigate = function (path: string) {
    Navigate(path); // Asegúrate de que `Navigate` esté definida y tipada
  };

  window.setVolume = function (volume: number) {
    setVolume(volume); // Asegúrate de que `setVolume` esté definida y tipada
  };

  window.setCurrentTime = function (time: number) {
    setSongTime(time); // Asegúrate de que `setSongTime` esté definida y tipada
  };

  window.playAudio = function () {
    playAudio(); // Asegúrate de que `playAudio` esté definida y tipada
  };

  window.ActivateBlur = function (value: boolean) {
    setIsBlur(value); // Asegúrate de que `setIsBlur` esté definida y tipada
  };

  const all = [...incontrolable, ...Perfect, ...Mid, ...Basic];

  return (
    <>
      <div>
        {isBlur && <div className="Blur"></div>}
        {/* <button>Click Click Click</button>

        <AudioVisualizer claves={all} /> */}
      </div>
    </>
  );
}
export default Login;
