// global.d.ts
interface Window {
  receiveFile?: (fileContent: string, fileName: string) => void; // Nota el operador '?'
}
