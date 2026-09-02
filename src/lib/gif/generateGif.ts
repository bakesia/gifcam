import type { Dimensions, GifFrame, LoopSetting, OutputSettings } from '../../types/gif'
import { renderFrameToCanvas } from '../image/renderFrame'

const GIF_QUALITY = 90
const MAX_FINITE_PLAY_COUNT = 65_536

export class GifGenerationError extends Error {
  userMessage: string

  constructor(userMessage: string, cause?: unknown) {
    super(userMessage, { cause })
    this.name = 'GifGenerationError'
    this.userMessage = userMessage
  }
}

type GenerateGifOptions = {
  frames: GifFrame[]
  dimensions: Dimensions | null
  settings: OutputSettings
}

const getGifskiRepeat = (loop: LoopSetting) => {
  if (loop.type === 'infinite') return -1
  if (!Number.isInteger(loop.count) || loop.count < 1 || loop.count > MAX_FINITE_PLAY_COUNT) {
    throw new GifGenerationError('반복 횟수를 1회 이상 65,536회 이하로 입력해 주세요.')
  }

  // gifski의 유한 repeat 값은 첫 재생 뒤의 추가 반복 횟수라서, UI의 총 재생 횟수보다 1 작다.
  return loop.count - 1
}

export async function generateGif({ frames, dimensions, settings }: GenerateGifOptions) {
  if (frames.length < 2) throw new GifGenerationError('GIF를 만들려면 사진을 두 장 이상 추가해 주세요.')
  if (!dimensions || dimensions.width <= 0 || dimensions.height <= 0) {
    throw new GifGenerationError('가로와 세로 크기를 1px 이상 입력해 주세요.')
  }
  if (frames.some((frame) => !Number.isInteger(frame.delayMs) || frame.delayMs <= 0)) {
    throw new GifGenerationError('모든 프레임 시간을 0초보다 크게 입력해 주세요.')
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new GifGenerationError('이미지를 처리할 수 없는 브라우저 환경입니다.')

  const preparedFrames: ImageData[] = []

  try {
    for (const frame of frames) {
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
