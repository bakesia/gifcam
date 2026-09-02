import type { Dimensions, GifFrame, OutputSettings } from '../types/gif'

export const MIN_OUTPUT_DIMENSION = 1

export const isValidOutputDimension = (dimension: number | null): dimension is number =>
  typeof dimension === 'number' && Number.isInteger(dimension) && dimension >= MIN_OUTPUT_DIMENSION

export const formatSeconds = (milliseconds: number) =>
  `${(milliseconds / 1000).toFixed(1)} SEC`

export const getOutputDimensions = (frame: GifFrame | undefined, settings: OutputSettings): Dimensions | null => {
  if (!frame?.width || !frame.height) return null
  if (settings.sizePreset === 'first-image') return { width: frame.width, height: frame.height }
  if (settings.sizePreset === 'custom') {
    if (!isValidOutputDimension(settings.customWidth) || !isValidOutputDimension(settings.customHeight)) return null
    return {
      width: settings.customWidth,
      height: settings.customHeight,
    }
  }

  // 작은 원본은 키우지 않고, 긴 변이 프리셋을 넘는 경우에만 비율을 유지해 축소한다.
  const scale = Math.min(1, settings.sizePreset / Math.max(frame.width, frame.height))
  return { width: Math.round(frame.width * scale), height: Math.round(frame.height * scale) }
}

export const formatDimensions = (dimensions: Dimensions | null) =>
  dimensions ? `${dimensions.width} × ${dimensions.height}` : '— × —'
