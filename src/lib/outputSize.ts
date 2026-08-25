import type { GifFrame, OutputSizePreset } from '../types/gif'

export const formatSeconds = (milliseconds: number) =>
  `${(milliseconds / 1000).toFixed(1)} SEC`

export const getOutputDimensions = (
  frame: GifFrame | undefined,
  preset: OutputSizePreset,
) => {
  if (!frame?.width || !frame.height) return null
  if (preset === 'first-image') return { width: frame.width, height: frame.height }

  const scale = preset / Math.max(frame.width, frame.height)
  return { width: Math.round(frame.width * scale), height: Math.round(frame.height * scale) }
}

export const formatDimensions = (dimensions: { width: number; height: number } | null) =>
  dimensions ? `${dimensions.width} × ${dimensions.height}` : '— × —'
