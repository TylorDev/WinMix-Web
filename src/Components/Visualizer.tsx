import { useFileContext } from "./../Contexts/FileContext";

function Visualizer() {
  const { canvasRef } = useFileContext();

  return <canvas ref={canvasRef} width={300} height={300} id="canvas" />;
}
export default Visualizer;
