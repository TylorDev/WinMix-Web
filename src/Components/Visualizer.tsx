import { useEffect } from "react";

import { useFileContext } from "./../Contexts/FileContext";

function Visualizer({ CreateVisualizer }) {
  const { blobFile, canvasRef } = useFileContext();

  useEffect(() => {
    CreateVisualizer();
  }, [blobFile]);

  return <canvas ref={canvasRef} width={300} height={300} id="canvas" />;
}
export default Visualizer;
