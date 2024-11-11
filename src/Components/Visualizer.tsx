import { useEffect, useState } from "react";
import { useFileContext } from "./../Contexts/FileContext";

function Visualizer() {
  const { canvasRef, blobFile } = useFileContext();
  const [canvasKey, setCanvasKey] = useState<string>(() => crypto.randomUUID());
  useEffect(() => {
    setCanvasKey(crypto.randomUUID());
  }, [blobFile]);

  return <canvas ref={canvasRef} width={300} height={300} id="canvas" />;
}
export default Visualizer;
