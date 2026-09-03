import type { BackgroundColor, Dimensions, FitMode } from '../../types/gif'
import { calculateFitGeometry } from './fitImage'

type RenderFrameOptions = {
  dimensions: Dimensions
  fitMode: FitMode
  backgroundColor: BackgroundColor
}

export function renderFrameToCanvas(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  image: CanvasImageSource & { width: number; height: number },
  options: RenderFrameOptions,
) {
  canvas.width = options.dimensions.width
  canvas.height = options.dimensions.height

  const context = canvas.getContext('2d') as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null
  if (!context) return

  context.fillStyle = options.backgroundColor === 'black' ? '#000000' : '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  const geometry = calculateFitGeometry(
    { width: image.width, height: image.height },
    options.dimensions,
    options.fitMode,
  )

  // source 좌표는 원본에서 읽을 영역, destination 좌표는 출력 캔버스에 그릴 위치를 뜻한다.
  context.drawImage(
    image,
    geometry.sourceX,
    geometry.sourceY,
    geometry.sourceWidth,
    geometry.sourceHeight,
    geometry.destinationX,
    geometry.destinationY,
    geometry.destinationWidth,
    geometry.destinationHeight,
  )
}
