import type {
  BackgroundColor,
  Dimensions,
  FitMode,
  GifGenerationProgress,
  LoopSetting,
} from '../../types/gif'

export type GifWorkerFrame = {
  file: File
  delayMs: number
}

export type GifWorkerRequest = {
  type: 'generate'
  jobId: number
  frames: GifWorkerFrame[]
  dimensions: Dimensions
  settings: {
    fitMode: FitMode
    backgroundColor: BackgroundColor
    loop: LoopSetting
  }
}

export type GifWorkerResponse =
  | {
      type: 'progress'
      jobId: number
      progress: GifGenerationProgress
    }
  | {
      type: 'success'
      jobId: number
      buffer: ArrayBuffer
    }
  | {
      type: 'error'
      jobId: number
      message: string
      detail?: string
    }
