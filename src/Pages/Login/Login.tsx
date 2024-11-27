import { useEffect } from "react";
import { decodeBase64ToBlob } from "../../Utils/Utils";
import { useFileContext } from "../../Contexts/FileContext";
import AudioVisualizer from "../../Components/AudioVisualizer";
import butterchurnPresets from "butterchurn-presets";
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

  const sendMessageToCSharp = () => {
    // Verifica si la función existe (para evitar errores en el navegador)
    if (window.chrome && window.chrome.webview) {
      window.chrome.webview.postMessage({ message: "¡Hola desde React!" });
    } else {
      console.log("WebView2 no disponible");
    }
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

  // const incontrolable = [
  //   "$$$ Royal - Mashup (197)",
  //   "martin - witchcraft reloaded",
  //   "_Aderrasi - Wanderer in Curved Space - mash0000 - faclempt kibitzing meshuggana schmaltz (Geiss color mix)",
  //   "gunthry is out back bloodying up the pine trees - adm atomising (v) the disintigrate (n)",
  //   "_Mig_049",
  //   "Halfbreak - Light of Breakers",
  // ];

  // const Perfect = [
  //   "Geiss - Reaction Diffusion 2",
  //   "TonyMilkdrop - Magellan's Nebula [Flexi - you enter first + multiverse]",
  //   "Hexcollie, Pieturp, Orb, Flexi, Geiss n Demon Lord - Premeditative Urination Clause",
  //   "Zylot - Paint Spill (Music Reactive Paint Mix)",
  //   "_Geiss - untitled",
  //   "MilkDrop2077.R033",
  //   "Flexi, martin + geiss - dedicated to the sherwin maxawow",
  //   "martin - bombyx mori",
  //   "martin - disco mix 4",
  // ];

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

  // const Basic = [
  //   "martin [shadow harlequins shape code] - fata morgana",
  //   "$$$ Royal - Mashup (220)",
  //   "Aderrasi - Storm of the Eye (Thunder) - mash0000 - quasi pseudo meta concentrics",
  //   "Aderrasi + Geiss - Airhandler (Kali Mix) - Canvas Mix",
  //   "Eo.S. + Zylot - skylight (Stained Glass Majesty mix)",
  //   "flexi + geiss - pogo cubes vs. tokamak vs. game of life [stahls jelly 4.5 finish]",
  //   "Geiss - Cauldron - painterly 2 (saturation remix)",
  //   "cope + flexi - colorful marble (ghost mix)",
  //   "martin - stormy sea (2010 update)",
  //   "Aderrasi - Potion of Spirits",
  //   "Rovastar - Oozing Resistance",
  //   "shifter - escape (sigur ros)",
  //   "_Rovastar + Geiss - Hurricane Nightmare (Posterize Mix)",
  //   "flexi - mom, why the sky looks different today",
  //   "_Geiss - Artifact 01",
  //   "suksma - heretical crosscut playpen",
  //   "Geiss - Thumb Drum",
  //   "Martin - charisma",
  //   "suksma - uninitialized variabowl (hydroponic chronic)",
  //   "Martin - liquid arrows",
  //   "martin - mucus cervix",
  // ];

  const estatic = [
    "Cope - The Neverending Explosion of Red Liquid Fire",
    "cope + martin - mother-of-pearl",
    "martin - mandelbox explorer - high speed demo version",
    "martin - castle in the air",
    "martin - frosty caves 2",
    "fiShbRaiN + Flexi - witchcraft 2.0",
    "Flexi - truly soft piece of software - this is generic texturing (Jelly)",
    "Flexi, fishbrain, Geiss + Martin - tokamak witchery",
    "Unchained - Rewop",
    "flexi - bouncing balls [double mindblob neon mix]",
    "flexi + amandio c - organic12-3d-2.milk",
    "Flexi - area 51",
    "flexi + fishbrain - neon mindblob grafitti",
  ];

  // const all = [...incontrolable, ...Perfect, ...Mid, ...Basic];

  return (
    <>
      <div>
        {/* <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          placeholder="xd"
        />

        <button onClick={stopAudio}>Stop Audio</button> */}
        <button onClick={sendMessageToCSharp}>send</button>
        <AudioVisualizer claves={[...Mid, ...estatic]} />
      </div>
    </>
  );
}
export default Login;
