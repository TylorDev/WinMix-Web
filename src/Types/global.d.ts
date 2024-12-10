// global.d.ts
interface Window {
  receiveFile?: (
    fileContent: string,
    fileName: string,
    mimeType: string
  ) => void; // Nota el operador '?'
}
