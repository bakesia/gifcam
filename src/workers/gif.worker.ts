import encode from 'gifski-wasm'
import { renderFrameToCanvas } from '../lib/image/renderFrame'
import {
  GIF_QUALITY,
  GifGenerationError,
  getGifskiRepeat,
  validateGifGenerationInput,
} from '../lib/gif/gifOptions'
import type { GifWorkerRequest, GifWorkerResponse } from '../lib/gif/workerMessages'
import type { GifGenerationProgress } from '../types/gif'

type GifWorkerScope = {
  onmessage: ((event: MessageEvent<GifWorkerRequest>) => void) | null
  postMessage: (message: GifWorkerResponse, transfer?: Transferable[]) => void
}

const workerScope = self as unknown as GifWorkerScope

function postProgress(jobId: number, progress: GifGenerationProgress) {
  workerScope.postMessage({ type: 'progress', jobId, progress })
}

async function generateInWorker(request: GifWorkerRequest) {
  const { jobId, frames, dimensions, settings } = request
  validateGifGenerationInput(frames, dimensions)

  if (typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') {
    throw new GifGenerationError('이 브라우저에서는 백그라운드 이미지 처리를 사용할 수 없습니다.')
  }

  postProgress(jobId, { stage: 'preparing' })

  const canvas = new OffscreenCanvas(dimensions.width, dimensions.height)
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new GifGenerationError('이미지를 처리할 수 없는 브라우저 환경입니다.')

  const preparedFrames: ImageData[] = []

  try {
    for (const [index, frame] of frames.entries()) {
      postProgress(jobId, {
        stage: 'rendering',
        currentFrame: index + 1,
        totalFrames: frames.length,
      })

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
        preparedFrames.push(context.getImageData(0, 0, dimensions.width, dimensions.height))
      } catch (error) {
        throw new GifGenerationError('프레임을 출력 크기로 변환하지 못했습니다.', error)
      } finally {
        bitmap.close()
      }
    }

    postProgress(jobId, { stage: 'encoding' })
    const encoded = await encode({
      frames: preparedFrames,
      width: dimensions.width,
      height: dimensions.height,
      frameDurations: frames.map((frame) => frame.delayMs),
      quality: GIF_QUALITY,
      repeat: getGifskiRepeat(settings.loop),
    })
    postProgress(jobId, { stage: 'finalizing' })

    const outputBuffer = Uint8Array.from(encoded).buffer
    // 완성된 GIF 버퍼의 소유권을 넘겨 Worker와 main thread 사이의 추가 복사를 막는다.
    workerScope.postMessage({ type: 'success', jobId, buffer: outputBuffer }, [outputBuffer])
  } finally {
    preparedFrames.length = 0
    canvas.width = 1
    canvas.height = 1
  }
}

workerScope.onmessage = (event) => {
  const request = event.data
  if (request.type !== 'generate') return

  void generateInWorker(request).catch((error: unknown) => {
    workerScope.postMessage({
      type: 'error',
      jobId: request.jobId,
      message:
        error instanceof GifGenerationError
          ? error.userMessage
          : 'GIF를 만드는 중 문제가 발생했습니다.',
      detail: error instanceof Error ? error.message : undefined,
    })
  })
}
