import type { Dimensions, LoopSetting } from '../../types/gif'

export const GIF_QUALITY = 90
const MAX_FINITE_PLAY_COUNT = 65_536

export class GifGenerationError extends Error {
  userMessage: string

  constructor(userMessage: string, cause?: unknown) {
    super(userMessage, { cause })
    this.name = 'GifGenerationError'
    this.userMessage = userMessage
  }
}

export function validateGifGenerationInput(
  frames: ReadonlyArray<{ delayMs: number }>,
  dimensions: Dimensions | null,
): asserts dimensions is Dimensions {
  if (frames.length < 2) throw new GifGenerationError('GIF를 만들려면 사진을 두 장 이상 추가해 주세요.')
  if (!dimensions || dimensions.width <= 0 || dimensions.height <= 0) {
    throw new GifGenerationError('가로와 세로 크기를 1px 이상 입력해 주세요.')
  }
  if (frames.some((frame) => !Number.isInteger(frame.delayMs) || frame.delayMs <= 0)) {
    throw new GifGenerationError('모든 프레임 시간을 0초보다 크게 입력해 주세요.')
  }
}

export function getGifskiRepeat(loop: LoopSetting) {
  if (loop.type === 'infinite') return -1
  if (!Number.isInteger(loop.count) || loop.count < 1 || loop.count > MAX_FINITE_PLAY_COUNT) {
    throw new GifGenerationError('반복 횟수를 1회 이상 65,536회 이하로 입력해 주세요.')
  }

  // gifski의 유한 repeat 값은 첫 재생 뒤의 추가 반복 횟수라서, UI의 총 재생 횟수보다 1 작다.
  return loop.count - 1
}
