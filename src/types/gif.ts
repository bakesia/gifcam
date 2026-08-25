export type GifFrame = {
  id: string
  file: File
  previewUrl: string
  delayMs: number
  width?: number
  height?: number
}

export type LoopMode = 'forever' | 'once'

export type FitMode = 'contain' | 'crop'

export type OutputSizePreset = 'first-image' | 1920 | 1280 | 720

export type OutputSettings = {
  sizePreset: OutputSizePreset
  fitMode: FitMode
  loopMode: LoopMode
}
