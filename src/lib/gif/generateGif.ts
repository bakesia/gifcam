import type { Dimensions, GifFrame, OutputSettings } from '../../types/gif'
import { renderFrameToCanvas } from '../image/renderFrame'
import type { GifGenerationProgress } from '../../types/gif'
import {
  GIF_QUALITY,
  GifGenerationError,
  getGifskiRepeat,
  validateGifGenerationInput,
} from './gifOptions'

type GenerateGifOptions = {
  frames: GifFrame[]
  dimensions: Dimensions | null
  settings: OutputSettings
  onProgress?: (progress: GifGenerationProgress) => void
}

export async function generateGif({ frames, dimensions, settings, onProgress }: GenerateGifOptions) {
  validateGifGenerationInput(frames, dimensions)
  onProgress?.({ stage: 'preparing' })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new GifGenerationError('이미지를 처리할 수 없는 브라우저 환경입니다.')

  const preparedFrames: ImageData[] = []

  try {
    for (const [index, frame] of frames.entries()) {
      onProgress?.({ stage: 'rendering', currentFrame: index + 1, totalFrames: frames.length })
      let bitmap: ImageBitmap
      try {
        bitmap = await createImageBitmap(frame.file)
      } catch (error) {
        throw new GifGenerationError('이미지를 불러오지 못했습니다. 파일을 확인해 주세요.', error)
      }

      try {
        renderFrameToCanvas(canvas, bitmap, {
          dimensions,
          fitMode: settings.fitMode,
          backgroundColor: settings.backgroundColor,
        })

        // Canvas에 그린 최종 프레임의 RGBA 픽셀을 현재 배열 순서대로 인코더에 넘긴다.
        preparedFrames.push(context.getImageData(0, 0, dimensions.width, dimensions.height))
      } catch (error) {
        throw new GifGenerationError('프레임을 출력 크기로 변환하지 못했습니다.', error)
      } finally {
        bitmap.close()
      }
    }

    onProgress?.({ stage: 'encoding' })
    const { default: encode } = await import('gifski-wasm')
    const encoded = await encode({
      frames: preparedFrames,
      width: dimensions.width,
      height: dimensions.height,
      // 앱의 delayMs와 gifski-wasm의 frameDurations는 모두 밀리초 단위다.
      frameDurations: frames.map((frame) => frame.delayMs),
      quality: GIF_QUALITY,
      repeat: getGifskiRepeat(settings.loop),
    })
    onProgress?.({ stage: 'finalizing' })
    const bytes = Uint8Array.from(encoded)
    return new Blob([bytes.buffer], { type: 'image/gif' })
  } catch (error) {
    if (error instanceof GifGenerationError) throw error
    throw new GifGenerationError('GIF를 만드는 중 문제가 발생했습니다. 다시 시도해 주세요.', error)
  } finally {
    // 픽셀 배열은 큰 메모리를 사용하므로 인코딩이 끝나는 즉시 참조와 임시 Canvas 버퍼를 비운다.
    preparedFrames.length = 0
    canvas.width = 1
    canvas.height = 1
  }
}
