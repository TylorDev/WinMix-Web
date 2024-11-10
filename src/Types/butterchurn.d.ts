declare module "butterchurn";

interface Visualizer {
  connectAudio(audioNode: AudioNode): void;
  disconnectAudio(audioNode: AudioNode): void;
  loadPreset(preset: Preset, blendTime?: number): void;
  loadExtraImages(imageData: Array<string>): void;
  setRendererSize(width: number, height: number): void;
  setInternalMeshSize(width: number, height: number): void;
  setOutputAA(useAA: boolean): void;
  render(): void;
  launchSongTitleAnim(text: string): void;
  toDataURL(): string;
  warpBufferToDataURL(): string;
}
