export type GifFrame = {
  id: string
  file: File
  previewUrl: string
  delayMs: number
  width?: number
  height?: number
}

export type LoopSetting =
  | { type: 'infinite' }
  | { type: 'count'; count: number }

export type FitMode = 'contain' | 'crop'

export type OutputSizePreset = 'first-image' | 1920 | 1280 | 720 | 'custom'

export type BackgroundColor = 'black' | 'white'

export type Dimensions = {
  width: number
  height: number
}

export type OutputSettings = {
  sizePreset: OutputSizePreset
  customWidth: number | null
  customHeight: number | null
  fitMode: FitMode
  backgroundColor: BackgroundColor
  loop: LoopSetting
}

export type GifGenerationStatus = 'idle' | 'encoding' | 'ready' | 'error'

export type GeneratedGif = {
  blob: Blob
  previewUrl: string
  width: number
  height: number
  fileSize: number
  durationMs: number
  frameCount: number
  sourceSignature: string
}
