import type { Dimensions, FitMode } from '../../types/gif'

export type DrawGeometry = {
  sourceX: number
  sourceY: number
  sourceWidth: number
  sourceHeight: number
  destinationX: number
  destinationY: number
  destinationWidth: number
  destinationHeight: number
}

export function calculateFitGeometry(source: Dimensions, output: Dimensions, fitMode: FitMode): DrawGeometry {
  if (fitMode === 'contain') {
    // 두 비율 중 작은 값을 사용해야 이미지 전체가 캔버스 안에 들어오며, 남는 공간은 배경으로 남는다.
    const scale = Math.min(output.width / source.width, output.height / source.height)
    const destinationWidth = source.width * scale
    const destinationHeight = source.height * scale
    return {
      sourceX: 0,
      sourceY: 0,
      sourceWidth: source.width,
      sourceHeight: source.height,
      destinationX: (output.width - destinationWidth) / 2,
      destinationY: (output.height - destinationHeight) / 2,
      destinationWidth,
      destinationHeight,
    }
  }

  // 큰 비율을 사용하면 캔버스를 빈틈없이 채운다. 캔버스 밖으로 나가는 부분은 중앙 기준으로 잘린다.
  const scale = Math.max(output.width / source.width, output.height / source.height)
  const sourceWidth = output.width / scale
  const sourceHeight = output.height / scale
  return {
    sourceX: (source.width - sourceWidth) / 2,
    sourceY: (source.height - sourceHeight) / 2,
    sourceWidth,
    sourceHeight,
    destinationX: 0,
    destinationY: 0,
    destinationWidth: output.width,
    destinationHeight: output.height,
  }
}
