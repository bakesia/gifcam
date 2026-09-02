import { useCallback, useEffect, useRef, useState } from 'react'
import { generateGif, GifGenerationError } from '../lib/gif/generateGif'
import type { Dimensions, GeneratedGif, GifFrame, GifGenerationStatus, OutputSettings } from '../types/gif'

type GenerateOptions = {
  frames: GifFrame[]
  dimensions: Dimensions | null
  settings: OutputSettings
  sourceSignature: string
}

export function useGifGeneration() {
  const [status, setStatus] = useState<GifGenerationStatus>('idle')
  const [result, setResult] = useState<GeneratedGif | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const resultUrlRef = useRef<string | null>(null)
  const activeJobRef = useRef(0)
  const isEncodingRef = useRef(false)

  const clearResult = useCallback(() => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
    resultUrlRef.current = null
    setResult(null)
  }, [])

  const invalidateResult = useCallback(() => {
    activeJobRef.current += 1
    clearResult()
    setErrorMessage(null)
    if (!isEncodingRef.current) setStatus('idle')
  }, [clearResult])

  const createGif = useCallback(async ({ frames, dimensions, settings, sourceSignature }: GenerateOptions) => {
    if (isEncodingRef.current) return

    const jobId = activeJobRef.current + 1
    activeJobRef.current = jobId
    isEncodingRef.current = true
    clearResult()
    setErrorMessage(null)
    setStatus('encoding')

    try {
      const blob = await generateGif({ frames, dimensions, settings })
      if (activeJobRef.current !== jobId) return

      const previewUrl = URL.createObjectURL(blob)
      resultUrlRef.current = previewUrl
      setResult({
        blob,
        previewUrl,
        width: dimensions?.width ?? 0,
        height: dimensions?.height ?? 0,
        fileSize: blob.size,
        durationMs: frames.reduce((total, frame) => total + frame.delayMs, 0),
        frameCount: frames.length,
        sourceSignature,
      })
      setStatus('ready')
    } catch (error) {
      console.error('GIF 생성 실패', error)
      if (activeJobRef.current !== jobId) return
      setErrorMessage(error instanceof GifGenerationError ? error.userMessage : 'GIF를 만드는 중 문제가 발생했습니다.')
      setStatus('error')
    } finally {
      isEncodingRef.current = false
      if (activeJobRef.current !== jobId) setStatus('idle')
    }
  }, [clearResult])

  const downloadResult = useCallback(() => {
    if (!resultUrlRef.current) return
    const link = document.createElement('a')
    link.href = resultUrlRef.current
    link.download = 'gifcam.gif'
    document.body.append(link)
    link.click()
    link.remove()
  }, [])

  useEffect(() => () => {
    activeJobRef.current += 1
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
  }, [])

  return { status, result, errorMessage, createGif, downloadResult, invalidateResult }
}
