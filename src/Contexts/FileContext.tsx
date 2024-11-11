import { createContext, useContext, useState, ReactNode, useRef } from "react";

// Define el tipo para el contexto (vacío en este caso)
interface FileContextType {
  blobFile: Blob | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  handleBlobFile: (value: Blob) => void;
  audioSource: HTMLAudioElement | null;
  handleSetAudioSource: (value: HTMLAudioElement) => void;
}

// Crea el contexto vacío
const FileContext = createContext<FileContextType | undefined>(undefined);

// Crea el hook personalizado para acceder al contexto
export const useFileContext = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileContextProvider");
  }
  return context;
};

// Crea el proveedor del contexto
interface FileContextProviderProps {
  children: ReactNode;
}

export const FileContextProvider: React.FC<FileContextProviderProps> = ({
  children,
}) => {
  const [blobFile, setBlobFile] = useState<Blob | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioSource, setAudioSource] = useState<HTMLAudioElement | null>(null);

  const handleSetAudioSource = (value: HTMLAudioElement) => {
    if (value) {
      setAudioSource(value);
    }
  };
  const handleBlobFile = (value: Blob) => {
    setBlobFile(value);
  };

  const value: FileContextType = {
    blobFile,
    canvasRef,
    handleBlobFile,
    audioSource,
    handleSetAudioSource,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};
